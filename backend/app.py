import os
import argparse
import webbrowser
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask import Flask, send_file, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import func
import sys



# Add Sentiment Analysis Project to path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(PROJECT_ROOT, "modules", "Sentiment-Analysis-Project"))
try:
    from helper import preprocessing, vectorizer, get_prediction, fallback_prediction
    SENTIMENT_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Sentiment Analysis modules not found: {e}")
    SENTIMENT_AVAILABLE = False

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database", "mental_health_v2.db")
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, "frontend", "images")
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
app.url_map.strict_slashes = False




@app.after_request
def add_no_cache_headers(response):
    try:
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    except Exception:
        pass
    return response

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_flag_for_country(country_name):
    if not country_name:
        return "🇱🇰"
    c = country_name.strip().lower()
    mapping = {
        "sri lanka": "images/LankaFlug.png",
        "india": "images/IndiaFlug.png",
        "usa": "images/USAflug.png",
        "united states": "images/USAflug.png",
        "uk": "🇬🇧",
        "united kingdom": "🇬🇧",
        "australia": "🇦🇺",
        "canada": "🇨🇦",
        "japan": "🇯🇵",
        "germany": "🇩🇪",
        "france": "🇫🇷",
        "china": "🇨🇳",
        "russia": "🇷🇺",
        "korea": "🇰🇷",
        "south korea": "🇰🇷",
        "italy": "🇮🇹",
        "singapore": "🇸🇬"
    }
    return mapping.get(c, "🌍")

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Counselor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    available = db.Column(db.Boolean, default=True)
    email = db.Column(db.String(255))
    password_hash = db.Column(db.String(255))
    profile_image = db.Column(db.String(255))
    languages = db.Column(db.String(255))
    country = db.Column(db.String(128))
    flag = db.Column(db.String(255))
    nic = db.Column(db.String(32))
    empathy = db.Column(db.Float, default=5.0)
    clarity = db.Column(db.Float, default=5.0)
    impact = db.Column(db.Float, default=5.0)
    dob = db.Column(db.String(32))
    civil_status = db.Column(db.String(32))
    specialty = db.Column(db.String(255))
    education = db.Column(db.Text)
    experience = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    counselor_id = db.Column(db.Integer, db.ForeignKey("counselor.id"), nullable=False)
    user_email = db.Column(db.String(255))
    date = db.Column(db.String(32), nullable=False)
    time = db.Column(db.String(32), nullable=False)
    ts = db.Column(db.DateTime, default=datetime.utcnow)
    ts = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(16), default="pending")
    payment_status = db.Column(db.String(16), default="unpaid")
    passcode = db.Column(db.String(32))
    zoom_link = db.Column(db.String(255))

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(255))
    start_ts = db.Column(db.DateTime, default=datetime.utcnow)
    end_ts = db.Column(db.DateTime)
    category = db.Column(db.String(255))
    counselor_name = db.Column(db.String(255))
    notes = db.Column(db.Text)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(255))
    package = db.Column(db.String(32))
    card_masked = db.Column(db.String(32))
    name_on_card = db.Column(db.String(255))
    expiry = db.Column(db.String(16))
    ts = db.Column(db.DateTime, default=datetime.utcnow)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(255))
    appointment_id = db.Column(db.Integer) # Track which appointment this belongs to
    title = db.Column(db.String(255))
    msg = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(16))
    related_person = db.Column(db.String(255))
    related_image = db.Column(db.String(255))
    ts = db.Column(db.DateTime, default=datetime.utcnow)

class Email(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(255))
    recipient = db.Column(db.String(255))
    subject = db.Column(db.String(255))
    body = db.Column(db.Text)
    ts = db.Column(db.DateTime, default=datetime.utcnow)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    counselor_id = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer)
    sentiment = db.Column(db.String(16))
    comment = db.Column(db.Text)
    ts = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

class AuthToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

class CounselorToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    counselor_id = db.Column(db.Integer, db.ForeignKey("counselor.id"), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AdminToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey("admin.id"), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

@app.route("/")
def index():
    resp = send_file(os.path.join(PROJECT_ROOT, "frontend", "index.html"))
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    return resp

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "db": "sqlite"})

