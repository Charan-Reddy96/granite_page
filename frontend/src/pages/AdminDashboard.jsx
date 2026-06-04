import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Mail, CheckCircle2, Phone, AlertCircle, Upload, Archive } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'inquiries'
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  
  // Product Form State
  const [editingId, setEditingId] = useState(null); // null means adding new
  const [formData, setFormData] = useState({
    name: '',
    category: 'Granite', // default
    color: '',
    price: '',
    availability: 'In Stock',
    description: '',
    featured: false,
    thickness: '',
    dimensions: '',
    finish: 'Polished',
    coverage: '',
    size: '',
    imageUrl: '' // manual url fallback
  });
  const [imageFile, setImageFile] = useState(null);
  const [productMessage, setProductMessage] = useState(null);
  
  useEffect(() => {
    fetchProducts();
    fetchInquiries();
  }, []);

  const fetchProducts = () => {
    api.getProducts()
      .then(data => setProducts(data))
      .catch(err => console.error("Error loading products:", err));
  };

  const fetchInquiries = () => {
    api.getInquiries()
      .then(data => setInquiries(data))
      .catch(err => console.error("Error loading inquiries:", err));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const resetForm = () => {
    setEditingId(null);
    setImageFile(null);
    setFormData({
      name: '',
      category: 'Granite',
      color: '',
      price: '',
      availability: 'In Stock',
      description: '',
      featured: false,
      thickness: '',
      dimensions: '',
      finish: 'Polished',
      coverage: '',
      size: '',
      imageUrl: ''
    });
    // Reset file input element
    const fileInput = document.getElementById('imageFileInput');
    if (fileInput) fileInput.value = '';
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductMessage(null);

    // We build form-data because of files
    const sendData = new FormData();
    sendData.append('name', formData.name);
    sendData.append('category', formData.category);
    sendData.append('color', formData.color);
    sendData.append('price', formData.price);
    sendData.append('availability', formData.availability);
    sendData.append('description', formData.description);
    sendData.append('featured', formData.featured);
    sendData.append('imageUrl', formData.imageUrl);

    // Contextual categories fields
    if (formData.category !== 'Paint') {
      sendData.append('thickness', formData.thickness);
      sendData.append('dimensions', formData.dimensions);
      sendData.append('finish', formData.finish);
    } else {
      sendData.append('finish', formData.finish);
      sendData.append('coverage', formData.coverage);
      sendData.append('size', formData.size);
    }

    if (imageFile) {
      sendData.append('images', imageFile);
    }

    try {
      if (editingId) {
        await api.updateProduct(editingId, sendData);
        setProductMessage({ type: 'success', text: 'Product updated successfully.' });
      } else {
        await api.createProduct(sendData);
        setProductMessage({ type: 'success', text: 'Product created successfully.' });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setProductMessage({ type: 'error', text: 'Failed to submit product details.' });
    }
  };

  const handleEditInit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      category: product.category || 'Granite',
      color: product.color || '',
      price: product.price || '',
      availability: product.availability || 'In Stock',
      description: product.description || '',
      featured: product.featured || false,
      thickness: product.thickness || '',
      dimensions: product.dimensions || '',
      finish: product.finish || 'Polished',
      coverage: product.coverage || '',
      size: product.size || '',
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : ''
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      await api.updateInquiryStatus(id, status);
      fetchInquiries();
    } catch (err) {
      console.error(err);
      alert("Failed to update inquiry status.");
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry record?")) return;

    try {
      await api.deleteInquiry(id);
      setInquiries(inquiries.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete inquiry.");
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="serif-title" style={{ fontSize: '36px' }}>Store Administration</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Manage granite, tiles, paints inventory and review client requests.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="glass" style={{ display: 'flex', padding: '4px', borderRadius: 'var(--border-radius-md)' }}>
          <button 
            onClick={() => setActiveTab('products')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeTab === 'products' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'products' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all var(--transition-normal)'
            }}
          >
            Manage Products ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeTab === 'inquiries' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'inquiries' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all var(--transition-normal)'
            }}
          >
            Customer Inquiries ({inquiries.length})
          </button>
        </div>
      </div>

      {/* --- TAB CONTENT: PRODUCTS --- */}
      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Column: Form to Add/Edit */}
          <div className="glass" style={{ padding: '30px', borderRadius: 'var(--border-radius-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {editingId ? <Edit2 size={20} color="var(--accent-gold)" /> : <Plus size={20} color="var(--accent-gold)" />}
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Fill in product info. The forms adjust details automatically depending on your category choice.
            </p>

            {productMessage && (
              <div style={{
                backgroundColor: productMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${productMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                color: productMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                padding: '10px 14px',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '13px',
                marginBottom: '20px'
              }}>
                {productMessage.text}
              </div>
            )}

            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Product Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Product Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  placeholder="e.g. Italian Calacatta Marble" 
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Category & Color row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category *</label>
                  <select 
                    name="category" 
                    className="form-control"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Granite">Granite</option>
                    <option value="Tile">Tiles</option>
                    <option value="Paint">Paints</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Color *</label>
                  <input 
                    type="text" 
                    name="color" 
                    required
                    placeholder="e.g. White, Gold" 
                    className="form-control"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Price & Availability row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Price per Unit (₹) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    name="price" 
                    required
                    placeholder={formData.category === 'Paint' ? 'e.g. 280.00 (per litre)' : 'e.g. 180.00 (per sqft)'} 
                    className="form-control"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Availability Status</label>
                  <select 
                    name="availability" 
                    className="form-control"
                    value={formData.availability}
                    onChange={handleInputChange}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* DYNAMIC CATEGORY FIELDS */}
              {formData.category !== 'Paint' ? (
                /* Granite or Tile Specs */
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Thickness</label>
                    <input 
                      type="text" 
                      name="thickness" 
                      placeholder="e.g. 3cm, 1.2cm" 
                      className="form-control"
                      value={formData.thickness}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Dimensions</label>
                    <input 
                      type="text" 
                      name="dimensions" 
                      placeholder='e.g. 120" x 74"' 
                      className="form-control"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Finish</label>
                    <select 
                      name="finish" 
                      className="form-control"
                      value={formData.finish}
                      onChange={handleInputChange}
                    >
                      <option value="Polished">Polished</option>
                      <option value="Honed">Honed</option>
                      <option value="Matte">Matte</option>
                      <option value="Leathered">Leathered</option>
                    </select>
                  </div>
                </div>
              ) : (
                /* Paint Specs */
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Finish</label>
                    <select 
                      name="finish" 
                      className="form-control"
                      value={formData.finish}
                      onChange={handleInputChange}
                    >
                      <option value="Matte">Matte</option>
                      <option value="Satin">Satin</option>
                      <option value="Gloss">Gloss</option>
                      <option value="Semi-Gloss">Semi-Gloss</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Coverage</label>
                    <input 
                      type="text" 
                      name="coverage" 
                      placeholder="e.g. 400 sq.ft" 
                      className="form-control"
                      value={formData.coverage}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Size</label>
                    <input 
                      type="text" 
                      name="size" 
                      placeholder="e.g. 1 Gallon" 
                      className="form-control"
                      value={formData.size}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea 
                  name="description" 
                  placeholder="Detail slab origins, design highlights..." 
                  className="form-control"
                  style={{ minHeight: '80px' }}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Image Upload Input */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Product Image File</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="file" 
                    id="imageFileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="imageFileInput"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                    <Upload size={14} /> {imageFile ? 'Change File' : 'Select Image File'}
                  </label>
                  {imageFile && (
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {imageFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Image URL (manual input fallback) */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Or Image URL (Fallback)</label>
                <input 
                  type="text" 
                  name="imageUrl" 
                  placeholder="e.g. /static/uploads/custom.jpg" 
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>

              {/* Featured checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0' }}>
                <input 
                  type="checkbox" 
                  name="featured" 
                  id="featuredCheckbox"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="featuredCheckbox" style={{ fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Display in Featured collections slider (Home page)
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                  {editingId ? 'Save Edits' : 'Create Product'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: List of existing products */}
          <div className="glass" style={{ padding: '30px', borderRadius: 'var(--border-radius-lg)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px' }}>Inventory Items</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 5px', color: 'var(--text-muted)' }}>Name</th>
                    <th style={{ padding: '10px 5px', color: 'var(--text-muted)' }}>Category</th>
                    <th style={{ padding: '10px 5px', color: 'var(--text-muted)' }}>Price</th>
                    <th style={{ padding: '10px 5px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px 5px', fontWeight: 500 }}>
                        {p.name} {p.featured && <span style={{ color: 'var(--accent-gold)', fontSize: '10px' }}>★</span>}
                      </td>
                      <td style={{ padding: '12px 5px' }}>{p.category}</td>
                      <td style={{ padding: '12px 5px' }}>₹{p.price}</td>
                      <td style={{ padding: '12px 5px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleEditInit(p)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            title="Edit"
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            title="Delete"
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB CONTENT: INQUIRIES --- */}
      {activeTab === 'inquiries' && (
        <div className="glass" style={{ padding: '30px', borderRadius: 'var(--border-radius-lg)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px' }}>Client Submissions</h3>
          
          {inquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              No inquiries submitted yet by customers.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {inquiries.map(i => (
                <div key={i.id} style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '24px',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Inquiry Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h4 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {i.name}
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Received: {i.created_at}</span>
                    </div>

                    {/* Status Badge & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`badge ${
                        i.status === 'New' ? 'badge-lowstock' : 
                        i.status === 'Contacted' ? 'badge-instock' : 'badge-outstock'
                      }`}>
                        {i.status}
                      </span>
                      
                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {i.status !== 'Contacted' && (
                          <button 
                            onClick={() => handleUpdateInquiryStatus(i.id, 'Contacted')}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Phone size={12} /> Contacted
                          </button>
                        )}
                        {i.status !== 'Resolved' && (
                          <button 
                            onClick={() => handleUpdateInquiryStatus(i.id, 'Resolved')}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CheckCircle2 size={12} /> Resolve
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteInquiry(i.id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Client Contact Info */}
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> {i.email}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> {i.phone}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Product:</span> <span style={{ color: 'var(--accent-gold)', fontWeight: 500 }}>{i.product_name}</span></div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <h5 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Inquiry Message:</h5>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{i.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
