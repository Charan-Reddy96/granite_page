import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
  const getBadgeClass = (availability) => {
    const status = availability ? availability.toLowerCase().replace(' ', '') : 'instock';
    if (status === 'instock') return 'badge-instock';
    if (status === 'lowstock') return 'badge-lowstock';
    return 'badge-outstock';
  };

  const displayPriceUnit = (category) => {
    if (category === 'Tile') return '/ box';
    return '/ sq.ft';
  };

  const getCategoryImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/static/uploads/placeholder.webp';
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Product Image Area */}
      <div className="img-container" style={{ height: 'var(--card-image-height, 220px)' }}>
        <img 
          src={getCategoryImage(product)} 
          alt={product.name} 
          className="img-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop';
          }}
        />
        
        {/* Category Badge overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(15, 15, 17, 0.85)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#FFFFFF'
        }}>
          <Layers size={12} color="var(--accent-gold)" />
          {product.category}
        </div>
      </div>

      {/* Product Details Area */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: '18px', margin: 0, lineHeight: '1.3' }}>
            {product.name}
          </h3>
          <span className={`badge ${getBadgeClass(product.availability)}`} style={{ flexShrink: 0, marginTop: '2px' }}>
            {product.availability}
          </span>
        </div>

        {/* Specifications row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Color: </span>{product.color}
          </div>
          {product.finish && (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Finish: </span>{product.finish}
            </div>
          )}
          {product.thickness && (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Thickness: </span>{product.thickness}
            </div>
          )}
          {product.size && (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Size: </span>{product.size}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '15px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
              ₹{product.price}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {displayPriceUnit(product.category)}
            </span>
          </div>
          <Link 
            to={`/products/${product.id}`}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
