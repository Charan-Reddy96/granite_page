// API Service that handles server integration and local mock database fallback
// enabling full interactive functionality on static environments like GitHub Pages.

// Firebase Firestore + Storage — cross-device product and inquiry sync
import { db, storage } from './firebase';
import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, getDocs as getDocsAlias
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const INQUIRIES_COLLECTION = 'inquiries';
const PRODUCTS_COLLECTION = 'products';

const isGitHubPages = window.location.hostname.includes('github.io');
const API_BASE = ''; // proxied via Vite config locally

export const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}${cleanPath}`;
};

// Helper for fetch with a timeout
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// Helper to get auth headers for admin API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem('gs_auth_token');
  const signature = localStorage.getItem('gs_device_signature');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (signature) headers['X-Device-Signature'] = signature;
  return headers;
};

// Seed data for standalone mode (16 items)
const defaultSeedProducts = [
  {
    id: 1,
    name: "Tan Brown Granite",
    category: "Granite",
    color: "Brown",
    price: "60 - 80",
    availability: "In Stock",
    description: "Dark black-brown background with large, chocolate-brown and bronze mineral crystals. Highly unique leathered texture.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 70\"",
    finish: "Leathered",
    images: ["/tan_brown_granite.png"]
  },
  {
    id: 2,
    name: "Black Granite",
    category: "Granite",
    color: "Black",
    price: "120 - 280",
    availability: "In Stock",
    description: "Deep black solid granite texture. Elegant choice for premium heavy-duty kitchen countertops and flooring.",
    featured: true,
    thickness: "2cm",
    dimensions: "118\" x 70\"",
    finish: "Polished",
    images: ["/black_granite.png"]
  },
  {
    id: 3,
    name: "Rosy Pink Granite",
    category: "Granite",
    color: "Pink",
    price: "80 - 120",
    availability: "In Stock",
    description: "Delicate rose-colored minerals embedded in clean quartz. Brings soft warmth to decorative architecture.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 72\"",
    finish: "Honed",
    images: ["/rosy_pink_granite.png"]
  },
  {
    id: 4,
    name: "Black Galaxy Granite",
    category: "Granite",
    color: "Black",
    price: "170 - 280",
    availability: "In Stock",
    description: "Stunning black granite with golden and white specks. Perfect for premium countertops and accent walls.",
    featured: true,
    thickness: "3cm",
    dimensions: "126\" x 74\"",
    finish: "Polished",
    images: ["/black_galaxy_granite_v2.png"]
  },
  {
    id: 5,
    name: "Black Pearl Granite",
    category: "Granite",
    color: "Black",
    price: "120 - 180",
    availability: "In Stock",
    description: "Deep dark granite with subtle metallic silver mineral pearls, highly resistant and durable surface.",
    featured: false,
    thickness: "2cm",
    dimensions: "115\" x 68\"",
    finish: "Polished",
    images: ["/black_pearl_granite.png"]
  },
  {
    id: 6,
    name: "Blue Granite",
    category: "Granite",
    color: "Blue",
    price: "70 - 110",
    availability: "In Stock",
    description: "Vibrant blue reflections on slate-grey base stone. Extremely beautiful and modern accent cladding.",
    featured: false,
    thickness: "2cm",
    dimensions: "115\" x 68\"",
    finish: "Polished",
    images: ["/blue_granite.png"]
  },
  {
    id: 7,
    name: "Sierra Pearl Granite",
    category: "Granite",
    color: "Grey",
    price: "80 - 120",
    availability: "In Stock",
    description: "Classic grey stone dotted with quartz pearls. Highly recommended for commercial lobby flooring.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 70\"",
    finish: "Leathered",
    images: ["/sierra_pearl_granite.png"]
  },
  {
    id: 8,
    name: "Sadali White Granite",
    category: "Granite",
    color: "White",
    price: "75 - 110",
    availability: "In Stock",
    description: "Renowned Sadali white granite, featuring balanced grey salt-and-pepper mineral patterns.",
    featured: false,
    thickness: "2cm",
    dimensions: "122\" x 72\"",
    finish: "Polished",
    images: ["/sadali_white_granite.png"]
  },
  {
    id: 9,
    name: "Coffee Brown Granite",
    category: "Granite",
    color: "Brown",
    price: "100 - 120",
    availability: "In Stock",
    description: "Warm brown coffee-toned natural stone. Exudes luxurious comfort for residential designs.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 70\"",
    finish: "Honed",
    images: ["/coffee_brown_granite.png"]
  },
  {
    id: 10,
    name: "Steel Black Granite",
    category: "Granite",
    color: "Black",
    price: "120 - 150",
    availability: "In Stock",
    description: "Premium steel black granite with textured metallic highlights. Exquisite durability and sleek appearance.",
    featured: true,
    thickness: "2cm",
    dimensions: "120\" x 70\"",
    finish: "Polished",
    images: ["/steel_black_granite.png"]
  },
  {
    id: 11,
    name: "4x2 Vitrified Tiles",
    category: "Tile",
    color: "White",
    price: "800 - 1200",
    availability: "In Stock",
    description: "Stunning high-gloss 4' x 2' vitrified floor tiles. Box pack covers multiple pieces.",
    featured: true,
    dimensions: "4' x 2'",
    finish: "Polished",
    images: ["/tiles_4x2.png"]
  },
  {
    id: 12,
    name: "2x2 Vitrified Tiles",
    category: "Tile",
    color: "White",
    price: "700 - 900",
    availability: "In Stock",
    description: "Durable 2' x 2' satin-finish vitrified floor tiles. Convenient box packaging.",
    featured: false,
    dimensions: "2' x 2'",
    finish: "Matte",
    images: ["/tiles_2x2.png"]
  },
  {
    id: 13,
    name: "18x12 Wall Tiles",
    category: "Tile",
    color: "Gold",
    price: "280 - 600",
    availability: "In Stock",
    description: "Exquisite 18\" x 12\" ceramic wall tiles. Perfect for bathrooms and kitchen backsplashes.",
    featured: false,
    dimensions: "18\" x 12\"",
    finish: "Polished",
    images: ["/tiles_18x12.png"]
  },
  {
    id: 14,
    name: "16x16 Floor Tiles",
    category: "Tile",
    color: "Grey",
    price: "400 - 700",
    availability: "In Stock",
    description: "Rustic 16\" x 16\" non-slip parking and floor tiles. Durable, heavy-traffic resistance.",
    featured: false,
    dimensions: "16\" x 16\"",
    finish: "Matte",
    images: ["/tiles_16x16.png"]
  },
  {
    id: 15,
    name: "8x2.5 Step Tiles",
    category: "Tile",
    color: "Brown",
    price: "2200 - 2800",
    availability: "In Stock",
    description: "Magnificent step tiles in 8' x 2.5' dimensions. Perfect for stairs and pathways.",
    featured: false,
    dimensions: "8' x 2.5'",
    finish: "Polished",
    images: ["/tiles_8x2_5.png"]
  }
];

// ─── Firestore Product Helpers ─────────────────────────────────────────────

// Seed default products to Firestore if the collection is empty (one-time setup)
let _seeded = false;
const seedFirestoreProducts = async () => {
  if (_seeded) return;
  _seeded = true;
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  if (snapshot.empty) {
    const batch = defaultSeedProducts.map(p =>
      addDoc(collection(db, PRODUCTS_COLLECTION), { ...p, _seeded: true })
    );
    await Promise.all(batch);
  }
};

// Upload an image File to Firebase Storage and return the public download URL
const uploadImageToStorage = async (imageFile) => {
  const fileName = `${Date.now()}_${imageFile.name}`;
  const storageRef = ref(storage, `product_images/${fileName}`);
  await uploadBytes(storageRef, imageFile);
  return getDownloadURL(storageRef);
};

// Convert a Firestore product doc to a plain object
const docToProduct = (d) => ({ ...d.data(), id: d.id });

const getLocalInquiries = () => {
  const i = localStorage.getItem('aura_inquiries');
  if (!i) {
    const defaultInquiries = [
      {
        id: 1,
        name: "Devin Sharma",
        phone: "+91 98765 43210",
        email: "devin@example.com",
        product_id: 1,
        product_name: "Black Galaxy Granite",
        product_category: "Granite",
        message: "Requesting a quote for 400 sq.ft of polished Black Galaxy slab.",
        status: "New",
        created_at: "2026-06-04 18:30:15"
      }
    ];
    localStorage.setItem('aura_inquiries', JSON.stringify(defaultInquiries));
    return defaultInquiries;
  }
  return JSON.parse(i);
};

const setLocalInquiries = (inquiries) => {
  localStorage.setItem('aura_inquiries', JSON.stringify(inquiries));
};

// Check if Flask server is responsive
async function checkServer() {
  if (isGitHubPages) return false;
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/products?featured=true`, {}, 1200);
    return res.ok;
  } catch (e) {
    return false;
  }
}

