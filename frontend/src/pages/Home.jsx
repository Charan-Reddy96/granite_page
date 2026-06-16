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

      {/* 2. CORE FEATURES / VALUES (Gitani Style Ethos list) */}
      <section className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '50px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              Natural Stone Collections
            </div>
            <h2 style={{ fontSize: '36px', lineHeight: '1.2', fontWeight: '800', maxWidth: '400px' }}>
              <span style={{ color: 'var(--accent-gold)' }}>Embrace</span> the beauty and durability of natural minerals.
            </h2>
          </div>
          <div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '30px', padding: 0 }}>
              <li style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Zero Resin Top Coating</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No yellowing over time due to UV exposure or direct light.</span>
              </li>
              <li style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Net Zero Manufacturing</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Solar power and water recycling are utilized to minimize environmental impact.</span>
              </li>
              <li style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Precision Vein Matching</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>High-definition camera alignment systems to match natural stone slabs seamlessly.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. STONE CATEGORIES SHOWCASE GRID (Interactive swatches layout) */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Exclusive Collections
          </span>
          <h2 style={{ fontSize: '38px', fontWeight: '800', marginTop: '8px' }}>Select Your Material</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '30px'
        }}>
          {[
            { name: 'Granite', label: 'Premium Granite', img: 'http://googleusercontent.com/image_collection/image_retrieval/1800106829975532889', query: 'Granite' },
            { name: 'Tiles', label: 'Luxury Tiles', img: 'http://googleusercontent.com/image_collection/image_retrieval/792531940683038687', query: 'Tile' }
          ].map((cat) => (
            <Link 
              key={cat.name} 
              to={`/catalog?category=${cat.query}`}
              style={{
                position: 'relative',
                height: '320px',
                borderRadius: 'var(--border-radius-md)',
                overflow: 'hidden',
                display: 'block',
                border: '1px solid var(--border-color)',
                transition: 'transform var(--transition-normal), border-color var(--transition-normal)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
                const overlay = e.currentTarget.querySelector('.cat-overlay');
                if (overlay) overlay.style.opacity = '1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                const overlay = e.currentTarget.querySelector('.cat-overlay');
                if (overlay) overlay.style.opacity = '0';
              }}
            >
              <img 
                src={cat.img} 
                alt={cat.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              {/* Static Dark Overlay */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(15,15,17,0.8) 0%, rgba(15,15,17,0.2) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '30px',
                zIndex: 2
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  {cat.label}
                </h3>
              </div>
              {/* Hover View Range Overlay */}
              <div 
                className="cat-overlay"
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(197, 168, 128, 0.15)',
                  backdropFilter: 'blur(3px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity var(--transition-normal)',
                  zIndex: 3
                }}
              >
                <span style={{
                  backgroundColor: 'var(--accent-gold)',
                  color: 'var(--bg-primary)',
                  padding: '12px 24px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  borderRadius: 'var(--border-radius-sm)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  View Range
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SERVICES: HAUTE MASONRY */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <span style={{ color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Services
              </span>
              <h2 style={{ fontSize: '40px', fontWeight: '800', lineHeight: '1.1', margin: 0 }}>
                <span style={{ color: 'var(--accent-gold)' }}>Haute</span> Masonry
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                G S Granites & Tiles is for the few. Our attention to detail is unmatched worldwide. Sourcing the rarest natural stones with strict quality standards from reputable quarries globally, fabricating them to millimetre-perfect templates, and masterfully installing them to match your dream spaces.
              </p>
              <div style={{ marginTop: '10px' }}>
                <Link to="/contact" className="btn btn-secondary" style={{ borderRadius: 'var(--border-radius-sm)', textTransform: 'uppercase', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Enquire Now
                </Link>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <span style={{ fontSize: '28px', fontWeight: 300, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>01</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Supply</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    We have decades of experience sourcing rare and refined natural stone slabs directly from leading quarries around the world. We offer a curated collection of marble, granite, quartzite, limestone, onyx, and travertine.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <span style={{ fontSize: '28px', fontWeight: 300, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>02</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Fabricate</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    Your selected slabs are moved to our precision fabrication facility, where master stonemasons pair centuries of combined experience with high-tech machinery to cut your stone templates to absolute perfection.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <span style={{ fontSize: '28px', fontWeight: 300, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>03</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Install</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    Our team carefully transports the completed templates to your site, where our master stonemasons handcraft the final joins and details, completing the installation with the highest standard of pride.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ETHOS: THE GS ARTISANS */}
      <section className="container" style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <span style={{ color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Ethos
          </span>
          <h2 style={{ fontSize: '38px', fontWeight: '800' }}>
            The GS <span style={{ color: 'var(--accent-gold)' }}>Artisans</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8', margin: 0 }}>
            We take immense pride in sourcing the finest natural stones and cultivating generations of master craftsmen, empowered by millimetre-perfect precision machinery.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8', margin: 0 }}>
            Natural stone is a material for those who appreciate true craftsmanship and raw organic character in their living spaces.
          </p>
          <div style={{ fontStyle: 'italic', color: 'var(--accent-gold)', fontSize: '18px', marginTop: '10px', fontFamily: 'var(--font-serif)' }}>
            "Reject imitation, choose the natural way."
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
