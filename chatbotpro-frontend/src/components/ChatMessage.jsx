import React from 'react';

const ChatMessage = ({ message, botName, primaryColor }) => {
  const isBot = message.role === 'bot';
  
  // Format timestamp (e.g. 2:34 PM)
  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: isBot ? 'row' : 'row-reverse',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: '15px',
      width: '100%',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      {/* Avatar */}
      {isBot ? (
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
          {botName ? botName.charAt(0).toUpperCase() : 'A'}
        </div>
      ) : (
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#30363D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          fontWeight: '700',
          color: '#E6EDF3',
          flexShrink: 0
        }}>
          U
        </div>
      )}

      {/* Bubble Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isBot ? 'flex-start' : 'flex-end',
        maxWidth: '75%'
      }}>
        {/* Bubble */}
        <div style={{
          background: isBot ? '#1C2128' : '#1E4DB7',
          color: '#E6EDF3',
          border: isBot ? '1px solid #30363D' : 'none',
          borderRadius: isBot ? '0px 12px 12px 12px' : '12px 0px 12px 12px',
          padding: '10px 14px',
          fontSize: '0.9rem',
          lineHeight: '1.4',
          wordBreak: 'break-word',
          whiteSpace: 'pre-line'
        }}>
          {message.content}
        </div>
        
        {/* Time */}
        <span style={{
          fontSize: '0.7rem',
          color: '#8B949E',
          marginTop: '4px',
          padding: '0 4px'
        }}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
