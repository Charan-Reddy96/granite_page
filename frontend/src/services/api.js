// API Service that handles server integration and local mock database fallback
// enabling full interactive functionality on static environments like GitHub Pages.

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

// LocalStorage helpers
const getLocalProducts = () => {
  const p = localStorage.getItem('aura_products');
  if (!p) {
    localStorage.setItem('aura_products', JSON.stringify(defaultSeedProducts));
    return defaultSeedProducts;
  }
  let parsed = JSON.parse(p);
  const featuredCount = parsed.filter(item => item.featured).length;
  // Clear and re-seed if the image for id: 2 is not the new black granite close-up texture
  const tanBrown = parsed.find(item => item.id === 1);
  const blackGranite = parsed.find(item => item.id === 2);
  const rosyPink = parsed.find(item => item.id === 3);
  const blackGalaxy = parsed.find(item => item.id === 4);
  const blackPearl = parsed.find(item => item.id === 5);
  const blueGranite = parsed.find(item => item.id === 6);
  const sierraPearl = parsed.find(item => item.id === 7);
  const sadaliWhite = parsed.find(item => item.id === 8);
  const coffeeBrown = parsed.find(item => item.id === 9);
  const steelBlack = parsed.find(item => item.id === 10);
  const tiles4x2 = parsed.find(item => item.id === 11);
  const tiles2x2 = parsed.find(item => item.id === 12);
  const tiles18x12 = parsed.find(item => item.id === 13);
  const tiles16x16 = parsed.find(item => item.id === 14);
  const tiles8x2_5 = parsed.find(item => item.id === 15);
  const hasNewTanBrown = tanBrown && tanBrown.images && tanBrown.images[0] && tanBrown.images[0].includes('tan_brown_granite.png');
  const hasNewImages = blackGranite && blackGranite.images && blackGranite.images[0] && blackGranite.images[0].includes('black_granite.png');
  const hasNewRosy = rosyPink && rosyPink.images && rosyPink.images[0] && rosyPink.images[0].includes('rosy_pink_granite.png');
  const hasNewGalaxy = blackGalaxy && blackGalaxy.images && blackGalaxy.images[0] && blackGalaxy.images[0].includes('black_galaxy_granite_v2.png');
  const hasNewPearl = blackPearl && blackPearl.images && blackPearl.images[0] && blackPearl.images[0].includes('black_pearl_granite.png');
  const hasNewBlue = blueGranite && blueGranite.images && blueGranite.images[0] && blueGranite.images[0].includes('blue_granite.png');
  const hasNewSierra = sierraPearl && sierraPearl.images && sierraPearl.images[0] && sierraPearl.images[0].includes('sierra_pearl_granite.png');
  const hasNewSadali = sadaliWhite && sadaliWhite.images && sadaliWhite.images[0] && sadaliWhite.images[0].includes('sadali_white_granite.png');
  const hasNewCoffee = coffeeBrown && coffeeBrown.images && coffeeBrown.images[0] && coffeeBrown.images[0].includes('coffee_brown_granite.png');
  const hasNewSteel = steelBlack && steelBlack.images && steelBlack.images[0] && steelBlack.images[0].includes('steel_black_granite.png');
  const hasNewTiles4x2 = tiles4x2 && tiles4x2.images && tiles4x2.images[0] && tiles4x2.images[0].includes('tiles_4x2.png');
  const hasNewTiles2x2 = tiles2x2 && tiles2x2.images && tiles2x2.images[0] && tiles2x2.images[0].includes('tiles_2x2.png');
  const hasNewTiles18x12 = tiles18x12 && tiles18x12.images && tiles18x12.images[0] && tiles18x12.images[0].includes('tiles_18x12.png');
  const hasNewTiles16x16 = tiles16x16 && tiles16x16.images && tiles16x16.images[0] && tiles16x16.images[0].includes('tiles_16x16.png');
  const hasNewTiles8x2_5 = tiles8x2_5 && tiles8x2_5.images && tiles8x2_5.images[0] && tiles8x2_5.images[0].includes('tiles_8x2_5.png');
  if (!parsed.some(item => item.name === 'Steel Black Granite') || featuredCount < 4 || !hasNewTanBrown || !hasNewImages || !hasNewRosy || !hasNewGalaxy || !hasNewPearl || !hasNewBlue || !hasNewSierra || !hasNewSadali || !hasNewCoffee || !hasNewSteel || !hasNewTiles4x2 || !hasNewTiles2x2 || !hasNewTiles18x12 || !hasNewTiles16x16 || !hasNewTiles8x2_5) {
    localStorage.setItem('aura_products', JSON.stringify(defaultSeedProducts));
    return defaultSeedProducts;
  }
  return parsed;
};

