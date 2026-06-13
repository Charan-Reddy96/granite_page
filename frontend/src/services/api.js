// API Service that handles server integration and local mock database fallback
// enabling full interactive functionality on static environments like GitHub Pages.

const isGitHubPages = window.location.hostname.includes('github.io');
const API_BASE = ''; // proxied via Vite config locally

// Seed data for standalone mode (16 items)
const defaultSeedProducts = [
  {
    id: 1,
    name: "Tan Brown Granite",
    category: "Granite",
    color: "Brown",
    price: 70,
    availability: "In Stock",
    description: "Dark black-brown background with large, chocolate-brown and bronze mineral crystals. Highly unique leathered texture.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 70\"",
    finish: "Leathered",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&auto=format&fit=crop"]
  },
  {
    id: 2,
    name: "Absolute Black Granite",
    category: "Granite",
    color: "Black",
    price: 220,
    availability: "In Stock",
    description: "Deep black solid granite texture. Elegant choice for premium heavy-duty kitchen countertops.",
    featured: true,
    thickness: "2cm",
    dimensions: "118\" x 70\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop"]
  },
  {
    id: 3,
    name: "Rose Pearl Granite",
    category: "Granite",
    color: "Pink",
    price: 95,
    availability: "In Stock",
    description: "Delicate rose-colored minerals embedded in clean quartz. Brings soft warmth to decorative architecture.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 72\"",
    finish: "Honed",
    images: ["https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500&auto=format&fit=crop"]
  },
  {
    id: 4,
    name: "Black Galaxy Granite",
    category: "Granite",
    color: "Black",
    price: 240,
    availability: "In Stock",
    description: "Stunning black granite with golden and white specks. Perfect for premium countertops and accent walls.",
    featured: true,
    thickness: "3cm",
    dimensions: "126\" x 74\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop"]
  },
  {
    id: 5,
    name: "Black Pearl Granite",
    category: "Granite",
    color: "Black",
    price: 150,
    availability: "In Stock",
    description: "Deep dark granite with subtle metallic silver mineral pearls, highly resistant and durable surface.",
    featured: false,
    thickness: "2cm",
    dimensions: "115\" x 68\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop"]
  },
  {
    id: 6,
    name: "Blue Granite",
    category: "Granite",
    color: "Blue",
    price: 85,
    availability: "In Stock",
    description: "Vibrant blue reflections on slate-grey base stone. Extremely beautiful and modern accent cladding.",
    featured: false,
    thickness: "2cm",
    dimensions: "115\" x 68\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=500&auto=format&fit=crop"]
  },
  {
    id: 7,
    name: "Sierra Pearl Granite",
    category: "Granite",
    color: "Grey",
    price: 105,
    availability: "In Stock",
    description: "Classic grey stone dotted with quartz pearls. Highly recommended for commercial lobby flooring.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 70\"",
    finish: "Leathered",
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&auto=format&fit=crop"]
  },
  {
    id: 8,
    name: "Sadarahalli White Granite",
    category: "Granite",
    color: "White",
    price: 90,
    availability: "In Stock",
    description: "Renowned Sadarahalli white granite, featuring balanced grey salt-and-pepper mineral patterns.",
    featured: false,
    thickness: "2cm",
    dimensions: "122\" x 72\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop"]
  },
  {
    id: 9,
    name: "Coffee Brown Granite",
    category: "Granite",
    color: "Brown",
    price: 110,
    availability: "In Stock",
    description: "Warm brown coffee-toned natural stone. Exudes luxurious comfort for residential designs.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 70\"",
    finish: "Honed",
    images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop"]
  },
  {
    id: 10,
    name: "Hassan Green Granite",
    category: "Granite",
    color: "Green",
    price: 135,
    availability: "In Stock",
    description: "Traditional premium Hassan green granite. Smooth, weather-resistant, perfect for landmarks and outdoors.",
    featured: false,
    thickness: "2cm",
    dimensions: "120\" x 70\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&auto=format&fit=crop"]
  },
  {
    id: 11,
    name: "4x2 Premium Vitrified Tiles",
    category: "Tile",
    color: "White",
    price: 950,
    availability: "In Stock",
    description: "Stunning high-gloss 4' x 2' vitrified floor tiles. Box pack covers multiple pieces.",
    featured: true,
    dimensions: "4' x 2'",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop"]
  },
  {
    id: 12,
    name: "2x2 Classic Vitrified Tiles",
    category: "Tile",
    color: "White",
    price: 800,
    availability: "In Stock",
    description: "Durable 2' x 2' satin-finish vitrified floor tiles. Convenient box packaging.",
    featured: false,
    dimensions: "2' x 2'",
    finish: "Matte",
    images: ["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=500&auto=format&fit=crop"]
  },
  {
    id: 13,
    name: "18x12 Decorative Wall Tiles",
    category: "Tile",
    color: "Gold",
    price: 450,
    availability: "In Stock",
    description: "Exquisite 18\" x 12\" ceramic wall tiles. Perfect for bathrooms and kitchen backsplashes.",
    featured: false,
    dimensions: "18\" x 12\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&auto=format&fit=crop"]
  },
  {
    id: 14,
    name: "16x16 Heavy Duty Floor Tiles",
    category: "Tile",
    color: "Grey",
    price: 550,
    availability: "In Stock",
    description: "Rustic 16\" x 16\" non-slip parking and floor tiles. Durable, heavy-traffic resistance.",
    featured: false,
    dimensions: "16\" x 16\"",
    finish: "Matte",
    images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop"]
  },
  {
    id: 15,
    name: "5x2.5 Large Format Slab Tiles",
    category: "Tile",
    color: "Blue",
    price: 2450,
    availability: "In Stock",
    description: "Magnificent large-format 5' x 2.5' vitrified slab tiles. Gives seamless marble-like look.",
    featured: false,
    dimensions: "5' x 2.5'",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=500&auto=format&fit=crop"]
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
  if (!parsed.some(item => item.name === 'Sierra Pearl Granite')) {
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
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200); // 1.2s timeout
    const res = await fetch(`${API_BASE}/api/products?featured=true`, { signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch (e) {
    return false;
  }
}

export const api = {
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
      
      const res = await fetch(`${API_BASE}/api/products?${queryParams.toString()}`);
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
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    } else {
      const products = getLocalProducts();
      const product = products.find(p => p.id === parseInt(id));
      if (!product) throw new Error("Product not found");
      return product;
    }
  },

  createProduct: async (formData) => {
    const isOnline = await checkServer();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        body: formData // Form data with file
      });
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
      const imageUrl = formData.get('imageUrl') || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop';

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
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        body: formData
      });
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
      const imageUrl = formData.get('imageUrl');

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
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    } else {
      let products = getLocalProducts();
      products = products.filter(p => p.id !== parseInt(id));
      setLocalProducts(products);
      return { message: "Product deleted successfully" };
    }
  },

  // 2. INQUIRIES API
  submitInquiry: async (inquiryData) => {
    const isOnline = await checkServer();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
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
      const res = await fetch(`${API_BASE}/api/inquiries`);
      return res.json();
    } else {
      return getLocalInquiries().reverse(); // Show newest first
    }
  },

  updateInquiryStatus: async (id, status) => {
    const isOnline = await checkServer();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
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
      const res = await fetch(`${API_BASE}/api/inquiries/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    } else {
      let inquiries = getLocalInquiries();
      inquiries = inquiries.filter(i => i.id !== parseInt(id));
      setLocalInquiries(inquiries);
      return { message: "Inquiry deleted successfully" };
    }
  }
};
