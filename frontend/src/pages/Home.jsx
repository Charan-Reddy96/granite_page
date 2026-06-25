import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import InquiryModal from '../components/InquiryModal';
import { api } from '../services/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    api.getProducts({ featured: true })
      .then(data => setFeaturedProducts(data))
      .catch(err => console.error("Error fetching featured products:", err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        backgroundColor: '#FCFCFC', 
        borderBottom: '1px solid var(--border-color)',
        padding: 'var(--section-padding-vertical, 80px) 0'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '64px',
          alignItems: 'center'
        }}>
          {/* Left Column: Slab Image */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
            border: '1px solid var(--border-color)',
            height: 'clamp(380px, 50vh, 520px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop" 
              alt="Premium Marble Slab" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Right Column: Hero Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
            <h1 className="serif-title" style={{
              fontSize: 'clamp(36px, 4.5vw, 52px)',
              lineHeight: '1.2',
              fontWeight: 'normal',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Exquisite Stone,<br />Timeless Elegance
            </h1>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              margin: 0,
              maxWidth: '480px'
            }}>
              Discover our curated collection of premium light stone slabs. Hand-selected for luxury residential and commercial architecture.
            </p>
            <Link 
              to="/catalog" 
              className="btn btn-primary" 
              style={{
                padding: '14px 28px',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderRadius: 'var(--border-radius-sm)',
                color: '#FFFFFF'
              }}
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTIONS SECTION */}
      <section style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '80px 0'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h2 className="serif-title" style={{ fontSize: 'clamp(26px, 3.5vw, 32px)', fontWeight: 'normal', margin: 0 }}>
                Featured Collections
              </h2>
            </div>
            <Link to="/catalog" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--accent-gold)',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              View Complete Catalog <ArrowRight size={16} />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)'
            }}>
              Loading catalog masterpieces...
            </div>
          ) : (
            <div className="catalog-grid">
              {featuredProducts.slice(0, 3).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. FEATURED PROJECTS SECTION */}
      <section style={{ 
        backgroundColor: '#FCFCFC', 
        borderBottom: '1px solid var(--border-color)',
        padding: '80px 0'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '64px',
          alignItems: 'center'
        }}>
          {/* Left Column: Kitchen/Project Image */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
            border: '1px solid var(--border-color)',
            height: 'clamp(280px, 40vh, 420px)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop" 
              alt="Featured Stone Project" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Right Column: Project Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
            <h2 className="serif-title" style={{
              fontSize: 'clamp(26px, 3.5vw, 32px)',
              fontWeight: 'normal',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Featured Projects
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              margin: 0,
              maxWidth: '480px'
            }}>
              See how our premium white marble and custom-cut granite countertops transform modern kitchens, luxury bathrooms, and commercial lobbies into works of art.
            </p>
            <button 
              onClick={() => setIsInquiryOpen(true)}
              className="btn btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderRadius: 'var(--border-radius-sm)',
                color: '#FFFFFF'
              }}
            >
              View Project Details
            </button>
          </div>
        </div>
      </section>

      {/* Inquiry Dialog Modal */}
      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
      />

    </div>
  );
}
