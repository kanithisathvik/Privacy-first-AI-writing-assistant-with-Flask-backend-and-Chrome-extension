#!/usr/bin/env python3
"""
Installation verification script for Privacy-first AI Writing Assistant
"""

import sys
import subprocess
import os
from pathlib import Path

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def check_python_version():
    """Check if Python version is 3.8 or higher"""
    print("\n[1/6] Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} (OK)")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor}.{version.micro} (Need 3.8+)")
        return False

def check_pip():
    """Check if pip is available"""
    print("\n[2/6] Checking pip...")
    try:
        result = subprocess.run(['pip', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✓ pip is installed: {result.stdout.strip()}")
            return True
        else:
            print("✗ pip is not available")
            return False
    except FileNotFoundError:
        print("✗ pip is not installed")
        return False

def check_requirements():
    """Check if all required packages are installed"""
    print("\n[3/6] Checking required packages...")
    packages = [
        ('Flask', 'flask'),
        ('Flask-CORS', 'flask_cors'),
        ('python-dotenv', 'dotenv'),
        ('requests', 'requests')
    ]
    missing = []
    
    for display_name, import_name in packages:
        try:
            __import__(import_name)
            print(f"  ✓ {display_name}")
        except ImportError:
            print(f"  ✗ {display_name} (missing)")
            missing.append(display_name)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("   Run: pip install -r requirements.txt")
        return False
    return True

def check_files():
    """Check if all required files exist"""
    print("\n[4/6] Checking project files...")
    required_files = [
        'app.py',
        'requirements.txt',
        '.env.example',
        'extension/manifest.json',
        'extension/background.js',
        'extension/popup/popup.html',
        'extension/content/content.js'
    ]
    
    missing = []
    for file in required_files:
        if os.path.exists(file):
            print(f"  ✓ {file}")
        else:
            print(f"  ✗ {file} (missing)")
            missing.append(file)
    
    if missing:
        print(f"\n⚠️  Missing files: {', '.join(missing)}")
        return False
    return True

def check_env_file():
    """Check if .env file exists"""
    print("\n[5/6] Checking environment configuration...")
    if os.path.exists('.env'):
        print("✓ .env file exists")
        return True
    else:
        print("⚠️  .env file not found")
        print("   Run: cp .env.example .env")
        # Auto-create .env file
        if os.path.exists('.env.example'):
            import shutil
            shutil.copy('.env.example', '.env')
            print("✓ Created .env file from .env.example")
            return True
        return False

def check_extension():
    """Check if extension files are complete"""
    print("\n[6/6] Checking Chrome extension...")
    extension_files = [
        'extension/manifest.json',
        'extension/background.js',
        'extension/popup/popup.html',
        'extension/popup/popup.css',
        'extension/popup/popup.js',
        'extension/content/content.js',
        'extension/content/content.css',
        'extension/icons/icon16.png',
        'extension/icons/icon48.png',
        'extension/icons/icon128.png'
    ]
    
    all_exist = True
    for file in extension_files:
        if not os.path.exists(file):
            print(f"  ✗ {file} (missing)")
            all_exist = False
    
    if all_exist:
        print("✓ All extension files present")
        return True
    else:
        print("⚠️  Some extension files are missing")
        return False

def main():
    print_header("Privacy-first AI Writing Assistant")
    print("Installation Verification")
    
    results = []
    results.append(("Python Version", check_python_version()))
    results.append(("pip", check_pip()))
    results.append(("Dependencies", check_requirements()))
    results.append(("Project Files", check_files()))
    results.append(("Environment", check_env_file()))
    results.append(("Extension", check_extension()))
    
    print_header("Verification Summary")
    
    passed = 0
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{name:20} {status}")
        if result:
            passed += 1
    
    print("\n" + "=" * 60)
    print(f"Result: {passed}/{len(results)} checks passed")
    print("=" * 60)
    
    if passed == len(results):
        print("\n🎉 Installation verified successfully!")
        print("\nNext steps:")
        print("1. Start the Flask backend:")
        print("   python app.py")
        print("\n2. Install the Chrome extension:")
        print("   - Open chrome://extensions/")
        print("   - Enable Developer mode")
        print("   - Click 'Load unpacked'")
        print("   - Select the 'extension' folder")
        print("\n3. Test with demo.html or any webpage!")
        return 0
    else:
        print("\n⚠️  Installation incomplete!")
        print("\nPlease fix the issues above and run this script again.")
        print("\nQuick fixes:")
        print("- Install dependencies: pip install -r requirements.txt")
        print("- Create .env: cp .env.example .env")
        return 1

if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nVerification interrupted by user.")
        sys.exit(1)
