"""
ContextGuard Backend - API Routes
General API endpoints
"""

from flask import Blueprint, request, jsonify
import logging

api_bp = Blueprint('api', __name__)
logger = logging.getLogger(__name__)


@api_bp.route('/ping', methods=['GET'])
def ping():
    """Simple ping endpoint"""
    return jsonify({'message': 'pong', 'status': 'ok'})


@api_bp.route('/version', methods=['GET'])
def version():
    """Get API version"""
    return jsonify({
        'version': '1.0.0',
        'api': 'v1',
        'service': 'ContextGuard'
    })


@api_bp.route('/stats', methods=['GET'])
def stats():
    """Get service statistics"""
    # In production, you'd track actual usage stats
    return jsonify({
        'total_requests': 0,
        'active_users': 0,
        'uptime': '100%'
    })
