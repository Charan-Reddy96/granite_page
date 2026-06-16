import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
from sqlalchemy import cast, Float

from config import Config
from models import db, bcrypt, Product, Inquiry, User
from auth import generate_token, get_current_user, admin_required

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend requests
CORS(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database and bcrypt
db.init_app(app)
bcrypt.init_app(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Seed database with initial products if empty
def seed_database():
    with app.app_context():
        db.create_all()

        # Seed default admin user if none exists
        if User.query.filter_by(role='admin').count() == 0:
            print("Creating default admin user...")
            admin = User(username='admin', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("Admin user created (username: admin, password: admin123)")
        
        # Clear out old seed data if we don't have the new granite/tile products
        try:
            has_new = Product.query.filter_by(name="Steel Black Granite").count() > 0
            if not has_new:
                print("Clearing old products to re-seed with the new granite/tile inventory...")
                Product.query.delete()
                db.session.commit()
        except Exception as e:
            print(f"Error checking/clearing products: {e}")
            db.session.rollback()

        if Product.query.count() == 0:
            print("Seeding database with default products...")
            default_products = [
                # Granite (10 items)
                Product(
                    name="Tan Brown Granite",
                    category="Granite",
                    color="Brown",
                    price="60 - 80",
                    availability="In Stock",
                    description="Dark black-brown background with large, chocolate-brown and bronze mineral crystals. Highly unique leathered texture.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 70\"",
                    finish="Leathered",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Black Granite",
                    category="Granite",
                    color="Black",
                    price="120 - 280",
                    availability="In Stock",
                    description="Deep black solid granite texture. Elegant choice for premium heavy-duty kitchen countertops and flooring.",
                    featured=True,
                    thickness="2cm",
                    dimensions="118\" x 70\"",
                    finish="Polished",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/11766463299363602454"])
                ),
                Product(
                    name="Rosy Pink Granite",
                    category="Granite",
                    color="Pink",
                    price="80 - 120",
                    availability="In Stock",
                    description="Delicate rose-colored minerals embedded in clean quartz. Brings soft warmth to decorative architecture.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 72\"",
                    finish="Honed",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/6038925374339461329"])
                ),
                Product(
                    name="Black Galaxy Granite",
                    category="Granite",
                    color="Black",
                    price="170 - 280",
                    availability="In Stock",
                    description="Stunning black granite with golden and white specks. Perfect for premium countertops and accent walls.",
                    featured=True,
                    thickness="3cm",
                    dimensions="126\" x 74\"",
                    finish="Polished",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/7106706524840432896"])
                ),
                Product(
                    name="Black Pearl Granite",
                    category="Granite",
                    color="Black",
                    price="120 - 180",
                    availability="In Stock",
                    description="Deep dark granite with subtle metallic silver mineral pearls, highly resistant and durable surface.",
                    featured=False,
                    thickness="2cm",
                    dimensions="115\" x 68\"",
                    finish="Polished",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/10407630008814658093"])
                ),
                Product(
                    name="Blue Granite",
                    category="Granite",
                    color="Blue",
                    price="70 - 110",
                    availability="In Stock",
                    description="Vibrant blue reflections on slate-grey base stone. Extremely beautiful and modern accent cladding.",
                    featured=False,
                    thickness="2cm",
                    dimensions="115\" x 68\"",
                    finish="Polished",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/11249034005412611704"])
                ),
                Product(
                    name="Sierra Pearl Granite",
                    category="Granite",
                    color="Grey",
                    price="80 - 120",
                    availability="In Stock",
                    description="Classic grey stone dotted with quartz pearls. Highly recommended for commercial lobby flooring.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 70\"",
                    finish="Leathered",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/13713677982778485788"])
                ),
                Product(
                    name="Sadali White Granite",
                    category="Granite",
                    color="White",
                    price="75 - 110",
                    availability="In Stock",
                    description="Renowned Sadali white granite, featuring balanced grey salt-and-pepper mineral patterns.",
                    featured=False,
                    thickness="2cm",
                    dimensions="122\" x 72\"",
                    finish="Polished",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/5907520677096429330"])
                ),
                Product(
                    name="Coffee Brown Granite",
                    category="Granite",
                    color="Brown",
                    price="100 - 120",
                    availability="In Stock",
                    description="Warm brown coffee-toned natural stone. Exudes luxurious comfort for residential designs.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 70\"",
                    finish="Honed",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/18160955284143415760"])
                ),
                Product(
                    name="Steel Black Granite",
                    category="Granite",
                    color="Black",
                    price="120 - 150",
                    availability="In Stock",
                    description="Premium steel black granite with textured metallic highlights. Exquisite durability and sleek appearance.",
                    featured=False,
                    thickness="2cm",
                    dimensions="120\" x 70\"",
                    finish="Polished",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/1800106829975532889"])
                ),
                # Tiles (5 items, sold per box)
                Product(
                    name="4x2 Vitrified Tiles",
                    category="Tile",
                    color="White",
                    price="800 - 1200",
                    availability="In Stock",
                    description="Stunning high-gloss 4' x 2' vitrified floor tiles. Box pack covers multiple pieces.",
                    featured=True,
                    dimensions="4' x 2'",
                    finish="Polished",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/792531940683038687"])
                ),
                Product(
                    name="2x2 Vitrified Tiles",
                    category="Tile",
                    color="White",
                    price="700 - 900",
                    availability="In Stock",
                    description="Durable 2' x 2' satin-finish vitrified floor tiles. Convenient box packaging.",
                    featured=False,
                    dimensions="2' x 2'",
                    finish="Matte",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/3675508590278326522"])
                ),
                Product(
                    name="18x12 Wall Tiles",
                    category="Tile",
                    color="Gold",
                    price="280 - 600",
                    availability="In Stock",
                    description="Exquisite 18\" x 12\" ceramic wall tiles. Perfect for bathrooms and kitchen backsplashes.",
                    featured=False,
                    dimensions="18\" x 12\"",
                    finish="Polished",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/722560681256745097"])
                ),
                Product(
                    name="16x16 Floor Tiles",
                    category="Tile",
                    color="Grey",
                    price="400 - 700",
                    availability="In Stock",
                    description="Rustic 16\" x 16\" non-slip parking and floor tiles. Durable, heavy-traffic resistance.",
                    featured=False,
                    dimensions="16\" x 16\"",
                    finish="Matte",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/17000636077708472496"])
                ),
                Product(
                    name="8x2.5 Step Tiles",
                    category="Tile",
                    color="Brown",
                    price="2200 - 2800",
                    availability="In Stock",
                    description="Magnificent step tiles in 8' x 2.5' dimensions. Perfect for stairs and pathways.",
                    featured=False,
                    dimensions="8' x 2.5'",
                    finish="Polished",
                    image_paths=json.dumps(["http://googleusercontent.com/image_collection/image_retrieval/15042865107189446128"])
                )
            ]
            for p in default_products:
                db.session.add(p)
            db.session.commit()
            print("Database seeding completed.")


# Helper route to serve static uploads (useful if Flask is acting alone)
@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# --- AUTH Routes ---

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({'error': 'Request body must be JSON.'}), 400

    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'error': 'Username and password are required.'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid username or password.'}), 401

    token = generate_token(user)
    return jsonify({
        'token': token,
        'user': user.to_dict()
    })


@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Not authenticated.'}), 401
    return jsonify({'user': user.to_dict()})


# --- API Routes ---

# GET all products (with filters)
@app.route('/api/products', methods=['GET'])
def get_products():
    query = Product.query
    
    # Apply category filter
    category = request.args.get('category')
    if category:
        query = query.filter(Product.category == category)
        
    # Apply search filter
    search = request.args.get('q')
    if search:
        query = query.filter((Product.name.like(f"%{search}%")) | (Product.description.like(f"%{search}%")))
        
    # Apply color filter
    color = request.args.get('color')
    if color:
        query = query.filter(Product.color == color)
        
    # Apply finish filter
    finish = request.args.get('finish')
    if finish:
        query = query.filter(Product.finish == finish)
        
    # Apply price filters
    min_price = request.args.get('min_price')
    if min_price:
        try:
            query = query.filter(cast(Product.price, Float) >= float(min_price))
        except ValueError:
            pass
            
    max_price = request.args.get('max_price')
    if max_price:
        try:
            query = query.filter(cast(Product.price, Float) <= float(max_price))
        except ValueError:
            pass
            
    # Check if featured items are requested
    featured = request.args.get('featured')
    if featured == 'true':
        query = query.filter(Product.featured == True)
        
    products = query.all()
    return jsonify([p.to_dict() for p in products])


# GET specific product
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())


# POST create new product (admin only)
@app.route('/api/products', methods=['POST'])
@admin_required
def create_product():
    # Admin endpoint
    data = request.form
    
    name = data.get('name')
    category = data.get('category')
    color = data.get('color')
    price = data.get('price')
    availability = data.get('availability', 'In Stock')
    description = data.get('description', '')
    featured = data.get('featured') == 'true'
    
    # Specific fields
    thickness = data.get('thickness')
    dimensions = data.get('dimensions')
    finish = data.get('finish')
    coverage = data.get('coverage')
    size = data.get('size')
    
    if not name or not category or not color or not price:
        return jsonify({'error': 'Name, Category, Color, and Price are required fields.'}), 400
        
    price_val = str(price)
        
    # File handling
    images_list = []
    if 'images' in request.files:
        files = request.files.getlist('images')
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Ensure unique filename
                base, ext = os.path.splitext(filename)
                counter = 1
                while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
                    filename = f"{base}_{counter}{ext}"
                    counter += 1
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                images_list.append(f"/static/uploads/{filename}")
                
    # Fallback to a text image URL if provided
    image_url_input = data.get('imageUrl')
    if image_url_input and not images_list:
        images_list.append(image_url_input)
        
    # If no images, use a default fallback
    if not images_list:
        images_list.append('/static/uploads/placeholder.webp')
        
    new_product = Product(
        name=name,
        category=category,
        color=color,
        price=price_val,
        availability=availability,
        description=description,
        featured=featured,
        thickness=thickness,
        dimensions=dimensions,
        finish=finish,
        coverage=coverage,
        size=size
    )
    new_product.set_images(images_list)
    
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify(new_product.to_dict()), 201


# PUT update product (admin only)
@app.route('/api/products/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    
    # We support either form data or JSON
    if request.is_json:
        data = request.json
    else:
        data = request.form
        
    if 'name' in data:
        product.name = data['name']
    if 'category' in data:
        product.category = data['category']
    if 'color' in data:
        product.color = data['color']
    if 'price' in data:
        product.price = str(data['price'])
    if 'availability' in data:
        product.availability = data['availability']
    if 'description' in data:
        product.description = data['description']
    if 'featured' in data:
        # Handle string "true"/"false" from form-data or boolean from JSON
        product.featured = str(data['featured']).lower() == 'true'
        
    # Specific fields
    if 'thickness' in data: product.thickness = data['thickness']
    if 'dimensions' in data: product.dimensions = data['dimensions']
    if 'finish' in data: product.finish = data['finish']
    if 'coverage' in data: product.coverage = data['coverage']
    if 'size' in data: product.size = data['size']
    
    # File handling if updating files via form-data
    if not request.is_json and 'images' in request.files:
        files = request.files.getlist('images')
        new_images = []
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                base, ext = os.path.splitext(filename)
                counter = 1
                while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
                    filename = f"{base}_{counter}{ext}"
                    counter += 1
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                new_images.append(f"/static/uploads/{filename}")
        if new_images:
            product.set_images(new_images)
            
    # Fallback to direct image paths update (if sent as array)
    if 'images' in data and request.is_json:
        product.set_images(data['images'])
        
    db.session.commit()
    return jsonify(product.to_dict())


# DELETE product (admin only)
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    
    # Optionally delete the image files from disk if they are in static/uploads
    # and not used by other products (for a robust demo we can keep files or delete them)
    # For safety, let's keep files on disk to prevent accidental data loss.
    
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': f'Product {product_id} deleted successfully.'})


# POST submit customer inquiry
@app.route('/api/inquiries', methods=['POST'])
def create_inquiry():
    data = request.json
    if not data:
        return jsonify({'error': 'Request body must be JSON.'}), 400
        
    name = data.get('name')
    phone = data.get('phone')
    email = data.get('email')
    message = data.get('message')
    product_id = data.get('product_id')
    
    if not name or not phone or not email or not message:
        return jsonify({'error': 'Name, Phone, Email, and Message are required fields.'}), 400
        
    # Check if product exists if product_id is provided
    if product_id:
        try:
            prod_id_int = int(product_id)
            Product.query.get_or_404(prod_id_int)
            product_id = prod_id_int
        except ValueError:
            product_id = None
            
    new_inquiry = Inquiry(
        name=name,
        phone=phone,
        email=email,
        product_id=product_id,
        message=message,
        status='New'
    )
    
    db.session.add(new_inquiry)
    db.session.commit()
    
    return jsonify(new_inquiry.to_dict()), 201


# GET all inquiries (admin only)
@app.route('/api/inquiries', methods=['GET'])
@admin_required
def get_inquiries():
    inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    return jsonify([i.to_dict() for i in inquiries])


# PUT update inquiry status (admin only)
@app.route('/api/inquiries/<int:inquiry_id>', methods=['PUT'])
@admin_required
def update_inquiry(inquiry_id):
    inquiry = Inquiry.query.get_or_404(inquiry_id)
    data = request.json
    
    if 'status' in data:
        valid_statuses = {'New', 'Contacted', 'Resolved'}
        if data['status'] not in valid_statuses:
            return jsonify({'error': f"Status must be one of {valid_statuses}."}), 400
        inquiry.status = data['status']
        
    db.session.commit()
    return jsonify(inquiry.to_dict())


# DELETE inquiry (admin only)
@app.route('/api/inquiries/<int:inquiry_id>', methods=['DELETE'])
@admin_required
def delete_inquiry(inquiry_id):
    inquiry = Inquiry.query.get_or_404(inquiry_id)
    db.session.delete(inquiry)
    db.session.commit()
    return jsonify({'message': f'Inquiry {inquiry_id} deleted successfully.'})


# POST upload standalone image
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        base, ext = os.path.splitext(filename)
        counter = 1
        while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
            filename = f"{base}_{counter}{ext}"
            counter += 1
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'url': f'/static/uploads/{filename}'}), 200
    else:
        return jsonify({'error': 'Allowed file types are png, jpg, jpeg, webp, gif'}), 400


if __name__ == '__main__':
    seed_database()
    app.run(host='0.0.0.0', port=5000, debug=True)