@app.route("/api/debug/routes")
def debug_routes():
    try:
        routes = []
        for r in app.url_map.iter_rules():
            routes.append({"rule": str(r), "methods": sorted(list(r.methods))})
        return jsonify({"routes": routes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/assets/<path:path>")
def serve_assets(path):
    resp = send_file(os.path.join(PROJECT_ROOT, "frontend", "assets", path))
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    return resp

@app.route("/images/<path:path>")
def serve_images(path):
    resp = send_file(os.path.join(PROJECT_ROOT, "frontend", "images", path))
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    return resp

# Keep old route for backwards compatibility
@app.route("/picures/<path:path>")
def serve_pictures(path):
    resp = send_file(os.path.join(PROJECT_ROOT, "frontend", "images", path))
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    return resp

@app.route("/api/photos")
def photos():
    pic_dir = os.path.join(PROJECT_ROOT, "frontend", "images")
    exts = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    items = []
    try:
        for name in os.listdir(pic_dir):
            base, ext = os.path.splitext(name)
            if ext.lower() in exts:
                items.append({"src": f"/images/{name}", "label": base})
    except Exception:
        pass
    items.sort(key=lambda x: x["label"].lower())
    return jsonify(items)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        filename = f"{name}_{int(datetime.utcnow().timestamp())}{ext}"
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return jsonify({"ok": True, "path": f"images/{filename}"})
    return jsonify({"error": "File type not allowed"}), 400

# Accounts
@app.route("/api/accounts", methods=["GET"])
def list_accounts():
    accs = Account.query.order_by(Account.created_at.desc()).all()
    return jsonify([{"email": a.email} for a in accs])

@app.route("/api/accounts", methods=["POST"])
def add_account():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "").strip()
    password = data.get("password") or ""
    if not email or "@" not in email:
        return jsonify({"error": "invalid_email"}), 400
    # Create/ensure Account row
    if not Account.query.filter_by(email=email).first():
        db.session.add(Account(email=email))
    # Create User row if password provided
    u = User.query.filter_by(email=email).first()
    if not u and password:
        u = User(name=name, email=email, password_hash=generate_password_hash(password))
        db.session.add(u)
    db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/accounts", methods=["DELETE"])
def delete_accounts():
    Account.query.delete()
    db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/accounts/login", methods=["POST", "GET"])
def accounts_login():
    data = request.get_json(silent=True) or request.args.to_dict()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    u = User.query.filter_by(email=email).first()
    if not u or not check_password_hash(u.password_hash, password):
        return jsonify({"error": "invalid_credentials"}), 401
    u.last_login = datetime.utcnow()
    token_str = secrets.token_urlsafe(32)
    t = AuthToken(user_id=u.id, token=token_str, created_at=datetime.utcnow(), expires_at=datetime.utcnow() + timedelta(days=7))
    db.session.add(t)
    db.session.commit()
    return jsonify({"ok": True, "token": token_str, "user": {"name": u.name, "email": u.email}})

# Counselors
@app.route("/api/counselors", methods=["GET"])
def list_counselors():
    cs = Counselor.query.order_by(Counselor.created_at.desc()).all()
    out = []
    for c in cs:
        out.append({
            "id": c.id,
            "name": c.name,
            "available": c.available,
            "email": c.email,
            "profileImage": c.profile_image,
            "languages": c.languages,
            "country": c.country,
            "flag": c.flag,
            "nic": c.nic,
            "ratings": {"empathy": c.empathy, "clarity": c.clarity, "impact": c.impact},
            "details": {
                "dob": c.dob,
                "civilStatus": c.civil_status,
                "specialty": c.specialty,
                "education": c.education,
                "experience": c.experience
            }
        })
    return jsonify(out)

@app.route("/api/counselors", methods=["POST"])
def add_counselor():
    data = request.get_json(silent=True) or request.form.to_dict()
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "name_required"}), 400
    
    details = data.get("details") or {}
    ratings = data.get("ratings") or {}
    available_val = data.get("available")
    is_available = available_val if isinstance(available_val, bool) else str(available_val).lower() in ("true", "1", "on", "yes")
    country_name = data.get("country") or "Sri Lanka"
    flag_val = data.get("flag") or get_flag_for_country(country_name)
    profile_img = data.get("profileImage") or data.get("profile_image") or "images/Counselor.jpg"
    pwd = data.get("password") or ""

    c = Counselor(
        name=name,
        available=is_available,
        email=data.get("email"),
        password_hash=generate_password_hash(pwd) if pwd else None,
        profile_image=profile_img,
        languages=data.get("languages"),
        country=country_name,
        flag=flag_val,
        nic=data.get("nic"),
        empathy=float(ratings.get("empathy") or 5.0),
        clarity=float(ratings.get("clarity") or 5.0),
        impact=float(ratings.get("impact") or 5.0),
        dob=details.get("dob"),
        civil_status=details.get("civilStatus"),
        specialty=details.get("specialty"),
        education=details.get("education"),
        experience=int(details.get("experience") or 0)
    )
    db.session.add(c)
    db.session.commit()
    return jsonify({"id": c.id, "ok": True})

@app.route("/api/counselors/<int:cid>", methods=["DELETE"])
def delete_counselor(cid):
    c = Counselor.query.get(cid)
    if not c:
        return jsonify({"error": "not_found"}), 404
        
    # Delete associated appointments
    Appointment.query.filter_by(counselor_id=cid).delete()
    
    # Delete the counselor
    db.session.delete(c)
    db.session.commit()
    return jsonify({"ok": True})

# Appointments
@app.route("/api/appointments", methods=["GET"])
def list_appointments():
    email = request.args.get("email")
    cid = request.args.get("cid")
    query = Appointment.query
    if email:
        query = query.filter_by(user_email=email)
    if cid:
        try:
            query = query.filter_by(counselor_id=int(cid))
        except Exception:
            return jsonify([])
    aps = query.order_by(Appointment.ts.desc()).limit(100).all()
    out = []
    for a in aps:
        c = Counselor.query.get(a.counselor_id)
        out.append({
            "id": a.id,
            "cid": a.counselor_id,
            "counselorName": c.name if c else "Unknown",
            "userEmail": a.user_email,
            "date": a.date,
            "time": a.time,
            "ts": int(a.ts.timestamp() * 1000),
            "status": a.status,
            "paymentStatus": a.payment_status,
            "passcode": a.passcode,
            "zoomLink": a.zoom_link
        })
    return jsonify(out)

