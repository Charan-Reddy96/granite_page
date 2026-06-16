import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  const isGitHubPages = window.location.hostname.includes('github.io');
  const storedSignature = localStorage.getItem('gs_device_signature');

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

