import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'granite-shop-secret-key-12345')
    
    # Security parameters for Admin panel protection
    ADMIN_DEVICE_SIGNATURE = os.environ.get('ADMIN_DEVICE_SIGNATURE', 'gs_dev_device_sig_2026')
    ALLOWED_ADMIN_IPS = [ip.strip() for ip in os.environ.get('ALLOWED_ADMIN_IPS', '').split(',') if ip.strip()]

    # Fallback to SQLite if DATABASE_URL is not set
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        f'sqlite:///{os.path.join(BASE_DIR, "granite_shop.db")}'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Image upload configuration
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

