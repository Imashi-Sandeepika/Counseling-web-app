@echo off
SETLOCAL
echo ==========================================
echo    PsyCare - Mental Health Web App
echo    Starting All Services...
echo ==========================================

:: Check if .venv exists
IF EXIST ".venv\Scripts\python.exe" (
    echo [1/2] Starting Backend (Flask)...
    start "PsyCare Backend" /min cmd /c ".venv\Scripts\python.exe backend\app.py"
) ELSE (
    echo [ERROR] Virtual environment not found (.venv). 
    echo Please run 'python -m venv .venv' first.
    pause
    exit /b
)

echo [2/2] Starting Frontend (React/Vite)...
cd frontend-react
npm run dev

ENDLOCAL
