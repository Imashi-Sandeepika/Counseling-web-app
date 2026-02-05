
import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, db, Admin
from werkzeug.security import generate_password_hash

def check_create_admin():
    with app.app_context():
        # Check if any admin exists
        admins = Admin.query.all()
        if admins:
            print(f"Found {len(admins)} admin(s):")
            for a in admins:
                print(f" - Email: {a.email}, Name: {a.name}")
            print("\nNote: Passwords are hashed and cannot be retrieved directly.")
        else:
            print("No admin found. Creating default admin...")
            email = "admin@psycare.com"
            password = "admin"
            name = "Super Admin"
            
            new_admin = Admin(
                name=name,
                email=email,
                password_hash=generate_password_hash(password)
            )
            db.session.add(new_admin)
            db.session.commit()
            print(f"Created default admin:\nEmail: {email}\nPassword: {password}")

if __name__ == "__main__":
    check_create_admin()
