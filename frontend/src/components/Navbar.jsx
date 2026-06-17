import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Layers, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  // Close menu whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close menu when tapping outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Backdrop overlay — tap to close menu on mobile */}
      {isOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 98,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <nav ref={navRef} className="glass" style={{
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
          <NavLink to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
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

          {/* Hamburger toggle — visible on mobile via CSS */}
          <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </div>

          {/* Navigation Links */}
          <div
            className={`nav-menu ${isOpen ? 'active' : ''}`}
          >
            {user && (
              <>
                <NavLink
                  to="/"
                  onClick={closeMenu}
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
                  onClick={closeMenu}
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
                  onClick={closeMenu}
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
                  onClick={closeMenu}
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
              </>
            )}

            {user ? (
              <div className="nav-user-badge" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {user.profile_image ? (
                    <img 
                      src={user.profile_image.startsWith('http') ? user.profile_image : `${import.meta.env.BASE_URL}${user.profile_image.substring(1)}`}
                      alt={user.username}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                    />
                  ) : (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>
                    {user.username}
                  </span>
                </div>
                
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="admin-nav-link"
                    onClick={closeMenu}
                    style={({ isActive }) => ({
                      fontSize: '13px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
                      transition: 'color var(--transition-fast)'
                    })}
                  >
                    Admin Panel
                  </NavLink>
                )}

                <button
                  onClick={() => { logout(); closeMenu(); navigate('/'); }}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '6px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <NavLink
                  to="/admin/login"
                  onClick={closeMenu}
                  style={({ isActive }) => ({
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    transition: 'color var(--transition-fast)'
                  })}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={closeMenu}
                  style={({ isActive }) => ({
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    transition: 'color var(--transition-fast)'
                  })}
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {user && (
              <NavLink
                to="/contact"
                onClick={closeMenu}
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
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
