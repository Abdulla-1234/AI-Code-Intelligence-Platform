import os
from app.db import get_connection
from app.services.chunker import chunk_file, make_chunk_id
from app.services.embedder import embed_batch

SUPPORTED_EXTENSIONS = ('.py', '.js', '.jsx', '.ts', '.tsx')
SKIP_DIRS = {'.git', 'node_modules', 'venv', '__pycache__', 'dist', 'build', '.next'}

def walk_repo_files(repo_path: str):
    """Yields (file_path, content) for all supported source files in a repo."""
    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if f.endswith(SUPPORTED_EXTENSIONS):
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, repo_path)
                try:
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as fh:
                        content = fh.read()
                    yield rel_path, content
                except Exception as e:
                    print(f"  Skipping {rel_path}: {e}")


def ingest_repository(repo_id: str, repo_path: str):
    """
    Walks a cloned repo, chunks every source file, embeds all chunks,
    and stores them in PostgreSQL with pgvector.
    """
    conn = get_connection()
    cur = conn.cursor()

    total_chunks = 0
    total_files = 0

    for rel_path, content in walk_repo_files(repo_path):
        chunks = chunk_file(content, rel_path)
        if not chunks:
            continue

        total_files += 1
        chunk_texts = [c['content'] for c in chunks]
        embeddings = embed_batch(chunk_texts)

        for chunk, embedding in zip(chunks, embeddings):
            chunk_id = make_chunk_id(repo_id, rel_path, chunk['start_line'])
            cur.execute("""
                INSERT INTO code_chunks
                    (id, repo_id, file_path, function_name, content, start_line, end_line, embedding)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    content = EXCLUDED.content,
                    embedding = EXCLUDED.embedding
            """, (
                chunk_id, repo_id, rel_path, chunk['function_name'],
                chunk['content'], chunk['start_line'], chunk['end_line'],
                embedding
            ))
            total_chunks += 1

        print(f"  Indexed {rel_path} — {len(chunks)} chunks")

    conn.commit()
    cur.close()
    conn.close()

    print(f"\nDone: {total_files} files, {total_chunks} chunks indexed for repo {repo_id}")
    return {'files': total_files, 'chunks': total_chunks}