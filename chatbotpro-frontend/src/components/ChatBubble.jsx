import React from 'react';

const ChatBubble = ({ onClick, primaryColor, hasUnread }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: primaryColor || '#1E90FF',
        border: 'none',
        color: '#fff',
        fontSize: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        transition: 'transform 0.2s, filter 0.2s',
        zIndex: 9999
      }}
      className="pulse-primary"
      aria-label="Open Chat"
    >
      <i className="fa-solid fa-comments"></i>
      
      {hasUnread && (
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '12px',
          height: '12px',
          background: '#EF4444',
          borderRadius: '50%',
          border: '2px solid #fff'
        }}></span>
      )}
    </button>
  );
};

export default ChatBubble;
