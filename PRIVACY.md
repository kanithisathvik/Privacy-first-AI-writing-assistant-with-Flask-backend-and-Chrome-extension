# Privacy Policy

## Privacy-First AI Writing Assistant

**Last Updated**: October 28, 2025

### Our Privacy Commitment

This application is built with privacy as its core principle. We are committed to protecting your privacy and ensuring your data remains completely under your control.

### Data Collection

**We collect ZERO data**. Specifically:

- ❌ We do NOT collect any text you analyze
- ❌ We do NOT log your usage patterns
- ❌ We do NOT track you across websites
- ❌ We do NOT send any data to external servers
- ❌ We do NOT use cookies for tracking
- ❌ We do NOT perform analytics on your usage

### How It Works

1. **Local Processing**: All text analysis is performed locally on your computer using the Flask backend running on your machine.

2. **No External Communication**: The Chrome extension only communicates with your local Flask server (127.0.0.1:5000). No external API calls are made.

3. **No Storage**: Your text is not stored anywhere. Analysis happens in memory and is discarded immediately after results are returned.

4. **Open Source**: The entire codebase is open source and available for inspection on GitHub.

### What Data Stays Local

Everything stays on your machine:
- The text you analyze
- Grammar check results
- Readability scores
- Writing suggestions
- All temporary processing data

### Chrome Extension Permissions

The extension requests the following permissions:

- **activeTab**: To read selected text when you explicitly request analysis
- **storage**: To temporarily save your last entered text in the popup (stored locally in your browser)
- **contextMenus**: To add a "Analyze with Writing Assistant" option to the right-click menu
- **host_permissions (localhost)**: To communicate with your local Flask server only

### Third-Party Services

We use the following open-source libraries that run locally:
- LanguageTool (grammar checking) - runs on your machine
- NLTK (natural language processing) - runs on your machine
- Textstat (readability metrics) - runs on your machine

None of these libraries send data externally when used in our application.

### Changes to This Policy

If we ever make changes to this privacy policy, we will update the "Last Updated" date and clearly communicate the changes through our GitHub repository.

### Your Rights

Since we don't collect any data, there is:
- No data to request
- No data to delete
- No data to export
- No data to modify

Your data always stays with you.

### Contact

If you have questions about this privacy policy, please open an issue on our GitHub repository.

---

**In Summary**: Your data is YOUR data. It never leaves your computer. Period.
