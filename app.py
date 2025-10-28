"""
Privacy-First AI Writing Assistant - Flask Backend

This backend provides privacy-focused writing assistance features:
- Grammar and spelling checking (using LanguageTool - runs locally)
- Readability analysis
- Writing suggestions
- Tone analysis

All processing is done locally without sending data to external servers.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import language_tool_python
import textstat
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
import re
import os

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

app = Flask(__name__)
CORS(app)  # Enable CORS for Chrome extension

# Initialize LanguageTool (local grammar checker)
# Initialize as None and lazy-load when needed
tool = None

def get_language_tool():
    """Lazy initialization of LanguageTool"""
    global tool
    if tool is None:
        try:
            tool = language_tool_python.LanguageTool('en-US')
        except Exception as e:
            print(f"Warning: LanguageTool initialization failed: {e}")
            print("Grammar checking will use fallback method")
    return tool

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Privacy-first AI Writing Assistant API',
        'version': '1.0.0',
        'privacy': 'All processing is done locally. No data is logged or sent to external servers.'
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    """
    Main endpoint for text analysis
    Accepts text and returns comprehensive analysis
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        
        if not text.strip():
            return jsonify({'error': 'Empty text provided'}), 400
        
        # Perform various analyses
        grammar_issues = check_grammar(text)
        readability = analyze_readability(text)
        statistics = calculate_statistics(text)
        suggestions = generate_suggestions(text)
        tone = analyze_tone(text)
        
        response = {
            'grammar': grammar_issues,
            'readability': readability,
            'statistics': statistics,
            'suggestions': suggestions,
            'tone': tone,
            'privacy_notice': 'This analysis was performed locally. Your data was not sent to any external server.'
        }
        
        return jsonify(response)
    
    except Exception as e:
        app.logger.error(f"Error in analyze endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred during text analysis. Please try again.'}), 500

@app.route('/api/grammar', methods=['POST'])
def check_grammar_endpoint():
    """Endpoint specifically for grammar checking"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        grammar_issues = check_grammar(text)
        
        return jsonify({
            'issues': grammar_issues,
            'count': len(grammar_issues)
        })
    
    except Exception as e:
        app.logger.error(f"Error in grammar endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred during grammar checking. Please try again.'}), 500

@app.route('/api/readability', methods=['POST'])
def readability_endpoint():
    """Endpoint for readability analysis"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        readability = analyze_readability(text)
        
        return jsonify(readability)
    
    except Exception as e:
        app.logger.error(f"Error in readability endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred during readability analysis. Please try again.'}), 500

def check_grammar(text):
    """Check grammar and spelling using LanguageTool or fallback"""
    tool_instance = get_language_tool()
    
    if tool_instance is not None:
        try:
            matches = tool_instance.check(text)
            issues = []
            
            for match in matches:
                issue = {
                    'message': match.message,
                    'context': match.context,
                    'offset': match.offset,
                    'length': match.errorLength,
                    'replacements': match.replacements[:3] if match.replacements else [],
                    'rule': match.ruleId,
                    'category': match.category
                }
                issues.append(issue)
            
            return issues
        except Exception as e:
            print(f"Grammar check error: {e}")
            return check_grammar_fallback(text)
    else:
        return check_grammar_fallback(text)

def check_grammar_fallback(text):
    """Simple fallback grammar checker using basic rules"""
    issues = []
    sentences = sent_tokenize(text)
    
    for sentence in sentences:
        # Check for double spaces
        if '  ' in sentence:
            issues.append({
                'message': 'Multiple consecutive spaces found',
                'context': sentence[:50],
                'offset': sentence.find('  '),
                'length': 2,
                'replacements': [' '],
                'rule': 'DOUBLE_SPACE',
                'category': 'Formatting'
            })
        
        # Check for sentences starting with lowercase
        if sentence and sentence[0].islower():
            issues.append({
                'message': 'Sentence should start with a capital letter',
                'context': sentence[:50],
                'offset': 0,
                'length': 1,
                'replacements': [sentence[0].upper()],
                'rule': 'UPPERCASE_SENTENCE_START',
                'category': 'Capitalization'
            })
        
        # Check for missing punctuation at end
        if sentence and sentence[-1] not in '.!?':
            issues.append({
                'message': 'Sentence should end with proper punctuation',
                'context': sentence[-50:],
                'offset': len(sentence),
                'length': 0,
                'replacements': ['.', '!', '?'],
                'rule': 'MISSING_PUNCTUATION',
                'category': 'Punctuation'
            })
    
    return issues

def analyze_readability(text):
    """Analyze text readability using various metrics"""
    try:
        flesch_reading_ease = textstat.flesch_reading_ease(text)
        flesch_kincaid_grade = textstat.flesch_kincaid_grade(text)
        smog_index = textstat.smog_index(text)
        coleman_liau_index = textstat.coleman_liau_index(text)
        automated_readability_index = textstat.automated_readability_index(text)
        
        # Interpret Flesch Reading Ease score
        if flesch_reading_ease >= 90:
            difficulty = "Very Easy"
        elif flesch_reading_ease >= 80:
            difficulty = "Easy"
        elif flesch_reading_ease >= 70:
            difficulty = "Fairly Easy"
        elif flesch_reading_ease >= 60:
            difficulty = "Standard"
        elif flesch_reading_ease >= 50:
            difficulty = "Fairly Difficult"
        elif flesch_reading_ease >= 30:
            difficulty = "Difficult"
        else:
            difficulty = "Very Difficult"
        
        return {
            'flesch_reading_ease': round(flesch_reading_ease, 2),
            'flesch_kincaid_grade': round(flesch_kincaid_grade, 2),
            'smog_index': round(smog_index, 2),
            'coleman_liau_index': round(coleman_liau_index, 2),
            'automated_readability_index': round(automated_readability_index, 2),
            'difficulty': difficulty
        }
    except Exception as e:
        app.logger.error(f"Error in readability analysis: {str(e)}")
        return {
            'error': 'Could not analyze readability',
            'message': 'Text may be too short or contain invalid characters'
        }

def calculate_statistics(text):
    """Calculate basic text statistics"""
    sentences = sent_tokenize(text)
    words = word_tokenize(text)
    
    # Filter out punctuation
    words_only = [word for word in words if word.isalnum()]
    
    # Calculate average word length
    avg_word_length = sum(len(word) for word in words_only) / len(words_only) if words_only else 0
    
    # Calculate average sentence length
    avg_sentence_length = len(words_only) / len(sentences) if sentences else 0
    
    # Count characters (excluding spaces)
    char_count = sum(len(word) for word in words_only)
    
    return {
        'word_count': len(words_only),
        'sentence_count': len(sentences),
        'character_count': char_count,
        'paragraph_count': len(text.split('\n\n')),
        'avg_word_length': round(avg_word_length, 2),
        'avg_sentence_length': round(avg_sentence_length, 2)
    }

def generate_suggestions(text):
    """Generate writing suggestions"""
    suggestions = []
    
    # Check for passive voice indicators
    passive_indicators = [
        'was', 'were', 'been', 'being', 'is', 'are', 'am',
        'has been', 'have been', 'had been', 'will be'
    ]
    
    sentences = sent_tokenize(text)
    
    for sentence in sentences:
        words = word_tokenize(sentence.lower())
        
        # Check for passive voice
        for indicator in passive_indicators:
            if indicator in sentence.lower() and any(word.endswith('ed') for word in words):
                suggestions.append({
                    'type': 'passive_voice',
                    'message': 'Consider using active voice for more direct writing',
                    'sentence': sentence
                })
                break
        
        # Check sentence length
        if len(word_tokenize(sentence)) > 25:
            suggestions.append({
                'type': 'long_sentence',
                'message': 'This sentence is quite long. Consider breaking it into shorter sentences.',
                'sentence': sentence
            })
        
        # Check for repeated words
        words_in_sentence = [w.lower() for w in word_tokenize(sentence) if w.isalnum()]
        if len(words_in_sentence) != len(set(words_in_sentence)):
            suggestions.append({
                'type': 'repeated_words',
                'message': 'This sentence contains repeated words',
                'sentence': sentence
            })
    
    return suggestions[:10]  # Limit to 10 suggestions

def analyze_tone(text):
    """Analyze the tone of the text"""
    text_lower = text.lower()
    
    # Simple keyword-based tone analysis
    formal_keywords = ['therefore', 'furthermore', 'moreover', 'consequently', 'thus', 'hence']
    informal_keywords = ['gonna', 'wanna', 'yeah', 'cool', 'awesome', 'stuff']
    positive_keywords = ['good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic']
    negative_keywords = ['bad', 'terrible', 'awful', 'poor', 'horrible', 'worst']
    
    formal_count = sum(1 for keyword in formal_keywords if keyword in text_lower)
    informal_count = sum(1 for keyword in informal_keywords if keyword in text_lower)
    positive_count = sum(1 for keyword in positive_keywords if keyword in text_lower)
    negative_count = sum(1 for keyword in negative_keywords if keyword in text_lower)
    
    # Determine formality
    if formal_count > informal_count:
        formality = 'formal'
    elif informal_count > formal_count:
        formality = 'informal'
    else:
        formality = 'neutral'
    
    # Determine sentiment
    if positive_count > negative_count:
        sentiment = 'positive'
    elif negative_count > positive_count:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    return {
        'formality': formality,
        'sentiment': sentiment,
        'formal_keyword_count': formal_count,
        'informal_keyword_count': informal_count,
        'positive_keyword_count': positive_count,
        'negative_keyword_count': negative_count
    }

if __name__ == '__main__':
    print("Starting Privacy-First AI Writing Assistant Backend...")
    print("All processing is done locally. No data is logged or sent to external servers.")
    print("")
    print("⚠️  WARNING: Debug mode is enabled for development purposes.")
    print("⚠️  For production use, set debug=False and use a production WSGI server.")
    print("")
    app.run(debug=True, host='127.0.0.1', port=5000)
