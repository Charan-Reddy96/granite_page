import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import InquiryModal from '../components/InquiryModal';
import { api, resolveImageUrl } from '../services/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [hoveredSlideId, setHoveredSlideId] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    api.getProducts({ featured: true })
      .then(data => {
        setFeaturedProducts(data);
        setLoadingFeatured(false);
      })
      .catch(err => {
        console.error("Error fetching featured products:", err);
        setLoadingFeatured(false);
      });

    api.getProducts()
      .then(data => setAllProducts(data.filter(p => p.images && p.images.length > 0)))
      .catch(err => console.error("Error fetching all products:", err));
  }, []);

  const slides = allProducts.slice(0, 8); // show first 8 items for a concise, clean gallery slideshow

  useEffect(() => {
    if (!autoSlide || slides.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoSlide, slides]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setSlideIndex(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setSlideIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

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

          {loadingFeatured ? (
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
          ) : featuredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)'
            }}>
              No featured collections at the moment.
            </div>
          ) : (
            <div className="catalog-grid">
              {featuredProducts.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. COLLECTION SHOWCASE SLIDESHOW SECTION */}
      <section style={{ 
        backgroundColor: '#FCFCFC', 
        borderBottom: '1px solid var(--border-color)',
        padding: '80px 0'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="serif-title" style={{ fontSize: 'clamp(26px, 3.5vw, 32px)', fontWeight: 'normal', margin: '0 0 12px 0' }}>
              Our Collection
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '500px', margin: '0 auto' }}>
              Explore high-resolution highlights of our natural stone products.
            </p>
          </div>

          {slides.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '100px 0',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)'
            }}>
              Loading showcase gallery...
            </div>
          ) : (
            <div 
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1080px',
                margin: '0 auto',
                height: 'clamp(360px, 58vh, 560px)',
                borderRadius: 'var(--border-radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)',
                border: '1px solid var(--border-color)'
              }}
              onMouseEnter={() => setAutoSlide(false)}
              onMouseLeave={() => setAutoSlide(true)}
            >
              {slides.map((p, idx) => {
                const isActive = idx === slideIndex;
                return (
                  <div
                    key={p.id}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: isActive ? 1 : 0,
                      visibility: isActive ? 'visible' : 'hidden',
                      transition: 'opacity 0.8s ease, visibility 0.8s ease',
                      zIndex: isActive ? 2 : 1
                    }}
                    onMouseEnter={() => setHoveredSlideId(p.id)}
                    onMouseLeave={() => setHoveredSlideId(null)}
                  >
                    <Link 
                      to={`/products/${p.id}`}
                      style={{ 
                        display: 'block', 
                        width: '100%', 
                        height: '100%', 
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      <img 
                        src={resolveImageUrl(p.images[0])} 
                        alt={p.name} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transform: hoveredSlideId === p.id ? 'scale(1.03)' : 'scale(1)',
                          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop';
                        }}
                      />
                    </Link>

                    {/* Minimal elegant label shown on hover */}
                    <div style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '24px',
                      backgroundColor: 'rgba(252, 252, 252, 0.95)',
                      color: 'var(--text-primary)',
                      padding: '10px 20px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '15px',
                      letterSpacing: '0.03em',
                      zIndex: 5,
                      opacity: hoveredSlideId === p.id ? 1 : 0,
                      transform: hoveredSlideId === p.id ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      pointerEvents: 'none'
                    }}>
                      {p.name}
                    </div>
                  </div>
                );
              })}

              {/* Slider Controls */}
              <button
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(252, 252, 252, 0.85)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'background var(--transition-fast), opacity var(--transition-fast)',
                  opacity: 0.8
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(252, 252, 252, 0.85)';
                  e.currentTarget.style.opacity = '0.8';
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(252, 252, 252, 0.85)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'background var(--transition-fast), opacity var(--transition-fast)',
                  opacity: 0.8
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(252, 252, 252, 0.85)';
                  e.currentTarget.style.opacity = '0.8';
                }}
              >
                <ChevronRight size={18} />
              </button>

              {/* Slider dots indicator */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 10
              }}>
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideIndex(idx)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      padding: 0,
                      border: 'none',
                      backgroundColor: idx === slideIndex ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
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
