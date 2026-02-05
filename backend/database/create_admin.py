
import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, db, Admin
from werkzeug.security import generate_password_hash

def ensure_admin():
    with app.app_context():
        email = "admin@psycare.com"
        password = "admin"
        name = "System Admin"
        
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
        print(f"Password: {password}")

if __name__ == "__main__":
    ensure_admin()
