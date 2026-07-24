from app.db import get_connection
from app.services.embedder import embed_text

def semantic_search(query: str, repo_id: str = None, top_k: int = 5):
    """
    Embeds the query, then finds the closest code chunks by cosine similarity.
    """
    query_embedding = embed_text(query)

    conn = get_connection()
    cur = conn.cursor()

    if repo_id:
        cur.execute("""
            SELECT id, file_path, function_name, content, start_line, end_line,
                   1 - (embedding <=> %s::vector) AS similarity
            FROM code_chunks
            WHERE repo_id = %s
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (query_embedding, repo_id, query_embedding, top_k))

    else:
        cur.execute("""
            SELECT id, file_path, function_name, content, start_line, end_line,
                   1 - (embedding <=> %s::vector) AS similarity
            FROM code_chunks
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (query_embedding, query_embedding, top_k))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    results = []
    for row in rows:
        results.append({
            'id': row[0],
            'file_path': row[1],
            'function_name': row[2],
            'content': row[3],
            'start_line': row[4],
            'end_line': row[5],
            'similarity': round(float(row[6]), 4)
        })

    return results