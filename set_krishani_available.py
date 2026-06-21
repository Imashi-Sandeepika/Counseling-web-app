import sys, os
sys.path.append('backend')
from app import app, db, Counselor

with app.app_context():
    c = Counselor.query.filter(Counselor.name == 'Krishani').first()
    if c:
        c.available = True
        db.session.commit()
        print('Krishani set to available')
    else:
        print('Krishani not found')
