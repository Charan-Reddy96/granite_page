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
        if Product.query.count() == 0:
            print("Seeding database with default products...")
            default_products = [
                # Granite
                Product(
                    name="Black Galaxy Granite",
                    category="Granite",
                    color="Black",
                    price=380.0,
                    availability="In Stock",
                    description="Stunning black granite with golden and white specks. Perfect for premium countertops and accent walls.",
                    featured=True,
                    thickness="3cm",
                    dimensions="126\" x 74\"",
                    finish="Polished",
                    image_paths=json.dumps(["/static/uploads/black_galaxy.webp"])
                ),
                Product(
                    name="Imperial White Granite",
                    category="Granite",
                    color="White",
                    price=320.0,
                    availability="In Stock",
                    description="Graceful white granite with light grey and burgundy waves. Elegant choice for kitchens.",
                    featured=True,
                    thickness="2cm",
                    dimensions="118\" x 70\"",
                    finish="Polished",
                    image_paths=json.dumps(["/static/uploads/imperial_white.webp"])
                ),
                Product(
                    name="Kashmir Gold Granite",
                    category="Granite",
                    color="Gold",
                    price=420.0,
                    availability="Low Stock",
                    description="Warm golden-yellow background with sandy waves. Brings cozy luxury to your spaces.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 72\"",
                    finish="Honed",
                    image_paths=json.dumps(["/static/uploads/kashmir_gold.webp"])
                ),
                Product(
                    name="Steel Grey Granite",
                    category="Granite",
                    color="Grey",
                    price=310.0,
                    availability="In Stock",
                    description="Durable steel grey granite slab from India, excellent for commercial heavy-traffic flooring, vanity tops, and durable kitchen countertops.",
                    featured=False,
                    thickness="2cm",
                    dimensions="122\" x 72\"",
                    finish="Polished",
                    image_paths=json.dumps(["/static/uploads/steel_grey.webp"])
                ),
                Product(
                    name="Tan Brown Granite",
                    category="Granite",
                    color="Brown",
                    price=340.0,
                    availability="In Stock",
                    description="Dark black-brown background with large, chocolate-brown and bronze mineral crystals. Highly unique leathered texture.",
                    featured=False,
                    thickness="3cm",
                    dimensions="120\" x 70\"",
                    finish="Leathered",
                    image_paths=json.dumps(["/static/uploads/tan_brown.webp"])
                ),
                Product(
                    name="Blue Pearl Granite",
                    category="Granite",
                    color="Blue",
                    price=480.0,
                    availability="In Stock",
                    description="Exclusive Norwegian blue granite with reflective metallic blue crystals. Elegant, shimmering surface finish.",
                    featured=False,
                    thickness="2cm",
                    dimensions="115\" x 68\"",
                    finish="Polished",
                    image_paths=json.dumps(["/static/uploads/blue_pearl.webp"])
                ),
                # Tiles
                Product(
                    name="Carrara Marble Tile",
                    category="Tile",
                    color="White",
                    price=180.0,
                    availability="In Stock",
                    description="Classic Italian Carrara marble tiles, suitable for bathroom floors, showers, and backsplash.",
                    featured=True,
                    thickness="1cm",
                    dimensions="12\" x 24\"",
                    finish="Polished",
                    image_paths=json.dumps(["/static/uploads/carrara_tile.webp"])
                ),
                Product(
                    name="Slate Grey Tile",
                    category="Tile",
                    color="Grey",
                    price=95.0,
                    availability="In Stock",
                    description="Natural slate tiles with structured matte surface, perfect for outdoor patios or rustic indoor floors.",
                    featured=False,
                    thickness="1.2cm",
                    dimensions="16\" x 16\"",
                    finish="Matte",
                    image_paths=json.dumps(["/static/uploads/slate_grey.webp"])
                ),
                Product(
                    name="Travertine Gold Tile",
                    category="Tile",
                    color="Gold",
                    price=160.0,
                    availability="In Stock",
                    description="Natural beige-gold travertine floor tiles, perfect for warm, luxurious bathroom walls and pool deck border cladding.",
                    featured=False,
                    thickness="1.5cm",
                    dimensions="18\" x 18\"",
                    finish="Honed",
                    image_paths=json.dumps(["/static/uploads/travertine_gold.webp"])
                ),
                Product(
                    name="Terrazzo White Tile",
                    category="Tile",
                    color="White",
                    price=120.0,
                    availability="Low Stock",
                    description="Modern terrazzo tiles with colorful quartz, granite, and marble chips embedded. Playful yet highly durable for public lobbies.",
                    featured=False,
                    thickness="1.2cm",
                    dimensions="24\" x 24\"",
                    finish="Matte",
                    image_paths=json.dumps(["/static/uploads/terrazzo_white.webp"])
                ),
                Product(
                    name="Emerald Ceramic Subway Tile",
                    category="Tile",
                    color="Green",
                    price=75.0,
                    availability="In Stock",
                    description="Vibrant emerald green glossy glazed ceramic tiles. Excellent for decorative backsplashes and feature walls.",
                    featured=False,
                    thickness="0.8cm",
                    dimensions="3\" x 6\"",
                    finish="Polished",
                    image_paths=json.dumps(["/static/uploads/emerald_subway.webp"])
                ),
                # Paints
                Product(
                    name="Royal Velvet Interior Paint",
                    category="Paint",
                    color="Blue",
                    price=280.0,
                    availability="In Stock",
                    description="Premium washproof interior paint in deep royal blue. Extremely high opacity with a luxurious feel.",
                    featured=True,
                    finish="Matte",
                    coverage="120-150 sq.ft/litre",
                    size="1 Litre",
                    image_paths=json.dumps(["/static/uploads/royal_velvet.webp"])
                ),
                Product(
                    name="Golden Sand Satin Paint",
                    category="Paint",
                    color="Gold",
                    price=240.0,
                    availability="In Stock",
                    description="Light warm sand paint with a gentle satin sheen. Highly cleanable and long-lasting paint.",
                    featured=False,
                    finish="Satin",
                    coverage="150 sq.ft/litre",
                    size="1 Litre",
                    image_paths=json.dumps(["/static/uploads/golden_sand.webp"])
                ),
                Product(
                    name="Emerald Forest Satin Paint",
                    category="Paint",
                    color="Green",
                    price=260.0,
                    availability="In Stock",
                    description="Sleek satin wall paint in deep forest green. Perfect for accent doors, cabinetry, and sophisticated study rooms.",
                    featured=False,
                    finish="Satin",
                    coverage="140 sq.ft/litre",
                    size="1 Litre",
                    image_paths=json.dumps(["/static/uploads/emerald_forest.webp"])
                ),
                Product(
                    name="Mist Grey Exterior Paint",
                    category="Paint",
                    color="Grey",
                    price=290.0,
                    availability="In Stock",
                    description="Heavy-duty weather protection exterior paint in cool mist grey. Resist algae, moisture, and fading.",
                    featured=False,
                    finish="Matte",
                    coverage="110-130 sq.ft/litre",
                    size="1 Litre",
                    image_paths=json.dumps(["/static/uploads/mist_grey.webp"])
                ),
                Product(
                    name="Coral Blush Interior Paint",
                    category="Paint",
                    color="Red",
                    price=230.0,
                    availability="In Stock",
                    description="Warm coral pink shade with a subtle satin glow. Ideal choice for nursery rooms and playful modern accent walls.",
                    featured=False,
                    finish="Satin",
                    coverage="150 sq.ft/litre",
                    size="1 Litre",
                    image_paths=json.dumps(["/static/uploads/coral_blush.webp"])
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
