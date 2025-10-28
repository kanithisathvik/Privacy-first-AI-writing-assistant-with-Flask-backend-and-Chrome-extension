"""
ContextGuard - Flask Application
Main entry point for the web application
"""

from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

# Import blueprints
from backend.api.routes import api_bp
from backend.auth.routes import auth_bp
from backend.ai.routes import ai_bp

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, 
           template_folder='frontend/templates',
           static_folder='frontend/static')

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-me')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max request size

# CORS configuration (for Chrome Extension)
allowed_origins = os.getenv('ALLOWED_ORIGINS', '*').split(',')
CORS(app, resources={
    r"/api/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(ai_bp, url_prefix='/ai')

# Main routes
@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    """Dashboard page with AI tools"""
    return render_template('dashboard.html')

@app.route('/extension')
def extension():
    """Extension download/info page"""
    return render_template('extension.html')

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.route('/privacy')
def privacy():
    """Privacy policy page"""
    return render_template('privacy.html')

@app.route('/analytics')
def analytics_page():
    """Analytics dashboard page"""
    return render_template('analytics.html')

@app.route('/api/analytics/user/<user_id>')
def get_user_analytics(user_id):
    """Get analytics for specific user"""
    from backend.analytics import analytics_tracker
    stats = analytics_tracker.get_user_stats(user_id)
    return jsonify(stats)

@app.route('/api/analytics/leaderboard')
def get_leaderboard():
    """Get global leaderboard"""
    from backend.analytics import analytics_tracker
    leaderboard = analytics_tracker.get_leaderboard(limit=10)
    return jsonify({'leaderboard': leaderboard})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Endpoint not found'}), 404
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f'Internal error: {error}')
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Internal server error'}), 500
    return render_template('500.html'), 500

@app.errorhandler(413)
def request_too_large(error):
    """Handle file too large errors"""
    return jsonify({'error': 'File too large. Maximum size is 16MB'}), 413

# Health check endpoint
@app.route('/health')
def health():
    """Health check for deployment monitoring"""
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0',
        'service': 'ContextGuard'
    })

# Context processor for templates
@app.context_processor
def inject_globals():
    """Inject global variables into templates"""
    return {
        'app_name': 'ContextGuard',
        'version': '1.0.0'
    }

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('DEBUG', 'True').lower() == 'true'
    
    logger.info(f'Starting ContextGuard on {host}:{port}')
    app.run(host=host, port=port, debug=debug)
