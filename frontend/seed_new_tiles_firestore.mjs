import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLadvl5zxTwpDGadstWM7MD1lQGjhbkZs",
  authDomain: "gs-granites-and-tiles.firebaseapp.com",
  projectId: "gs-granites-and-tiles",
  storageBucket: "gs-granites-and-tiles.firebasestorage.app",
  messagingSenderId: "137141060985",
  appId: "1:137141060985:web:3a9e06c3bf25d165c95ba8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newTiles = [
  {
    name: "Carrara White Marble Tiles",
    category: "Tile",
    color: "White",
    price: "150 - 250",
    availability: "In Stock",
    description: "Luxurious polished Carrara marble floor and wall tiles. Classic grey veining on pure white background.",
    featured: true,
    thickness: "1.2cm",
    dimensions: '24" x 24"',
    finish: "Polished",
    coverage: "",
    size: "",
    images: ["https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop"] // Carrara Marble pattern
  },
  {
    name: "Emerald Green Subway Tiles",
    category: "Tile",
    color: "Green",
    price: "120 - 180",
    availability: "In Stock",
    description: "Vibrant glazed emerald green subway tiles. Ideal for kitchen backsplashes and bathroom accent walls.",
    featured: false,
    thickness: "0.8cm",
    dimensions: '3" x 6"',
    finish: "Glossy",
    coverage: "",
    size: "",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop"] // Green tiles
  },
  {
    name: "Terrazzo White Tiles",
    category: "Tile",
    color: "White",
    price: "90 - 140",
    availability: "In Stock",
    description: "Modern matte-finish white terrazzo tiles with colorful marble and quartz chips.",
    featured: false,
    thickness: "1.0cm",
    dimensions: '12" x 12"',
    finish: "Matte",
    coverage: "",
    size: "",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop"] // Terrazzo pattern
  },
  {
    name: "Travertine Gold Tiles",
    category: "Tile",
    color: "Gold",
    price: "200 - 320",
    availability: "In Stock",
    description: "Exquisite warm gold travertine stone tiles, honed and filled for premium indoor and outdoor floor styling.",
    featured: false,
    thickness: "1.5cm",
    dimensions: '16" x 16"',
    finish: "Honed",
    coverage: "",
    size: "",
    images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop"] // Travertine stone
  },
  {
    name: "Coral Blush Ceramic Tiles",
    category: "Tile",
    color: "Pink",
    price: "110 - 160",
    availability: "In Stock",
    description: "Soft pastel coral pink ceramic tiles. Add a warm, modern minimalist aesthetic to your home styling.",
    featured: false,
    thickness: "0.8cm",
    dimensions: '8" x 8"',
    finish: "Satin",
    coverage: "",
    size: "",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop"] // Coral pink tiles
  }
];

async function run() {
  console.log('🔥 Connecting to Firestore...');
  const productsCol = collection(db, 'products');

  let added = 0;
  for (const tile of newTiles) {
    const q = query(productsCol, where('name', '==', tile.name));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      console.log(`Skipping ${tile.name} (already exists in Firestore)`);
    } else {
      const docRef = await addDoc(productsCol, {
        ...tile,
        created_at: serverTimestamp()
      });
      console.log(`✅ Added ${tile.name} to Firestore with ID: ${docRef.id}`);
      added++;
    }
  }

  console.log(`\n🎉 Firestore seeding complete. Added ${added} tiles.`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