@app.route("/api/appointments/<int:aid>", methods=["PUT"])
def update_appointment(aid):
    data = request.get_json(silent=True) or {}
    a = Appointment.query.get(aid)
    if not a:
        return jsonify({"error": "not_found"}), 404
        
    old_status = a.status
    if "status" in data:
        a.status = data["status"]
        if old_status != a.status:
            c = Counselor.query.get(a.counselor_id)
            c_name = c.name if c else "Counselor"
            c_img = c.profile_image if c else None
            
            # Remove PREVIOUS notifications for this appointment to keep it to one for the USER
            Notification.query.filter_by(appointment_id=a.id, user_email=a.user_email).delete()
            
            msg = f"Your session with {c_name} on {a.date} at {a.time} is now {a.status}."
            db.session.add(Notification(
                user_email=a.user_email,
                appointment_id=a.id,
                title=f"Appointment {a.status.capitalize()}",
                msg=msg,
                status="success" if a.status == "confirmed" else "info",
                related_person=c_name,
                related_image=c_img
            ))

            # ALSO notify counselor if the update didn't come from them (though usually it does)
            if c and c.email:
                Notification.query.filter_by(appointment_id=a.id, user_email=c.email).delete()
                c_msg = f"Appointment with {a.user_email} on {a.date} at {a.time} is now {a.status}."
                db.session.add(Notification(
                    user_email=c.email,
                    appointment_id=a.id,
                    title=f"Booking {a.status.capitalize()}",
                    msg=c_msg,
                    status="info",
                    related_person=a.user_email,
                    related_image="images/Client.jpg"
                ))

    if "paymentStatus" in data:
        a.payment_status = data["paymentStatus"]
    if "passcode" in data:
        a.passcode = data["passcode"]
    if "zoomLink" in data:
        a.zoom_link = data["zoomLink"]
        
    db.session.commit()
    return jsonify({"ok": True})


@app.route("/api/appointments", methods=["POST"])
def add_appointment():
    data = request.get_json(silent=True) or {}
    cid = data.get("cid")
    date = data.get("date")
    time = data.get("time")
    email = data.get("email")
    if not cid or not date or not time:
        return jsonify({"error": "missing_fields"}), 400
    
    # Get counselor info
    c = Counselor.query.get(cid)
    c_name = c.name if c else "Counselor"
    c_email = c.email if c else None

    a = Appointment(counselor_id=cid, user_email=email, date=date, time=time, status="pending")
    db.session.add(a)
    db.session.flush() # Get appointment ID

    # Notification for User
    user_msg = f"Your session with {c_name} on {date} at {time} has been requested."
    db.session.add(Notification(
        user_email=email,
        appointment_id=a.id,
        title="Appointment Requested",
        msg=user_msg,
        status="info",
        related_person=c_name,
        related_image=c.profile_image if c else None
    ))
    
    # Notification for Counselor
    if c_email:
        # Find user if possible for image
        u = User.query.filter_by(email=email).first()
        u_img = "images/Client.jpg" # Default client image

        c_msg = f"A new client, {email}, has requested a session on {date} at {time}."
        db.session.add(Notification(
            user_email=c_email,
            appointment_id=a.id,
            title="New Booking Request",
            msg=c_msg,
            status="info",
            related_person=email,
            related_image=u_img
        ))

    db.session.commit()
    return jsonify({"id": a.id, "ok": True})

# Sessions
@app.route("/api/sessions", methods=["GET"])
def list_sessions():
    email = request.args.get("email")
    query = Session.query
    if email:
        query = query.filter((Session.user_email == email) | (Session.user_email == "demo@example.com"))
    ss = query.order_by(Session.start_ts.desc()).limit(100).all()
    return jsonify([{
        "id": s.id,
        "start": int(s.start_ts.timestamp() * 1000),
        "end": int(s.end_ts.timestamp() * 1000) if s.end_ts else None,
        "category": s.category,
        "counselorName": s.counselor_name,
        "notes": s.notes
    } for s in ss])

@app.route("/api/sessions", methods=["POST"])
def add_session():
    data = request.get_json(silent=True) or {}
    sts = datetime.fromtimestamp(data.get("start") / 1000) if data.get("start") else datetime.utcnow()
    ets = datetime.fromtimestamp(data.get("end") / 1000) if data.get("end") else None
    s = Session(
        user_email=data.get("email"),
        category=data.get("category"),
        counselor_name=data.get("counselorName"),
        notes=data.get("notes"),
        start_ts=sts,
        end_ts=ets
    )
    db.session.add(s)
    db.session.commit()
    return jsonify({"ok": True})

