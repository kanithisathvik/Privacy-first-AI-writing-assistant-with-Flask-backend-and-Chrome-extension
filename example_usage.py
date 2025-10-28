#!/usr/bin/env python3
"""
Example script demonstrating how to use the Privacy-First AI Writing Assistant API
"""

import requests
import json

# Backend URL
API_URL = 'http://127.0.0.1:5000'

def check_backend_status():
    """Check if the backend is running"""
    try:
        response = requests.get(f'{API_URL}/')
        if response.status_code == 200:
            print("✓ Backend is running")
            data = response.json()
            print(f"  Version: {data['version']}")
            print(f"  Privacy: {data['privacy']}")
            return True
        else:
            print("❌ Backend returned error")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running")
        print("   Please start it with: python3 app.py")
        return False

def analyze_text(text):
    """Analyze text using the API"""
    try:
        response = requests.post(
            f'{API_URL}/api/analyze',
            json={'text': text},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def print_analysis_results(results):
    """Pretty print analysis results"""
    if not results:
        return
    
    print("\n" + "="*60)
    print("ANALYSIS RESULTS")
    print("="*60)
    
    # Statistics
    if 'statistics' in results:
        stats = results['statistics']
        print(f"\n📊 STATISTICS:")
        print(f"   Words: {stats['word_count']}")
        print(f"   Sentences: {stats['sentence_count']}")
        print(f"   Characters: {stats['character_count']}")
        print(f"   Avg Word Length: {stats['avg_word_length']}")
        print(f"   Avg Sentence Length: {stats['avg_sentence_length']}")
    
    # Readability
    if 'readability' in results:
        read = results['readability']
        if 'error' not in read:
            print(f"\n📖 READABILITY:")
            print(f"   Reading Ease: {read['flesch_reading_ease']} ({read['difficulty']})")
            print(f"   Grade Level: {read['flesch_kincaid_grade']}")
    
    # Grammar Issues
    if 'grammar' in results:
        issues = results['grammar']
        print(f"\n✏️ GRAMMAR ISSUES: {len(issues)} found")
        for i, issue in enumerate(issues[:3], 1):
            print(f"   {i}. {issue['message']}")
            if issue['replacements']:
                print(f"      Suggestions: {', '.join(issue['replacements'])}")
        if len(issues) > 3:
            print(f"   ... and {len(issues) - 3} more")
    
    # Tone
    if 'tone' in results:
        tone = results['tone']
        print(f"\n🎭 TONE ANALYSIS:")
        print(f"   Formality: {tone['formality'].title()}")
        print(f"   Sentiment: {tone['sentiment'].title()}")
    
    # Suggestions
    if 'suggestions' in results:
        suggestions = results['suggestions']
        if suggestions:
            print(f"\n💡 SUGGESTIONS: {len(suggestions)} found")
            for i, suggestion in enumerate(suggestions[:3], 1):
                print(f"   {i}. {suggestion['message']}")
            if len(suggestions) > 3:
                print(f"   ... and {len(suggestions) - 3} more")
    
    print("\n" + "="*60)
    print(f"🔒 {results.get('privacy_notice', 'Privacy notice not found')}")
    print("="*60 + "\n")

def main():
    """Main function"""
    print("🔒 Privacy-First AI Writing Assistant - Example Usage")
    print()
    
    # Check backend status
    if not check_backend_status():
        return
    
    print()
    
    # Example texts
    examples = [
        {
            'name': 'Simple Text',
            'text': 'This is a simple test. It demonstrates the writing assistant.'
        },
        {
            'name': 'Text with Issues',
            'text': 'this sentence has problems  it dont have proper capitalization and has double spaces'
        },
        {
            'name': 'Formal Writing',
            'text': 'Therefore, we must consequently proceed with the implementation. Moreover, the results indicate significant improvement in overall performance metrics.'
        }
    ]
    
    # Analyze each example
    for example in examples:
        print(f"\n{'='*60}")
        print(f"Analyzing: {example['name']}")
        print(f"{'='*60}")
        print(f"Text: \"{example['text']}\"")
        
        results = analyze_text(example['text'])
        print_analysis_results(results)
        
        input("Press Enter to continue to next example...")

if __name__ == '__main__':
    main()
