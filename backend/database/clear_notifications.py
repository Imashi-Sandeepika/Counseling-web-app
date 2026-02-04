
import os
import sys

# Adjust path to find app.py
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from app import app, db, Notification

def clear_all_notifications():
    with app.app_context():
        count = Notification.query.delete()
        db.session.commit()
        print(f"Deleted all {count} notifications.")

if __name__ == "__main__":
    clear_all_notifications()
