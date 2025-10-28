REM ========================================
REM  PUSH CONTEXTGUARD TO GITHUB
REM ========================================

@echo off
echo.
echo ==========================================
echo   Pushing ContextGuard to GitHub
echo ==========================================
echo.
echo Repository: https://github.com/kanithisathvik/ContextGuard
echo.
echo IMPORTANT: Make sure you've created the repository on GitHub first!
echo Go to: https://github.com/new
echo.
echo Repository Settings:
echo   - Name: ContextGuard
echo   - Visibility: Public
echo   - DO NOT initialize with README/gitignore
echo.
pause
echo.
echo Pushing to GitHub...
echo.

cd /d "e:\hackthons\New folder (2)\ContextGuard"

REM Push to GitHub
git push -u origin master

echo.
echo ==========================================
echo   Push Complete!
echo ==========================================
echo.
echo Your repository is now live at:
echo https://github.com/kanithisathvik/ContextGuard
echo.
echo Next Steps:
echo 1. View your repository on GitHub
echo 2. Add topics: ai, flask, chrome-extension, privacy, nlp, python
echo 3. Enable Issues and Discussions
echo 4. Create a release (v1.0.0)
echo 5. Share your project!
echo.
pause
