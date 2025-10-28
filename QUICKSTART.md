# 🚀 Quick Start Guide

Get up and running with the Privacy-first AI Writing Assistant in 5 minutes!

## Step 1: Start the Flask Backend (2 minutes)

### Option A: Using the startup script (Easiest)

**On macOS/Linux:**
```bash
./start.sh
```

**On Windows:**
```cmd
start.bat
```

### Option B: Manual setup

```bash
# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

The server will start on `http://127.0.0.1:5000`

## Step 2: Install the Chrome Extension (2 minutes)

1. Open Google Chrome
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right corner)
4. Click **Load unpacked**
5. Navigate to and select the `extension` folder
6. The extension icon should appear in your toolbar

## Step 3: Test It Out (1 minute)

### Test the Popup Interface:

1. Click the extension icon in Chrome
2. Verify the status shows "Connected to AI service" (green dot)
3. Type or paste some text with errors:
   ```
   this is a test sentance with i making errors
   ```
4. Click **Check Grammar**
5. See the results!

### Test the Context Menu:

1. Visit any webpage (or create a test HTML file)
2. Type some text in a text field or select text on the page:
   ```
   i gonna write something here kinda quickly
   ```
3. Select the text, right-click, and choose:
   - **Rewrite (Formal)** to make it more formal
4. A floating box will show the result!

## 🎉 You're Done!

### What's Next?

- Try all the different features:
  - ✓ Check Grammar
  - ✨ Improve Text
  - 📝 Rewrite (Formal/Casual/Concise)
  - 📋 Summarize

- Read the full [README.md](README.md) for more details
- Check out [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute

## 🐛 Troubleshooting

### "Not connected" in the extension
- Make sure the Flask server is running
- Check the console for errors
- Verify the server is on `http://127.0.0.1:5000`

### Extension won't load
- Make sure Developer mode is enabled
- Reload the extension after changes
- Check for errors on the extension details page

### Python errors
```bash
# Make sure you have Python 3.8+
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## 📚 Learn More

- **Full Documentation**: [README.md](README.md)
- **API Testing**: Run `python test_api.py` to test all endpoints
- **Report Issues**: Open an issue on GitHub

---

**Remember**: Your privacy is protected! All text processing happens on your local machine. No data is sent to external servers or stored anywhere. 🔒
