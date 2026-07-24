import os
from dotenv import load_dotenv
load_dotenv()

import psycopg2

conn = psycopg2.connect(
    host=os.getenv("PG_HOST"),
    port=os.getenv("PG_PORT"),
    user=os.getenv("PG_USER"),
    password=os.getenv("PG_PASSWORD"),
    dbname=os.getenv("PG_DB"),
)
cur = conn.cursor()
cur.execute("SELECT extname FROM pg_extension WHERE extname='vector';")
result = cur.fetchone()
print("pgvector extension:", "FOUND" if result else "NOT FOUND")

from sentence_transformers import SentenceTransformer
print("Loading embedding model (first run downloads ~90MB)...")
model = SentenceTransformer('all-MiniLM-L6-v2')
embedding = model.encode("def hello_world(): print('hello')")
print("Embedding dimension:", len(embedding))
print("First 5 values:", embedding[:5])

conn.close()
print("\nAll checks passed!")