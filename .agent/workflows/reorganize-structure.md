---
description: Reorganize project folder structure
---

# Mental Health Project - Folder Reorganization Plan

## Current Structure Issues:
- Root directory is cluttered with multiple Python scripts
- Images folder is named "picures" (typo)
- Duplicate/unused "mentalhealth" folder (appears to be a Vite project)
- Database scripts scattered in root

## Proposed New Structure:

```
MentalHealth/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── database/
│   │   ├── mental_health_v2.db   # SQLite database
│   │   ├── fix_db.py             # Database fix scripts
│   │   ├── seed_counselor.py     # Seed data
│   │   ├── update_db.py          # DB update scripts
│   │   ├── update_db_email.py
│   │   ├── update_db_feedback.py
│   │   └── update_db_live.py
│   ├── models/                   # (Future: separate DB models)
│   ├── routes/                   # (Future: separate API routes)
│   └── utils/                    # (Future: helper functions)
│
├── frontend/
│   ├── index.html                # Main HTML file
│   ├── assets/
│   │   ├── app.js                # JavaScript
│   │   └── styles.css            # CSS
│   └── images/                   # Renamed from "picures"
│       └── [all image files]
│
├── modules/
│   └── Sentiment-Analysis-Project/  # Sentiment analysis module
│
├── scripts/
│   └── test_api.py               # Testing scripts
│
├── docs/
│   └── RUN_PROJECT.md            # Documentation
│
├── .git/
├── .venv/
├── .vscode/
└── __pycache__/
```

## Migration Steps:

1. Create new directory structure
2. Move backend files
3. Move frontend files
4. Move images and rename folder
5. Move modules and scripts
6. Update all file references in code
7. Test the application

## Files to Update After Move:
- `app.py` - Update paths for database, upload folder, templates
- `index.html` - Update image paths if needed
- `app.js` - Update API endpoints if needed
- Database scripts - Update database path references
