import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InquiryModal({ isOpen, onClose, preFilledProduct = null }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product_id: '',
    message: ''
  });
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  useEffect(() => {
    // If modal is opened, fetch list of products for dropdown if not prefilled
    if (isOpen) {
      // Pre-populate name and email if user is authenticated
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: prev.name || user.username,
          email: prev.email || `${user.username}@example.com`
        }));
      }

      if (preFilledProduct) {
        setFormData(prev => ({
          ...prev,
          product_id: preFilledProduct.id,
          message: prev.message || `Hello, I am interested in your "${preFilledProduct.name}" product. Please share pricing and shipping details.`
        }));
      } else {
        // Fetch all products for dropdown
        api.getProducts()
          .then(data => setProducts(data))
          .catch(err => console.error("Error loading products for modal dropdown:", err));
      }
    }
  }, [isOpen, preFilledProduct, user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await api.submitInquiry(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        product_id: '',
        message: ''
      });
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2500);
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '10px' }}>
          Request Product Inquiry
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          Our consultants will reach out to provide customized quotes and answer any specifications.
        </p>

        {submitStatus === 'success' && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '12px 16px',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            Inquiry submitted successfully! We will contact you shortly.
          </div>
        )}

        {submitStatus === 'error' && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '12px 16px',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            Oops! Error submitting inquiry. Please check required fields.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              className="form-control"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Contact Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                className="form-control"
                placeholder="+91XXXXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                className="form-control"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Product Select Field */}
          <div className="form-group">
            <label className="form-label">Product Interested In *</label>
            {preFilledProduct ? (
              <input
                type="text"
                disabled
                className="form-control"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                value={`${preFilledProduct.category}: ${preFilledProduct.name}`}
              />
            ) : (
              <select
                name="product_id"
                required
                className="form-control"
                value={formData.product_id}
                onChange={handleChange}
              >
                <option value="">-- Select Product --</option>
                <option value="general">General Consultation Inquiry</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.category}] {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Message Field */}
          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              name="message"
              required
              className="form-control"
              placeholder="Detail your dimensions requirements, timeline, or color customizations..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {isSubmitting ? 'Sending...' : 'Send Inquiry'} <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
