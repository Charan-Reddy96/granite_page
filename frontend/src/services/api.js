// API Service that handles server integration and local mock database fallback
// enabling full interactive functionality on static environments like GitHub Pages.

const isGitHubPages = window.location.hostname.includes('github.io');
const API_BASE = ''; // proxied via Vite config locally

// Seed data for standalone mode (16 items)
const defaultSeedProducts = [
  {
    id: 1,
    name: "Black Galaxy Granite",
    category: "Granite",
    color: "Black",
    price: 380,
    availability: "In Stock",
    description: "Stunning black granite with golden and white specks. Perfect for premium countertops and accent walls.",
    featured: true,
    thickness: "3cm",
    dimensions: "126\" x 74\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop"]
  },
  {
    id: 2,
    name: "Imperial White Granite",
    category: "Granite",
    color: "White",
    price: 320,
    availability: "In Stock",
    description: "Graceful white granite with light grey and burgundy waves. Elegant choice for kitchens.",
    featured: true,
    thickness: "2cm",
    dimensions: "118\" x 70\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop"]
  },
  {
    id: 3,
    name: "Kashmir Gold Granite",
    category: "Granite",
    color: "Gold",
    price: 420,
    availability: "Low Stock",
    description: "Warm golden-yellow background with sandy waves. Brings cozy luxury to your spaces.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 72\"",
    finish: "Honed",
    images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&auto=format&fit=crop"]
  },
  {
    id: 4,
    name: "Steel Grey Granite",
    category: "Granite",
    color: "Grey",
    price: 310,
    availability: "In Stock",
    description: "Durable steel grey granite slab from India, excellent for commercial heavy-traffic flooring, vanity tops, and durable kitchen countertops.",
    featured: false,
    thickness: "2cm",
    dimensions: "122\" x 72\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1527380907441-615c3757c30e?w=500&auto=format&fit=crop"]
  },
  {
    id: 5,
    name: "Tan Brown Granite",
    category: "Granite",
    color: "Brown",
    price: 340,
    availability: "In Stock",
    description: "Dark black-brown background with large, chocolate-brown and bronze mineral crystals. Highly unique leathered texture.",
    featured: false,
    thickness: "3cm",
    dimensions: "120\" x 70\"",
    finish: "Leathered",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&auto=format&fit=crop"]
  },
  {
    id: 6,
    name: "Blue Pearl Granite",
    category: "Granite",
    color: "Blue",
    price: 480,
    availability: "In Stock",
    description: "Exclusive Norwegian blue granite with reflective metallic blue crystals. Elegant, shimmering surface finish.",
    featured: false,
    thickness: "2cm",
    dimensions: "115\" x 68\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=500&auto=format&fit=crop"]
  },
  {
    id: 7,
    name: "Carrara Marble Tile",
    category: "Tile",
    color: "White",
    price: 180,
    availability: "In Stock",
    description: "Classic Italian Carrara marble tiles, suitable for bathroom floors, showers, and backsplash.",
    featured: true,
    thickness: "1cm",
    dimensions: "12\" x 24\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=500&auto=format&fit=crop"]
  },
  {
    id: 8,
    name: "Slate Grey Tile",
    category: "Tile",
    color: "Grey",
    price: 95,
    availability: "In Stock",
    description: "Natural slate tiles with structured matte surface, perfect for outdoor patios or rustic indoor floors.",
    featured: false,
    thickness: "1.2cm",
    dimensions: "16\" x 16\"",
    finish: "Matte",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop"]
  },
  {
    id: 9,
    name: "Travertine Gold Tile",
    category: "Tile",
    color: "Gold",
    price: 160,
    availability: "In Stock",
    description: "Natural beige-gold travertine floor tiles, perfect for warm, luxurious bathroom walls and pool deck border cladding.",
    featured: false,
    thickness: "1.5cm",
    dimensions: "18\" x 18\"",
    finish: "Honed",
    images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop"]
  },
  {
    id: 10,
    name: "Terrazzo White Tile",
    category: "Tile",
    color: "White",
    price: 120,
    availability: "Low Stock",
    description: "Modern terrazzo tiles with colorful quartz, granite, and marble chips embedded. Playful yet highly durable for public lobbies.",
    featured: false,
    thickness: "1.2cm",
    dimensions: "24\" x 24\"",
    finish: "Matte",
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&auto=format&fit=crop"]
  },
  {
    id: 11,
    name: "Emerald Ceramic Subway Tile",
    category: "Tile",
    color: "Green",
    price: 75,
    availability: "In Stock",
    description: "Vibrant emerald green glossy glazed ceramic tiles. Excellent for decorative backsplashes and feature walls.",
    featured: false,
    thickness: "0.8cm",
    dimensions: "3\" x 6\"",
    finish: "Polished",
    images: ["https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&auto=format&fit=crop"]
  },
  {
    id: 12,
    name: "Royal Velvet Interior Paint",
    category: "Paint",
    color: "Blue",
    price: 280,
    availability: "In Stock",
    description: "Premium washproof interior paint in deep royal blue. Extremely high opacity with a luxurious feel.",
    featured: true,
    finish: "Matte",
    coverage: "120-150 sq.ft/litre",
    size: "1 Litre",
    images: ["https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop"]
  },
  {
    id: 13,
    name: "Golden Sand Satin Paint",
    category: "Paint",
    color: "Gold",
    price: 240,
    availability: "In Stock",
    description: "Light warm sand paint with a gentle satin sheen. Highly cleanable and long-lasting paint.",
    featured: false,
    finish: "Satin",
    coverage: "150 sq.ft/litre",
    size: "1 Litre",
    images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop"]
  },
  {
    id: 14,
    name: "Emerald Forest Satin Paint",
    category: "Paint",
    color: "Green",
    price: 260,
    availability: "In Stock",
    description: "Sleek satin wall paint in deep forest green. Perfect for accent doors, cabinetry, and sophisticated study rooms.",
    featured: false,
    finish: "Satin",
    coverage: "140 sq.ft/litre",
    size: "1 Litre",
    images: ["https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=500&auto=format&fit=crop"]
  },
  {
    id: 15,
    name: "Mist Grey Exterior Paint",
    category: "Paint",
    color: "Grey",
    price: 290,
    availability: "In Stock",
    description: "Heavy-duty weather protection exterior paint in cool mist grey. Resist algae, moisture, and fading.",
    featured: false,
    finish: "Matte",
    coverage: "110-130 sq.ft/litre",
    size: "1 Litre",
    images: ["https://images.unsplash.com/photo-1500336624523-d727130c3328?w=500&auto=format&fit=crop"]
  },
  {
    id: 16,
    name: "Coral Blush Interior Paint",
    category: "Paint",
    color: "Red",
    price: 230,
    availability: "In Stock",
    description: "Warm coral pink shade with a subtle satin glow. Ideal choice for nursery rooms and playful modern accent walls.",
    featured: false,
    finish: "Satin",
    coverage: "150 sq.ft/litre",
    size: "1 Litre",
    images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop"]
  }
];

// LocalStorage helpers
const getLocalProducts = () => {
  const p = localStorage.getItem('aura_products');
  if (!p) {
    localStorage.setItem('aura_products', JSON.stringify(defaultSeedProducts));
    return defaultSeedProducts;
  }
  return JSON.parse(p);
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
