import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardSidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: 'fa-solid fa-house' },
    { name: 'Configure Bot', path: '/dashboard/configure', icon: 'fa-solid fa-sliders' },
    { name: 'Conversations', path: '/dashboard/conversations', icon: 'fa-solid fa-comments' },
    { name: 'Embed Code', path: '/dashboard/embed', icon: 'fa-solid fa-code' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-sidebar-header" style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: '#161B22',
        borderBottom: '1px solid #30363D',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 900
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#1E90FF' }}>
          <i className="fa-solid fa-robot"></i>
          <span>Dashboard</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#E6EDF3',
            fontSize: '1.3rem',
            cursor: 'pointer'
          }}
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Sidebar Container */}
      <div 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          background: '#161B22',
          borderRight: '1px solid #30363D',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 800,
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Brand */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #30363D',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            background: 'rgba(30, 144, 255, 0.1)',
            color: '#1E90FF',
            padding: '8px',
            borderRadius: '8px',
            fontSize: '1.2rem'
          }}>
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: '700' }}>ChatBot Pro</h2>
            <p style={{ fontSize: '0.75rem', color: '#8B949E' }}>Business Dashboard</p>
          </div>
        </div>

        {/* Business Tag */}
        {user && (
          <div style={{
            padding: '15px 20px',
            background: 'rgba(30, 144, 255, 0.05)',
            borderBottom: '1px solid #30363D',
            fontSize: '0.85rem'
          }}>
            <p style={{ color: '#8B949E', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logged in as</p>
            <p style={{ fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.businessName}</p>
          </div>
        )}

        {/* Nav Links */}
        <div style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setIsOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                borderRadius: '6px',
                color: isActive ? '#fff' : '#8B949E',
                background: isActive ? '#1E90FF' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                transition: 'background 0.2s, color 0.2s'
              })}
              className="sidebar-link"
            >
              <i className={item.icon} style={{ width: '20px' }}></i>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div style={{ padding: '20px 10px', borderTop: '1px solid #30363D' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 15px',
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: '#F85149',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
            className="sidebar-logout"
          >
            <i className="fa-solid fa-right-from-bracket" style={{ width: '20px' }}></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style>{`
        .sidebar-link:hover {
          color: #fff !important;
          background: rgba(30, 144, 255, 0.1) !important;
        }
        .sidebar-link.active {
          color: #fff !important;
          background: #1E90FF !important;
        }
        .sidebar-logout:hover {
          background: rgba(248, 81, 73, 0.1) !important;
        }
        @media (max-width: 768px) {
          .mobile-sidebar-header {
            display: flex !important;
          }
          .sidebar {
            transform: translateX(-100%);
            top: 60px !important;
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default DashboardSidebar;