# Payments
@app.route("/api/payments", methods=["GET"])
def list_payments():
    email = request.args.get("email")
    cid = request.args.get("cid")
    query = Payment.query
    if email:
        query = query.filter_by(user_email=email)
    if cid:
        try:
            c_appts = Appointment.query.filter_by(counselor_id=int(cid)).with_entities(Appointment.user_email).all()
            emails = [e[0] for e in c_appts if e[0]]
            if emails:
                query = query.filter(Payment.user_email.in_(emails))
            else:
                return jsonify([])
        except Exception:
            return jsonify([])
    ps = query.order_by(Payment.ts.desc()).limit(100).all()
    return jsonify([{
        "id": p.id,
        "package": p.package,
        "card": p.card_masked,
        "name": p.name_on_card,
        "expiry": p.expiry,
        "ts": int(p.ts.timestamp() * 1000)
    } for p in ps])

@app.route("/api/payments", methods=["POST"])
def add_payment():
    data = request.get_json(silent=True) or {}
    p = Payment(
        user_email=data.get("email"),
        package=data.get("package"),
        card_masked=data.get("card"),
        name_on_card=data.get("name"),
        expiry=data.get("expiry")
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({"ok": True})

# Notifications
@app.route("/api/notifications", methods=["GET"])
def list_notifications():
    email = request.args.get("email")
    query = Notification.query
    if email:
        query = query.filter_by(user_email=email)
    ns = query.order_by(Notification.ts.desc()).limit(100).all()
    return jsonify([{
        "id": n.id,
        "title": n.title,
        "msg": n.msg,
        "status": n.status,
        "related_person": n.related_person,
        "related_image": n.related_image,
        "ts": int(n.ts.timestamp() * 1000)
    } for n in ns])

@app.route("/api/notifications", methods=["POST"])
def add_notification():
    data = request.get_json(silent=True) or {}
    n = Notification(
        user_email=data.get("email"),
        title=data.get("title"),
        msg=data.get("msg"),
        status=data.get("status"),
        related_person=data.get("related_person")
    )
    db.session.add(n)
    db.session.commit()
    return jsonify({"id": n.id, "ok": True})

@app.route("/api/notifications/<int:nid>", methods=["DELETE"])
def delete_notification(nid):
    n = Notification.query.get(nid)
    if n:
        db.session.delete(n)
        db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/notifications/<int:nid>", methods=["PUT"])
def update_notification(nid):
    data = request.get_json(silent=True) or {}
    n = Notification.query.get(nid)
    if not n:
        return jsonify({"error": "not_found"}), 404
    if "msg" in data:
        n.msg = data["msg"]
    if "status" in data:
        n.status = data["status"]
    db.session.commit()
    return jsonify({"ok": True})

# Emails
@app.route("/api/emails", methods=["GET"])
def list_emails():
    account = request.args.get("email")
    if not account:
        return jsonify([])
    # Get emails where recipient is the account
    # For demo purposes, we might also want to show sent emails, but "Inbox" usually means recipient
    emails = Email.query.filter_by(recipient=account).order_by(Email.ts.desc()).all()
    return jsonify([{
        "id": e.id,
        "sender": e.sender,
        "recipient": e.recipient,
        "subject": e.subject,
        "body": e.body,
        "ts": int(e.ts.timestamp() * 1000)
    } for e in emails])

@app.route("/api/emails", methods=["POST"])
def send_email_api():
    data = request.get_json(silent=True) or {}
    e = Email(
        sender=data.get("sender") or "System",
        recipient=data.get("recipient"),
        subject=data.get("subject"),
        body=data.get("body")
    )
    db.session.add(e)
    db.session.commit()
    
    # Simulate sending to real inbox
    print(f"\n[SMTP MOCK] Sending email to {e.recipient}...")
    
    # --- REAL EMAIL SENDING LOGIC STARTS HERE ---
    try:
        # CONFIGURE YOUR EMAIL DETAILS HERE
        SMTP_SERVER = "smtp.gmail.com"
        SMTP_PORT = 587
        SENDER_EMAIL = "imashibandara19@gmail.com"  # Your email
        SENDER_PASSWORD = "YOUR_APP_PASSWORD_HERE"  # REPLACE THIS WITH YOUR GMAIL APP PASSWORD

        if SENDER_PASSWORD != "YOUR_APP_PASSWORD_HERE":
            msg = MIMEMultipart()
            msg['From'] = SENDER_EMAIL
            msg['To'] = e.recipient
            msg['Subject'] = e.subject
            msg.attach(MIMEText(e.body, 'plain'))

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            text = msg.as_string()
            server.sendmail(SENDER_EMAIL, e.recipient, text)
            server.quit()
            print(f"[SMTP REAL] Successfully sent email to {e.recipient}")
        else:
            print("[SMTP REAL] SKIPPED. Please set SENDER_PASSWORD in app.py to enable real sending.")
    except Exception as ex:
        print(f"[SMTP REAL] FAILED: {ex}")
    # ----------------------------------------------

    print("[SMTP MOCK] Email recording complete.\n")

    return jsonify({"ok": True, "id": e.id})

    return jsonify({"ok": True, "id": e.id})

@app.route("/api/counselor/auth/login", methods=["POST", "GET"])
def counselor_auth_login():
    data = request.get_json(silent=True) or request.args.to_dict()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    c = Counselor.query.filter_by(email=email).first()
    if not c or not c.password_hash or not check_password_hash(c.password_hash, password):
        return jsonify({"error": "invalid_credentials"}), 401
    token_str = secrets.token_urlsafe(32)
    t = CounselorToken(counselor_id=c.id, token=token_str, created_at=datetime.utcnow(), expires_at=datetime.utcnow() + timedelta(days=7))
    db.session.add(t)
    db.session.commit()
    return jsonify({"ok": True, "token": token_str, "counselor": {"id": c.id, "name": c.name, "email": c.email}})

@app.route("/api/counselor/auth/logout", methods=["POST"])
def counselor_auth_logout():
    data = request.get_json(silent=True) or {}
    token = data.get("token") or ""
    if not token and "Authorization" in request.headers:
        auth = request.headers.get("Authorization") or ""
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1]
    if not token:
        return jsonify({"error": "no_token"}), 400
    t = CounselorToken.query.filter_by(token=token).first()
    if t:
        db.session.delete(t)
        db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/counselor/auth/me", methods=["GET"])
