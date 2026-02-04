import sqlite3
import os

def cleanup():
    db_path = os.path.join("database", "mental_health_v2.db")
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Notifications created by addActivity typically contain ' • '
    # e.g., 'booking_start • N. Silva'
    cursor.execute("DELETE FROM notification WHERE msg LIKE '% • %'")
    deleted_count = cursor.rowcount
    
    conn.commit()
    conn.close()
    
    print(f"Cleanup complete. Removed {deleted_count} redundant notifications.")

if __name__ == "__main__":
    cleanup()
