# How to Run the Mental Health Web App

This guide will help you start both the **Backend (Flask)** and the **Frontend (React/Vite)** and view the application in Google Chrome.

---

## 🚀 Step 1: Run the Backend (Python/Flask)

1.  **Open a terminal** and navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  **Activate your virtual environment** (if you have one):
    ```powershell
    # Windows
    .venv\Scripts\activate
    ```
3.  **Install dependencies** (if not already installed):
    ```bash
    pip install -r requirements.txt
    ```
4.  **Start the Flask server**:
    ```bash
    python app.py
    ```
    - The backend will typically run on: `http://127.0.0.1:8000` (check terminal output for exact URL).

---

## 💻 Step 2: Run the Frontend (React/Vite)

1.  **Open a NEW terminal** (leave the backend running) and navigate to the `frontend-react` folder:
    ```bash
    cd frontend-react
    ```
2.  **Install dependencies** (if not already installed):
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
    - The frontend will typically run on: `http://localhost:5173` (check terminal output for exact URL).

---

## 🌐 Step 3: View in Google Chrome

1.  Open **Google Chrome**.
2.  In the address bar, type the URL provided by the frontend (usually `http://localhost:5173`).
3.  Press **Enter**.
4.  The application should now be visible and interacting with the backend.

---

## 🛠️ Troubleshooting

- **CORS Errors**: Ensure the backend is running first.
- **Port Busy**: If `5173` or `8000` is already in use, Vite/Flask will automatically pick the next available port. Check the terminal output for the correct URL.
- **Database**: Ensure the `mental_health_v2.db` file exists in `backend/database/`.
