
import os
import sys

# Adjust path to find app.py
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from app import app, db, Counselor

def update_specific_counselor_images():
    with app.app_context():
        custom_mapping = {
            "P.K.I.S. Bandara": "images/MyOff.jpg",
            "W.A.M.Waduwaththa": "images/AvskOff.jpg",
            "Rianne": "images/girl_3.jpg"
        }
        
        for name, img_path in custom_mapping.items():
            c = Counselor.query.filter_by(name=name).first()
            if c:
                c.profile_image = img_path
                print(f"Updated {name} with image: {img_path}")
            else:
                print(f"Counselor not found: {name}")
        
        db.session.commit()
        print("Done updating specific counselor images.")

if __name__ == "__main__":
    update_specific_counselor_images()