const setLocalProducts = (products) => {
  localStorage.setItem('aura_products', JSON.stringify(products));
};

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

  // 1. PRODUCTS API
  getProducts: async (filters = {}) => {
    const isOnline = await checkServer();
    if (isOnline) {
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
      // Mock Filtering
      let results = getLocalProducts();

      if (filters.category) {
        results = results.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.q) {
        const query = filters.q.toLowerCase();
        results = results.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.color.toLowerCase().includes(query)
        );
      }
      if (filters.color) {
        results = results.filter(p => p.color.toLowerCase() === filters.color.toLowerCase());
      }
      if (filters.finish) {
        results = results.filter(p => p.finish.toLowerCase() === filters.finish.toLowerCase());
      }
      if (filters.min_price) {
        results = results.filter(p => p.price >= parseFloat(filters.min_price));
      }
      if (filters.max_price) {
        results = results.filter(p => p.price <= parseFloat(filters.max_price));
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
      const res = await fetchWithTimeout(`${API_BASE}/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    } else {
      const products = getLocalProducts();
      const product = products.find(p => p.id.toString() === id.toString());
      if (!product) throw new Error("Product not found");
      return product;
    }
  },

  createProduct: async (formData) => {
    const isOnline = await checkServer();
    if (isOnline) {
      const res = await fetchWithTimeout(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: formData // Form data with file
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create product');
      }
      return res.json();
    } else {
      // Mock Create Product
      const name = formData.get('name');
      const category = formData.get('category');
      const color = formData.get('color');
      const price = parseFloat(formData.get('price'));
      const availability = formData.get('availability') || 'In Stock';
      const description = formData.get('description') || '';
      const featured = formData.get('featured') === 'true';
      const thickness = formData.get('thickness');
      const dimensions = formData.get('dimensions');
      const finish = formData.get('finish');
      const coverage = formData.get('coverage');
      const size = formData.get('size');

      const imageFile = formData.get('images');
      let imageUrl = formData.get('imageUrl') || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop';

      if (imageFile && imageFile.name) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      const products = getLocalProducts();
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

      const newProduct = {
        id: newId,
        name,
        category,
        color,
        price,
        availability,
        description,
        featured,
        thickness,
        dimensions,
        finish,
        coverage,
        size,
        images: [imageUrl]
      };

      products.push(newProduct);
      setLocalProducts(products);
      return newProduct;
    }
  },

  updateProduct: async (id, formData) => {
    const isOnline = await checkServer();
    if (isOnline) {
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
      // Mock Update Product
      const products = getLocalProducts();
      const index = products.findIndex(p => p.id === parseInt(id));
      if (index === -1) throw new Error("Product not found");

      const name = formData.get('name');
      const category = formData.get('category');
      const color = formData.get('color');
      const price = parseFloat(formData.get('price'));
      const availability = formData.get('availability');
      const description = formData.get('description');
      const featured = formData.get('featured') === 'true';
      const thickness = formData.get('thickness');
      const dimensions = formData.get('dimensions');
      const finish = formData.get('finish');
      const coverage = formData.get('coverage');
      const size = formData.get('size');

      const imageFile = formData.get('images');
      let imageUrl = formData.get('imageUrl');

      if (imageFile && imageFile.name) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      products[index] = {
        ...products[index],
        name: name || products[index].name,
        category: category || products[index].category,
        color: color || products[index].color,
        price: !isNaN(price) ? price : products[index].price,
        availability: availability || products[index].availability,
        description: description !== null ? description : products[index].description,
        featured: featured,
        thickness: thickness !== undefined ? thickness : products[index].thickness,
        dimensions: dimensions !== undefined ? dimensions : products[index].dimensions,
        finish: finish !== undefined ? finish : products[index].finish,
        coverage: coverage !== undefined ? coverage : products[index].coverage,
        size: size !== undefined ? size : products[index].size,
        images: imageUrl ? [imageUrl] : products[index].images
      };

      setLocalProducts(products);
      return products[index];
    }
  },

  deleteProduct: async (id) => {
    const isOnline = await checkServer();
    if (isOnline) {
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
      let products = getLocalProducts();
      const index = products.findIndex(p => p.id.toString() === id.toString());
      if (index !== -1) {
        products.splice(index, 1);
        setLocalProducts(products);
      }
      return { message: "Product deleted successfully" };
    }
  },

  // 2. INQUIRIES API
  submitInquiry: async (inquiryData) => {
    const isOnline = await checkServer();
    if (isOnline) {
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
      const inquiries = getLocalInquiries();
      const products = getLocalProducts();

      const newId = inquiries.length > 0 ? Math.max(...inquiries.map(i => i.id)) + 1 : 1;
      let prodName = "General Inquiry";
      let prodCat = null;

      if (inquiryData.product_id && inquiryData.product_id !== 'general') {
        const prod = products.find(p => p.id === parseInt(inquiryData.product_id));
        if (prod) {
          prodName = prod.name;
          prodCat = prod.category;
        }
      }

      const newInquiry = {
        id: newId,
        name: inquiryData.name,
        phone: inquiryData.phone,
        email: inquiryData.email,
        product_id: inquiryData.product_id === 'general' ? null : parseInt(inquiryData.product_id),
        product_name: prodName,
        product_category: prodCat,
        message: inquiryData.message,
        status: "New",
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      inquiries.push(newInquiry);
      setLocalInquiries(inquiries);
      return newInquiry;
    }
  },

  getInquiries: async () => {
    const isOnline = await checkServer();
    if (isOnline) {
      const res = await fetchWithTimeout(`${API_BASE}/api/inquiries`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch inquiries');
      }
      return res.json();
    } else {
      return getLocalInquiries().reverse(); // Show newest first
    }
  },

  updateInquiryStatus: async (id, status) => {
    const isOnline = await checkServer();
    if (isOnline) {
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
      const inquiries = getLocalInquiries();
      const index = inquiries.findIndex(i => i.id === parseInt(id));
      if (index === -1) throw new Error("Inquiry not found");
      inquiries[index].status = status;
      setLocalInquiries(inquiries);
      return inquiries[index];
    }
  },

  deleteInquiry: async (id) => {
    const isOnline = await checkServer();
    if (isOnline) {
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
      let inquiries = getLocalInquiries();
      inquiries = inquiries.filter(i => i.id.toString() !== id.toString());
      setLocalInquiries(inquiries);
      return { message: "Inquiry deleted successfully" };
    }
  }
};
