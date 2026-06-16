import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show verifying state while checking auth context
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
        Verifying access privileges...
      </div>
    );
  }

  // If no user is authenticated, redirect to Login page
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