def counselor_auth_me():
    auth = request.headers.get("Authorization") or ""
    if not auth.lower().startswith("bearer "):
        return jsonify({"error": "unauthorized"}), 401
    token = auth.split(" ", 1)[1]
    t = CounselorToken.query.filter_by(token=token).first()
    if not t or t.expires_at < datetime.utcnow():
        return jsonify({"error": "unauthorized"}), 401
    c = Counselor.query.get(t.counselor_id)
    if not c:
        return jsonify({"error": "unauthorized"}), 401
    return jsonify({"ok": True, "counselor": {"id": c.id, "name": c.name, "email": c.email}})

@app.route("/api/admin/auth/login", methods=["POST", "GET"])
def admin_auth_login():
    data = request.get_json(silent=True) or request.args.to_dict()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    a = Admin.query.filter_by(email=email).first()
    if not a or not check_password_hash(a.password_hash, password):
        return jsonify({"error": "invalid_credentials"}), 401
    token_str = secrets.token_urlsafe(32)
    t = AdminToken(admin_id=a.id, token=token_str, created_at=datetime.utcnow(), expires_at=datetime.utcnow() + timedelta(days=7))
    db.session.add(t)
    db.session.commit()
    return jsonify({"ok": True, "token": token_str, "admin": {"id": a.id, "name": a.name, "email": a.email}})

@app.route("/api/admin/auth/register", methods=["POST", "GET"])
def admin_auth_register():
    data = request.get_json(silent=True) or request.args.to_dict()
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or "@" not in email or not password:
        return jsonify({"error": "invalid"}), 400
    if Admin.query.filter_by(email=email).first():
        return jsonify({"error": "exists"}), 400
    a = Admin(name=name, email=email, password_hash=generate_password_hash(password))
    db.session.add(a)
    db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/admin/auth/logout", methods=["POST"])
def admin_auth_logout():
    data = request.get_json(silent=True) or {}
    token = data.get("token") or ""
    if not token and "Authorization" in request.headers:
        auth = request.headers.get("Authorization") or ""
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1]
    if not token:
        return jsonify({"error": "no_token"}), 400
    t = AdminToken.query.filter_by(token=token).first()
    if t:
        db.session.delete(t)
        db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/admin/auth/me", methods=["GET"])
def admin_auth_me():
    auth = request.headers.get("Authorization") or ""
    if not auth.lower().startswith("bearer "):
        return jsonify({"error": "unauthorized"}), 401
    token = auth.split(" ", 1)[1]
    t = AdminToken.query.filter_by(token=token).first()
    if not t or t.expires_at < datetime.utcnow():
        return jsonify({"error": "unauthorized"}), 401
    a = Admin.query.get(t.admin_id)
    if not a:
        return jsonify({"error": "unauthorized"}), 401
    return jsonify({"ok": True, "admin": {"id": a.id, "name": a.name, "email": a.email}})

@app.route("/api/admin/users", methods=["GET"])
def admin_list_users():
    admin = get_admin_from_request()
    if not admin: return jsonify({"error": "unauthorized"}), 401
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name, "email": u.email} for u in users])

@app.route("/api/admin/counselors", methods=["GET"])
def admin_list_counselors():
    admin = get_admin_from_request()
    if not admin: return jsonify({"error": "unauthorized"}), 401
    cnsls = Counselor.query.all()
    return jsonify([{"id": c.id, "name": c.name, "email": c.email} for c in cnsls])

@app.route("/api/admin/users/<int:uid>", methods=["DELETE"])
def admin_delete_user(uid):
    admin = get_admin_from_request()
    if not admin: return jsonify({"error": "unauthorized"}), 401
    u = User.query.get(uid)
    if not u: return jsonify({"error": "not_found"}), 404
    email = u.email
    # Delete related data
    AuthToken.query.filter_by(user_id=uid).delete()
    Notification.query.filter_by(user_email=email).delete()
    Session.query.filter_by(user_email=email).delete()
    Payment.query.filter_by(user_email=email).delete()
    Appointment.query.filter_by(user_email=email).delete()
    db.session.delete(u)
    db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/admin/counselors/<int:cid>", methods=["DELETE"])
