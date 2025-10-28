"""
Test suite for Privacy-First AI Writing Assistant Flask Backend
"""

import json
import pytest
from app import app

@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test the health check endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    assert 'version' in data
    assert 'privacy' in data

def test_analyze_endpoint_success(client):
    """Test the analyze endpoint with valid text"""
    test_text = "This is a test sentence. It should be analyzed properly."
    
    response = client.post(
        '/api/analyze',
        data=json.dumps({'text': test_text}),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    
    # Check that all expected keys are present
    assert 'grammar' in data
    assert 'readability' in data
    assert 'statistics' in data
    assert 'suggestions' in data
    assert 'tone' in data
    assert 'privacy_notice' in data
    
    # Verify statistics
    assert data['statistics']['word_count'] > 0
    assert data['statistics']['sentence_count'] > 0

def test_analyze_endpoint_no_text(client):
    """Test the analyze endpoint with no text"""
    response = client.post(
        '/api/analyze',
        data=json.dumps({}),
        content_type='application/json'
    )
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_analyze_endpoint_empty_text(client):
    """Test the analyze endpoint with empty text"""
    response = client.post(
        '/api/analyze',
        data=json.dumps({'text': '   '}),
        content_type='application/json'
    )
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_grammar_endpoint(client):
    """Test the grammar checking endpoint"""
    test_text = "this is a test. it should find some issues"
    
    response = client.post(
        '/api/grammar',
        data=json.dumps({'text': test_text}),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    
    assert 'issues' in data
    assert 'count' in data
    assert isinstance(data['issues'], list)

def test_readability_endpoint(client):
    """Test the readability analysis endpoint"""
    test_text = "This is a simple sentence. It is easy to read. Everyone can understand it."
    
    response = client.post(
        '/api/readability',
        data=json.dumps({'text': test_text}),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    
    # Check for readability metrics
    if 'error' not in data:
        assert 'flesch_reading_ease' in data
        assert 'difficulty' in data

def test_statistics_calculation():
    """Test the statistics calculation function"""
    from app import calculate_statistics
    
    test_text = "This is a test. It has two sentences."
    stats = calculate_statistics(test_text)
    
    assert stats['word_count'] == 8
    assert stats['sentence_count'] == 2
    assert stats['character_count'] > 0
    assert stats['paragraph_count'] == 1

def test_tone_analysis():
    """Test the tone analysis function"""
    from app import analyze_tone
    
    # Test formal text
    formal_text = "Therefore, we must consequently proceed with the aforementioned plan."
    tone = analyze_tone(formal_text)
    assert tone['formality'] in ['formal', 'neutral']
    
    # Test informal text
    informal_text = "Yeah, that's cool! Wanna go get some stuff?"
    tone = analyze_tone(informal_text)
    assert tone['formality'] in ['informal', 'neutral']

def test_suggestions_generation():
    """Test the suggestions generation function"""
    from app import generate_suggestions
    
    # Test with passive voice
    text = "The ball was thrown by John. The game was played yesterday."
    suggestions = generate_suggestions(text)
    
    assert isinstance(suggestions, list)
    # Should detect passive voice
    passive_found = any(s['type'] == 'passive_voice' for s in suggestions)
    assert passive_found

def test_cors_headers(client):
    """Test that CORS headers are present"""
    response = client.get('/')
    assert 'Access-Control-Allow-Origin' in response.headers

def test_privacy_notice_in_response(client):
    """Test that privacy notice is included in analysis responses"""
    response = client.post(
        '/api/analyze',
        data=json.dumps({'text': 'Test text for privacy check.'}),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'privacy_notice' in data
    assert 'locally' in data['privacy_notice'].lower()

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
