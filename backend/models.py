from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime
import json

db = SQLAlchemy()
bcrypt = Bcrypt()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # bcrypt hash
    role = db.Column(db.String(20), default='user')  # 'admin' or 'user'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, raw_password):
        self.password = bcrypt.generate_password_hash(raw_password).decode('utf-8')

    def check_password(self, raw_password):
        return bcrypt.check_password_hash(self.password, raw_password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 'Granite', 'Tile', 'Paint'
    color = db.Column(db.String(50), nullable=False)
    price = db.Column(db.String(50), nullable=False)  # Price per sq.ft or box (supporting ranges)
    availability = db.Column(db.String(50), default='In Stock')  # 'In Stock', 'Low Stock', 'Out of Stock'
    description = db.Column(db.Text, nullable=True)
    featured = db.Column(db.Boolean, default=False)
    image_paths = db.Column(db.Text, nullable=True)  # Store JSON array string of image URLs
    
    # Granite & Tile specific fields
    thickness = db.Column(db.String(50), nullable=True)  # e.g., "2cm", "3cm"
    dimensions = db.Column(db.String(100), nullable=True)  # e.g., "120\" x 70\"" or "12\" x 12\""
    
    # Shareable / Paint specific fields
    finish = db.Column(db.String(50), nullable=True)  # e.g., "Polished", "Matte", "Gloss", "Satin"
    coverage = db.Column(db.String(100), nullable=True)  # Paint: "350-400 sq.ft/gal"
    size = db.Column(db.String(50), nullable=True)  # Paint: "1 Gallon", "5 Gallon"
    
    def get_images(self):
        if not self.image_paths:
            return []
        try:
            return json.loads(self.image_paths)
        except Exception:
            return [self.image_paths]

    def set_images(self, images_list):
        self.image_paths = json.dumps(images_list)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'color': self.color,
            'price': self.price,
            'availability': self.availability,
            'description': self.description,
            'featured': self.featured,
            'images': self.get_images(),
            'thickness': self.thickness,
            'dimensions': self.dimensions,
            'finish': self.finish,
            'coverage': self.coverage,
            'size': self.size
        }


class Inquiry(db.Model):
    __tablename__ = 'inquiries'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='SET NULL'), nullable=True)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='New')  # 'New', 'Contacted', 'Resolved'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    product = db.relationship('Product', backref=db.backref('inquiries', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'General Inquiry',
            'product_category': self.product.category if self.product else None,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
