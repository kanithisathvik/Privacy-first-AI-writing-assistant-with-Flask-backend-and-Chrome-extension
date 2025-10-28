"""
ContextGuard Backend - API Routes
General API endpoints
"""

from flask import Blueprint, request, jsonify, send_file
import logging
import io
from ..export import export_manager

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


@api_bp.route('/export', methods=['POST'])
def export_content():
    """Export processed text in various formats"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        export_format = data.get('format', 'markdown').lower()
        content = {
            'action': data.get('action', 'Unknown'),
            'original': data.get('original', ''),
            'result': data.get('result', ''),
            'metadata': data.get('metadata', {})
        }
        
        if export_format == 'markdown' or export_format == 'md':
            md_content = export_manager.export_markdown(content)
            buffer = io.BytesIO(md_content.encode('utf-8'))
            return send_file(
                buffer,
                as_attachment=True,
                download_name=f'contextguard_export_{content["action"]}.md',
                mimetype='text/markdown'
            )
        
        elif export_format == 'pdf':
            pdf_buffer = export_manager.export_pdf(content)
            return send_file(
                pdf_buffer,
                as_attachment=True,
                download_name=f'contextguard_export_{content["action"]}.pdf',
                mimetype='application/pdf'
            )
        
        elif export_format == 'json':
            json_content = export_manager.export_json(content)
            buffer = io.BytesIO(json_content.encode('utf-8'))
            return send_file(
                buffer,
                as_attachment=True,
                download_name=f'contextguard_export_{content["action"]}.json',
                mimetype='application/json'
            )
        
        elif export_format == 'txt' or export_format == 'text':
            txt_content = export_manager.export_txt(content)
            buffer = io.BytesIO(txt_content.encode('utf-8'))
            return send_file(
                buffer,
                as_attachment=True,
                download_name=f'contextguard_export_{content["action"]}.txt',
                mimetype='text/plain'
            )
        
        else:
            return jsonify({'error': f'Unsupported format: {export_format}'}), 400
    
    except Exception as e:
        logger.error(f"Export error: {e}")
        return jsonify({'error': str(e)}), 500
