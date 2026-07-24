from app.services.search import semantic_search

queries = [
    "how do we connect to the database",
    "convert text into vector embeddings",
    "split code into chunks",
]

for q in queries:
    print(f"\nQuery: \"{q}\"")
    print("-" * 50)
    results = semantic_search(q, repo_id="test-repo-1", top_k=3)
    for r in results:
        print(f"  [{r['similarity']}] {r['file_path']} :: {r['function_name']}")