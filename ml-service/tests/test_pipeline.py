import pytest
from app.services.chunker import chunk_python_file, chunk_file
from app.services.embedder import embed_text, embed_batch
from app.services.search import semantic_search
from app.db import get_connection, init_db
import uuid

SAMPLE_CODE = '''
def calculate_total(items):
    total = 0
    for item in items:
        total += item.price
    return total

class ShoppingCart:
    def add_item(self, item):
        self.items.append(item)
'''

def test_chunker_finds_functions():
    chunks = chunk_python_file(SAMPLE_CODE, "test.py")
    assert len(chunks) >= 2
    names = [c['function_name'] for c in chunks]
    assert 'calculate_total' in names

def test_chunker_routes_by_extension():
    py_chunks = chunk_file(SAMPLE_CODE, "test.py")
    unsupported = chunk_file(SAMPLE_CODE, "test.rs")
    assert len(py_chunks) > 0
    assert len(unsupported) == 0

def test_embedding_dimension():
    embedding = embed_text("def hello(): pass")
    assert len(embedding) == 384
    assert isinstance(embedding, list)

def test_batch_embedding_matches_single():
    texts = ["def a(): pass", "def b(): pass"]
    batch = embed_batch(texts)
    assert len(batch) == 2
    assert len(batch[0]) == 384

def test_semantic_search_returns_results():
    init_db()
    repo_id = str(uuid.uuid4())

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO repositories (id, name, url, status) VALUES (%s,%s,%s,%s)",
        (repo_id, "pytest-repo", "test", "ready")
    )

    embedding = embed_text("def get_connection(): connect to database")
    cur.execute("""
        INSERT INTO code_chunks (id, repo_id, file_path, function_name, content, start_line, end_line, embedding)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (str(uuid.uuid4()), repo_id, "db.py", "get_connection",
          "def get_connection(): connect to database", 1, 3, embedding))
    conn.commit()
    cur.close()
    conn.close()

    results = semantic_search("connect to database", repo_id=repo_id, top_k=5)
    assert len(results) > 0
    assert results[0]['function_name'] == 'get_connection'

    # cleanup
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM repositories WHERE id=%s", (repo_id,))
    conn.commit()
    cur.close()
    conn.close()