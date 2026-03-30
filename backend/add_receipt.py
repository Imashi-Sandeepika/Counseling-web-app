import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'database', 'mental_health_v2.db')
conn = sqlite3.connect(db_path)
c = conn.cursor()
try:
    c.execute("ALTER TABLE appointment ADD COLUMN receipt_url VARCHAR(255)")
    print("Added receipt_url to appointment table.")
except Exception as e:
    print(f"Error (column might already exist): {e}")
conn.commit()
conn.close()
