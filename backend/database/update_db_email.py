import sqlite3
import os

db_path = "mental_health_v2.db"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        # Create Email table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS email (
                id INTEGER PRIMARY KEY,
                sender VARCHAR(255),
                recipient VARCHAR(255),
                subject VARCHAR(255),
                body TEXT,
                ts DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        print("Table 'email' created/verified.")
    except sqlite3.OperationalError as e:
        print(f"Error creating table: {e}")
    finally:
        conn.close()
else:
    print(f"Database {db_path} not found.")
