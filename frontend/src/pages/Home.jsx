import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '100px', paddingBottom: '100px' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        height: '85vh',
        minHeight: '600px',
        maxHeight: '900px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(rgba(15, 15, 17, 0.4), rgba(15, 15, 17, 0.85)), url("https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&auto=format&fit=crop") no-repeat center center/cover',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Visual Overlay Layer for premium depth */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(15, 15, 17, 0.2) 0%, rgba(15, 15, 17, 0.8) 100%)',
          zIndex: 1
        }} />

        <div className="container" style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px'
        }}>
          <h1 style={{
            fontSize: 'clamp(44px, 7vw, 76px)',
            lineHeight: '1.1',
            fontWeight: '800',
            maxWidth: '900px',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '-0.02em'
          }}>
            Natural Stone,<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-gold) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Naturally Better.
            </span>
          </h1>

          <p className="subtitle" style={{ 
            fontSize: '20px', 
            maxWidth: '650px', 
            color: 'var(--text-primary)',
            fontWeight: '500',
            lineHeight: '1.6',
            opacity: 0.95
          }}>
            Supplier and installer of premium granite, marble, and quartzite slabs for residential and commercial architecture.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
            <Link to="/catalog" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 'var(--border-radius-sm)' }}>
              Browse Natural Stone Slabs
            </Link>
            <button 
              onClick={() => setIsInquiryOpen(true)} 
              className="btn btn-secondary" 
              style={{ padding: '14px 32px', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 'var(--border-radius-sm)', backdropFilter: 'blur(8px)' }}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </section>



      {/* 6. FEATURED PRODUCTS COLLECTION */}
      <section className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h2 className="serif-title" style={{ fontSize: '32px', marginTop: '8px' }}>
              Featured Collections
            </h2>
          </div>
          <Link to="/catalog" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--accent-gold)',
            fontSize: '14px',
            fontWeight: 500
          }}>
            View Complete Catalog <ArrowRight size={16} />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius-md)',
            color: 'var(--text-secondary)'
          }}>
            Loading catalog masterpieces...
          </div>
        ) : (
          <div className="catalog-grid">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 4. PRIVATE CONSULTATION / SHOWROOM BANNER */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(197, 168, 128, 0.08) 100%)',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '60px 50px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(197, 168, 128, 0.02)',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '30px' }}>
            <div style={{ maxWidth: '650px' }}>
              <span style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                Private Consultation
              </span>
              <h2 className="serif-title" style={{ fontSize: '32px', marginTop: '16px', marginBottom: '12px', fontWeight: '800' }}>
                Private Showroom & Stone Selection
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7' }}>
                Book a private appointment at our showroom. Our stone consultants will guide you through our exclusive range of natural marble, granite, quartzite, and tiles to perfectly elevate your residential or commercial architectural vision.
              </p>
            </div>
            <div>
              <button 
                onClick={() => setIsInquiryOpen(true)}
                className="btn btn-primary"
                style={{ padding: '14px 32px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 'var(--border-radius-sm)' }}
              >
                Book Consultation <ArrowRight size={16} />
              </button>
            </div>
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
