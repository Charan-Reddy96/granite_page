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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'clamp(60px, 8vw, 100px)', 
      paddingBottom: 'clamp(60px, 8vw, 100px)',
      backgroundImage: `url("${import.meta.env.BASE_URL}home_bg_texture.png")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: 'var(--hero-min-height, clamp(480px, 85vh, 900px))',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(rgba(15, 15, 17, 0.4), rgba(15, 15, 17, 0.85)), url("${import.meta.env.BASE_URL}indian_stone_showroom.png") no-repeat center center/cover`,
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
            fontSize: 'clamp(36px, 5.5vw, 60px)',
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
            fontSize: 'clamp(14px, 1.8vw, 17px)', 
            maxWidth: '650px', 
            color: 'var(--text-primary)',
            fontWeight: '500',
            lineHeight: '1.6',
            opacity: 0.95
          }}>
            Supplier and installer of premium granite, marble, and quartzite slabs for residential and commercial architecture.
          </p>

          <div className="hero-buttons">
            <Link to="/catalog" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '13.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 'var(--border-radius-sm)' }}>
              Browse Natural Stone Slabs
            </Link>
            <button 
              onClick={() => setIsInquiryOpen(true)} 
              className="btn btn-secondary" 
              style={{ padding: '12px 24px', fontSize: '13.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 'var(--border-radius-sm)', backdropFilter: 'blur(8px)' }}
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
            <h2 className="section-title serif-title" style={{ marginTop: '8px', fontSize: 'clamp(24px, 3.5vw, 30px)' }}>
              Featured Collections
            </h2>
          </div>
          <Link to="/catalog" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--accent-gold)',
            fontSize: '13px',
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
        <div className="consultation-banner">
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

          <div className="hero-cta-banner-inner">
            <div style={{ maxWidth: '650px' }}>
              <span style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                Private Consultation
              </span>
              <h2 className="section-title serif-title" style={{ marginTop: '16px', marginBottom: '12px', fontWeight: '800', fontSize: 'clamp(24px, 3.5vw, 30px)' }}>
                Private Showroom & Stone Selection
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Book a private appointment at our showroom. Our stone consultants will guide you through our exclusive range of natural marble, granite, quartzite, and tiles to perfectly elevate your residential or commercial architectural vision.
              </p>
            </div>
            <div>
              <button 
                onClick={() => setIsInquiryOpen(true)}
                className="btn btn-primary"
                style={{ padding: '12px 26px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 'var(--border-radius-sm)' }}
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
