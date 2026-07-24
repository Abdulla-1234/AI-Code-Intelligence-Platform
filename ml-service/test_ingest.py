from app.db import init_db, get_connection
from app.services.ingest import ingest_repository

init_db()

# First create the repository record
conn = get_connection()
cur = conn.cursor()
cur.execute("""
    INSERT INTO repositories (id, name, url, status)
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING
""", ("test-repo-1", "test-repo", "local-test", "indexing"))
conn.commit()
cur.close()
conn.close()

# Now ingest
result = ingest_repository("test-repo-1", "./app")
print(result)