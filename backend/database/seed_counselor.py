
import os
import sys
from datetime import datetime
from werkzeug.security import generate_password_hash

# Add the project directory to sys.path to import the app and db
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Counselor, Appointment, User

def seed_data():
    with app.app_context():
        # Create the specific counselor
        c_email = 'imashisandeepika2001@gmail.com'
        c_name = 'W.A.M.Waduwaththa'
        c_pwd = 'Imashi@0618'
        
        # Check if exists
        c = Counselor.query.filter_by(email=c_email).first()
        if not c:
            print(f"Adding counselor {c_name}...")
            c = Counselor(
                name=c_name,
                email=c_email,
                password_hash=generate_password_hash(c_pwd),
                available=True,
                country="Sri Lanka",
                flag="picures/LankaFlug.png",
                profile_image="picures/AvskOff.jpg",
                specialty="General Counseling",
                experience=5
            )
            db.session.add(c)
            db.session.commit()
            print(f"Counselor added with ID: {c.id}")
        else:
            print(f"Counselor {c_name} already exists.")
            # Update password just in case
            c.password_hash = generate_password_hash(c_pwd)
            db.session.commit()

        # Add a demo user if not exists
        u_email = 'demo@example.com'
        u = User.query.filter_by(email=u_email).first()
        if not u:
            print("Adding demo user...")
            u = User(
                name="Demo User",
                email=u_email,
                password_hash=generate_password_hash("password")
            )
            db.session.add(u)
            db.session.commit()
            
        # Add a test appointment
        print("Adding a test appointment...")
        a = Appointment(
            counselor_id=c.id,
            user_email=u_email,
            date="2026-02-10",
            time="10:00",
            status="pending"
        )
        db.session.add(a)
        db.session.commit()
        print("Test appointment added.")

if __name__ == "__main__":
    seed_data()
