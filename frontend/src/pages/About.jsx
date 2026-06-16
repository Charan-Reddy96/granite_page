import React from 'react';
import { Award, Compass, ShieldCheck, MapPin } from 'lucide-react';

export default function About() {
  return (
    <div style={{ padding: '60px 0 100px 0', display: 'flex', flexDirection: 'column', gap: '80px' }}>

      {/* Introduction Header */}
      <section className="container text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <span style={{
          color: 'var(--accent-gold)',
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Discover G S Granites & Tiles
        </span>
        <h1 className="serif-title" style={{ fontSize: '42px', maxWidth: '800px', lineHeight: '1.2' }}>
          Crafting the Foundation of Exquisite Architecture
        </h1>
        <p className="subtitle" style={{ fontSize: '16px', margin: '0 auto' }}>
          Since 2021, we have partnered with builders, interior designers, and homeowners to supply premium granite and decorative tiles.
        </p>
      </section>

      {/* History and Image Split */}
      <section className="container">
        <div className="about-story-grid">
          <div>
            <h2 className="serif-title" style={{ fontSize: '28px', marginBottom: '20px' }}>
              Our Story & Heritage
            </h2>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '15px', lineHeight: '1.7' }}>
              <p>
                Founded in 2021, G S Granites & Tiles began with a clear focus: sourcing the finest natural granite slabs. Our dedication to selecting premium materials quickly earned us a reputation for quality.
              </p>
              <p>
                As client demand grew, we expanded our operations to introduce high-quality ceramic, porcelain, and mosaic tiles.
              </p>
              <p>
                Today, G S Granites & Tiles operates a comprehensive showroom and warehouse facility, housing a diverse selection of stone slabs and tile patterns.
              </p>
            </div>
          </div>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            height: '400px',
            border: '1px solid var(--border-color)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop"
              alt="Premium stone showroom"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>

            {/* Mission */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                backgroundColor: 'var(--accent-gold-light)',
                border: '1px solid var(--accent-gold)',
                borderRadius: '8px',
                padding: '12px',
                color: 'var(--accent-gold)',
                flexShrink: 0
              }}>
                <Compass size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>Our Mission</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                  To supply designers and builders with the highest quality raw architectural materials, ensuring long-term structural durability while creating stunning aesthetics that feel uniquely personal.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                backgroundColor: 'var(--accent-gold-light)',
                border: '1px solid var(--accent-gold)',
                borderRadius: '8px',
                padding: '12px',
                color: 'var(--accent-gold)',
                flexShrink: 0
              }}>
                <Award size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>Our Vision</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                  To become the leading national supplier of premium surface materials, recognized for sustainable sourcing practices and unmatched customer design consultations.
                </p>
              </div>
            </div>

            {/* Business Integrity */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                backgroundColor: 'var(--accent-gold-light)',
                border: '1px solid var(--accent-gold)',
                borderRadius: '8px',
                padding: '12px',
                color: 'var(--accent-gold)',
                flexShrink: 0
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>Our Commitment</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                  We guarantee absolute transparency in material origins, and thickness tolerances within 1mm.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Corporate Statistics / Numbers */}
      <section className="container">
        <div className="stats-grid">
          <div className="stats-item">
            <span style={{ fontSize: '48px', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>5+</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '10px' }}>Years in Industry</p>
          </div>
          <div className="stats-item">
            <span style={{ fontSize: '48px', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>2k+</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '10px' }}>Projects Completed</p>
          </div>
          <div className="stats-item">
            <span style={{ fontSize: '48px', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>20+</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '10px' }}>Unique Stone Slabs</p>
          </div>
          <div className="stats-item">
            <span style={{ fontSize: '48px', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>100%</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '10px' }}>Client Satisfaction</p>
          </div>
        </div>
      </section>

    </div>
  );
}
