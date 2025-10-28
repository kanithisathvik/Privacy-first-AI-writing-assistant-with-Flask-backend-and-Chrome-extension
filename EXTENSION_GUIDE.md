# Chrome Extension User Guide

## 🚀 Installation

1. **Download or clone the repository**
   ```bash
   git clone https://github.com/kanithisathvik/Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension.git
   ```

2. **Start the Flask backend**
   ```bash
   cd Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension
   pip3 install -r requirements.txt
   python3 app.py
   ```

3. **Load the extension in Chrome**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Navigate to and select the `chrome-extension` folder

4. **Verify installation**
   - Look for the extension icon (🔒) in your Chrome toolbar
   - Click the icon to open the popup
   - You should see "Backend connected" if the Flask server is running

## 📖 Using the Extension

### Method 1: Direct Text Input

1. Click the extension icon in your toolbar
2. Type or paste your text in the text area
3. Click "Analyze Text"
4. Review the analysis results

### Method 2: Analyze Selected Text

1. Select any text on a webpage
2. Click the extension icon
3. Click "Analyze Selected"
4. Review the analysis results

### Method 3: Context Menu (Right-Click)

1. Select text on any webpage
2. Right-click on the selected text
3. Choose "Analyze with Writing Assistant"
4. The extension popup will open with results

## 📊 Understanding the Results

### Statistics
- **Word Count**: Total number of words
- **Sentence Count**: Total number of sentences
- **Character Count**: Total characters (excluding spaces)
- **Paragraph Count**: Number of paragraphs

### Readability
- **Reading Ease (0-100)**: Higher scores = easier to read
  - 90-100: Very Easy (5th grade)
  - 80-90: Easy (6th grade)
  - 70-80: Fairly Easy (7th grade)
  - 60-70: Standard (8th-9th grade)
  - 50-60: Fairly Difficult (10th-12th grade)
  - 30-50: Difficult (College)
  - 0-30: Very Difficult (College graduate)

- **Grade Level**: US school grade level needed to understand the text

### Grammar Issues
- Shows spelling and grammar mistakes
- Provides correction suggestions
- Click on replacements to learn alternatives

### Suggestions
- **Passive Voice**: Suggestions to use active voice
- **Long Sentences**: Warnings about overly complex sentences
- **Repeated Words**: Detection of unnecessary repetition

### Tone Analysis
- **Formality**: Formal, Informal, or Neutral
- **Sentiment**: Positive, Negative, or Neutral

## 🔧 Troubleshooting

### "Backend offline" message

**Problem**: Extension shows "Backend offline - Please start Flask server"

**Solution**:
1. Make sure the Flask backend is running: `python3 app.py`
2. Check that it's running on port 5000
3. Verify no firewall is blocking localhost

### No text detected

**Problem**: "Analyze Selected" doesn't work

**Solution**:
1. Make sure text is actually selected on the page
2. Try refreshing the page after installing the extension
3. Check that the extension has permission to access the page

### Analysis takes too long

**Problem**: Analysis seems to hang

**Solution**:
1. Try with shorter text first
2. Check browser console for errors (F12)
3. Restart the Flask backend

### Grammar checker not working

**Problem**: No grammar issues detected

**Solution**:
- The extension uses a fallback grammar checker
- Some issues may not be detected by the basic checker
- For best results, ensure good internet connection on first run

## 💡 Tips

1. **Best Results**: Use complete sentences with proper punctuation
2. **Text Length**: Works best with 100-5000 words
3. **Privacy**: Remember, all analysis happens locally - your data never leaves your computer
4. **Keyboard Shortcuts**: Use Ctrl+C to copy, Ctrl+V to paste in the text area
5. **Multiple Analyses**: You can analyze text multiple times with different edits

## 🔒 Privacy Features

- ✅ All processing happens locally
- ✅ No data sent to external servers
- ✅ No tracking or analytics
- ✅ No data storage
- ✅ You can disconnect from the internet after loading

## 📝 Keyboard Shortcuts

The extension doesn't currently have global keyboard shortcuts, but you can:
- Use standard text editing shortcuts in the text area
- Tab between buttons
- Enter to submit (when focused on Analyze button)

## 🆘 Getting Help

If you need help:
1. Check this guide first
2. Check the main README.md
3. Look at CONTRIBUTING.md for development info
4. Open an issue on GitHub with your question

## 🎨 Customization

Currently, the extension uses a fixed color scheme and layout. To customize:
1. Edit `chrome-extension/popup.css` for styling
2. Reload the extension in Chrome after changes

## 📱 Compatibility

- **Chrome**: Version 88 or higher (Manifest V3)
- **Edge**: Chromium-based Edge (Version 88+)
- **Brave**: Should work (not officially tested)
- **Other Browsers**: Not supported (Chrome extensions only)

## 🔄 Updating the Extension

1. Pull latest changes from the repository
2. Reload the extension in `chrome://extensions/`
3. Restart the Flask backend if needed
