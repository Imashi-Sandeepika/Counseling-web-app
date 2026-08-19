
import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, db, Admin
from werkzeug.security import generate_password_hash

def ensure_admin():
    with app.app_context():
        email = os.environ.get("ADMIN_EMAIL", "admin@psycare.com")
        password = os.environ.get("ADMIN_PASSWORD")
        name = os.environ.get("ADMIN_NAME", "System Admin")
        
        if not password:
            print("Error: ADMIN_PASSWORD environment variable is not set.")
            print("Please run this script with it set, e.g., set ADMIN_PASSWORD=secret && python create_admin.py")
            return
        
        admin = Admin.query.filter_by(email=email).first()
        if admin:
            print(f"Updating existing admin: {email}")
            admin.password_hash = generate_password_hash(password)
        else:
            print(f"Creating new admin: {email}")
            admin = Admin(
                name=name,
                email=email,
                password_hash=generate_password_hash(password)
            )
            db.session.add(admin)
        
        db.session.commit()
        print(f"\nSUCCESS! Admin Credentials:")
        print(f"Email:    {email}")
        print("Password: [set securely]")

if __name__ == "__main__":
    ensure_admin()
