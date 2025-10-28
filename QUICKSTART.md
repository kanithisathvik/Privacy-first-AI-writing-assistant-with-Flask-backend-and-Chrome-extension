# ContextGuard - Quick Start Guide

## Local Development

### 1. Setup
```bash
# Clone or navigate to project
cd ContextGuard

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### 2. Configure
```bash
# Copy environment template
copy .env.example .env

# Edit .env and add:
# - SECRET_KEY (any random string for development)
# - GOOGLE_API_KEY (get from https://makersuite.google.com)
# - Firebase config (optional)
```

### 3. Run
```bash
python app.py
```

Visit: http://localhost:5000

## Production Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set GOOGLE_API_KEY=your-key
git push heroku main
```

### Google Cloud Run
```bash
gcloud run deploy contextguard --source .
```

## Chrome Extension

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `ContextGuard` folder
5. Look for the ⚡ icon on webpages!

## Features

- 📝 Summarize - Condense long text
- ✍️ Rewrite - Adjust tone and style
- ✅ Proofread - Fix errors
- 🌐 Translate - 10+ languages
- 🔒 Privacy-first - No data collection

## Support

- Documentation: README.md
- Issues: GitHub Issues
- Email: support@contextguard.com
