import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '80px 0 40px 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Logo and About Brief */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={24} color="var(--accent-gold)" />
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #f3f3f6 30%, var(--accent-gold) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                G S
              </span>
              <span style={{
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                alignSelf: 'flex-end',
                marginBottom: '2px',
                marginLeft: '2px'
              }}>
                Granites & Tiles
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              Specialists in premium natural stone slabs, luxury marble surfaces and architectural flooring. Elevating spaces with raw natural elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'var(--font-sans)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Slabs Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-secondary)', fontSize: '14px', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'var(--font-sans)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Contact Us
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px', color: 'var(--text-secondary)', padding: 0 }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <a
                  href="https://maps.app.goo.gl/TMdMDVnAZnbS2iGQ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)', lineHeight: '1.5' }}
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  FCGC+RR3, Opposite DMart Kukatpally, IDA Kukatpally, Kukatpally, Hyderabad, Telangana 500072, India
                </a>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} color="var(--accent-gold)" />
                <a href="tel:+919391666951" style={{ transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>+91 93916 66951</a>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} color="var(--accent-gold)" />
                <a href="mailto:gsgranitesandmarbles@gmail.com" style={{ transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>gsgranitesandmarbles@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'var(--font-sans)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Showroom Hours
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)', padding: 0 }}>
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
                <span>Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '25px',
          display: 'flex',
          justifyContent: 'space-between',
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
