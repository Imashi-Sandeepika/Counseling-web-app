import sqlite3
import os

db_path = "mental_health_v2.db"

def add_column(conn, table, col_def):
    cursor = conn.cursor()
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col_def}")
        conn.commit()
        print(f"Column '{col_def}' added to '{table}'.")
    except sqlite3.OperationalError as e:
        if "duplicate column" in str(e):
            print(f"Column '{col_def}' already exists in '{table}'.")
        else:
            print(f"Error adding column: {e}")

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    add_column(conn, "appointment", "payment_status VARCHAR(16) DEFAULT 'unpaid'")
    add_column(conn, "appointment", "passcode VARCHAR(32)")
    conn.close()
else:
    print(f"Database {db_path} not found.")
