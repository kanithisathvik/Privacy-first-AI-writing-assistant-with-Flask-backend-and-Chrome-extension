"""
ContextGuard Backend - AI Routes
API endpoints for AI operations
"""

from flask import Blueprint, request, jsonify
from backend.ai.processor import ai_processor
import logging
import asyncio

ai_bp = Blueprint('ai', __name__)
logger = logging.getLogger(__name__)


def run_async(coro):
    """Helper to run async functions in sync context"""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)


@ai_bp.route('/summarize', methods=['POST'])
def summarize():
    """Summarize text endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data.get('text', '').strip()
        if len(text) < 10:
            return jsonify({'error': 'Text too short (minimum 10 characters)'}), 400
        
        if len(text) > 50000:
            return jsonify({'error': 'Text too long (maximum 50,000 characters)'}), 400
        
        options = {
            'type': data.get('type', 'key-points'),
            'length': data.get('length', 'medium')
        }
        
        result = run_async(ai_processor.summarize(text, options))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Summarize endpoint error: {e}")
        return jsonify({'error': str(e), 'success': False}), 500


@ai_bp.route('/rewrite', methods=['POST'])
def rewrite():
    """Rewrite text endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data.get('text', '').strip()
        if len(text) < 5:
            return jsonify({'error': 'Text too short'}), 400
        
        options = {
            'tone': data.get('tone', 'neutral'),
            'readingLevel': data.get('readingLevel', 'intermediate')
        }
        
        result = run_async(ai_processor.rewrite(text, options))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Rewrite endpoint error: {e}")
        return jsonify({'error': str(e), 'success': False}), 500


@ai_bp.route('/proofread', methods=['POST'])
def proofread():
    """Proofread text endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data.get('text', '').strip()
        if len(text) < 5:
            return jsonify({'error': 'Text too short'}), 400
        
        result = run_async(ai_processor.proofread(text))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Proofread endpoint error: {e}")
        return jsonify({'error': str(e), 'success': False}), 500


@ai_bp.route('/translate', methods=['POST'])
def translate():
    """Translate text endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data.get('text', '').strip()
        target_lang = data.get('targetLanguage', 'es')
        
        if len(text) < 1:
            return jsonify({'error': 'Text too short'}), 400
        
        result = run_async(ai_processor.translate(text, target_lang))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Translate endpoint error: {e}")
        return jsonify({'error': str(e), 'success': False}), 500


@ai_bp.route('/generate-alt-text', methods=['POST'])
def generate_alt_text():
    """Generate alt text endpoint"""
    try:
        data = request.get_json()
        
        context = data.get('context', '')
        current_alt = data.get('currentAlt', '')
        
        result = run_async(ai_processor.generate_alt_text(context, current_alt))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Generate alt text endpoint error: {e}")
        return jsonify({'error': str(e), 'success': False}), 500


@ai_bp.route('/eli5', methods=['POST'])
def eli5():
    """Explain Like I'm 5 endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data.get('text', '').strip()
        if len(text) < 10:
            return jsonify({'error': 'Text too short'}), 400
        
        result = run_async(ai_processor.eli5(text))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"ELI5 endpoint error: {e}")
        return jsonify({'error': str(e), 'success': False}), 500


@ai_bp.route('/side-by-side-translate', methods=['POST'])
def side_by_side_translate():
    """Side-by-side translation endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data.get('text', '').strip()
        target_lang = data.get('targetLanguage', 'es')
        
        result = run_async(ai_processor.side_by_side_translate(text, target_lang))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Side-by-side translation endpoint error: {e}")
        return jsonify({'error': str(e), 'success': False}), 500


@ai_bp.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    """Generate quiz questions endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data.get('text', '').strip()
        options = {
            'num_questions': data.get('num_questions', 5)
        }
        
        result = run_async(ai_processor.generate_quiz(text, options))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Quiz generation endpoint error: {e}")
        return jsonify({'error': str(e), 'success': False}), 500


@ai_bp.route('/status', methods=['GET'])
def status():
    """Check AI service status"""
    return jsonify({
        'status': 'online',
        'gemini_available': ai_processor.gemini_available,
        'methods': ['summarize', 'rewrite', 'proofread', 'translate', 'generate-alt-text', 'eli5', 'side-by-side-translate', 'generate-quiz']
    })
