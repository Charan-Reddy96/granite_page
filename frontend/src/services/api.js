// API Service that handles server integration and local mock database fallback
// enabling full interactive functionality on static environments like GitHub Pages.

// Firebase Firestore — cross-device product and inquiry sync (no Storage needed)
import { db, auth } from './firebase';
import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, setDoc, onSnapshot
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

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

// Clear any stale localStorage data — products/inquiries are in Firestore, users are in Firebase Auth
['aura_products', 'aura_inquiries', 'gs_mock_users'].forEach(key => localStorage.removeItem(key));

// Waits for Firebase Auth to restore its persisted session (handles page-reload race condition)
const waitForFirebaseUser = () => new Promise((resolve) => {
  if (auth.currentUser) { resolve(auth.currentUser); return; }
  const unsub = onAuthStateChanged(auth, (user) => { unsub(); resolve(user); });
});

// ─── Firestore Helpers ──────────────────────────────────────────────────────

// Convert an image File to a base64 data URL (stored directly in Firestore)
// Works for images up to ~700KB. No external service required.
const convertImageToBase64 = (imageFile) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

// Convert a Firestore doc snapshot to a plain product object
const docToProduct = (d) => ({ ...d.data(), id: d.id });

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
        // Sign in with Firebase Auth — username stored as username@gs-granites.app internally
        const fakeEmail = `${trimUser.toLowerCase().replace(/[^a-z0-9]/g, '_')}@gs-granites.app`;
        let firebaseCredential;
        try {
          firebaseCredential = await signInWithEmailAndPassword(auth, fakeEmail, password);
        } catch {
          throw new Error('Invalid username or password.');
        }

        const fbUser = firebaseCredential.user;
        let userData;

        // 1. Try Firestore profile first
        try {
          const userDocSnap = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDocSnap.exists()) {
            userData = userDocSnap.data();
          }
        } catch (fsErr) {
          console.warn('[Login] Firestore read failed, trying fallbacks.', fsErr.message);
        }

        // 2. Fall back to localStorage cached profile (saved when Firestore write failed at signup)
        if (!userData) {
          const cached = JSON.parse(localStorage.getItem('gs_fb_profiles') || '{}');
          if (cached[fbUser.uid]) {
            userData = cached[fbUser.uid];
          }
        }

        // 3. Last resort: build profile from Firebase Auth data
        if (!userData) {
          userData = {
            id: fbUser.uid,
            username: fbUser.displayName || trimUser,
            role: 'user',
            profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }

        const idToken = await fbUser.getIdToken();
        return { token: idToken, user: userData };
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

      // Regular user — restore from Firebase Auth session + Firestore profile
      const currentFBUser = await waitForFirebaseUser();
      if (!currentFBUser) throw new Error('Not authenticated');

      // Try Firestore first, fall back to locally cached profile
      try {
        const userDocSnap = await getDoc(doc(db, 'users', currentFBUser.uid));
        if (userDocSnap.exists()) return { user: userDocSnap.data() };
      } catch (e) {
        console.warn('[Auth] Firestore profile read failed, checking local fallback.', e.message);
      }

      // Fallback: check locally cached profile (saved when Firestore write failed)
      const cached = JSON.parse(localStorage.getItem('gs_fb_profiles') || '{}');
      if (cached[currentFBUser.uid]) return { user: cached[currentFBUser.uid] };

      // Last resort: build minimal profile from Firebase Auth data
      return {
        user: {
          id: currentFBUser.uid,
          username: currentFBUser.displayName || currentFBUser.email?.split('@')[0] || 'User',
          role: 'user',
          profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
          created_at: currentFBUser.metadata?.creationTime || new Date().toISOString()
        }
      };
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
      // Register with Firebase Auth — username is stored as username@gs-granites.app internally
      const username = formData.get('username');
      const password = formData.get('password');
      const profileImageFile = formData.get('profile_image');

      let profile_image_url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop';
      if (profileImageFile && profileImageFile.name) {
        profile_image_url = await convertImageToBase64(profileImageFile);
      }

      const fakeEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, '_')}@gs-granites.app`;
      let firebaseCredential;
      try {
        firebaseCredential = await createUserWithEmailAndPassword(auth, fakeEmail, password);
      } catch (firebaseErr) {
        if (firebaseErr.code === 'auth/email-already-in-use') {
          throw new Error('Username is already taken.');
        }
        throw new Error(firebaseErr.message || 'Registration failed. Please try again.');
      }

      await updateProfile(firebaseCredential.user, { displayName: username });

      const newUser = {
        id: firebaseCredential.user.uid,
        username,
        role: 'user',
        profile_image: profile_image_url,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      // Store user profile in Firestore for cross-device retrieval
      // Non-fatal: if Firestore rules block write, Firebase Auth user is still created
      try {
        await setDoc(doc(db, 'users', firebaseCredential.user.uid), newUser);
        console.log('[Auth] User profile saved to Firestore:', firebaseCredential.user.uid);
      } catch (firestoreErr) {
        console.warn('[Auth] Firestore profile write failed (check Firestore rules). User is still registered in Firebase Auth.', firestoreErr.message);
        // Store minimal profile locally as fallback until Firestore rules are fixed
        const stored = JSON.parse(localStorage.getItem('gs_fb_profiles') || '{}');
        stored[firebaseCredential.user.uid] = newUser;
        localStorage.setItem('gs_fb_profiles', JSON.stringify(stored));
      }

      const idToken = await firebaseCredential.user.getIdToken();
      return {
        message: 'Registration successful',
        token: idToken,
        user: newUser
      };
    }
  },

  // AUTH — Google Sign-In (always uses Firebase, works online + offline)
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    let credential;
    try {
      credential = await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        throw new Error('Google sign-in was cancelled.');
      }
      if (err.code === 'auth/unauthorized-domain') {
        throw new Error(
          'Google sign-in is not authorized for this domain. ' +
          'Please add "charan-reddy96.github.io" to Firebase Console → Authentication → Authorized Domains.'
        );
      }
      throw new Error(err.message || 'Google sign-in failed.');
    }

    const firebaseUser = credential.user;
    const userDocRef = doc(db, 'users', firebaseUser.uid);

    // Check if user profile already exists in Firestore
    let userProfile;
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        userProfile = snap.data();
      } else {
        // New Google user — create profile from Google account data
        userProfile = {
          id: firebaseUser.uid,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: 'user',
          profile_image: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
          email: firebaseUser.email,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        try {
          await setDoc(userDocRef, userProfile);
          console.log('[Auth] Google user profile saved to Firestore:', firebaseUser.uid);
        } catch (fsErr) {
          console.warn('[Auth] Firestore write failed for Google user.', fsErr.message);
          // Cache locally as fallback
          const stored = JSON.parse(localStorage.getItem('gs_fb_profiles') || '{}');
          stored[firebaseUser.uid] = userProfile;
          localStorage.setItem('gs_fb_profiles', JSON.stringify(stored));
        }
      }
    } catch (fsReadErr) {
      // Firestore read failed — build profile from Firebase Auth data
      console.warn('[Auth] Firestore read failed for Google user.', fsReadErr.message);
      userProfile = {
        id: firebaseUser.uid,
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'user',
        profile_image: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
        email: firebaseUser.email,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
    }

    const idToken = await firebaseUser.getIdToken();
    return { token: idToken, user: userProfile };
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
      // Standalone / GitHub Pages — read all products from Firestore
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
      if (filters.min_price || filters.max_price) {
        const minF = filters.min_price ? parseFloat(filters.min_price) : null;
        const maxF = filters.max_price ? parseFloat(filters.max_price) : null;
        
        results = results.filter(p => {
          if (!p.price) return false;
          const matches = String(p.price).match(/\d+(\.\d+)?/g);
          if (!matches || matches.length === 0) return false;
          
          const numbers = matches.map(Number);
          const pMin = Math.min(...numbers);
          const pMax = Math.max(...numbers);
          
          if (minF !== null && !isNaN(minF) && pMax < minF) return false;
          if (maxF !== null && !isNaN(maxF) && pMin > maxF) return false;
          return true;
        });
      }
      if (filters.featured) {
        results = results.filter(p => p.featured === true || p.featured === 'true');
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
        imageUrl = await convertImageToBase64(imageFile);
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
        imageUrl = await convertImageToBase64(imageFile);
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
      let prodName = 'General Inquiry';
      let prodCat = null;

      if (inquiryData.product_id && inquiryData.product_id !== 'general') {
        try {
          const docRef = doc(db, PRODUCTS_COLLECTION, inquiryData.product_id);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const prod = snap.data();
            prodName = prod.name;
            prodCat = prod.category;
          }
        } catch (e) {
          console.error("Error retrieving product for inquiry:", e);
        }
      }

      const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
        name: inquiryData.name,
        phone: inquiryData.phone,
        email: inquiryData.email,
        product_id: inquiryData.product_id === 'general' ? null : inquiryData.product_id,
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

  // Real-time inquiry listener — calls callback(inquiries[]) whenever Firestore changes
  // Returns an unsubscribe function. Use this in the Admin Dashboard.
  subscribeToInquiries: (callback) => {
    const q = query(
      collection(db, INQUIRIES_COLLECTION),
      orderBy('created_at', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const inquiries = snapshot.docs.map(d => {
        const data = d.data();
        const ts = data.created_at;
        const created_at = ts && ts.toDate
          ? ts.toDate().toISOString().replace('T', ' ').substring(0, 19)
          : (ts || new Date().toISOString().replace('T', ' ').substring(0, 19));
        return { ...data, id: d.id, created_at };
      });
      callback(inquiries);
    }, (err) => {
      console.error('[Firestore] Real-time inquiry subscription error:', err.message);
    });
    return unsub;
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