def admin_delete_counselor(cid):
    admin = get_admin_from_request()
    if not admin: return jsonify({"error": "unauthorized"}), 401
    c = Counselor.query.get(cid)
    if not c: return jsonify({"error": "not_found"}), 404
    # Delete related data
    CounselorToken.query.filter_by(counselor_id=cid).delete()
    Appointment.query.filter_by(counselor_id=cid).delete()
    Feedback.query.filter_by(counselor_id=cid).delete()
    db.session.delete(c)
    db.session.commit()
    return jsonify({"ok": True})

def get_admin_from_request():
    auth = request.headers.get("Authorization") or ""
    if not auth.lower().startswith("bearer "): return None
    token = auth.split(" ", 1)[1]
    t = AdminToken.query.filter_by(token=token).first()
    if not t or t.expires_at < datetime.utcnow(): return None
    return Admin.query.get(t.admin_id)

@app.route("/api/feedback", methods=["POST"])
def submit_feedback():
    data = request.get_json(silent=True) or {}
    cid = data.get("counselorId")
    text = data.get("text") or ""
    rating = int(data.get("rating") or 5)
    
    # Update Counselor Stats (Empathy, Clarity, Impact)
    c = Counselor.query.get(cid)
    if c:
        # Simple weighted average update for demo purposes
        # Assuming input ratings are 1-5, we update the counselor's existing ratings
        # New Average = (Old * Count + New) / (Count + 1) -> approximating this by just nudging it
        # Since we don't store count, we'll use a simple moving average with weight 0.1
        weight = 0.1
        
        # In a real app, users would rate each category. Here we assume the overall rating applies to all,
        # or we could accept specific ratings if sent.
        # Let's assume the user sends specific ratings if available, else use overall.
        def _scale(v, default):
            try:
                x = float(v)
                return x / 20.0 if x > 5 else x
            except Exception:
                return float(default)
        empathy = _scale(data.get("empathy"), rating)
        clarity = _scale(data.get("clarity"), rating)
        impact = _scale(data.get("impact"), rating)
        
        c.empathy = c.empathy * (1 - weight) + empathy * weight
        c.clarity = c.clarity * (1 - weight) + clarity * weight
        c.impact = c.impact * (1 - weight) + impact * weight
        
        db.session.add(c)

    # Sentiment Analysis
    prediction = "neutral"
    if SENTIMENT_AVAILABLE and text:
        try:
            preprocessed_txt = preprocessing(text)
            vectorized_txt = vectorizer(preprocessed_txt)
            fallback_label, fallback_score = fallback_prediction(text)
            
            if vectorized_txt.any():
                prediction = get_prediction(vectorized_txt)
                if prediction == 'positive' and fallback_label == 'negative' and fallback_score <= -0.30:
                    prediction = fallback_label
            else:
                prediction = fallback_label
        except Exception as e:
            print(f"Sentiment Error: {e}")
            
    # Save Feedback
    f = Feedback(counselor_id=cid, rating=rating, sentiment=prediction, comment=text)
    db.session.add(f)
    db.session.commit()
    
    return jsonify({
        "ok": True, 
        "sentiment": prediction, 
        "newRatings": {
            "empathy": round(c.empathy, 1) if c else 0,
            "clarity": round(c.clarity, 1) if c else 0,
            "impact": round(c.impact, 1) if c else 0
        }
    })

@app.route("/api/feedback", methods=["GET"])
def list_feedback():
    cid = request.args.get("cid")
    q = Feedback.query
    if cid:
        try:
            q = q.filter_by(counselor_id=int(cid))
        except Exception:
            return jsonify([])
    items = q.order_by(Feedback.ts.desc()).limit(50).all()
    return jsonify([{
        "id": f.id,
        "counselorId": f.counselor_id,
        "rating": f.rating,
        "sentiment": f.sentiment,
        "comment": f.comment,
        "ts": int(f.ts.timestamp() * 1000)
    } for f in items])

@app.route("/api/sentiment", methods=["POST", "GET"])
def analyze_sentiment():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    label = "neutral"
    score = 0.0
    if text:
        if 'SENTIMENT_AVAILABLE' in globals() and SENTIMENT_AVAILABLE:
            try:
                preprocessed_txt = preprocessing(text)
                vec = vectorizer(preprocessed_txt)
                fb_label, fb_score = fallback_prediction(text)
                if hasattr(vec, "any") and vec.any():
                    label = get_prediction(vec)
                    if label == 'positive' and fb_label == 'negative' and fb_score <= -0.30:
                        label = fb_label
                    score = fb_score
                else:
                    label = fb_label
                    score = fb_score
            except Exception:
                pass
        else:
            pos = ["good", "great", "excellent", "helpful", "kind", "supportive", "positive", "improve", "better", "happy", "satisfied"]
            neg = ["bad", "poor", "terrible", "rude", "unhelpful", "negative", "worse", "sad", "angry", "unsatisfied", "disappointed"]
            t = text.lower()
            p = sum(w in t for w in pos)
            n = sum(w in t for w in neg)
            if n > p and n > 0:
                label = "negative"
                score = -min(1.0, n / max(1, p + n))
            elif p > n and p > 0:
                label = "positive"
                score = min(1.0, p / max(1, p + n))
            else:
                label = "neutral"
                score = 0.0
    return jsonify({"ok": True, "label": label, "score": score})

