import sqlite3
import os

db_path = "mental_health_v2.db"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY,
                counselor_id INTEGER NOT NULL,
                rating INTEGER,
                sentiment VARCHAR(16),
                comment TEXT,
                ts DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        print("Table 'feedback' created/verified.")
    except sqlite3.OperationalError as e:
        print(f"Error creating table: {e}")
    finally:
        conn.close()
else:
    print(f"Database {db_path} not found.")
