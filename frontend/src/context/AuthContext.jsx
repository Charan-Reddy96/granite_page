import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const isGitHubPages = window.location.hostname.includes('github.io');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gs_auth_token'));
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  // On mount, validate the stored token
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('gs_auth_token');
      if (!storedToken || isGitHubPages) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('gs_auth_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        // Server not reachable — clear auth state
        localStorage.removeItem('gs_auth_token');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('gs_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('gs_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
