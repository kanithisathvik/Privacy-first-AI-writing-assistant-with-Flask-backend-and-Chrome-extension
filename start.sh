#!/bin/bash
# Quick start script for Privacy-First AI Writing Assistant

echo "🔒 Privacy-First AI Writing Assistant - Quick Start"
echo "===================================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ Error: pip3 is not installed"
    echo "Please install pip3"
    exit 1
fi

echo "✓ pip3 found"
echo ""

# Install dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "✓ Dependencies installed successfully"
echo ""

# Run tests
echo "🧪 Running tests..."
python3 -m pytest test_app.py -v

if [ $? -ne 0 ]; then
    echo "❌ Error: Tests failed"
    exit 1
fi

echo ""
echo "✓ All tests passed!"
echo ""

# Start the Flask backend
echo "🚀 Starting Flask backend..."
echo ""
echo "The backend will be available at: http://127.0.0.1:5000"
echo ""
echo "To load the Chrome extension:"
echo "  1. Open Chrome and navigate to: chrome://extensions/"
echo "  2. Enable 'Developer mode'"
echo "  3. Click 'Load unpacked'"
echo "  4. Select the 'chrome-extension' folder from this directory"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py
