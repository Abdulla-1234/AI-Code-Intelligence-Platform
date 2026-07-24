import json
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

from app.services.search import semantic_search
from app.services.github_client import get_pr_files

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.1,
)

SYSTEM_PROMPT = """You are an expert code reviewer. You will be given:
1. A pull request diff
2. Similar existing code from the same codebase (for context/consistency)

Review the diff for:
- Bugs or logic errors
- Inconsistency with existing codebase patterns (using the similar code as reference)
- Security issues
- Missing error handling

Return ONLY valid JSON in this exact format, no markdown, no backticks:
{
  "summary": "1-2 sentence overall assessment",
  "issues": [
    {
      "severity": "high|medium|low",
      "file": "filename",
      "line": 0,
      "description": "what the issue is",
      "suggestion": "how to fix it"
    }
  ]
}

If no issues found, return an empty issues array."""


def review_pull_request(repo_id: str, repo_full_name: str, pr_number: int):
    """
    RAG-powered PR review:
    1. Fetch the diff from GitHub
    2. For each changed file, retrieve similar code from our vector index
    3. Feed diff + retrieved context to the LLM
    4. Return structured review with issues
    """
    files = get_pr_files(repo_full_name, pr_number)

    diff_summary = []
    context_snippets = []

    for f in files[:10]:  # cap at 10 files to keep prompt size reasonable
        filename = f["filename"]
        patch = f.get("patch", "")
        if not patch:
            continue

        diff_summary.append(f"--- {filename} ---\n{patch}")

        # Retrieve similar existing code for this file's context
        similar = semantic_search(f"code similar to {filename}", repo_id=repo_id, top_k=2)
        for s in similar:
            if s["file_path"] != filename:  # don't compare file to itself
                context_snippets.append(
                    f"[Similar code from {s['file_path']} :: {s['function_name']}]\n{s['content'][:300]}"
                )

    diff_text = "\n\n".join(diff_summary)
    context_text = "\n\n".join(context_snippets[:6])  # cap context size

    user_prompt = f"""PULL REQUEST DIFF:
{diff_text}

SIMILAR EXISTING CODE IN THIS REPOSITORY (for consistency reference):
{context_text if context_text else "No similar code found in index."}

Review this pull request."""

    response = llm.invoke([
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_prompt),
    ])

    try:
        review = json.loads(response.content)
    except json.JSONDecodeError:
        review = {
            "summary": "Review generated but could not be parsed as structured data.",
            "issues": [],
        }

    return review