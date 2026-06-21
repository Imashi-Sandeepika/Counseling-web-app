import sqlite3
import pandas as pd

conn = sqlite3.connect('backend/database/mental_health_v2.db')
print("Counselor table:")
print(pd.read_sql("SELECT * FROM counselor", conn))
print("\nUser table:")
print(pd.read_sql("SELECT * FROM user", conn))
conn.close()
