@echo off
REM ContextGuard - Local Development Server
REM Run this script to start the Flask application

echo.
echo ================================================
echo    ContextGuard - Starting Development Server
echo ================================================
echo.

REM Activate virtual environment
call "E:\hackthons\New folder (2)\.venv\Scripts\activate.bat"

REM Set environment variables
set FLASK_APP=app.py
set FLASK_ENV=development
set DEBUG=True
set HOST=127.0.0.1
set PORT=5000

REM Check if .env file exists
if not exist .env (
    echo WARNING: .env file not found. Creating from .env.example...
    copy .env.example .env
)

echo Starting Flask server on http://127.0.0.1:5000
echo Press Ctrl+C to stop the server
echo.

REM Run Flask application
python app.py

pause
