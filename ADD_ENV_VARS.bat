@echo off
REM ========================================
REM  ADD ENVIRONMENT VARIABLES TO VERCEL
REM ========================================

echo.
echo ==========================================
echo   Setup Environment Variables
echo ==========================================
echo.
echo This will help you add environment variables to Vercel.
echo.
echo ==========================================
echo   REQUIRED VARIABLES
echo ==========================================
echo.
echo 1. SECRET_KEY (for Flask sessions)
echo    Suggested value: 8f42a73054b1749f8f58848be5e6502c2e0b8e14e6d5f8c5d9e3f4a6b7c8d9e0
echo.
echo 2. GEMINI_API_KEY (for AI features)
echo    Get from: https://makersuite.google.com/app/apikey
echo    Format: AIzaSy...
echo.
echo 3. FLASK_ENV
echo    Value: production
echo.
echo 4. DEBUG
echo    Value: False
echo.
echo 5. ALLOWED_ORIGINS
echo    Value: https://your-app.vercel.app,chrome-extension://
echo    (Update after getting your Vercel URL)
echo.
echo ==========================================
echo   HOW TO ADD VARIABLES
echo ==========================================
echo.
echo METHOD 1: Via Vercel Dashboard (Easiest)
echo -----------------------------------------
echo 1. Go to: https://vercel.com/dashboard
echo 2. Select your project
echo 3. Go to Settings ^> Environment Variables
echo 4. Add each variable one by one
echo 5. Click "Save"
echo.
echo METHOD 2: Via Vercel CLI
echo -----------------------------------------
echo Run these commands:
echo.
echo   vercel env add SECRET_KEY
echo   vercel env add GEMINI_API_KEY
echo   vercel env add FLASK_ENV
echo   vercel env add DEBUG
echo   vercel env add ALLOWED_ORIGINS
echo.
echo ==========================================
echo   LET'S ADD THEM NOW
echo ==========================================
echo.
echo Press any key to add variables via CLI...
echo (or Ctrl+C to exit and use Dashboard method)
pause >nul

cd /d "e:\hackthons\New folder (2)\ContextGuard"

echo.
echo Adding SECRET_KEY...
echo Enter: 8f42a73054b1749f8f58848be5e6502c2e0b8e14e6d5f8c5d9e3f4a6b7c8d9e0
vercel env add SECRET_KEY

echo.
echo Adding GEMINI_API_KEY...
echo Enter your Google Gemini API key:
vercel env add GEMINI_API_KEY

echo.
echo Adding FLASK_ENV...
echo Enter: production
vercel env add FLASK_ENV

echo.
echo Adding DEBUG...
echo Enter: False
vercel env add DEBUG

echo.
echo Adding ALLOWED_ORIGINS...
echo Enter: https://your-app.vercel.app,chrome-extension://
echo (You can update this later after deployment)
vercel env add ALLOWED_ORIGINS

echo.
echo ==========================================
echo   ENVIRONMENT VARIABLES ADDED!
echo ==========================================
echo.
echo Next steps:
echo 1. Redeploy your app: vercel --prod
echo 2. Test your deployment
echo 3. Update ALLOWED_ORIGINS with actual URL
echo.
pause
