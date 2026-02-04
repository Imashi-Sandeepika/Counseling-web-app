
import os
import sys

# Adjust path to find app.py
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from app import app, db, Counselor

def remove_specific_counselors():
    with app.app_context():
        names_to_remove = [
            "Dr. K.M.C. Dissanayaka",
            "Script Test",
            "Dr. Test"
        ]
        
        for name in names_to_remove:
            c = Counselor.query.filter_by(name=name).first()
            if c:
                db.session.delete(c)
                print(f"Deleted counselor: {name}")
            else:
                print(f"Counselor not found: {name}")
        
        db.session.commit()
        print("Done.")

if __name__ == "__main__":
    remove_specific_counselors()
