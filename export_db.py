import sqlite3
import pandas as pd
import os

DB_PATH = 'backend/database/mental_health_v2.db'
OUT_PATH = 'Database_Records.md'

if not os.path.exists(DB_PATH):
    print("Database not found.")
    exit(1)

conn = sqlite3.connect(DB_PATH)

# Fetch data
try:
    users = pd.read_sql('SELECT name as Username, email as Email, password_hash as PasswordHash, created_at as Registered_At FROM user', conn)
    counselors = pd.read_sql('SELECT name, email, specialty, available FROM counselor', conn)
    
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        f.write('# Database Records\n\n')
        f.write('## Registered Users\n\n')
        f.write(users.to_markdown(index=False))
        f.write('\n\n## Counselors\n\n')
        f.write(counselors.to_markdown(index=False))
        f.write('\n')
        
    print(f'Records saved to {OUT_PATH}')
except Exception as e:
    print(f"Error reading database: {e}")
finally:
    conn.close()
