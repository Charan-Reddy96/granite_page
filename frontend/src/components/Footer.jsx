import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '60px 0 30px 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Logo and About Brief */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Layers size={24} color="var(--accent-gold)" />
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}>
                G S <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Granites & Tiles</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.7' }}>
              Specialists in premium granite slabs, luxury marble and floor tiles. Elevating residential and commercial architecture since 2021.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  About Our Business
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              Contact Us
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <a 
                  href="https://maps.app.goo.gl/TMdMDVnAZnbS2iGQ9" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  FCGC+RR3, Opposite DMart Kukatpally, IDA Kukatpally, Kukatpally, Hyderabad, Telangana 500072, India
                </a>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} color="var(--accent-gold)" />
                <span>+91 93916 66951</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} color="var(--accent-gold)" />
                <span>gsgranitesandmarbles@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              Showroom Hours
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={16} color="var(--accent-gold)" />
                <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={16} color="var(--accent-gold)" />
                <span>Saturday: 9:00 AM - 4:00 PM</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={16} color="var(--text-muted)" />
                <span>Sunday: Closed (Showroom)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '25px',
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <p>&copy; {new Date().getFullYear()} G S Granites & Tiles. All rights reserved.</p>
          <p>Designed with premium quality materials.</p>
        </div>
      </div>
    </footer>
  );
}
