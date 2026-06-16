import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    product_id: '' // empty for general inquiries
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      await api.submitInquiry(formData);
      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        product_id: ''
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px 100px 24px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span style={{
          color: 'var(--accent-gold)',
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Showroom & Consultations
        </span>
        <h1 className="serif-title" style={{ fontSize: '42px', marginTop: '8px' }}>Get in Touch</h1>
        <p className="subtitle" style={{ margin: '0 auto', fontSize: '15px', marginTop: '6px' }}>
          Have a remodeling project or commercial design? Submit an inquiry, call us, or visit our showroom.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '50px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Form & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Quick Info Grid */}
          <div className="quick-info-grid">
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '20px',
              borderRadius: 'var(--border-radius-md)'
            }}>
              <Phone size={24} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Phone Contact</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>+91 93916 66951</p>
            </div>
            
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '20px',
              borderRadius: 'var(--border-radius-md)'
            }}>
              <Mail size={24} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Email Contact</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>gsgranitesandmarbles@gmail.com</p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '20px',
              borderRadius: 'var(--border-radius-md)',
              gridColumn: 'span 2'
            }}>
              <MapPin size={24} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '14px', marginBottom: '6px' }}>Showroom Address</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.6' }}>
                <a 
                  href="https://maps.app.goo.gl/TMdMDVnAZnbS2iGQ9" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  Opp. metro pillar no. A857, beside musjid, kukatpally, "y" junction, Hyderabad, Telangana - 500072
                </a>
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '20px',
              borderRadius: 'var(--border-radius-md)',
              gridColumn: 'span 2'
            }}>
              <Clock size={24} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Business Hours</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Monday - Friday</span> <span>8:00 AM - 6:00 PM</span>
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>Saturday</span> <span>9:00 AM - 4:00 PM</span>
              </p>
            </div>
          </div>

          {/* Map Location - Leaflet / OpenStreetMap Iframe styled in dark colors */}
          <div style={{
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            height: '280px',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <iframe 
              title="Showroom Location Map"
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0" 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.6383134396856!2d78.4220232!3d17.4770171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91aecdd3e1fd%3A0x58b0867381008a99!2sG.S.+Granites+And+Marbles!5e0!3m2!1sen!2sin"
              style={{ filter: 'grayscale(0.9) invert(0.9) contrast(1.2)' }}
            />
          </div>

        </div>

        {/* Right Column: Customer Inquiry Form */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '40px'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '8px' }}>
            Send Us a Message
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Submit an inquiry for custom slab sizing, tile estimates, or delivery options.
          </p>

          {status === 'success' && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--success)',
              color: 'var(--success)',
              padding: '12px 16px',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '14px',
              value: status,
              marginBottom: '20px'
            }}>
              Your inquiry has been successfully sent! We will contact you within 24 hours.
            </div>
          )}

          {status === 'error' && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              padding: '12px 16px',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              Failed to submit your inquiry. Please ensure all mandatory fields are correct.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                name="name"
                required
                className="form-control" 
                placeholder="e.g. William Smith" 
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number *</label>
              <input 
                type="tel" 
                name="phone"
                required
                className="form-control" 
                placeholder="e.g. (555) 123-4567" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                name="email"
                required
                className="form-control" 
                placeholder="e.g. william@example.com" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Message Details *</label>
              <textarea 
                name="message"
                required
                className="form-control" 
                placeholder="Please describe details of your project, stone, or tile requirements..." 
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ alignSelf: 'flex-start', padding: '12px 24px', marginTop: '10px' }}
            >
              {isSubmitting ? 'Sending...' : 'Send Inquiry'} <Send size={16} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
