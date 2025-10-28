#!/usr/bin/env python3
"""
Test script for Privacy-first AI Writing Assistant
Run this after starting the Flask server to verify everything is working.
"""

import requests
import json
import sys

API_BASE_URL = 'http://127.0.0.1:5000/api'

def test_health():
    """Test health endpoint"""
    print("Testing /api/health endpoint...")
    try:
        response = requests.get(f'{API_BASE_URL}/health')
        data = response.json()
        if data['status'] == 'healthy':
            print("✓ Health check passed")
            print(f"  Privacy mode: {data['privacy_mode']}")
            print(f"  Version: {data['version']}")
            return True
        else:
            print("✗ Health check failed")
            return False
    except Exception as e:
        print(f"✗ Error connecting to server: {e}")
        return False

def test_grammar_check():
    """Test grammar check endpoint"""
    print("\nTesting /api/check-grammar endpoint...")
    try:
        response = requests.post(
            f'{API_BASE_URL}/check-grammar',
            json={'text': 'this is a test with i making errors'}
        )
        data = response.json()
        if data['success'] and data['result']['has_issues']:
            print("✓ Grammar check passed")
            print(f"  Found {len(data['result']['suggestions'])} issue(s)")
            return True
        else:
            print("✗ Grammar check failed")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_rewrite():
    """Test rewrite endpoint"""
    print("\nTesting /api/rewrite endpoint...")
    try:
        response = requests.post(
            f'{API_BASE_URL}/rewrite',
            json={'text': 'gonna do something kinda cool', 'style': 'formal'}
        )
        data = response.json()
        if data['success']:
            print("✓ Rewrite passed")
            print(f"  Original: {data['original']}")
            print(f"  Rewritten: {data['rewritten']}")
            return True
        else:
            print("✗ Rewrite failed")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_summarize():
    """Test summarize endpoint"""
    print("\nTesting /api/summarize endpoint...")
    try:
        text = "This is sentence one. This is sentence two with details. " + \
               "This is sentence three. This is sentence four. This is sentence five."
        response = requests.post(
            f'{API_BASE_URL}/summarize',
            json={'text': text, 'max_sentences': 2}
        )
        data = response.json()
        if data['success']:
            print("✓ Summarize passed")
            print(f"  Summary: {data['summary'][:50]}...")
            return True
        else:
            print("✗ Summarize failed")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_improve():
    """Test improve endpoint"""
    print("\nTesting /api/improve endpoint...")
    try:
        response = requests.post(
            f'{API_BASE_URL}/improve',
            json={'text': 'i gonna write this here  .'}
        )
        data = response.json()
        if data['success']:
            print("✓ Improve passed")
            print(f"  Grammar fixes: {data['grammar_fixes']}")
            print(f"  Improved: {data['improved']}")
            return True
        else:
            print("✗ Improve failed")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("Privacy-first AI Writing Assistant - Test Suite")
    print("=" * 60)
    
    results = []
    
    results.append(("Health Check", test_health()))
    results.append(("Grammar Check", test_grammar_check()))
    results.append(("Rewrite", test_rewrite()))
    results.append(("Summarize", test_summarize()))
    results.append(("Improve", test_improve()))
    
    print("\n" + "=" * 60)
    print("Test Results:")
    print("=" * 60)
    
    passed = 0
    for name, result in results:
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{name:20} {status}")
        if result:
            passed += 1
    
    print("=" * 60)
    print(f"Total: {passed}/{len(results)} tests passed")
    print("=" * 60)
    
    if passed == len(results):
        print("\n🎉 All tests passed! The server is working correctly.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the Flask server logs.")
        return 1

if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user.")
        sys.exit(1)
