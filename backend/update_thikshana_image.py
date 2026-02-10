
from app import app, db, Counselor

with app.app_context():
    # ID is 4, found in previous step
    cid = 4
    c = Counselor.query.get(cid)
    
    if c:
        print(f"Updating image for {c.name}")
        c.profile_image = "images/SilvaProfile.jpg"
        db.session.commit()
        print("Updated successfully.")
    else:
        print("Counselor not found (ID=4).")