export const api = {
  // 0. AUTH API
  login: async (username, password, deviceSignature = '') => {
    const isOnline = await checkServer();
    if (isOnline) {
      const headers = { 'Content-Type': 'application/json' };
      if (deviceSignature) {
        headers['X-Device-Signature'] = deviceSignature;
      }
      const res = await fetchWithTimeout(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ username, password, deviceSignature })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data;
    } else {
      // Mock Login in Standalone Mode
      const trimUser = username.trim();
      if (trimUser === 'admin') {
        if (password !== 'admin123') {
          throw new Error('Invalid username or password.');
        }
        if (deviceSignature !== 'gs_dev_device_sig_2026') {
          throw new Error('Access restricted: Unauthorized device signature key.');
        }
        const adminUser = {
          id: 1,
          username: 'admin',
          role: 'admin',
          profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
          created_at: '2026-06-16 12:00:00'
        };
        return {
          token: 'mock_jwt_token_admin',
          user: adminUser
        };
      } else {
        // Check local users
        const users = JSON.parse(localStorage.getItem('gs_mock_users') || '[]');
        const user = users.find(u => u.username === trimUser);
        if (!user || password === '') {
          throw new Error('Invalid username or password.');
        }
        return {
          token: `mock_jwt_token_${user.id}`,
          user
        };
      }
    }
  },

  getMe: async (token) => {
    const isOnline = await checkServer();
    if (isOnline) {
      const headers = { 'Authorization': `Bearer ${token}` };
      const signature = localStorage.getItem('gs_device_signature');
      if (signature) {
        headers['X-Device-Signature'] = signature;
      }
      const res = await fetchWithTimeout(`${API_BASE}/api/auth/me`, { headers });
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    } else {
      // Mock getMe
      if (token === 'mock_jwt_token_admin') {
        const signature = localStorage.getItem('gs_device_signature');
        if (signature !== 'gs_dev_device_sig_2026') {
          throw new Error('Access restricted: Unauthorized device signature key.');
        }
        return {
          user: {
            id: 1,
            username: 'admin',
            role: 'admin',
            profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
            created_at: '2026-06-16 12:00:00'
          }
        };
      }

      const userId = token.replace('mock_jwt_token_', '');
      const users = JSON.parse(localStorage.getItem('gs_mock_users') || '[]');
      const user = users.find(u => u.id === parseInt(userId));
      if (!user) throw new Error('Not authenticated');
      return { user };
    }
  },

  register: async (formData) => {
    const isOnline = await checkServer();
    if (isOnline) {
      const res = await fetchWithTimeout(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        body: formData // Form data including files
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      return data;
    } else {
      // Mock Register in Standalone Mode
      const username = formData.get('username');
      const password = formData.get('password');
      const profileImageFile = formData.get('profile_image');

      let profile_image_url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop'; // fallback placeholder

      if (profileImageFile && profileImageFile.name) {
        // Read client file as data URL to keep offline flow completely active
        profile_image_url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(profileImageFile);
        });
      }

      const users = JSON.parse(localStorage.getItem('gs_mock_users') || '[]');
      if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Username is already taken.');
      }

      const newUser = {
        id: users.length + 10,
        username,
        role: 'user',
        profile_image: profile_image_url,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      users.push(newUser);
      localStorage.setItem('gs_mock_users', JSON.stringify(users));

      return {
        message: 'Registration successful (standalone mock)',
        token: `mock_jwt_token_${newUser.id}`,
        user: newUser
      };
    }
  },

  // 1. PRODUCTS API — powered by Firebase Firestore for cross-device sync
  getProducts: async (filters = {}) => {
    const isOnline = await checkServer();
    if (isOnline) {
      // Flask backend available — use REST API
      let queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.q) queryParams.append('q', filters.q);
      if (filters.color) queryParams.append('color', filters.color);
      if (filters.finish) queryParams.append('finish', filters.finish);
      if (filters.min_price) queryParams.append('min_price', filters.min_price);
      if (filters.max_price) queryParams.append('max_price', filters.max_price);
      if (filters.featured) queryParams.append('featured', 'true');
      const res = await fetchWithTimeout(`${API_BASE}/api/products?${queryParams.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch products');
      }
      return res.json();
    } else {
      // Standalone / GitHub Pages — read from Firestore, seed if empty
      await seedFirestoreProducts();
      const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      let results = snapshot.docs.map(docToProduct);

      // Apply filters client-side
      if (filters.category) {
        results = results.filter(p => p.category && p.category.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.q) {
        const q = filters.q.toLowerCase();
        results = results.filter(p =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.color || '').toLowerCase().includes(q)
        );
      }
      if (filters.color) {
        results = results.filter(p => p.color && p.color.toLowerCase() === filters.color.toLowerCase());
      }
      if (filters.finish) {
        results = results.filter(p => p.finish && p.finish.toLowerCase() === filters.finish.toLowerCase());
      }
      if (filters.featured) {
        results = results.filter(p => p.featured === true);
      }
      return results;
    }
  },

  getProductById: async (id) => {
    const isOnline = await checkServer();
    if (isOnline) {
      // Flask backend available — use REST API
      const res = await fetchWithTimeout(`${API_BASE}/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    } else {
      // Standalone / GitHub Pages — read from Firestore
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) throw new Error('Product not found');
      return docToProduct(snap);
    }
  },

  createProduct: async (formData) => {
    const isOnline = await checkServer();
    if (isOnline) {
      // Flask backend available — use REST API
      const res = await fetchWithTimeout(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: formData
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create product');
      }
      return res.json();
    } else {
      // Standalone / GitHub Pages — write to Firestore, image to Storage
      const name = formData.get('name');
      const category = formData.get('category');
      const color = formData.get('color');
      const price = formData.get('price');
      const availability = formData.get('availability') || 'In Stock';
      const description = formData.get('description') || '';
      const featured = formData.get('featured') === 'true';
      const thickness = formData.get('thickness') || '';
      const dimensions = formData.get('dimensions') || '';
      const finish = formData.get('finish') || 'Polished';
      const coverage = formData.get('coverage') || '';
      const size = formData.get('size') || '';

      const imageFile = formData.get('images');
      let imageUrl = formData.get('imageUrl') || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop';

      if (imageFile && imageFile.name) {
        imageUrl = await uploadImageToStorage(imageFile);
      }

      const newData = {
        name, category, color, price, availability, description,
        featured, thickness, dimensions, finish, coverage, size,
        images: [imageUrl],
        created_at: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newData);
      return { ...newData, id: docRef.id };
    }
  },

  updateProduct: async (id, formData) => {
    const isOnline = await checkServer();
    if (isOnline) {
      // Flask backend available — use REST API
      const res = await fetchWithTimeout(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders() },
        body: formData
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update product');
      }
      return res.json();
    } else {
      // Standalone / GitHub Pages — update Firestore doc
      const name = formData.get('name');
      const category = formData.get('category');
      const color = formData.get('color');
      const price = formData.get('price');
      const availability = formData.get('availability');
      const description = formData.get('description');
      const featured = formData.get('featured') === 'true';
      const thickness = formData.get('thickness') || '';
      const dimensions = formData.get('dimensions') || '';
      const finish = formData.get('finish') || 'Polished';
      const coverage = formData.get('coverage') || '';
      const size = formData.get('size') || '';

      const imageFile = formData.get('images');
      let imageUrl = formData.get('imageUrl') || null;

      if (imageFile && imageFile.name) {
        imageUrl = await uploadImageToStorage(imageFile);
      }

      const updateData = {
        name, category, color, price, availability, description,
        featured, thickness, dimensions, finish, coverage, size,
        updated_at: serverTimestamp()
      };
      if (imageUrl) updateData.images = [imageUrl];

      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(docRef, updateData);
      return { ...updateData, id };
    }
  },

  deleteProduct: async (id) => {
    const isOnline = await checkServer();
    if (isOnline) {
      // Flask backend available — use REST API
      const res = await fetchWithTimeout(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete product');
      }
      return res.json();
    } else {
      // Standalone / GitHub Pages — delete Firestore doc
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
      return { message: 'Product deleted successfully' };
    }
  },

  // 2. INQUIRIES API — powered by Firebase Firestore for cross-device sync
  submitInquiry: async (inquiryData) => {
    const isOnline = await checkServer();
    if (isOnline) {
      // Flask backend available — use REST API
      const res = await fetchWithTimeout(`${API_BASE}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit inquiry');
      }
      return res.json();
    } else {
      // Standalone / GitHub Pages — write directly to Firestore
      const products = getLocalProducts();
      let prodName = 'General Inquiry';
      let prodCat = null;

      if (inquiryData.product_id && inquiryData.product_id !== 'general') {
        const prod = products.find(p => p.id === parseInt(inquiryData.product_id));
        if (prod) {
          prodName = prod.name;
          prodCat = prod.category;
        }
      }

      const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
        name: inquiryData.name,
        phone: inquiryData.phone,
        email: inquiryData.email,
        product_id: inquiryData.product_id === 'general' ? null : parseInt(inquiryData.product_id),
        product_name: prodName,
        product_category: prodCat,
        message: inquiryData.message,
        status: 'New',
        created_at: serverTimestamp()
      });

      return { id: docRef.id, message: 'Inquiry submitted successfully' };
    }
  },

  getInquiries: async () => {
    const isOnline = await checkServer();
    if (isOnline) {
      // Flask backend available — use REST API
      const res = await fetchWithTimeout(`${API_BASE}/api/inquiries`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch inquiries');
      }
      return res.json();
    } else {
      // Standalone / GitHub Pages — read from Firestore, newest first
      const q = query(
        collection(db, INQUIRIES_COLLECTION),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => {
        const data = d.data();
        // Convert Firestore Timestamp to readable string
        const ts = data.created_at;
        const created_at = ts && ts.toDate
          ? ts.toDate().toISOString().replace('T', ' ').substring(0, 19)
          : (ts || '');
        return { ...data, id: d.id, created_at };
      });
    }
  },

  updateInquiryStatus: async (id, status) => {
    const isOnline = await checkServer();
    if (isOnline) {
      // Flask backend available — use REST API
      const res = await fetchWithTimeout(`${API_BASE}/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update inquiry status');
      }
      return res.json();
    } else {
      // Standalone / GitHub Pages — update Firestore doc
      const docRef = doc(db, INQUIRIES_COLLECTION, id);
      await updateDoc(docRef, { status });
      return { id, status };
    }
  },

  deleteInquiry: async (id) => {
    const isOnline = await checkServer();
    if (isOnline) {
      // Flask backend available — use REST API
      const res = await fetchWithTimeout(`${API_BASE}/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete inquiry');
      }
      return res.json();
    } else {
      // Standalone / GitHub Pages — delete Firestore doc
      await deleteDoc(doc(db, INQUIRIES_COLLECTION, id));
      return { message: 'Inquiry deleted successfully' };
    }
  }
};
