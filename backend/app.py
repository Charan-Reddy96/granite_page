import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json

from config import Config
from models import db, Product, Inquiry

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend requests
CORS(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
db.init_app(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Seed database with initial products if empty
def seed_database():
    with app.app_context():
        db.create_all()
        
        # Clear out old seed data if we don't have G S Granites & Tiles products yet
        try:
            has_new = Product.query.filter_by(name="Sierra Pearl Granite").count() > 0
            if not has_new:
                print("Clearing old products to re-seed with G S Granites & Tiles products...")
                Product.query.delete()
                db.session.commit()
        except Exception as e:
            print(f"Error checking/clearing products: {e}")
            db.session.rollback()

        if Product.query.count() == 0:
            print("Seeding database with default products...")
            default_products = [
                # Granite
                Product(
                    name="Tan Brown Granite",
                    category="Granite",
                    color="Brown",
                    price=70.0,
                    availability="In Stock",
                    description="Dark black-brown background with large, chocolate-brown and bronze mineral crystals. Highly unique leathered texture.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 70\"",
                    finish="Leathered",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Absolute Black Granite",
                    category="Granite",
                    color="Black",
                    price=220.0,
                    availability="In Stock",
                    description="Deep black solid granite texture. Elegant choice for premium heavy-duty kitchen countertops.",
                    featured=True,
                    thickness="2cm",
                    dimensions="118\" x 70\"",
                    finish="Polished",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Rose Pearl Granite",
                    category="Granite",
                    color="Pink",
                    price=95.0,
                    availability="In Stock",
                    description="Delicate rose-colored minerals embedded in clean quartz. Brings soft warmth to decorative architecture.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 72\"",
                    finish="Honed",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Black Galaxy Granite",
                    category="Granite",
                    color="Black",
                    price=240.0,
                    availability="In Stock",
                    description="Stunning black granite with golden and white specks. Perfect for premium countertops and accent walls.",
                    featured=True,
                    thickness="3cm",
                    dimensions="126\" x 74\"",
                    finish="Polished",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Black Pearl Granite",
                    category="Granite",
                    color="Black",
                    price=150.0,
                    availability="In Stock",
                    description="Deep dark granite with subtle metallic silver mineral pearls, highly resistant and durable surface.",
                    featured=False,
                    thickness="2cm",
                    dimensions="115\" x 68\"",
                    finish="Polished",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Blue Granite",
                    category="Granite",
                    color="Blue",
                    price=85.0,
                    availability="In Stock",
                    description="Vibrant blue reflections on slate-grey base stone. Extremely beautiful and modern accent cladding.",
                    featured=False,
                    thickness="2cm",
                    dimensions="115\" x 68\"",
                    finish="Polished",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Sierra Pearl Granite",
                    category="Granite",
                    color="Grey",
                    price=105.0,
                    availability="In Stock",
                    description="Classic grey stone dotted with quartz pearls. Highly recommended for commercial lobby flooring.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 70\"",
                    finish="Leathered",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Sadarahalli White Granite",
                    category="Granite",
                    color="White",
                    price=90.0,
                    availability="In Stock",
                    description="Renowned Sadarahalli white granite, featuring balanced grey salt-and-pepper mineral patterns.",
                    featured=False,
                    thickness="2cm",
                    dimensions="122\" x 72\"",
                    finish="Polished",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Coffee Brown Granite",
                    category="Granite",
                    color="Brown",
                    price=110.0,
                    availability="In Stock",
                    description="Warm brown coffee-toned natural stone. Exudes luxurious comfort for residential designs.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 70\"",
                    finish="Honed",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="Hassan Green Granite",
                    category="Granite",
                    color="Green",
                    price=135.0,
                    availability="In Stock",
                    description="Traditional premium Hassan green granite. Smooth, weather-resistant, perfect for landmarks and outdoors.",
                    featured=False,
                    thickness="2cm",
                    dimensions="120\" x 70\"",
                    finish="Polished",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&auto=format&fit=crop"])
                ),
                # Tiles (sold per box)
                Product(
                    name="4x2 Premium Vitrified Tiles",
                    category="Tile",
                    color="White",
                    price=950.0,
                    availability="In Stock",
                    description="Stunning high-gloss 4' x 2' vitrified floor tiles. Box pack covers multiple pieces.",
                    featured=True,
                    dimensions="4' x 2'",
                    finish="Polished",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="2x2 Classic Vitrified Tiles",
                    category="Tile",
                    color="White",
                    price=800.0,
                    availability="In Stock",
                    description="Durable 2' x 2' satin-finish vitrified floor tiles. Convenient box packaging.",
                    featured=False,
                    dimensions="2' x 2'",
                    finish="Matte",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="18x12 Decorative Wall Tiles",
                    category="Tile",
                    color="Gold",
                    price=450.0,
                    availability="In Stock",
                    description="Exquisite 18\" x 12\" ceramic wall tiles. Perfect for bathrooms and kitchen backsplashes.",
                    featured=False,
                    dimensions="18\" x 12\"",
                    finish="Polished",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="16x16 Heavy Duty Floor Tiles",
                    category="Tile",
                    color="Grey",
                    price=550.0,
                    availability="In Stock",
                    description="Rustic 16\" x 16\" non-slip parking and floor tiles. Durable, heavy-traffic resistance.",
                    featured=False,
                    dimensions="16\" x 16\"",
                    finish="Matte",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop"])
                ),
                Product(
                    name="5x2.5 Large Format Slab Tiles",
                    category="Tile",
                    color="Blue",
                    price=2450.0,
                    availability="In Stock",
                    description="Magnificent large-format 5' x 2.5' vitrified slab tiles. Gives seamless marble-like look.",
                    featured=False,
                    dimensions="5' x 2.5'",
                    finish="Polished",
                    image_paths=json.dumps(["https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=500&auto=format&fit=crop"])
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
            query = query.filter(Product.price >= float(min_price))
        except ValueError:
            pass
            
    max_price = request.args.get('max_price')
    if max_price:
        try:
            query = query.filter(Product.price <= float(max_price))
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


# POST create new product
@app.route('/api/products', methods=['POST'])
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
        
    try:
        price_val = float(price)
    except ValueError:
        return jsonify({'error': 'Price must be a number.'}), 400
        
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


# PUT update product
@app.route('/api/products/<int:product_id>', methods=['PUT'])
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
        try:
            product.price = float(data['price'])
        except ValueError:
            return jsonify({'error': 'Price must be a number.'}), 400
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


# DELETE product
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
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


# GET all inquiries
@app.route('/api/inquiries', methods=['GET'])
def get_inquiries():
    inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    return jsonify([i.to_dict() for i in inquiries])


# PUT update inquiry status
@app.route('/api/inquiries/<int:inquiry_id>', methods=['PUT'])
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


# DELETE inquiry
@app.route('/api/inquiries/<int:inquiry_id>', methods=['DELETE'])
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