@app.route("/api/auth/register", methods=["POST", "GET"])
def auth_register():
    data = request.get_json(silent=True) or request.args.to_dict()
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or "@" not in email or not password:
        return jsonify({"error": "invalid_input"}), 400
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"ok": True, "exists": True})
    u = User(name=name, email=email, password_hash=generate_password_hash(password))
    db.session.add(u)
    if not Account.query.filter_by(email=email).first():
        db.session.add(Account(email=email))
    db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/auth/login", methods=["POST", "GET"])
def auth_login():
    data = request.get_json(silent=True) or request.args.to_dict()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    u = User.query.filter_by(email=email).first()
    if not u or not check_password_hash(u.password_hash, password):
        return jsonify({"error": "invalid_credentials"}), 401
    u.last_login = datetime.utcnow()
    token_str = secrets.token_urlsafe(32)
    t = AuthToken(user_id=u.id, token=token_str, created_at=datetime.utcnow(), expires_at=datetime.utcnow() + timedelta(days=7))
    db.session.add(t)
    db.session.commit()
    return jsonify({"ok": True, "token": token_str, "user": {"name": u.name, "email": u.email}})

@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    data = request.get_json(silent=True) or {}
    token = data.get("token") or ""
    if not token and "Authorization" in request.headers:
        auth = request.headers.get("Authorization") or ""
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1]
    if not token:
        return jsonify({"error": "no_token"}), 400
    t = AuthToken.query.filter_by(token=token).first()
    if t:
        db.session.delete(t)
        db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/auth/me", methods=["GET"])
def auth_me():
    auth = request.headers.get("Authorization") or ""
    if not auth.lower().startswith("bearer "):
        return jsonify({"error": "unauthorized"}), 401
    token = auth.split(" ", 1)[1]
    t = AuthToken.query.filter_by(token=token).first()
    if not t or t.expires_at < datetime.utcnow():
        return jsonify({"error": "unauthorized"}), 401
    u = User.query.get(t.user_id)
    if not u:
        return jsonify({"error": "unauthorized"}), 401
    return jsonify({"ok": True, "user": {"name": u.name, "email": u.email}})

@app.route("/api/auth/change-password", methods=["POST"])
def auth_change_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    old_pwd = data.get("oldPassword")
    new_pwd = data.get("newPassword")
    role = data.get("role") or "client"

    if role == "counselor":
        u = Counselor.query.filter_by(email=email).first()
    elif role == "admin":
        u = Admin.query.filter_by(email=email).first()
    else:
        u = User.query.filter_by(email=email).first()

    if not u or not check_password_hash(u.password_hash, old_pwd):
        return jsonify({"error": "invalid_credentials"}), 401
    
    u.password_hash = generate_password_hash(new_pwd)
    db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/auth/forgot-password", methods=["POST"])
def auth_forgot_password():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    role = data.get("role") or "client"

    if role == "counselor":
        u = Counselor.query.filter_by(email=email).first()
    elif role == "admin":
        u = Admin.query.filter_by(email=email).first()
    else:
        u = User.query.filter_by(email=email).first()

    if not u:
        return jsonify({"error": "user_not_found"}), 404
    
    code = secrets.token_hex(4).upper()
    e = Email(
        sender="System",
        recipient=email,
        subject="Password Reset Request",
        body=f"Hi {u.name or 'User'},\n\nYour password reset code for {role} account is: {code}\n\nIf you didn't request this, please ignore this email."
    )
    db.session.add(e)
    db.session.commit()
    return jsonify({"ok": True, "message": "Email sent"})

@app.route("/api/auth/reset-password", methods=["POST"])
def auth_reset_password():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    role = data.get("role") or "client"
    code = data.get("code")
    new_pwd = data.get("newPassword")

    if not code or len(code) != 8:
        return jsonify({"error": "invalid_code"}), 400

    if role == "counselor":
        u = Counselor.query.filter_by(email=email).first()
    elif role == "admin":
        u = Admin.query.filter_by(email=email).first()
    else:
        u = User.query.filter_by(email=email).first()

    if not u:
        return jsonify({"error": "user_not_found"}), 404
    
    u.password_hash = generate_password_hash(new_pwd)
    db.session.commit()
    return jsonify({"ok": True})

# Counselor Dashboard API Endpoints
@app.route("/api/counselor/appointments", methods=["GET"])
def list_counselor_appointments():
    email = request.args.get("email")
    if not email:
        return jsonify([])
    c = Counselor.query.filter_by(email=email).first()
    if not c:
        return jsonify([])
    aps = Appointment.query.filter_by(counselor_id=c.id).order_by(Appointment.ts.desc()).all()
    out = []
    for a in aps:
        out.append({
            "id": a.id,
            "client_email": a.user_email,
            "date": a.date,
            "time": a.time,
            "status": a.status,
            "paymentStatus": a.payment_status
        })
    return jsonify(out)

