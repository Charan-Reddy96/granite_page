import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gs_auth_token'));
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  // On mount, validate the stored token
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('gs_auth_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getMe(storedToken);
        setUser(data.user);
        setToken(storedToken);
      } catch (err) {
        // Token is invalid or expired
        localStorage.removeItem('gs_auth_token');
        localStorage.removeItem('gs_device_signature');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (username, password, deviceSignature = '') => {
    const data = await api.login(username, password, deviceSignature);

    if (deviceSignature) {
      localStorage.setItem('gs_device_signature', deviceSignature);
    }
    localStorage.setItem('gs_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const loginWithOTP = async (identifier, token) => {
    const data = await api.loginWithOTP(identifier, token);
    localStorage.setItem('gs_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const data = await api.register(formData);

    localStorage.setItem('gs_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('gs_auth_token');
    localStorage.removeItem('gs_device_signature');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, loading, login, loginWithOTP, register, logout }}>
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

