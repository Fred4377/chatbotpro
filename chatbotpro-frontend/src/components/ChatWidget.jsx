import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { getOrCreateSessionId, resetSessionId } from '../utils/session';
import ChatBubble from './ChatBubble';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const ChatWidget = ({ botConfig, botOwnerId, previewMode = false, autofillText = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [disableSendTemp, setDisableSendTemp] = useState(false);
  
  const messagesEndRef = useRef(null);
  const sessionId = getOrCreateSessionId();

  // Handle autofill changes from parent
  useEffect(() => {
    if (autofillText) {
      setIsOpen(true);
      setInputText(autofillText);
    }
  }, [autofillText]);

  // Load default configurations
  const config = {
    botName: botConfig?.botName || 'Assistant',
    welcomeMessage: botConfig?.welcomeMessage || 'Hi! How can I help you today?',
    primaryColor: botConfig?.primaryColor || '#1E90FF',
    fallbackMessage: botConfig?.fallbackMessage || "I'm not sure about that. Please contact us directly.",
    isActive: botConfig?.isActive !== undefined ? botConfig.isActive : true
  };

  // Fetch conversation history from API on load
  useEffect(() => {
    const fetchHistory = async () => {
      if (previewMode || !botOwnerId) return;
      try {
        const res = await api.get(`/chat/session/${sessionId}`);
        if (res.data.success && res.data.data && res.data.data.messages) {
          setMessages(res.data.data.messages);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    fetchHistory();
  }, [sessionId, botOwnerId, previewMode]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle opening widget
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  // Quick replies
  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  const sendMessage = async (textToSend) => {
    const text = textToSend.trim();
    if (!text) return;

    // Add user message immediately
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setIsRateLimited(false);
    setDisableSendTemp(true);

    // Re-enable send after 1 second (frontend rate limiting request throttling)
    setTimeout(() => {
      setDisableSendTemp(false);
    }, 1000);

    // If previewMode is true and there is no owner yet (mock setup), handle mock replies locally
    if (previewMode && !botOwnerId) {
      setTimeout(() => {
        setIsTyping(false);
        const lower = text.toLowerCase();
        let reply = '';
        if (lower.includes('mombasa') || lower.includes('deliver') || lower.includes('ship')) {
          reply = "Yes, we do! 📦 We ship countrywide via G4S or Wells Fargo Courier. Delivery to Mombasa takes 24 hours and costs KSh 350.";
        } else if (lower.includes('payment') || lower.includes('mpesa') || lower.includes('stk')) {
          reply = "We accept Lipa na M-Pesa (C2B Paybill or STK Push), Visa, Mastercard, and Cash on Delivery for orders inside Nairobi CBD.";
        } else if (lower.includes('office') || lower.includes('nairobi') || lower.includes('location') || lower.includes('where')) {
          reply = "Our developer workstation is located in Westlands, Nairobi, near the Inceptor Institute of Technology campus.";
        } else if (lower.includes('hour') || lower.includes('time') || lower.includes('open')) {
          reply = "We are open Monday to Saturday from 9am to 10pm, and Sunday from 10am to 9pm.";
        } else if (lower.includes('menu') || lower.includes('food') || lower.includes('serve') || lower.includes('price')) {
          reply = "We serve delicious Italian and local cuisine. Popular items: Pizza KSh 800, Pasta KSh 700, Burger KSh 600.";
        } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('whatsapp') || lower.includes('call')) {
          reply = "You can contact us via phone or WhatsApp at +254700000000.";
        } else {
          reply = config.fallbackMessage;
        }

        setMessages(prev => [...prev, {
          role: 'bot',
          content: reply,
          timestamp: new Date().toISOString()
        }]);
      }, 1000);
      return;
    }


    try {
      // POST message to API
      // Send history (max last 10 messages)
      const formattedHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await api.post('/chat/message', {
        sessionId,
        botOwnerId,
        message: text,
        history: formattedHistory
      });

      setIsTyping(false);
      if (response.data && response.data.reply) {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: response.data.reply,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (err) {
      setIsTyping(false);
      const isRateLimitResponse = err.response?.status === 429 || err.response?.data?.message?.includes('too many messages');
      
      const errMsg = {
        role: 'bot',
        content: isRateLimitResponse 
          ? "You've sent too many messages. Please wait a moment."
          : "Sorry, I'm having trouble connecting. Please try again.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errMsg]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isTyping && !disableSendTemp) {
      sendMessage(inputText);
    }
  };

  const showQuickReplies = messages.filter(m => m.role === 'user').length === 0;

  return (
    <div 
      className="chat-widget-container"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      {/* Closed State Bubble */}
      {!isOpen && (
        <ChatBubble 
          onClick={handleToggle} 
          primaryColor={config.primaryColor} 
          hasUnread={hasUnread} 
        />
      )}

      {/* Open State Chat Window */}
      {isOpen && (
        <div 
          className="chat-window animate-slide-up"
          style={{
            width: '360px',
            height: '500px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'absolute',
            bottom: '0',
            right: '0'
          }}
        >
          {/* Header */}
          <div 
            style={{
              padding: '15px',
              background: 'var(--card-bg)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Bot Avatar */}
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: config.primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1rem',
                  position: 'relative',
                  color: '#fff'
                }}
              >
                {config.botName.charAt(0).toUpperCase()}
                {/* Active Indicator */}
                <span 
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10B981',
                    border: '2px solid var(--card-bg)'
                  }}
                ></span>
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{config.botName}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Online Support</span>
              </div>
            </div>
            
            {/* Window Controls */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleToggle}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
                aria-label="Minimize Chat"
              >
                <i className="fa-solid fa-chevron-down"></i>
              </button>
              <button 
                onClick={handleToggle}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
                aria-label="Close Chat"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>


          {/* Messages Area */}
          <div 
            style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              background: '#f9fafb',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Welcome Message Card (First opening) */}
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                margin: '20px 0',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: config.primaryColor,
                  margin: '0 auto 10px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1.3rem',
                  fontWeight: '700'
                }}>
                  {config.botName.charAt(0).toUpperCase()}
                </div>
                <h5 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-color)' }}>Hi! I'm {config.botName}</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0 20px', lineHeight: '1.4' }}>
                  {config.welcomeMessage}
                </p>
              </div>
            )}

            {/* List messages */}
            {messages.map((msg, index) => (
              <ChatMessage 
                key={index} 
                message={msg} 
                botName={config.botName} 
                primaryColor={config.primaryColor} 
              />
            ))}

            {/* Typing Animation */}
            {isTyping && <TypingIndicator primaryColor={config.primaryColor} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Panel */}
          {showQuickReplies && (
            <div style={{
              padding: '0 15px 10px 15px',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              background: '#f9fafb'
            }}>
              <button 
                onClick={() => handleQuickReply('Do you deliver to Mombasa?')}
                style={{
                  background: 'rgba(0, 112, 243, 0.08)',
                  border: '1px solid rgba(0, 112, 243, 0.2)',
                  borderRadius: '16px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  color: 'var(--primary-color)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  fontWeight: '500'
                }}
                className="btn-quick-reply"
              >
                Mombasa Delivery?
              </button>
              <button 
                onClick={() => handleQuickReply('What are your payment options?')}
                style={{
                  background: 'rgba(0, 112, 243, 0.08)',
                  border: '1px solid rgba(0, 112, 243, 0.2)',
                  borderRadius: '16px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  color: 'var(--primary-color)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  fontWeight: '500'
                }}
                className="btn-quick-reply"
              >
                M-Pesa Payments?
              </button>
              <button 
                onClick={() => handleQuickReply('Where is your office in Nairobi?')}
                style={{
                  background: 'rgba(0, 112, 243, 0.08)',
                  border: '1px solid rgba(0, 112, 243, 0.2)',
                  borderRadius: '16px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  color: 'var(--primary-color)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  fontWeight: '500'
                }}
                className="btn-quick-reply"
              >
                Nairobi Office?
              </button>
            </div>
          )}

          {/* Input Area */}
          <div 
            style={{
              padding: '10px 15px',
              background: 'var(--card-bg)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <input 
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              style={{
                flex: 1,
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '8px 12px',
                outline: 'none',
                fontSize: '0.9rem',
                color: 'var(--text-color)'
              }}
            />

            <button 
              onClick={() => sendMessage(inputText)}
              disabled={isTyping || !inputText.trim() || disableSendTemp}
              style={{
                background: config.primaryColor,
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: (isTyping || !inputText.trim() || disableSendTemp) ? 0.6 : 1,
                transition: 'opacity 0.2s'
              }}
              aria-label="Send Message"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      {/* Responsive overrides to render full screen on mobile */}
      <style>{`
        .btn-quick-reply:hover {
          background: rgba(30, 144, 255, 0.2) !important;
        }
        @media (max-width: 480px) {
          .chat-window {
            width: 100vw !important;
            height: 100vh !important;
            bottom: -20px !important;
            right: -20px !important;
            border-radius: 0 !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
