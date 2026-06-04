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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        height: '80vh',
        minHeight: '550px',
        maxHeight: '800px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(rgba(15, 15, 17, 0.75), rgba(15, 15, 17, 0.95)), url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop") no-repeat center center/cover',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--accent-gold-light)',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Sparkles size={14} /> Shaping Dream Spaces Since 1998
          </div>

          <h1 className="serif-title" style={{
            fontSize: 'clamp(40px, 6vw, 68px)',
            lineHeight: '1.15',
            fontWeight: 'bold',
            maxWidth: '850px'
          }}>
            Sculpted by Nature. <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-gold) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Refined for Luxury.
            </span>
          </h1>

          <p className="subtitle" style={{ fontSize: '18px', maxWidth: '650px' }}>
            Discover our hand-selected collection of premium granite slabs, luxury wall & floor tiles, and designer interior paints crafted to inspire architectural excellence.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
            <Link to="/catalog" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }}>
              Explore Collections <ArrowRight size={16} />
            </Link>
            <button 
              onClick={() => setIsInquiryOpen(true)} 
              className="btn btn-secondary" 
              style={{ padding: '14px 28px', fontSize: '15px' }}
            >
              Get Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES / VALUES */}
      <section className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            padding: '30px',
            borderRadius: 'var(--border-radius-md)'
          }}>
            <Star size={36} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Exceptional Quality</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              We source only raw, premium-grade granite from leading quarries and engineer custom tiles for maximum strength and style.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            padding: '30px',
            borderRadius: 'var(--border-radius-md)'
          }}>
            <ShieldCheck size={36} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Certified Durability</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Our paints are eco-friendly, zero-VOC, washproof and backed by a lifetime warranty to protect and color your home.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            padding: '30px',
            borderRadius: 'var(--border-radius-md)'
          }}>
            <Sparkles size={36} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Custom Finishes</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              From mirror-polished and leathered granites to velvet-finish paints, we offer tailored finishes to suit any style.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS COLLECTION */}
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
            <span style={{
              color: 'var(--accent-gold)',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Handpicked Materials
            </span>
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

      {/* 4. SPECIAL OFFERS / PROMOTION BANNER */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(197, 168, 128, 0.08) 100%)',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '50px 40px',
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
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                LIMITED-TIME PROMOTION
              </span>
              <h2 className="serif-title" style={{ fontSize: '30px', marginTop: '16px', marginBottom: '12px' }}>
                Spring Remodeling Special: 15% Off Italian Carrara Slabs
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
                Schedule a consultation today to lock in customized slab pricing. Includes professional measuring, custom template cuts, and installation estimates.
              </p>
            </div>
            <div>
              <button 
                onClick={() => setIsInquiryOpen(true)}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '15px' }}
              >
                Inquire Special Offer <PhoneCall size={16} />
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
