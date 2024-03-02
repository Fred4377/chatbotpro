import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#0D1117',
      borderTop: '1px solid #30363D',
      padding: '40px 0 20px 0',
      color: '#8B949E',
      fontSize: '0.9rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: '700', color: '#1E90FF', marginBottom: '10px' }}>
              <i className="fa-solid fa-robot"></i>
              <span>ChatBot <span style={{ color: '#E6EDF3' }}>Pro</span></span>
            </div>
            <p style={{ maxWidth: '280px', lineHeight: '1.6' }}>
              Empowering businesses with smart, responsive, and 24/7 AI-powered customer support chatbots.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: '#E6EDF3', marginBottom: '15px', fontSize: '0.95rem' }}>Product</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/" style={{ hover: { color: '#1E90FF' } }}>Features</Link></li>
                <li><Link to="/demo">Try Demo</Link></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#E6EDF3', marginBottom: '15px', fontSize: '0.95rem' }}>Business Dashboard</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Create Account</Link></li>
                <li><Link to="/dashboard">Configure Bot</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid #30363D',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <p>&copy; {new Date().getFullYear()} ChatBot Pro. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '1.2rem' }}>
            <a href="#" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" aria-label="GitHub"><i className="fa-brands fa-github"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
