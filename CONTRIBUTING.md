# Contributing to Privacy-First AI Writing Assistant

Thank you for considering contributing to this project! We welcome contributions from everyone.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:
- A clear description of the bug
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (OS, Python version, Chrome version)

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- A clear description of the feature
- The problem it solves
- Any potential implementation ideas

### Code Contributions

1. **Fork the repository**
   ```bash
   git fork https://github.com/kanithisathvik/Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

4. **Run tests**
   ```bash
   python3 -m pytest test_app.py -v
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add feature: description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Ensure all tests pass

## 🎯 Development Guidelines

### Python Code Style

- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Keep functions focused and single-purpose

### JavaScript Code Style

- Use ES6+ syntax
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing patterns in the codebase

### Testing

- Write tests for all new functionality
- Ensure all tests pass before submitting PR
- Aim for high test coverage
- Test both success and error cases

### Privacy Considerations

This project is built on privacy principles. When contributing:

- ✅ DO: Process data locally
- ✅ DO: Document data handling clearly
- ✅ DO: Minimize data collection
- ❌ DON'T: Add external API calls without discussion
- ❌ DON'T: Add tracking or analytics
- ❌ DON'T: Log user data

## 🔧 Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kanithisathvik/Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension.git
   cd Privacy-first-AI-writing-assistant-with-Flask-backend-and-Chrome-extension
   ```

2. **Install dependencies**
   ```bash
   pip3 install -r requirements.txt
   ```

3. **Run the backend**
   ```bash
   python3 app.py
   ```

4. **Load the extension in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

## 🧪 Running Tests

```bash
# Run all tests
python3 -m pytest test_app.py -v

# Run specific test
python3 -m pytest test_app.py::test_name -v

# Run with coverage
pip3 install pytest-cov
python3 -m pytest test_app.py --cov=app --cov-report=html
```

## 📝 Documentation

When adding new features:
- Update the README.md if needed
- Add docstrings to new functions
- Update API documentation for new endpoints
- Add examples if helpful

## 🐛 Debugging

### Backend Debugging

```python
# Add debug prints
print(f"Debug: variable value = {value}")

# Use Flask debug mode (already enabled in app.py)
app.run(debug=True)
```

### Extension Debugging

1. Open Chrome DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Use `console.log()` for debugging

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect differing viewpoints

## ❓ Questions?

If you have questions about contributing, please:
- Open a discussion on GitHub
- Check existing issues and discussions
- Read the README.md and documentation

## 🙏 Thank You!

Your contributions help make this project better for everyone. Thank you for taking the time to contribute!
