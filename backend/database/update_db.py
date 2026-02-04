import sqlite3
import os

db_path = "mental_health_v2.db"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE counselor ADD COLUMN email VARCHAR(255)")
        conn.commit()
        print("Column 'email' added successfully.")
    except sqlite3.OperationalError as e:
        if "duplicate column" in str(e):
            print("Column 'email' already exists.")
        else:
            print(f"Error adding column: {e}")
    finally:
        conn.close()
else:
    print(f"Database {db_path} not found.")
