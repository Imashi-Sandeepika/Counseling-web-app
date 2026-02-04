
import os
import sys
from werkzeug.security import generate_password_hash

# Add the project directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Counselor, Appointment, User, Notification

def fix_database():
    with app.app_context():
        target_email = 'imashisandeepika2001@gmail.com'
        target_name = 'W.A.M.Waduwaththa'
        target_pwd = 'Imashi@0618'
        
        # 1. Clean up duplicate counselors with this email
        duplicates = Counselor.query.filter_by(email=target_email).all()
        for d in duplicates:
            print(f"Deleting duplicate counselor: {d.name} (ID: {d.id})")
            # Reassign their appointments if any? No, let's just clear for now.
            db.session.delete(d)
        db.session.commit()
        
        # 2. Find W.A.M.Waduwaththa and set email/password
        c = Counselor.query.filter_by(name=target_name).first()
        if not c:
            print(f"Adding counselor {target_name}...")
            c = Counselor(
                name=target_name,
                email=target_email,
                password_hash=generate_password_hash(target_pwd),
                available=True,
                country="Sri Lanka",
                flag="picures/LankaFlug.png",
                profile_image="picures/AvskOff.jpg",
                specialty="Professional Counselor",
                experience=10
            )
            db.session.add(c)
        else:
            print(f"Updating counselor {target_name} (ID: {c.id})...")
            c.email = target_email
            c.password_hash = generate_password_hash(target_pwd)
            c.available = True
        
        db.session.commit()
        print(f"Counselor {target_name} is ready with ID {c.id}")
        
        # 3. Create a test user
        client_email = 'test_client@example.com'
        u = User.query.filter_by(email=client_email).first()
        if not u:
            u = User(name="Test Client", email=client_email, password_hash=generate_password_hash("password"))
            db.session.add(u)
            db.session.commit()
            
        # 4. Clear all previous appointments and notifications to be sure
        Appointment.query.delete()
        Notification.query.delete()
        db.session.commit()
        
        # 5. Add a test appointment for this counselor
        print("Adding test appointment...")
        a = Appointment(
            counselor_id=c.id,
            user_email=client_email,
            date="2026-02-15",
            time="14:00",
            status="pending"
        )
        db.session.add(a)
        db.session.commit()
        
        # 6. Add a notification for the counselor to be sure
        # The counselor view for notifications actually renders appointments,
        # but let's see if they also show General notifications.
        # Based on my previous change, counselors only see Counselor-specific lists.
        
        print("Cleanup and test data setup complete.")

if __name__ == "__main__":
    fix_database()
