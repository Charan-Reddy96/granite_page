import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Monitor } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  const isGitHubPages = window.location.hostname.includes('github.io');
  const storedSignature = localStorage.getItem('gs_device_signature');
  
  // Track viewport width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        color: 'var(--text-secondary)',
        fontSize: '14px'
      }}>
        Verifying access...
      </div>
    );
  }

  // Restrict mobile access (<= 768px)
  if (windowWidth <= 768) {
    return (
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        padding: '40px 24px',
        textAlign: 'center',
        gap: '20px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-gold)'
        }}>
          <Monitor size={40} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: '700' }}>
          Desktop & Tablet Access Only
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          For security and display optimization, the Admin Dashboard is restricted and can only be accessed on PC and Tablet devices. Please log in from a larger screen.
        </p>
        <Link to="/" className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', textDecoration: 'none' }}>
          Return to Homepage
        </Link>
      </div>
    );
  }

  // If not admin, redirect to login
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check device signature key in static deployments
  if (isGitHubPages && storedSignature !== 'gs_dev_device_sig_2026') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}


