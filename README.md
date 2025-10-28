# 🔒 Privacy-First AI Writing Assistant

A privacy-focused AI writing assistant that helps you improve your writing without sending your data to external servers. All text analysis is performed locally on your machine using a Flask backend and a Chrome extension.

## ✨ Features

- **🔐 Complete Privacy**: All processing happens locally on your machine. No data is sent to external servers or logged.
- **✏️ Grammar & Spelling Check**: Powered by LanguageTool (runs locally)
- **📖 Readability Analysis**: Multiple readability metrics (Flesch-Kincaid, SMOG, etc.)
- **📊 Writing Statistics**: Word count, sentence count, character count, and more
- **💡 Smart Suggestions**: Detects passive voice, long sentences, and repeated words
- **🎭 Tone Analysis**: Analyze formality and sentiment of your writing
- **🌐 Browser Integration**: Chrome extension for easy access across websites

## 🏗️ Architecture

```
┌─────────────────────┐
│  Chrome Extension   │
│  (Frontend UI)      │
└──────────┬──────────┘
           │ HTTP
           │ (localhost only)
┌──────────▼──────────┐
│   Flask Backend     │
│   (Local Server)    │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼───┐  ┌───▼────┐
│Language│  │ NLTK & │
│ Tool   │  │Textstat│
└────────┘  └────────┘
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Google Chrome browser
- pip (Python package manager)

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kanithisathvik/Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension.git
   cd Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask backend**:
   ```bash
   python app.py
   ```
   
   The backend will start on `http://127.0.0.1:5000`

### Chrome Extension Setup

1. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

2. **Load the extension**:
   - Click "Load unpacked"
   - Select the `chrome-extension` folder from this repository

3. **Verify installation**:
   - You should see the extension icon (🔒) in your Chrome toolbar
   - The extension should show "Backend connected" when the Flask server is running

## 📖 Usage

### Method 1: Using the Extension Popup

1. Click the extension icon in your Chrome toolbar
2. Paste or type your text in the text area
3. Click "Analyze Text" to get instant feedback

### Method 2: Analyze Selected Text

1. Select any text on a webpage
2. Click the extension icon
3. Click "Analyze Selected" to analyze the highlighted text

### Method 3: Context Menu

1. Select text on any webpage
2. Right-click and select "Analyze with Writing Assistant"
3. The extension popup will open with your selected text

## 📊 Analysis Features

### Grammar & Spelling
- Detects grammar mistakes
- Identifies spelling errors
- Provides correction suggestions
- Context-aware recommendations

### Readability Metrics
- **Flesch Reading Ease**: Measures how easy text is to read (0-100 scale)
- **Flesch-Kincaid Grade**: Indicates US school grade level
- **SMOG Index**: Estimates years of education needed
- **Coleman-Liau Index**: Grade level based on characters
- **Automated Readability Index**: Another grade-level metric

### Writing Statistics
- Word count
- Sentence count
- Character count
- Paragraph count
- Average word length
- Average sentence length

### Suggestions
- Passive voice detection
- Long sentence warnings
- Repeated word detection
- Style improvement recommendations

### Tone Analysis
- **Formality**: Formal, Informal, or Neutral
- **Sentiment**: Positive, Negative, or Neutral

## 🔒 Privacy & Security

This application is designed with privacy as the core principle:

- ✅ **Local Processing Only**: All text analysis happens on your machine
- ✅ **No External API Calls**: No data leaves your computer
- ✅ **No Data Logging**: Your text is never saved or logged
- ✅ **No Telemetry**: We don't collect any usage data
- ✅ **Open Source**: Full transparency - inspect the code yourself
- ✅ **localhost Communication**: Extension only talks to your local server

## 🛠️ API Endpoints

The Flask backend exposes the following endpoints:

### `GET /`
Health check endpoint
```json
{
  "status": "ok",
  "message": "Privacy-first AI Writing Assistant API",
  "version": "1.0.0",
  "privacy": "All processing is done locally..."
}
```

### `POST /api/analyze`
Comprehensive text analysis
```json
{
  "text": "Your text here"
}
```

### `POST /api/grammar`
Grammar checking only
```json
{
  "text": "Your text here"
}
```

### `POST /api/readability`
Readability analysis only
```json
{
  "text": "Your text here"
}
```

## 🧪 Testing

You can test the backend API using curl:

```bash
# Health check
curl http://127.0.0.1:5000/

# Analyze text
curl -X POST http://127.0.0.1:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here"}'

# Grammar check
curl -X POST http://127.0.0.1:5000/api/grammar \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here"}'
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [LanguageTool](https://languagetool.org/) - Open-source grammar checker
- [NLTK](https://www.nltk.org/) - Natural Language Toolkit
- [Textstat](https://github.com/textstat/textstat) - Text statistics library
- [Flask](https://flask.palletsprojects.com/) - Python web framework

## 🐛 Troubleshooting

### Extension shows "Backend offline"
- Make sure the Flask backend is running (`python app.py`)
- Check that it's running on port 5000
- Ensure no firewall is blocking localhost connections

### Grammar checker takes long on first run
- LanguageTool downloads language data on first use
- Subsequent runs will be much faster

### Extension not detecting selected text
- Make sure you've granted the extension permission to access the webpage
- Try refreshing the page after installing the extension

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.