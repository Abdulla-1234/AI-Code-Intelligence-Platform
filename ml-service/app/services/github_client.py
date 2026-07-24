import os
import requests

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_API = "https://api.github.com"

def get_headers():
    return {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
    }

def get_pr_diff(repo_full_name: str, pr_number: int) -> str:
    """Fetches the raw diff of a pull request."""
    url = f"{GITHUB_API}/repos/{repo_full_name}/pulls/{pr_number}"
    headers = get_headers()
    headers["Accept"] = "application/vnd.github.v3.diff"
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.text

def get_pr_files(repo_full_name: str, pr_number: int):
    """Returns list of changed files with patch content."""
    url = f"{GITHUB_API}/repos/{repo_full_name}/pulls/{pr_number}/files"
    resp = requests.get(url, headers=get_headers())
    resp.raise_for_status()
    return resp.json()

def post_pr_comment(repo_full_name: str, pr_number: int, body: str):
    """Posts a review comment on the PR."""
    url = f"{GITHUB_API}/repos/{repo_full_name}/issues/{pr_number}/comments"
    resp = requests.post(url, headers=get_headers(), json={"body": body})
    resp.raise_for_status()
    return resp.json()