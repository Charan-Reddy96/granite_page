// One-time Firestore image updater — run with: node update_images.mjs
// Matches each product by name and sets the correct image URL.

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

// Map: product name keyword → image URL
const imageMap = [
  { key: "black granite",        url: "https://img.freepik.com/premium-photo/bump-map-texture-asphalt-bump-mapping-texture_220166-5106.jpg?semt=ais_hybrid" },
  { key: "tan brown",            url: "https://5.imimg.com/data5/QF/OR/MY-2496702/tan-brown-granite-1000x1000.jpg" },
  { key: "black galaxy",         url: "https://i.pinimg.com/736x/2e/fd/d7/2efdd7253381b5526438ef2d526d9b2b.jpg" },
  { key: "rosy pink",            url: "https://cpimg.tistatic.com/2352912/b/4/rosy-pink-granite.jpg" },
  { key: "black pearl",          url: "https://stone-synergy.co.uk/wp-content/uploads/black-pearl.jpg" },
  { key: "coffee brown",         url: "https://www.disconord.com/wp-content/uploads/2021/01/COFFE-BROWN-1.jpg" },
  { key: "steel gray",           url: "https://granitetopinc.com/wp-content/uploads/2016/10/Steel-Grey.jpg" },
  { key: "saffire blue",         url: "https://goodwillexports.com/wp-content/uploads/2022/07/Sapphire-Blue.jpg" },
  { key: "lavender blue",        url: "https://5.imimg.com/data5/SELLER/Default/2023/11/358126553/ZF/CZ/HU/2238097/lavender-blue-granite-1000x1000.jpg" },
  { key: "sk blue",              url: "https://5.imimg.com/data5/SELLER/Default/2023/9/343250666/MW/ON/IF/30779266/vizag-blue-granite-sk-blue-granite-1000x1000.jpg" },
  { key: "shell white",          url: "https://5.imimg.com/data5/PW/JQ/MY-2/flamed-granite-tile-500x500.jpg" },
  { key: "p white",              url: "https://graniteofindia.com/wp-content/uploads/2019/10/P-White-Granite.jpg" },
  { key: "nh red",               url: "https://5.imimg.com/data5/FJ/DR/MY-48018632/nh-red-500x500.jpg" },
  { key: "ruby red",             url: "https://img3.exportersindia.com/product_images/bc-full/dir_12/345869/ruby-red-granite-1386943.jpg" },
  { key: "lakha red",            url: "https://img1.exportersindia.com/product_images/bc-full/2018/6/5739170/lakha-red-granite-1529997357-4021218.jpeg" },
  { key: "red multicolour",      url: "https://stonediscoverusaapi.onrender.com/uploads/Red-Multi-Color-1.jpg" },
  { key: "paradiso",             url: "https://lavinagranites.com/assets/uploads/product_gallery_image/product_gallery_image_224.jpg" },
  { key: "madurai gold",         url: "https://marble.com/uploads/materials/701/1280X720/granite_Madura-Gold_jqTH7bfDIl9WCx6D847A.jpg" },
  { key: "blue pearl",           url: "https://4.imimg.com/data4/WC/SO/MY-345396/blue-pearl-granite-stone-500x500.jpg" },
  { key: "seema pink",           url: "https://www.anilexport.com/wp-content/uploads/2019/03/Cheema-Pink-1.jpg" },
  { key: "green black",          url: "https://d1paxro4wyfm9z.cloudfront.net/5/5/6/3/e/8/hassan-green-2.jpg" },
  { key: "kuppam green",         url: "https://tse2.mm.bing.net/th/id/OIP.uUcgAYSGz3YTyfZAvyZulgHaHa?pid=Api&P=0&h=180" },
  { key: "cat eye",              url: "https://5.imimg.com/data5/AE/HJ/MY-22509551/cat-eye-granite-500x500.jpg" },
  { key: "kashmir white",        url: "https://www.reliancegranito.com/wp-content/uploads/2021/09/Kashmir-white.jpg" },
  { key: "himalayan blue",       url: "https://www.agastyagranites.com/wp-content/uploads/2022/03/Himalayan-Blue-Granite.jpg" },
  { key: "bala flower",          url: "https://3.imimg.com/data3/FK/SH/MY-8340577/bala-flower-granite-500x500.jpg" },
  { key: "hassan green",         url: "https://5.imimg.com/data5/SELLER/Default/2023/2/YH/OS/LT/142806635/hassan-green-granite-slab-1000x1000.JPG" },
  { key: "river gold",           url: "https://i.pinimg.com/736x/79/e0/e6/79e0e6654058cb6b18de8ad4a3891bbd.jpg" },
  { key: "h grey",               url: "https://www.stoneadd.com/photo/upload/2023/lightgreygranitepolishedtiles202371116336.jpg" },
];

const findUrl = (productName) => {
  const lower = productName.toLowerCase();
  // Order matters: more specific matches first to avoid "black granite" catching "black galaxy" etc.
  const sorted = [...imageMap].sort((a, b) => b.key.length - a.key.length);
  const match = sorted.find(entry => lower.includes(entry.key));
  return match ? match.url : null;
};

async function run() {
  console.log('🔥 Connecting to Firestore...');
  const snapshot = await getDocs(collection(db, 'products'));
  const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`📦 Found ${products.length} products.\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const imageUrl = findUrl(product.name);
    if (imageUrl) {
      await updateDoc(doc(db, 'products', product.id), { images: [imageUrl] });
      console.log(`✅ ${product.name.padEnd(30)} → image set`);
      updated++;
    } else {
      console.log(`⚠️  ${product.name.padEnd(30)} → NO MATCH FOUND`);
      skipped++;
    }
  }

  console.log(`\n🎉 Done! ${updated} updated, ${skipped} skipped.`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
