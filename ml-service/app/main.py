import os
import uuid
import threading
import hmac
import hashlib
import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from app.db import init_db, get_connection
from app.services.search import semantic_search
from app.services.ingest import ingest_repository
from app.services.review_agent import review_pull_request
from app.services.github_client import post_pr_comment

app = FastAPI(title="Code Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)

WEBHOOK_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET", "")


@app.on_event("startup")
def startup():
    init_db()


# ---------- Repositories ----------

class RepoCreate(BaseModel):
    url: str


@app.get("/api/repositories")
def list_repositories():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT r.id, r.name, r.url, r.status, r.created_at,
               COUNT(DISTINCT c.file_path) as file_count,
               COUNT(c.id) as chunk_count
        FROM repositories r
        LEFT JOIN code_chunks c ON c.repo_id = r.id
        GROUP BY r.id
        ORDER BY r.created_at DESC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [{
        "id": r[0], "name": r[1], "url": r[2], "status": r[3],
        "lastIndexed": r[4].isoformat(),
        "fileCount": r[5], "chunkCount": r[6],
    } for r in rows]


@app.post("/api/repositories")
def create_repository(body: RepoCreate):
    repo_id = str(uuid.uuid4())
    name = body.url.replace("https://github.com/", "").replace(".git", "")

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO repositories (id, name, url, status)
        VALUES (%s, %s, %s, 'indexing')
    """, (repo_id, name, body.url))
    conn.commit()
    cur.close()
    conn.close()

    thread = threading.Thread(target=run_ingestion_background, args=(repo_id, body.url))
    thread.start()

    return {"id": repo_id, "name": name, "url": body.url, "status": "indexing"}


def run_ingestion_background(repo_id: str, github_url: str):
    import subprocess, tempfile

    conn = get_connection()
    cur = conn.cursor()
    try:
        with tempfile.TemporaryDirectory() as tmp_dir:
            subprocess.run(["git", "clone", "--depth", "1", github_url, tmp_dir], check=True, capture_output=True)
            ingest_repository(repo_id, tmp_dir)

        cur.execute("UPDATE repositories SET status='ready' WHERE id=%s", (repo_id,))
        conn.commit()
    except Exception as e:
        print(f"Ingestion failed for {repo_id}: {e}")
        cur.execute("UPDATE repositories SET status='failed' WHERE id=%s", (repo_id,))
        conn.commit()
    finally:
        cur.close()
        conn.close()


# ---------- Search ----------

class SearchRequest(BaseModel):
    query: str
    repoId: Optional[str] = None


@app.post("/api/search")
def search(body: SearchRequest):
    repo_id = None if body.repoId in (None, "all") else body.repoId
    results = semantic_search(body.query, repo_id=repo_id, top_k=10)

    return [{
        "id": r["id"],
        "filePath": r["file_path"],
        "functionName": r["function_name"] or "",
        "score": r["similarity"],
        "language": "python" if r["file_path"].endswith(".py") else "typescript",
        "snippet": r["content"],
        "startLine": r["start_line"],
    } for r in results]


# ---------- PR Reviews (stub — built in a later step) ----------

@app.get("/api/pr-reviews")
def list_pr_reviews():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT pr.id, pr.pr_number, pr.review_text, pr.issues_found, pr.status, pr.created_at, r.name
        FROM pr_reviews pr
        JOIN repositories r ON r.id = pr.repo_id
        ORDER BY pr.created_at DESC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [{
        "id": r[0], "prNumber": r[1], "reviewText": r[2],
        "issuesFound": r[3], "status": r[4],
        "createdAt": r[5].isoformat(), "repoName": r[6],
    } for r in rows]


# ---------- GitHub Webhook — auto reindex on push ----------

def verify_signature(payload_body: bytes, signature_header: str) -> bool:
    """
    GitHub signs every webhook payload with your secret so you can verify
    the request genuinely came from GitHub and not an attacker.
    """
    if not WEBHOOK_SECRET:
        return True  # dev mode — no secret configured yet
    if not signature_header:
        return False
    expected = "sha256=" + hmac.new(
        WEBHOOK_SECRET.encode(), payload_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature_header)

@app.post("/api/webhooks/github")
async def github_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("X-Hub-Signature-256", "")

    if not verify_signature(body, signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = await request.json()
    
    event_type = request.headers.get("X-GitHub-Event", "")

    repo_full_name = payload.get("repository", {}).get("full_name")
    repo_url = payload.get("repository", {}).get("clone_url")

    if not repo_full_name:
        return {"status": "ignored", "reason": "no repository info in payload"}

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM repositories WHERE name = %s", (repo_full_name,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {"status": "ignored", "reason": "repository not tracked by this platform"}

    repo_id = row[0]

    # Push event -> re-index the repo
    if event_type == "push":
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("UPDATE repositories SET status='indexing' WHERE id=%s", (repo_id,))
        conn.commit()
        cur.close()
        conn.close()

        thread = threading.Thread(target=run_ingestion_background, args=(repo_id, repo_url))
        thread.start()
        return {"status": "reindexing", "repo": repo_full_name}

    # Pull request opened/synchronized -> run AI review
    if event_type == "pull_request" and payload.get("action") in ("opened", "synchronize"):
        pr_number = payload.get("number")
        thread = threading.Thread(
            target=run_pr_review_background,
            args=(repo_id, repo_full_name, pr_number)
        )
        thread.start()
        return {"status": "reviewing", "repo": repo_full_name, "pr": pr_number}

    return {"status": "ignored", "reason": f"unhandled event type: {event_type}"}

def run_pr_review_background(repo_id: str, repo_full_name: str, pr_number: int):
    import uuid as uuid_lib
    conn = get_connection()
    cur = conn.cursor()
    try:
        review = review_pull_request(repo_id, repo_full_name, pr_number)

        review_id = str(uuid_lib.uuid4())
        status = "issues_found" if review["issues"] else "no_issues"

        cur.execute("""
            INSERT INTO pr_reviews (id, repo_id, pr_number, review_text, issues_found, status)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (review_id, repo_id, pr_number, review["summary"], json.dumps(review["issues"]), status))
        conn.commit()

        # Post the review as a comment on the actual PR
        comment_body = f"**🤖 AI Code Review**\n\n{review['summary']}\n\n"
        if review["issues"]:
            comment_body += "**Issues found:**\n\n"
            for issue in review["issues"]:
                comment_body += f"- **[{issue['severity'].upper()}]** `{issue['file']}` — {issue['description']}\n  - *Suggestion:* {issue['suggestion']}\n"
        else:
            comment_body += "No issues found. Looks good!"

        post_pr_comment(repo_full_name, pr_number, comment_body)
        print(f"[PR REVIEW] Posted review for PR #{pr_number} on {repo_full_name}")

    except Exception as e:
        print(f"[PR REVIEW ERROR] {e}")
    finally:
        cur.close()
        conn.close()