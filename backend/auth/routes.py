"""
ContextGuard Backend - Firebase Authentication
Handles Firebase auth integration
"""

import os
import json
import logging
from flask import Blueprint, request, jsonify, session
import firebase_admin
from firebase_admin import credentials, auth, firestore

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
try:
    cred_path = os.getenv('FIREBASE_ADMIN_CREDENTIALS', 'firebase-adminsdk.json')
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        logger.info("Firebase initialized successfully")
    else:
        logger.warning(f"Firebase credentials not found at {cred_path}. Auth features disabled.")
        db = None
except Exception as e:
    logger.error(f"Firebase initialization error: {e}")
    db = None


@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    """Verify Firebase ID token"""
    try:
        if not db:
            return jsonify({'error': 'Firebase not configured'}), 503
        
        data = request.get_json()
        id_token = data.get('idToken')
        
        if not id_token:
            return jsonify({'error': 'Token required'}), 400
        
        # Verify the token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Store user session
        session['user_id'] = uid
        session['email'] = decoded_token.get('email')
        
        return jsonify({
            'success': True,
            'uid': uid,
            'email': decoded_token.get('email')
        })
        
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        return jsonify({'error': 'Invalid token', 'details': str(e)}), 401


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})


@auth_bp.route('/user/preferences', methods=['GET'])
def get_preferences():
    """Get user preferences"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            # Return default preferences for non-logged in users
            return jsonify({
                'tone': 'neutral',
                'readingLevel': 'intermediate',
                'targetLanguage': 'es'
            })
        
        if not db:
            return jsonify({'error': 'Firebase not configured'}), 503
        
        # Get from Firestore
        doc_ref = db.collection('users').document(user_id)
        doc = doc_ref.get()
        
        if doc.exists:
            prefs = doc.to_dict().get('preferences', {})
            return jsonify(prefs)
        else:
            # Return defaults
            return jsonify({
                'tone': 'neutral',
                'readingLevel': 'intermediate',
                'targetLanguage': 'es'
            })
            
    except Exception as e:
        logger.error(f"Get preferences error: {e}")
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/user/preferences', methods=['POST'])
def save_preferences():
    """Save user preferences"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        if not db:
            return jsonify({'error': 'Firebase not configured'}), 503
        
        data = request.get_json()
        
        # Validate preferences
        valid_tones = ['formal', 'neutral', 'friendly']
        valid_levels = ['basic', 'intermediate', 'advanced']
        
        preferences = {
            'tone': data.get('tone', 'neutral'),
            'readingLevel': data.get('readingLevel', 'intermediate'),
            'targetLanguage': data.get('targetLanguage', 'es')
        }
        
        if preferences['tone'] not in valid_tones:
            return jsonify({'error': 'Invalid tone'}), 400
        
        if preferences['readingLevel'] not in valid_levels:
            return jsonify({'error': 'Invalid reading level'}), 400
        
        # Save to Firestore
        doc_ref = db.collection('users').document(user_id)
        doc_ref.set({
            'preferences': preferences,
            'email': session.get('email'),
            'updated_at': firestore.SERVER_TIMESTAMP
        }, merge=True)
        
        return jsonify({
            'success': True,
            'preferences': preferences
        })
        
    except Exception as e:
        logger.error(f"Save preferences error: {e}")
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/user/status', methods=['GET'])
def user_status():
    """Get current user status"""
    user_id = session.get('user_id')
    
    if user_id:
        return jsonify({
            'authenticated': True,
            'uid': user_id,
            'email': session.get('email')
        })
    else:
        return jsonify({
            'authenticated': False
        })
