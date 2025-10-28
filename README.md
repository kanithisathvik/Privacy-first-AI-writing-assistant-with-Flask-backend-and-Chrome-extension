# 🔒 Privacy-first AI Writing Assistant

A privacy-focused AI writing assistant with a Flask backend and Chrome extension. All text processing is done locally on your machine - no data is stored or sent to external servers.

## ✨ Features

- **Grammar Check**: Identifies and corrects common grammar errors
- **Text Rewriting**: Rewrite text in different styles (formal, casual, concise)
- **Text Summarization**: Generate concise summaries of longer texts
- **Text Improvement**: Combines grammar checking and style improvements
- **Privacy-first**: All processing happens locally on your machine
- **No Data Collection**: Your text is never stored or logged
- **Easy to Use**: Right-click context menu and popup interface

## 🏗️ Architecture

- **Backend**: Python Flask API with local text processing
- **Frontend**: Chrome extension with popup UI and content scripts
- **Privacy**: No external API calls, no data storage, no logging

## 📋 Prerequisites

- Python 3.8 or higher
- Google Chrome browser
- pip (Python package manager)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kanithisathvik/Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension.git
cd Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension
```

### 2. Set Up the Flask Backend

1. Create a virtual environment (recommended):
```bash
python -m venv venv
```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment configuration:
```bash
cp .env.example .env
```

5. Start the Flask server:
```bash
python app.py
```

The server will start on `http://127.0.0.1:5000`

### 3. Install the Chrome Extension

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `extension` folder from this repository
6. The extension icon should appear in your Chrome toolbar

## 💻 Usage

### Using the Popup Interface

1. Click the extension icon in your Chrome toolbar
2. Enter or paste text into the text area
3. Choose an action:
   - **Check Grammar**: Find and fix grammar errors
   - **Improve Text**: Apply grammar fixes and style improvements
   - **Formal**: Rewrite in formal style
   - **Casual**: Rewrite in casual style
   - **Concise**: Remove filler words and make text concise
   - **Summarize**: Generate a summary

### Using the Context Menu

1. Select any text on a webpage
2. Right-click to open the context menu
3. Choose an AI action from the menu
4. Results appear in a floating box on the page

### Keyboard Shortcuts

- No default shortcuts, but you can configure them in Chrome settings

## 🔧 Configuration

Edit the `.env` file to customize settings:

```env
# Server Configuration
HOST=127.0.0.1
PORT=5000

# Privacy Settings
LOG_REQUESTS=False        # Disable request logging
STORE_USER_DATA=False     # Never store user data

# Model Configuration
USE_LOCAL_MODELS=True     # Use local processing only
```

## 🔒 Privacy Features

- ✅ All text processing happens locally
- ✅ No data is sent to external servers
- ✅ No user data is stored or logged
- ✅ No tracking or analytics
- ✅ Request logging disabled by default
- ✅ Open source - verify the code yourself

## 🛠️ Development

### Project Structure

```
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── .env.example          # Environment configuration template
├── extension/            # Chrome extension files
│   ├── manifest.json     # Extension configuration
│   ├── background.js     # Background service worker
│   ├── popup/           # Popup interface
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── content/         # Content scripts
│   │   ├── content.js
│   │   └── content.css
│   └── icons/           # Extension icons
└── README.md
```

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/check-grammar` - Check grammar
- `POST /api/rewrite` - Rewrite text with style
- `POST /api/summarize` - Summarize text
- `POST /api/improve` - Improve text (grammar + style)

### Adding New Features

1. Add API endpoint in `app.py`
2. Update `extension/background.js` to call the new endpoint
3. Add UI controls in `extension/popup/popup.html` and `popup.js`
4. Test thoroughly

## 🧪 Testing

### Test the Flask Backend

```bash
# Health check
curl http://127.0.0.1:5000/api/health

# Grammar check
curl -X POST http://127.0.0.1:5000/api/check-grammar \
  -H "Content-Type: application/json" \
  -d '{"text":"this is a test sentance with a eror"}'

# Rewrite text
curl -X POST http://127.0.0.1:5000/api/rewrite \
  -H "Content-Type: application/json" \
  -d '{"text":"gonna do something", "style":"formal"}'
```

### Test the Extension

1. Load the extension in Chrome
2. Check the status indicator in the popup (should be green)
3. Test each action with sample text
4. Test context menu on web pages

## 🐛 Troubleshooting

### Extension shows "Not connected"

- Make sure the Flask backend is running (`python app.py`)
- Check that it's running on `http://127.0.0.1:5000`
- Check browser console for CORS errors

### "Module not found" errors

```bash
pip install -r requirements.txt
```

### Extension not loading

- Make sure Developer mode is enabled in `chrome://extensions/`
- Check for errors in the extension details page
- Reload the extension after making changes

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Limitations

- Grammar checking uses rule-based patterns (not ML-based)
- Text summarization uses simple extractive methods
- Best for English language text
- Maximum text length: 10,000 characters

## 🔮 Future Enhancements

- [ ] Integration with more advanced local ML models
- [ ] Support for multiple languages
- [ ] Customizable writing styles
- [ ] Keyboard shortcuts
- [ ] Settings page for customization
- [ ] Export/import custom rules

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Remember**: Your privacy matters. This tool processes everything locally on your machine. No data leaves your computer.