import React from 'react';

const TypingIndicator = ({ primaryColor }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: '15px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Bot Avatar */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: primaryColor || '#1E90FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#fff',
        flexShrink: 0
      }}>
        <i className="fa-solid fa-robot"></i>
      </div>
      
      {/* Typing Bubble */}
      <div style={{
        background: '#1C2128',
        border: '1px solid #30363D',
        borderRadius: '0px 12px 12px 12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          background: '#8B949E',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'typing 1.4s infinite ease-in-out both'
        }}></span>
        <span style={{
          width: '6px',
          height: '6px',
          background: '#8B949E',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'typing 1.4s infinite ease-in-out both',
          animationDelay: '0.2s'
        }}></span>
        <span style={{
          width: '6px',
          height: '6px',
          background: '#8B949E',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'typing 1.4s infinite ease-in-out both',
          animationDelay: '0.4s'
        }}></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
