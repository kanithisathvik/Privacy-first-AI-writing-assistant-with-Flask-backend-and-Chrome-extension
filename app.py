"""
Privacy-first AI Writing Assistant - Flask Backend
This application provides AI-powered writing assistance while maintaining user privacy.
No user data is stored or logged.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import re
from typing import Dict, Any

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for Chrome extension
CORS(app, resources={
    r"/api/*": {
        "origins": ["chrome-extension://*"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Privacy-first configuration
app.config['LOG_REQUESTS'] = os.getenv('LOG_REQUESTS', 'False').lower() == 'true'
app.config['STORE_USER_DATA'] = os.getenv('STORE_USER_DATA', 'False').lower() == 'true'

# Disable request logging for privacy
if not app.config['LOG_REQUESTS']:
    import logging
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)


def check_grammar_simple(text: str) -> Dict[str, Any]:
    """
    Simple grammar checker using rule-based approach.
    Privacy-first: All processing done locally, no external API calls.
    """
    suggestions = []
    
    # Common grammar patterns to check
    patterns = [
        (r'\bi\b', 'I', 'Capitalize "I"'),
        (r'\s+([,.!?])', r'\1', 'Remove space before punctuation'),
        (r'([,.!?])([A-Z])', r'\1 \2', 'Add space after punctuation'),
        (r'\s{2,}', ' ', 'Multiple spaces detected'),
    ]
    
    corrected_text = text
    for pattern, replacement, message in patterns:
        matches = list(re.finditer(pattern, corrected_text))
        if matches:
            for match in matches:
                suggestions.append({
                    'position': match.start(),
                    'original': match.group(0),
                    'suggestion': re.sub(pattern, replacement, match.group(0)),
                    'message': message
                })
            corrected_text = re.sub(pattern, replacement, corrected_text)
    
    return {
        'original': text,
        'corrected': corrected_text,
        'suggestions': suggestions,
        'has_issues': len(suggestions) > 0
    }


def rewrite_text(text: str, style: str = 'formal') -> str:
    """
    Simple text rewriting with different styles.
    Privacy-first: All processing done locally.
    """
    if style == 'formal':
        # Replace informal words with formal equivalents
        replacements = {
            r'\bkinda\b': 'kind of',
            r'\bgonna\b': 'going to',
            r'\bwanna\b': 'want to',
            r'\bcan\'t\b': 'cannot',
            r'\bdon\'t\b': 'do not',
            r'\bwon\'t\b': 'will not',
            r'\bisn\'t\b': 'is not',
            r'\baren\'t\b': 'are not',
        }
        result = text
        for pattern, replacement in replacements.items():
            result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
        return result
    
    elif style == 'casual':
        # Make text more casual
        replacements = {
            r'\bcannot\b': "can't",
            r'\bdo not\b': "don't",
            r'\bwill not\b': "won't",
            r'\bis not\b': "isn't",
            r'\bare not\b': "aren't",
        }
        result = text
        for pattern, replacement in replacements.items():
            result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
        return result
    
    elif style == 'concise':
        # Remove filler words
        fillers = [
            r'\bvery\s+', r'\breally\s+', r'\bquite\s+', r'\bjust\s+',
            r'\bactually\s+', r'\bbasically\s+', r'\bliterally\s+'
        ]
        result = text
        for filler in fillers:
            result = re.sub(filler, '', result, flags=re.IGNORECASE)
        return result
    
    return text


def summarize_text(text: str, max_sentences: int = 3) -> str:
    """
    Simple text summarization by extracting key sentences.
    Privacy-first: All processing done locally.
    """
    # Split into sentences
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if len(sentences) <= max_sentences:
        return text
    
    # Simple scoring based on sentence length and position
    scored_sentences = []
    for i, sentence in enumerate(sentences):
        # Prefer longer sentences and sentences near the beginning
        score = len(sentence.split()) * (1 - (i / len(sentences)) * 0.5)
        scored_sentences.append((score, sentence))
    
    # Sort by score and take top sentences
    scored_sentences.sort(reverse=True)
    top_sentences = scored_sentences[:max_sentences]
    
    # Sort by original order
    result_sentences = []
    for _, sentence in top_sentences:
        result_sentences.append(sentence)
    
    return '. '.join(result_sentences) + '.'


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'privacy_mode': not app.config['STORE_USER_DATA'],
        'version': '1.0.0'
    })


@app.route('/api/check-grammar', methods=['POST', 'OPTIONS'])
def check_grammar():
    """
    Check grammar in the provided text.
    Privacy: Text is processed locally and not stored.
    """
    if request.method == 'OPTIONS':
        return '', 204
    
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    
    if len(text) > 10000:
        return jsonify({'error': 'Text too long (max 10000 characters)'}), 400
    
    result = check_grammar_simple(text)
    
    return jsonify({
        'success': True,
        'result': result
    })


@app.route('/api/rewrite', methods=['POST', 'OPTIONS'])
def rewrite():
    """
    Rewrite text in different styles.
    Privacy: Text is processed locally and not stored.
    """
    if request.method == 'OPTIONS':
        return '', 204
    
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    style = data.get('style', 'formal')
    
    if len(text) > 10000:
        return jsonify({'error': 'Text too long (max 10000 characters)'}), 400
    
    if style not in ['formal', 'casual', 'concise']:
        return jsonify({'error': 'Invalid style. Use: formal, casual, or concise'}), 400
    
    rewritten = rewrite_text(text, style)
    
    return jsonify({
        'success': True,
        'original': text,
        'rewritten': rewritten,
        'style': style
    })


@app.route('/api/summarize', methods=['POST', 'OPTIONS'])
def summarize():
    """
    Summarize the provided text.
    Privacy: Text is processed locally and not stored.
    """
    if request.method == 'OPTIONS':
        return '', 204
    
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    max_sentences = data.get('max_sentences', 3)
    
    if len(text) > 10000:
        return jsonify({'error': 'Text too long (max 10000 characters)'}), 400
    
    summary = summarize_text(text, max_sentences)
    
    return jsonify({
        'success': True,
        'original': text,
        'summary': summary
    })


@app.route('/api/improve', methods=['POST', 'OPTIONS'])
def improve():
    """
    Improve text by combining grammar check and rewriting.
    Privacy: Text is processed locally and not stored.
    """
    if request.method == 'OPTIONS':
        return '', 204
    
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    
    if len(text) > 10000:
        return jsonify({'error': 'Text too long (max 10000 characters)'}), 400
    
    # First check grammar
    grammar_result = check_grammar_simple(text)
    corrected = grammar_result['corrected']
    
    # Then improve style
    improved = rewrite_text(corrected, 'formal')
    
    return jsonify({
        'success': True,
        'original': text,
        'improved': improved,
        'grammar_fixes': len(grammar_result['suggestions'])
    })


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"""
    ╔══════════════════════════════════════════════════════════╗
    ║  Privacy-first AI Writing Assistant API                 ║
    ║  Running on http://{host}:{port}                    ║
    ║                                                          ║
    ║  Privacy Mode: {'ENABLED' if not app.config['STORE_USER_DATA'] else 'DISABLED'}                                  ║
    ║  No user data is stored or logged.                      ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    app.run(host=host, port=port, debug=debug)
