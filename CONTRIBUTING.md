# Contributing to Privacy-first AI Writing Assistant

Thank you for your interest in contributing to the Privacy-first AI Writing Assistant! This document provides guidelines for contributing to the project.

## 🌟 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the problem
- Expected vs actual behavior
- Your environment (OS, Python version, Chrome version)
- Any relevant logs or screenshots

### Suggesting Enhancements

We welcome suggestions for new features! Please open an issue with:
- A clear description of the feature
- Use cases and benefits
- Any implementation ideas (optional)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** with clear, focused commits
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

## 💻 Development Setup

1. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension.git
cd Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

## 🧪 Testing

Before submitting a PR:

1. Start the Flask server:
```bash
python app.py
```

2. Run the test suite:
```bash
python test_api.py
```

3. Test the Chrome extension manually:
   - Load the extension in Chrome
   - Test all features (grammar check, rewrite, summarize, etc.)
   - Test context menu functionality
   - Verify privacy features work correctly

## 📝 Code Style

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and concise
- Maintain privacy-first principles

## 🔒 Privacy Guidelines

When contributing, always maintain privacy-first principles:
- ✅ Process data locally whenever possible
- ✅ Avoid external API calls unless necessary
- ✅ Never log or store user data
- ✅ Document any data handling clearly
- ❌ Don't add telemetry or analytics
- ❌ Don't send data to external servers

## 📋 Commit Messages

Use clear, descriptive commit messages:
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep the first line under 50 characters
- Add details in the body if needed

Examples:
```
Add support for Spanish language
Fix grammar check regex pattern
Update README with installation steps
```

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

1. **Language Support**: Add support for more languages
2. **Grammar Rules**: Improve grammar checking patterns
3. **UI/UX**: Enhance the extension interface
4. **Performance**: Optimize text processing
5. **Testing**: Add more test cases
6. **Documentation**: Improve guides and examples
7. **Accessibility**: Make the extension more accessible

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches

## ❓ Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Comment on existing issues
- Check the README for documentation

Thank you for contributing to privacy-first software! 🔒✨
