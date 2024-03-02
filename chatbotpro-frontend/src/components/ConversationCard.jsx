import React from 'react';

const ConversationCard = ({ conversation, isActive, onClick }) => {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const lastMessageText = lastMessage ? lastMessage.content : 'No messages yet';
  
  // Format date
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 15px',
        background: isActive ? 'rgba(30, 144, 255, 0.1)' : '#161B22',
        border: `1px solid ${isActive ? '#1E90FF' : '#30363D'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
        marginBottom: '10px'
      }}
      className="conversation-card"
    >
      {/* Icon */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#30363D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
        color: '#1E90FF',
        flexShrink: 0
      }}>
        <i className="fa-solid fa-message"></i>
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#E6EDF3', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {conversation.customerName || `Session ${conversation.sessionId.substring(0, 6)}`}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#8B949E' }}>
            {formatDate(conversation.lastMessageAt)}
          </span>
        </div>
        <p style={{
          fontSize: '0.8rem',
          color: '#8B949E',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          margin: 0
        }}>
          {lastMessageText}
        </p>
      </div>

      {/* Badge */}
      <div style={{
        background: isActive ? '#1E90FF' : '#30363D',
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: '600',
        borderRadius: '10px',
        padding: '2px 8px',
        minWidth: '22px',
        textAlign: 'center'
      }}>
        {conversation.totalMessages || conversation.messages.length}
      </div>
    </div>
  );
};

export default ConversationCard;
