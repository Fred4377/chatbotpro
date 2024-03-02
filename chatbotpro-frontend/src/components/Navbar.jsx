import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'rgba(13, 17, 23, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #30363D',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '15px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontWeight: '700', color: '#1E90FF' }}>
          <i className="fa-solid fa-robot"></i>
          <span>ChatBot <span style={{ color: '#E6EDF3' }}>Pro</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ color: '#E6EDF3', fontSize: '0.95rem', fontWeight: '500' }}>Home</Link>
          <Link to="/demo" style={{ color: '#E6EDF3', fontSize: '0.95rem', fontWeight: '500' }}>Demo</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '6px 15px', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-gauge"></i> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '6px 15px', fontSize: '0.9rem', backgroundColor: '#e03e3e' }}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#8B949E', fontSize: '0.95rem', fontWeight: '500' }}>Login</Link>
              <Link to="/register" className="btn pulse-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#E6EDF3',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
          className="mobile-toggle"
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '55px',
            left: 0,
            right: 0,
            background: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            zIndex: 99
          }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: '5px 0' }}>Home</Link>
            <Link to="/demo" onClick={() => setMobileMenuOpen(false)} style={{ padding: '5px 0' }}>Demo</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-danger" style={{ width: '100%' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center', padding: '5px 0' }}>Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn" style={{ width: '100%' }}>
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
