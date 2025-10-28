# ContextGuard 🔒⚡

**Privacy-First AI Writing Assistant** - Summarize, rewrite, proofread, and translate text with powerful AI while keeping your data secure.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.12%2B-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 Features

- **📝 Smart Summarization** - Condense long text into key points
- **✍️ Intelligent Rewriting** - Adjust tone (formal/neutral/friendly) and reading level
- **✅ Advanced Proofreading** - Fix grammar, spelling, and punctuation
- **🌐 Multi-Language Translation** - Translate to 10+ languages
- **🔒 Privacy-First** - Your data stays secure (optional local processing)
- **⚡ Chrome Extension** - Access AI tools on any webpage
- **🌐 Web Application** - Full-featured web interface
- **🔥 Firebase Integration** - Optional authentication for cross-device preferences

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- **Flask** - Python web framework
- **Firebase Admin SDK** - Authentication and Firestore
- **Google Generative AI** - AI processing (Gemini)
- **NLTK/SpaCy** - Fallback text processing

**Frontend:**
- **Jinja2 Templates** - Server-side rendering
- **Vanilla JavaScript** - No heavy frameworks
- **Firebase Auth** - Optional user authentication
- **Responsive CSS** - Mobile-friendly design

**Chrome Extension:**
- **Manifest V3** - Modern extension architecture
- **Content Scripts** - Page interaction
- **Service Worker** - Background processing
- **Chrome AI APIs** - Optional local AI processing

---

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Chrome 128+ (for extension)
- Firebase project (optional, for auth)
- Google API key (optional, for enhanced AI)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/contextguard.git
cd contextguard
```

2. **Create virtual environment:**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Download NLTK data:**
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

5. **Configure environment:**
```bash
copy .env.example .env
# Edit .env with your configuration
```

6. **Run the application:**
```bash
python app.py
```

7. **Access the app:**
- Web App: http://localhost:5000
- Dashboard: http://localhost:5000/dashboard

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Firebase (Optional)
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CREDENTIALS=firebase-adminsdk.json

# Google Generative AI (Recommended)
GOOGLE_API_KEY=your-google-api-key

# Server
PORT=5000
HOST=0.0.0.0
DEBUG=True
```

### Firebase Setup (Optional)

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Google)
3. Enable Firestore Database
4. Download Admin SDK credentials as `firebase-adminsdk.json`
5. Copy Web App config to `.env`

### Google AI Setup (Recommended)

1. Get API key from https://makersuite.google.com/app/apikey
2. Add to `.env` as `GOOGLE_API_KEY`

---

## 📱 Chrome Extension Setup

### Installation

1. **Load Extension:**
   - Open Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `ContextGuard` folder

2. **Configure Extension:**
   - Click the extension icon
   - Go to Settings
   - Configure tone, reading level, and language preferences

### Usage

1. **On Any Webpage:**
   - Look for the ⚡ button (bottom-right)
   - Select text or let it auto-detect content
   - Choose an action (Summarize/Rewrite/Proofread/Translate)
   - View results in the side panel
   - Copy or Apply changes

2. **Context Menus:**
   - Right-click selected text
   - Choose "ContextGuard" actions

---

## 🌐 Web Application

### Pages

- **Home** (`/`) - Landing page
- **Dashboard** (`/dashboard`) - Main AI processing interface
- **Extension** (`/extension`) - Extension download and info
- **About** (`/about`) - About the project
- **Privacy** (`/privacy`) - Privacy policy

### API Endpoints

#### AI Processing

```
POST /ai/summarize
POST /ai/rewrite
POST /ai/proofread
POST /ai/translate
POST /ai/generate-alt-text
GET  /ai/status
```

#### Authentication

```
POST /auth/verify-token
POST /auth/logout
GET  /auth/user/preferences
POST /auth/user/preferences
GET  /auth/user/status
```

### Example API Request

```javascript
// Summarize text
const response = await fetch('/ai/summarize', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        text: 'Your long text here...',
        type: 'key-points',
        length: 'medium'
    })
});

const data = await response.json();
console.log(data.result);
```

---

## 🧪 Development

### Project Structure

```
ContextGuard/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── .env.example               # Environment template
├── backend/
│   ├── ai/
│   │   ├── processor.py       # AI processing logic
│   │   └── routes.py          # AI API endpoints
│   ├── auth/
│   │   └── routes.py          # Authentication endpoints
│   └── api/
│       └── routes.py          # General API endpoints
├── frontend/
│   ├── templates/             # Jinja2 HTML templates
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── dashboard.html
│   │   └── ...
│   └── static/
│       ├── css/               # Stylesheets
│       ├── js/                # JavaScript files
│       └── icons/             # Application icons
├── src/                       # Chrome Extension
│   ├── content/               # Content scripts
│   ├── worker/                # Service worker
│   └── ...
├── public/                    # Extension public files
├── assets/                    # Extension assets
└── manifest.json              # Extension manifest
```

### Running in Development

```bash
# With auto-reload
flask run --debug

# Or
python app.py
```

### Testing

```bash
# Test AI endpoints
curl -X POST http://localhost:5000/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here..."}'

# Check health
curl http://localhost:5000/health
```

---

## 🚢 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set GOOGLE_API_KEY=your-api-key

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Google Cloud Run

```bash
# Build and deploy
gcloud run deploy contextguard \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to Vercel/Railway

Follow their Python deployment guides with `app.py` as entry point.

---

## 🔒 Privacy & Security

### Data Handling

- **No Logging**: Text content is never logged or stored
- **In-Memory Processing**: All processing happens in-memory
- **Optional Local Processing**: Chrome extension can use built-in AI
- **Minimal Data Collection**: Only email (if signed in) and preferences
- **HTTPS Only**: All communication encrypted
- **No Analytics**: We don't track your usage

### Chrome Extension Permissions

- `activeTab` - To read selected text on current page
- `scripting` - To inject overlay UI
- `storage` - To save user preferences locally
- `contextMenus` - For right-click actions
- `sidePanel` - To show results panel

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript
- Write descriptive commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Generative AI** - AI processing
- **Firebase** - Authentication and database
- **NLTK** - Natural language processing
- **Chrome AI APIs** - Local AI processing
- **Flask** - Web framework

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/contextguard/issues)
- **Email**: support@contextguard.com
- **Docs**: [Full Documentation](https://contextguard.com/docs)

---

## 🗺️ Roadmap

- [ ] Desktop application (Electron)
- [ ] Mobile app (React Native)
- [ ] More languages support
- [ ] Voice-to-text integration
- [ ] Document upload and batch processing
- [ ] Browser extensions for Firefox, Edge
- [ ] Offline mode with local models
- [ ] API for developers

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Made with ❤️ by ContextGuard Team**

*Your privacy is our priority* 🔒
