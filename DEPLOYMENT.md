# GitHub Deployment Guide

Complete guide to deploy ContextGuard to GitHub and set up continuous deployment.

## 📋 Prerequisites

- GitHub account
- Git installed locally
- ContextGuard repository initialized (✅ Already done!)

## 🚀 Push to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right
3. Select "New repository"
4. Repository settings:
   - **Name**: `ContextGuard` (or your preferred name)
   - **Description**: "Privacy-first AI writing assistant with Flask backend and Chrome extension"
   - **Visibility**: Public (recommended) or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/ContextGuard.git

# Verify remote was added
git remote -v

# Push all commits to GitHub
git push -u origin master
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Alternative: Using SSH

If you prefer SSH:

```bash
# Add remote with SSH
git remote add origin git@github.com:YOUR_USERNAME/ContextGuard.git

# Push to GitHub
git push -u origin master
```

## 🔧 Repository Settings

### Branch Protection (Optional but Recommended)

1. Go to repository Settings → Branches
2. Add branch protection rule for `master` or `main`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Include administrators

### Secrets for CI/CD

Go to Settings → Secrets and variables → Actions

Add these secrets:

1. **FIREBASE_CREDENTIALS** (optional)
   - Your Firebase service account JSON (if using Firebase)

2. **GEMINI_API_KEY** (required)
   - Your Google Generative AI API key

3. **SECRET_KEY** (required)
   - Flask secret key for sessions

## 🤖 GitHub Actions CI/CD

### Create Workflow File

Already created in `.github/workflows/` (if you want to add it):

```yaml
name: ContextGuard CI/CD

on:
  push:
    branches: [ master, main ]
  pull_request:
    branches: [ master, main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.12'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Lint with flake8
      run: |
        pip install flake8
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
    
    - name: Test Flask app
      run: |
        python -c "from app import app; assert app is not None"
      env:
        FLASK_ENV: testing
        SECRET_KEY: test-secret-key
```

### Enable GitHub Actions

1. Go to Actions tab in your repository
2. Click "I understand my workflows, go ahead and enable them"
3. Workflows will run automatically on push

## 🌐 Deploy to Web Platforms

### Option 1: Heroku (Easiest)

Already configured with `Procfile` and `runtime.txt`!

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-contextguard-app

# Set environment variables
heroku config:set SECRET_KEY="your-secret-key-here"
heroku config:set GEMINI_API_KEY="your-gemini-key-here"
heroku config:set FIREBASE_CREDENTIALS="$(cat path/to/firebase-credentials.json)"

# Deploy
git push heroku master

# Open app
heroku open
```

### Option 2: Google Cloud Run

```bash
# Build container
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/contextguard

# Deploy
gcloud run deploy contextguard \
  --image gcr.io/YOUR_PROJECT_ID/contextguard \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 3: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to link your GitHub repo
```

## 📱 Chrome Extension Publishing

### Prepare Extension for Web Store

1. **Create ZIP file** of extension:
   ```bash
   # From ContextGuard directory
   zip -r contextguard-extension.zip manifest.json src/ public/ assets/icons/
   ```

2. **Create Chrome Web Store Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 registration fee

3. **Upload Extension**
   - Click "New Item"
   - Upload `contextguard-extension.zip`
   - Fill in store listing details
   - Add screenshots
   - Submit for review

### Store Listing Details

**Name**: ContextGuard - Privacy-First AI Assistant

**Description**:
```
Privacy-first AI writing assistant that works on any webpage. Summarize, rewrite, proofread, and translate text with powerful AI while keeping your data secure.

Features:
✨ Smart Summarization
✍️ Intelligent Rewriting  
✅ Advanced Proofreading
🌐 Multi-Language Translation
🎓 ELI5 Explanations
📊 Analytics Dashboard
⌨️ Keyboard Shortcuts

Your privacy matters. All processing can be done locally or on our secure servers - you choose.
```

**Category**: Productivity

**Language**: English (add more as needed)

## 📊 GitHub Pages (Documentation)

You can host documentation on GitHub Pages:

```bash
# Create gh-pages branch
git checkout --orphan gh-pages

# Remove all files
git rm -rf .

# Create index.html with docs
echo "<!DOCTYPE html><html><body><h1>ContextGuard Documentation</h1></body></html>" > index.html

# Commit and push
git add index.html
git commit -m "Initial GitHub Pages"
git push origin gh-pages

# Go back to master
git checkout master
```

Enable GitHub Pages in Settings → Pages → Source: gh-pages branch

## 🔐 Security Best Practices

### .gitignore Check

Ensure these are in `.gitignore`:
- ✅ `.env`
- ✅ `*.pyc`
- ✅ `__pycache__/`
- ✅ Firebase credentials
- ✅ `venv/` or `.venv/`

### Environment Variables

Never commit:
- ❌ API keys
- ❌ Firebase credentials
- ❌ Secret keys
- ❌ Database passwords

Always use:
- ✅ `.env` files (gitignored)
- ✅ Platform environment variables
- ✅ GitHub Secrets for CI/CD

## 📝 Post-Deployment Checklist

After pushing to GitHub:

- [ ] Repository is public/accessible
- [ ] README.md displays correctly
- [ ] All badges are working
- [ ] License file is present
- [ ] .gitignore is working (no sensitive files)
- [ ] GitHub Actions are passing (if configured)
- [ ] Issues are enabled
- [ ] Discussions are enabled (optional)
- [ ] Topics/tags are added for discoverability
- [ ] Social preview image is set (optional)

### Add Repository Topics

Go to repository → About → Settings (gear icon) → Topics

Suggested topics:
- `ai`
- `flask`
- `chrome-extension`
- `privacy`
- `writing-assistant`
- `nlp`
- `python`
- `javascript`
- `firebase`

## 🎉 You're Done!

Your repository is now live at:
```
https://github.com/YOUR_USERNAME/ContextGuard
```

### Next Steps

1. **Add Badges** to README:
   ```markdown
   ![Build Status](https://github.com/YOUR_USERNAME/ContextGuard/workflows/CI/badge.svg)
   ![Deploy](https://img.shields.io/badge/deploy-heroku-purple)
   ```

2. **Create Releases**:
   - Go to Releases → Create a new release
   - Tag: `v1.0.0`
   - Title: "ContextGuard v1.0.0 - Initial Release"
   - Description: Feature list and changelog

3. **Enable Dependabot** (Security):
   - Go to Settings → Security & analysis
   - Enable Dependabot alerts and security updates

4. **Add Contributing Guidelines**:
   - Create `CONTRIBUTING.md`
   - Define how others can contribute

5. **Share Your Project**:
   - Tweet about it
   - Post on Reddit (r/Python, r/flask)
   - Share on LinkedIn
   - Submit to Product Hunt

## 🐛 Troubleshooting

### "Remote already exists" error
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ContextGuard.git
```

### Push rejected / Non-fast-forward error
```bash
# If you're sure you want to overwrite
git push -f origin master

# Or pull first and merge
git pull origin master --allow-unrelated-histories
git push origin master
```

### Large files error
```bash
# Remove large files from history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch PATH/TO/LARGE/FILE' \
  --prune-empty --tag-name-filter cat -- --all
```

---

**Need Help?** Open an issue on the repository or check [GitHub Docs](https://docs.github.com/)
