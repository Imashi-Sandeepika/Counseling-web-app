
import os
import sys
from datetime import datetime

# Adjust path to find app.py
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from app import app, db, Counselor

def update_counselor_images():
    with app.app_context():
        # List of available images in public/images/
        # mapping them to specific names if possible, else just distribute
        images = [
            "images/PereraProfile.jpg",
            "images/SilvaProfile.jpg",
            "images/couns_2_1769248126.jpg",
            "images/girl_3.jpg",
            "images/Ayani DP.jpg", # Likely Ayani? 
            "images/AvskOff.jpg",
            "images/MyOff.jpg"
        ]
        
        counselors = Counselor.query.all()
        print(f"Found {len(counselors)} counselors.")
        
        for i, c in enumerate(counselors):
            # Try to match by name keywords first
            img_idx = i % len(images)
            name_lower = c.name.lower()
            
            if "perera" in name_lower:
                c.profile_image = "images/PereraProfile.jpg"
            elif "silva" in name_lower:
                c.profile_image = "images/SilvaProfile.jpg"
            elif "yani" in name_lower:
                c.profile_image = "images/Ayani DP.jpg"
            else:
                c.profile_image = images[img_idx]
            
            print(f"Updated {c.name} with image: {c.profile_image}")
            
        db.session.commit()
        print("Done updating counselor profile images.")

if __name__ == "__main__":
    update_counselor_images()
