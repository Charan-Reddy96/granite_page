import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Shield, CheckCircle, Scale } from 'lucide-react';
import InquiryModal from '../components/InquiryModal';
import { api, resolveImageUrl } from '../services/api';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    api.getProductById(id)
      .then(data => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading product details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Fetching product specifications and images...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>The product you are looking for does not exist or has been removed.</p>
        <Link to="/catalog" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const displayPriceUnit = (category) => {
    if (category === 'Tile') return '/ box';
    return '/ sq.ft';
  };

  const getStatusClass = (availability) => {
    const status = availability ? availability.toLowerCase().replace(' ', '') : 'instock';
    if (status === 'instock') return 'badge-instock';
    if (status === 'lowstock') return 'badge-lowstock';
    return 'badge-outstock';
  };

  return (
    <div className="container" style={{ padding: '40px 24px 100px 24px' }}>
      
      {/* Back button */}
      <Link to="/catalog" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '30px',
        transition: 'color var(--transition-fast)'
      }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="product-details-grid">
        
        {/* Left Column: Image Gallery */}
        <div>
          <div className="product-main-image">
            <img 
              src={resolveImageUrl(activeImage) || resolveImageUrl('/static/uploads/placeholder.webp')} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop';
              }}
            />
          </div>
          
          {/* Thumbnails if multiple images exist */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'hidden',
                    border: activeImage === img ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <img src={resolveImageUrl(img)} alt="Product view" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Product Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{
                backgroundColor: 'var(--accent-gold-light)',
                border: '1px solid var(--accent-gold)',
                color: 'var(--accent-gold)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                {product.category}
              </span>
              <span className={`badge ${getStatusClass(product.availability)}`}>
                {product.availability}
              </span>
            </div>
            
            <h1 className="serif-title" style={{ fontSize: '38px', lineHeight: '1.2', marginBottom: '12px' }}>
              {product.name}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                ₹{product.price}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {displayPriceUnit(product.category)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '10px', color: 'var(--text-primary)' }}>
              Product Description
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7' }}>
              {product.description || "No description provided. Please contact our catalog advisors for more specifications."}
            </p>
          </div>

          {/* Specifications Table */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Technical Details
            </h3>
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              {/* Table Row: Category */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '12px 16px', fontSize: '14px' }}>
                <span style={{ width: '150px', color: 'var(--text-muted)', fontWeight: 500 }}>Category</span>
                <span style={{ color: 'var(--text-primary)' }}>{product.category}</span>
              </div>
              
              {/* Table Row: Color */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '12px 16px', fontSize: '14px' }}>
                <span style={{ width: '150px', color: 'var(--text-muted)', fontWeight: 500 }}>Color Family</span>
                <span style={{ color: 'var(--text-primary)' }}>{product.color}</span>
              </div>

              {/* Table Row: Finish */}
              {product.finish && (
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '12px 16px', fontSize: '14px' }}>
                  <span style={{ width: '150px', color: 'var(--text-muted)', fontWeight: 500 }}>Surface Finish</span>
                  <span style={{ color: 'var(--text-primary)' }}>{product.finish}</span>
                </div>
              )}

              {/* Granite/Tile specific spec rows */}
              {product.thickness && (
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '12px 16px', fontSize: '14px' }}>
                  <span style={{ width: '150px', color: 'var(--text-muted)', fontWeight: 500 }}>Thickness</span>
                  <span style={{ color: 'var(--text-primary)' }}>{product.thickness}</span>
                </div>
              )}
              {product.dimensions && (
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '12px 16px', fontSize: '14px' }}>
                  <span style={{ width: '150px', color: 'var(--text-muted)', fontWeight: 500 }}>Slab Dimensions</span>
                  <span style={{ color: 'var(--text-primary)' }}>{product.dimensions}</span>
                </div>
              )}
            </div>
          </div>

          {/* Guarantee / Shipping note */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
              <Shield size={16} color="var(--accent-gold)" /> 10-Year Material Integrity Guarantee
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
              <CheckCircle size={16} color="var(--accent-gold)" /> Professional slab templates and custom edge styling available
            </div>
          </div>

          {/* Action: Send Inquiry */}
          <button 
            onClick={() => setIsInquiryOpen(true)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
          >
            Submit Inquiry for Quote <MessageSquare size={18} />
          </button>

        </div>

      </div>

      {/* Inquiry Dialog Modal */}
      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)}
        preFilledProduct={product}
      />

    </div>
  );
}
