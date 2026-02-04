# Mental Health Web Application - Project Structure

## 📁 New Organized Structure

```
MentalHealth/
├── backend/                      # Backend application
│   ├── app.py                    # Main Flask application
│   └── database/                 # Database and related scripts
│       ├── mental_health_v2.db   # SQLite database
│       ├── fix_db.py             # Database fix utility
│       ├── seed_counselor.py     # Seed counselor data
│       ├── update_db.py          # Database update scripts
│       ├── update_db_email.py
│       ├── update_db_feedback.py
│       └── update_db_live.py
│
├── frontend/                     # Frontend application
│   ├── index.html                # Main HTML file
│   ├── assets/                   # CSS and JavaScript
│   │   ├── app.js                # Main JavaScript file
│   │   └── styles.css            # Main CSS file
│   └── images/                   # All images (renamed from "picures")
│       ├── Chatbot.jpg
│       ├── LankaFlug.png
│       ├── IndiaFlug.png
│       ├── USAflug.png
│       └── [all other images]
│
├── modules/                      # External modules
│   └── Sentiment-Analysis-Project/  # Sentiment analysis module
│
├── scripts/                      # Utility scripts
│   └── test_api.py               # API testing script
│
├── docs/                         # Documentation
│   └── RUN_PROJECT.md            # How to run the project
│
├── .git/                         # Git repository
├── .venv/                        # Python virtual environment
├── .vscode/                      # VS Code settings
└── __pycache__/                  # Python cache files
```

## 🚀 How to Run the Project

### 1. Start the Backend Server

```powershell
cd backend
python app.py
```

The server will start at: `http://127.0.0.1:8000/`

### 2. Access the Application

Open your browser and navigate to:
- **Main Application**: http://127.0.0.1:8000/
- **Health Check**: http://127.0.0.1:8000/api/health
- **API Routes**: http://127.0.0.1:8000/api/debug/routes

## 📝 Key Changes Made

### Path Updates in `backend/app.py`:

1. **Database Path**: Now points to `backend/database/mental_health_v2.db`
2. **Upload Folder**: Now points to `frontend/images/`
3. **Sentiment Analysis**: Now loads from `modules/Sentiment-Analysis-Project/`
4. **Frontend Files**: Serves from `frontend/` directory
5. **Image Routes**: 
   - New route: `/images/<path>` (recommended)
   - Old route: `/picures/<path>` (kept for backwards compatibility)

### Benefits of New Structure:

✅ **Better Organization**: Clear separation of backend, frontend, and modules
✅ **Easier Maintenance**: Related files are grouped together
✅ **Professional Structure**: Follows industry best practices
✅ **Scalability**: Easy to add new features in appropriate folders
✅ **No Breaking Changes**: Old image paths still work via compatibility routes

## 🔧 API Endpoints

### Authentication
- `POST /api/accounts/login` - Client login
- `POST /api/counselor/auth/login` - Counselor login
- `POST /api/admin/auth/login` - Admin login

### Core Features
- `GET /api/counselors` - List all counselors
- `POST /api/appointments` - Book appointment
- `GET /api/sessions` - Get session history
- `POST /api/payments` - Process payment
- `GET /api/notifications` - Get notifications

### Static Files
- `/` - Serves `frontend/index.html`
- `/assets/*` - Serves from `frontend/assets/`
- `/images/*` - Serves from `frontend/images/`
- `/picures/*` - Backwards compatible, serves from `frontend/images/`

## 📊 Database Location

The SQLite database is now located at:
```
backend/database/mental_health_v2.db
```

All database utility scripts are in the same folder for easy access.

## 🎨 Frontend Assets

All frontend files are now in the `frontend/` directory:
- HTML: `frontend/index.html`
- CSS: `frontend/assets/styles.css`
- JavaScript: `frontend/assets/app.js`
- Images: `frontend/images/`

## 🧪 Testing

To test the API:
```powershell
cd scripts
python test_api.py
```

## 📚 Documentation

All project documentation is in the `docs/` folder.

---

**Last Updated**: February 3, 2026
**Structure Version**: 2.0
