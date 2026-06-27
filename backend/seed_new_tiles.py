import sqlite3
import json

new_tiles = [
    {
        "name": "Carrara White Marble Tiles",
        "category": "Tile",
        "color": "White",
        "price": "150 - 250",
        "availability": "In Stock",
        "description": "Luxurious polished Carrara marble floor and wall tiles. Classic grey veining on pure white background.",
        "featured": 1,
        "thickness": "1.2cm",
        "dimensions": '24" x 24"',
        "finish": "Polished",
        "image_paths": json.dumps(["/static/uploads/carrara_tile.webp"])
    },
    {
        "name": "Emerald Green Subway Tiles",
        "category": "Tile",
        "color": "Green",
        "price": "120 - 180",
        "availability": "In Stock",
        "description": "Vibrant glazed emerald green subway tiles. Ideal for kitchen backsplashes and bathroom accent walls.",
        "featured": 0,
        "thickness": "0.8cm",
        "dimensions": '3" x 6"',
        "finish": "Glossy",
        "image_paths": json.dumps(["/static/uploads/emerald_subway.webp"])
    },
    {
        "name": "Terrazzo White Tiles",
        "category": "Tile",
        "color": "White",
        "price": "90 - 140",
        "availability": "In Stock",
        "description": "Modern matte-finish white terrazzo tiles with colorful marble and quartz chips.",
        "featured": 0,
        "thickness": "1.0cm",
        "dimensions": '12" x 12"',
        "finish": "Matte",
        "image_paths": json.dumps(["/static/uploads/terrazzo_white.webp"])
    },
    {
        "name": "Travertine Gold Tiles",
        "category": "Tile",
        "color": "Gold",
        "price": "200 - 320",
        "availability": "In Stock",
        "description": "Exquisite warm gold travertine stone tiles, honed and filled for premium indoor and outdoor floor styling.",
        "featured": 0,
        "thickness": "1.5cm",
        "dimensions": '16" x 16"',
        "finish": "Honed",
        "image_paths": json.dumps(["/static/uploads/travertine_gold.webp"])
    },
    {
        "name": "Coral Blush Ceramic Tiles",
        "category": "Tile",
        "color": "Pink",
        "price": "110 - 160",
        "availability": "In Stock",
        "description": "Soft pastel coral pink ceramic tiles. Add a warm, modern minimalist aesthetic to your home styling.",
        "featured": 0,
        "thickness": "0.8cm",
        "dimensions": '8" x 8"',
        "finish": "Satin",
        "image_paths": json.dumps(["/static/uploads/coral_blush.webp"])
    }
]

def seed():
    conn = sqlite3.connect("granite_shop.db")
    cur = conn.cursor()
    
    # Ensure products table exists (if script runs before backend starts, though it should exist)
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")
    if not cur.fetchone():
        print("Table 'products' does not exist yet. Please run the backend first to initialize it.")
        conn.close()
        return

    added = 0
    for tile in new_tiles:
        cur.execute("SELECT id FROM products WHERE name = ?", (tile["name"],))
        if cur.fetchone():
            print(f"Skipping {tile['name']} (already exists)")
        else:
            cur.execute("""
                INSERT INTO products (name, category, color, price, availability, description, featured, thickness, dimensions, finish, image_paths)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                tile["name"], tile["category"], tile["color"], tile["price"], tile["availability"],
                tile["description"], tile["featured"], tile["thickness"], tile["dimensions"], tile["finish"], tile["image_paths"]
            ))
            print(f"Added {tile['name']}")
            added += 1
            
    conn.commit()
    conn.close()
    print(f"Seeding finished. Added {added} tiles.")

if __name__ == "__main__":
    seed()
