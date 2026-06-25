// One-time Firestore seed script — run with: node seed_products.mjs
// Clears all existing products and inserts the 30 new ones.

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

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
const PRODUCTS_COLLECTION = 'products';

const newProducts = [
  { name: "Black Granite", category: "Granite", color: "Black", price: "180 - 280", availability: "In Stock", featured: true, finish: "Polished", description: "Premium deep black granite slab with uniform tone. Ideal for countertops, flooring, and cladding.", images: [] },
  { name: "Tan Brown Granite", category: "Granite", color: "Brown", price: "60 - 80", availability: "In Stock", featured: false, finish: "Leathered", description: "Dark brown background with chocolate and bronze mineral crystals. Unique leathered texture.", images: [] },
  { name: "Black Galaxy Granite", category: "Granite", color: "Black", price: "260 - 300", availability: "In Stock", featured: true, finish: "Polished", description: "Stunning black granite with golden and white specks. A premium choice for accent walls and countertops.", images: [] },
  { name: "Rosy Pink Granite", category: "Granite", color: "Pink", price: "80 - 120", availability: "In Stock", featured: false, finish: "Honed", description: "Delicate rose-pink minerals in clean quartz. Adds soft warmth to residential architecture.", images: [] },
  { name: "Black Pearl Granite", category: "Granite", color: "Black", price: "120 - 150", availability: "In Stock", featured: false, finish: "Polished", description: "Deep dark granite with subtle metallic silver pearls. Highly resistant and durable surface.", images: [] },
  { name: "Coffee Brown Granite", category: "Granite", color: "Brown", price: "100 - 130", availability: "In Stock", featured: false, finish: "Honed", description: "Warm coffee-toned natural stone. Exudes luxurious comfort for residential designs.", images: [] },
  { name: "Steel Gray Granite", category: "Granite", color: "Grey", price: "90 - 120", availability: "In Stock", featured: false, finish: "Polished", description: "Classic steel-grey granite with fine mineral grains. Excellent for commercial flooring and facade.", images: [] },
  { name: "Saffire Blue Granite", category: "Granite", color: "Blue", price: "80 - 120", availability: "In Stock", featured: false, finish: "Polished", description: "Vibrant sapphire-blue reflections on a grey base. Striking choice for decorative cladding.", images: [] },
  { name: "Lavender Blue Granite", category: "Granite", color: "Blue", price: "130 - 180", availability: "In Stock", featured: false, finish: "Polished", description: "Elegant lavender-blue toned granite with subtle purple hues. Premium decorative stone.", images: [] },
  { name: "SK Blue Granite", category: "Granite", color: "Blue", price: "130 - 180", availability: "In Stock", featured: false, finish: "Polished", description: "Rich blue granite with fine crystalline pattern. Popular for premium residential projects.", images: [] },
  { name: "Shell White Granite", category: "Granite", color: "White", price: "75 - 100", availability: "In Stock", featured: false, finish: "Polished", description: "Clean white granite with soft grey veining. Versatile choice for kitchens and bathrooms.", images: [] },
  { name: "P White Granite", category: "Granite", color: "White", price: "110 - 130", availability: "In Stock", featured: false, finish: "Polished", description: "Premium white granite with minimal patterning. Ideal for modern minimalist interiors.", images: [] },
  { name: "NH Red Granite", category: "Granite", color: "Red", price: "120 - 150", availability: "In Stock", featured: false, finish: "Polished", description: "Deep red granite with bold natural grain patterns. Excellent for flooring and staircases.", images: [] },
  { name: "Ruby Red Granite", category: "Granite", color: "Red", price: "150 - 180", availability: "In Stock", featured: false, finish: "Polished", description: "Rich ruby-red granite with contrasting mineral specks. A bold statement stone for premium spaces.", images: [] },
  { name: "Lakha Red Granite", category: "Granite", color: "Red", price: "220 - 280", availability: "In Stock", featured: true, finish: "Polished", description: "Exclusive deep red granite from Rajasthan. Known for its exceptional durability and rich colour.", images: [] },
  { name: "Red Multicolour Granite", category: "Granite", color: "Red", price: "120 - 140", availability: "In Stock", featured: false, finish: "Polished", description: "Vibrant multicolour red granite with natural mineral specks. Adds warmth to any space.", images: [] },
  { name: "Paradiso Granite", category: "Granite", color: "Purple", price: "130 - 160", availability: "In Stock", featured: false, finish: "Polished", description: "Exotic granite with purple, grey and black swirling patterns. Unique and eye-catching stone.", images: [] },
  { name: "Madurai Gold Granite", category: "Granite", color: "Gold", price: "150 - 180", availability: "In Stock", featured: false, finish: "Polished", description: "Warm golden-yellow granite from Tamil Nadu. Perfect for feature walls and countertops.", images: [] },
  { name: "Blue Pearl Granite", category: "Granite", color: "Blue", price: "350 - 450", availability: "In Stock", featured: true, finish: "Polished", description: "Rare premium blue pearl granite with iridescent shimmer. The finest choice for luxury projects.", images: [] },
  { name: "Seema Pink Granite", category: "Granite", color: "Pink", price: "90 - 120", availability: "In Stock", featured: false, finish: "Polished", description: "Light pink granite with uniform grain texture. Popular for both indoor and outdoor applications.", images: [] },
  { name: "Green Black Granite", category: "Granite", color: "Green", price: "120 - 150", availability: "In Stock", featured: false, finish: "Polished", description: "Dense green-black granite with rich colour depth. Excellent for flooring and exterior cladding.", images: [] },
  { name: "Kuppam Green Granite", category: "Granite", color: "Green", price: "110 - 140", availability: "In Stock", featured: false, finish: "Polished", description: "Classic Kuppam green granite from Andhra Pradesh. Durable and widely used for outdoor spaces.", images: [] },
  { name: "Cat Eye Granite", category: "Granite", color: "Green", price: "180 - 220", availability: "In Stock", featured: false, finish: "Polished", description: "Distinctive green granite with cat-eye mineral shimmer. A premium and unique decorative stone.", images: [] },
  { name: "Kashmir White Granite", category: "Granite", color: "White", price: "140 - 180", availability: "In Stock", featured: true, finish: "Polished", description: "Iconic white granite with grey and burgundy mineral specks. One of India's most popular export granites.", images: [] },
  { name: "Himalayan Blue Granite", category: "Granite", color: "Blue", price: "140 - 170", availability: "In Stock", featured: false, finish: "Polished", description: "Cool blue-toned granite with grey undertones. Excellent for countertops and water features.", images: [] },
  { name: "Bala Flower Granite", category: "Granite", color: "Grey", price: "90 - 130", availability: "In Stock", featured: false, finish: "Polished", description: "Distinctive grey granite with floral-pattern mineral clusters. Popular for flooring and walls.", images: [] },
  { name: "Hassan Green Granite", category: "Granite", color: "Green", price: "120 - 140", availability: "In Stock", featured: false, finish: "Polished", description: "Deep forest-green granite from Karnataka. Highly sought for exterior cladding and landscapes.", images: [] },
  { name: "River Gold Granite", category: "Granite", color: "Gold", price: "140 - 180", availability: "In Stock", featured: false, finish: "Polished", description: "Warm golden-brown granite with flowing river-like mineral patterns. Elegant natural stone.", images: [] },
  { name: "H Grey Granite", category: "Granite", color: "Grey", price: "140 - 160", availability: "In Stock", featured: false, finish: "Honed", description: "Fine-grained homogeneous grey granite. Clean and contemporary look for modern architecture.", images: [] },
];

async function run() {
  console.log('🔥 Connecting to Firestore...');

  // Step 1: Delete all existing products
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  const deletions = snapshot.docs.map(d => deleteDoc(doc(db, PRODUCTS_COLLECTION, d.id)));
  await Promise.all(deletions);
  console.log(`🗑  Deleted ${snapshot.docs.length} old products.`);

  // Step 2: Insert new products
  let count = 0;
  for (const product of newProducts) {
    await addDoc(collection(db, PRODUCTS_COLLECTION), product);
    count++;
    process.stdout.write(`\r✅ Inserted ${count}/${newProducts.length} products...`);
  }

  console.log(`\n\n🎉 Done! ${count} products added to Firestore.`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
