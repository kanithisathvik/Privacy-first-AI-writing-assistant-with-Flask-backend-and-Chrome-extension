#!/bin/bash
# Start the Privacy-first AI Writing Assistant Flask backend

echo "Starting Privacy-first AI Writing Assistant..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt --quiet

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

# Start Flask server
echo ""
echo "Starting Flask server..."
python app.py
