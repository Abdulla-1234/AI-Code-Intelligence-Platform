import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.getenv("PG_HOST"),
        port=os.getenv("PG_PORT"),
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_PASSWORD"),
        dbname=os.getenv("PG_DB"),
    )

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    cur.execute("""
        CREATE TABLE IF NOT EXISTS repositories (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            url         TEXT NOT NULL,
            status      TEXT DEFAULT 'pending',
            created_at  TIMESTAMPTZ DEFAULT NOW()
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS code_chunks (
            id           TEXT PRIMARY KEY,
            repo_id      TEXT REFERENCES repositories(id) ON DELETE CASCADE,
            file_path    TEXT NOT NULL,
            function_name TEXT,
            content      TEXT NOT NULL,
            start_line   INTEGER,
            end_line     INTEGER,
            embedding    vector(384),
            created_at   TIMESTAMPTZ DEFAULT NOW()
        );
    """)

    cur.execute("""
        CREATE INDEX IF NOT EXISTS code_chunks_embedding_idx
        ON code_chunks USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS pr_reviews (
            id           TEXT PRIMARY KEY,
            repo_id      TEXT REFERENCES repositories(id) ON DELETE CASCADE,
            pr_number    INTEGER,
            review_text  TEXT,
            issues_found JSONB,
            status       TEXT DEFAULT 'pending',
            created_at   TIMESTAMPTZ DEFAULT NOW()
        );
    """)

    conn.commit()
    cur.close()
    conn.close()
    print("Database initialized — repositories, code_chunks, pr_reviews tables ready")

if __name__ == "__main__":
    init_db()