
from app import app, db, Counselor

with app.app_context():
    # Search for Thikshana
    search_term = "Thikshana"
    counselors = Counselor.query.filter(Counselor.name.like(f"%{search_term}%")).all()
    
    if counselors:
        print(f"Found {len(counselors)} counselor(s) matching '{search_term}':")
        for c in counselors:
            print(f"ID: {c.id}, Name: {c.name}, Current Image: {c.profile_image}")
    else:
        print(f"No counselor found matching '{search_term}'. Listing all names:")
        for c in Counselor.query.all():
            print(f"ID: {c.id}, Name: {c.name}")
