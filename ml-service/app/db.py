from dotenv import load_dotenv

load_dotenv()

import os
import psycopg2

def get_connection():
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return psycopg2.connect(database_url, sslmode="require")
    return psycopg2.connect(
        host=os.getenv("PG_HOST", "localhost"),
        port=os.getenv("PG_PORT", "5434"),
        user=os.getenv("PG_USER", "admin"),
        password=os.getenv("PG_PASSWORD", "password"),
        dbname=os.getenv("PG_DB", "codeintel"),
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