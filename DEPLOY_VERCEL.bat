@echo off
REM ========================================
REM  DEPLOY CONTEXTGUARD TO VERCEL
REM ========================================

echo.
echo ==========================================
echo   ContextGuard - Vercel Deployment
echo ==========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    echo.
    npm install -g vercel
    echo.
    echo Installation complete!
    echo.
)

echo ==========================================
echo   Step 1: Login to Vercel
echo ==========================================
echo.
echo You will be redirected to browser for authentication.
echo.
pause

vercel login

echo.
echo ==========================================
echo   Step 2: Deploy to Vercel
echo ==========================================
echo.
echo Deploying your application...
echo.

cd /d "e:\hackthons\New folder (2)\ContextGuard"

REM Initial deployment
vercel

echo.
echo ==========================================
echo   Step 3: Deploy to Production
echo ==========================================
echo.
echo Deploying to production...
echo.

vercel --prod

echo.
echo ==========================================
echo   DEPLOYMENT COMPLETE!
echo ==========================================
echo.
echo Your app should now be live!
echo.
echo To view:
echo   vercel open
echo.
echo To check logs:
echo   vercel logs
echo.
echo To add environment variables:
echo   vercel env add SECRET_KEY
echo   vercel env add GEMINI_API_KEY
echo.
echo ==========================================
echo.
echo IMPORTANT: Don't forget to add environment variables!
echo.
echo Required Variables:
echo   - SECRET_KEY
echo   - GEMINI_API_KEY  
echo   - FLASK_ENV (set to 'production')
echo.
echo Add them via:
echo   Vercel Dashboard -^> Your Project -^> Settings -^> Environment Variables
echo   OR
echo   vercel env add VARIABLE_NAME
echo.
pause

echo.
echo Opening Vercel dashboard...
vercel open

echo.
echo ==========================================
echo   Next Steps
echo ==========================================
echo.
echo 1. Add environment variables (if not done)
echo 2. Test your deployed app
echo 3. Configure custom domain (optional)
echo 4. Share your live URL!
echo.
pause
