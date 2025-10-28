@echo off
REM Start the Privacy-first AI Writing Assistant Flask backend

echo Starting Privacy-first AI Writing Assistant...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt --quiet

REM Create .env if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

REM Start Flask server
echo.
echo Starting Flask server...
python app.py
