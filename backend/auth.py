import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app
from models import User


def generate_token(user):
    """Generate a JWT token for the given user."""
    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        'iat': datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token


def decode_token(token):
    """Decode and validate a JWT token. Returns the payload dict or None."""
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_current_user():
    """Extract the current user from the Authorization header."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ', 1)[1]
    payload = decode_token(token)
    if not payload:
        return None

    user = User.query.get(payload['user_id'])
    return user


def admin_required(f):
    """Decorator that requires a valid admin JWT token, matching device signature, and whitelisted IP."""
    @wraps(f)
    def decorated(*args, **kwargs):
        # 1. IP Whitelisting validation
        allowed_ips = current_app.config.get('ALLOWED_ADMIN_IPS', [])
        if allowed_ips:
            client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
            if client_ip and ',' in client_ip:
                client_ip = client_ip.split(',')[0].strip()
            if client_ip not in allowed_ips:
                return jsonify({'error': f'Access restricted: Unauthorized device IP address ({client_ip}).'}), 403

        # 2. Device Signature validation
        expected_sig = current_app.config.get('ADMIN_DEVICE_SIGNATURE')
        if expected_sig:
            device_sig = request.headers.get('X-Device-Signature')
            if device_sig != expected_sig:
                return jsonify({'error': 'Access restricted: Unauthorized device signature key.'}), 403

        # 3. Standard JWT auth validation
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required. Please log in.'}), 401
        if user.role != 'admin':
            return jsonify({'error': 'Admin privileges required.'}), 403
        return f(*args, **kwargs)
    return decorated