@app.route("/api/counselor/payments", methods=["GET"])
def list_counselor_payments():
    # Since we don't have direct payment->counselor link, we infer from paid appointments
    email = request.args.get("email")
    if not email:
        return jsonify([])
    c = Counselor.query.filter_by(email=email).first()
    if not c:
        return jsonify([])
    aps = Appointment.query.filter_by(counselor_id=c.id, payment_status="paid").order_by(Appointment.ts.desc()).all()
    out = []
    for a in aps:
        out.append({
            "client_email": a.user_email,
            "amount": "45.00", # Fixed demo amount
            "ts": int(a.ts.timestamp() * 1000)
        })
    return jsonify(out)

@app.route("/api/counselor/feedback", methods=["GET"])
def list_counselor_feedback():
    email = request.args.get("email")
    if not email:
        return jsonify([])
    c = Counselor.query.filter_by(email=email).first()
    if not c:
        return jsonify([])
    feeds = Feedback.query.filter_by(counselor_id=c.id).order_by(Feedback.ts.desc()).all()
    out = []
    for f in feeds:
        out.append({
            "text": f.comment,
            "impact": int(f.rating * 20), # Convert 5-star to percentage roughly
            "rating": f.rating,
            "ts": int(f.ts.timestamp() * 1000)
        })
    return jsonify(out)

def seed():
    if Counselor.query.count() > 0:
        return
    db.session.add(Counselor(name="P.K.I.S. Bandara", email="bandara@example.com", available=True, empathy=4.8, clarity=4.6, impact=4.7, profile_image="MyOff.jpg", languages="Sinhala, English", country="Sri Lanka", flag="picures/LankaFlug.png"))
    db.session.add(Counselor(name="W.A.M.Waduwaththa", email="wadu@example.com", available=True, empathy=4.9, clarity=4.8, impact=4.9, profile_image="picures/AvskOff.jpg", languages="English, Sinhala, Korean", country="Sri Lanka", flag="picures/LankaFlug.png"))
    
    if Session.query.count() == 0:
        db.session.add(Session(user_email="demo@example.com", category="Deep Breathing", notes="Practiced 4-7-8 method.", start_ts=datetime.utcnow(), end_ts=datetime.utcnow()))
        db.session.add(Session(user_email="demo@example.com", category="Relationship Issues", counselor_name="W.A.M.Waduwaththa", notes="Discussed boundaries.", start_ts=datetime.utcnow(), end_ts=datetime.utcnow()))
    if Admin.query.count() == 0:
        admin = Admin(name="Administrator", email="admin@example.com", password_hash=generate_password_hash("admin123"))
        db.session.add(admin)
    
    # Add Mock Notifications for Testing
    if Notification.query.count() == 0:
        # Client Notifications
        db.session.add(Notification(user_email="demo@example.com", title="Appointment Confirmed", status="success", msg="Your session with Dr. Jane Smith has been scheduled. We look forward to supporting you.", related_person="Dr. Jane Smith"))
        db.session.add(Notification(user_email="demo@example.com", title="New Message", status="info", msg="Dr. Jane Smith has sent you a message in your private chat.", related_person="Dr. Jane Smith"))
        
        # Counselor Notifications
        db.session.add(Notification(user_email="bandara@example.com", title="New Booking Request", status="info", msg="A new client, demo@example.com, has requested a session.", related_person="demo@example.com"))
        
        # Admin Notifications
        db.session.add(Notification(user_email="admin@example.com", title="Provider Onboarding", status="success", msg="Counselor Mark Evans has completed the verification process and is now active.", related_person="Mark Evans"))

    db.session.commit()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8000")))
    args = parser.parse_args()
    
    with app.app_context():
        db.create_all()
        try:
            from sqlalchemy import text
            cols = db.session.execute(text("PRAGMA table_info(counselor)")).fetchall()
            names = [r[1] for r in cols]
            if "password_hash" not in names:
                db.session.execute(text("ALTER TABLE counselor ADD COLUMN password_hash TEXT"))
            cols2 = db.session.execute(text("PRAGMA table_info(appointment)")).fetchall()
            names2 = [r[1] for r in cols2]
            if "zoom_link" not in names2:
                db.session.execute(text("ALTER TABLE appointment ADD COLUMN zoom_link TEXT"))
            
            # Migration for Notification table
            cols3 = db.session.execute(text("PRAGMA table_info(notification)")).fetchall()
            names3 = [r[1] for r in cols3]
            if "title" not in names3:
                db.session.execute(text("ALTER TABLE notification ADD COLUMN title TEXT"))
            if "related_person" not in names3:
                db.session.execute(text("ALTER TABLE notification ADD COLUMN related_person TEXT"))
            if "related_image" not in names3:
                db.session.execute(text("ALTER TABLE notification ADD COLUMN related_image TEXT"))
            if "appointment_id" not in names3:
                db.session.execute(text("ALTER TABLE notification ADD COLUMN appointment_id INTEGER"))

            db.session.commit()
        except Exception as e:
            print(f"Migration Error: {e}")
            pass
        seed()
            
    url = f"http://{args.host}:{args.port}/"
    print("Serving with auth", url)
    try:
        webbrowser.open(url)
    except Exception:
        pass
    app.run(host=args.host, port=args.port)

if __name__ == "__main__":
    main()
