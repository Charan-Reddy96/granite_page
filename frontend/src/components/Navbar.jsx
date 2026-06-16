import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layers, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={28} color="var(--accent-gold)" />
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            G S
          </span>
          <span style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            alignSelf: 'flex-end',
            marginBottom: '4px',
            marginLeft: '5px'
          }}>
            Granites & Tiles
          </span>
        </NavLink>

        {/* Mobile Menu Icon */}
        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        {/* Navigation Links */}
        <div className={`nav-menu ${isOpen ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <NavLink 
            to="/" 
            onClick={() => setIsOpen(false)}
            style={({ isActive }) => ({
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            })}
          >
            Home
          </NavLink>
          <NavLink 
            to="/catalog" 
            onClick={() => setIsOpen(false)}
            style={({ isActive }) => ({
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            })}
          >
            Slabs
          </NavLink>

          <NavLink 
            to="/about" 
            onClick={() => setIsOpen(false)}
            style={({ isActive }) => ({
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            })}
          >
            About Us
          </NavLink>
          <NavLink 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            style={({ isActive }) => ({
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            })}
          >
            Contact Us
          </NavLink>
          <NavLink 
            to="/admin" 
            onClick={() => setIsOpen(false)}
            style={({ isActive }) => ({
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              transition: 'color var(--transition-fast)'
            })}
            onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            Admin Panel
          </NavLink>
          <NavLink 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            className="btn btn-primary"
            style={{ 
              padding: '10px 20px', 
              fontSize: '13px', 
              fontWeight: '700', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: 'var(--border-radius-sm)',
              color: 'var(--accent-dark)'
            }}
          >
            Book Appointment
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
