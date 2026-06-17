import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}>
          {/* Navigation Bar */}
          <Navbar />

          {/* Page Content */}
          <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Public Unprotected Sign Up / Login */}
              <Route path="/signup" element={<UserSignup />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Client Pages */}
              <Route path="/" element={
                <UserProtectedRoute>
                  <Home />
                </UserProtectedRoute>
              } />
              <Route path="/about" element={
                <UserProtectedRoute>
                  <About />
                </UserProtectedRoute>
              } />
              <Route path="/catalog" element={
                <UserProtectedRoute>
                  <Catalog />
                </UserProtectedRoute>
              } />
              <Route path="/products/:id" element={
                <UserProtectedRoute>
                  <ProductDetails />
                </UserProtectedRoute>
              } />
              <Route path="/contact" element={
                <UserProtectedRoute>
                  <Contact />
                </UserProtectedRoute>
              } />

              {/* Protected Admin Page */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}


