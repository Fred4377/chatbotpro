import React, { useState, useEffect, useContext } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import ConversationCard from '../../components/ConversationCard';
import ChatMessage from '../../components/ChatMessage';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ConversationsPage = () => {
  const { user } = useContext(AuthContext);
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);

  // Fetch bot config to get custom colors/names for rendering messages
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/config');
        if (res.data.success) {
          setConfig(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching bot config:', err);
      }
    };
    if (user) {
      fetchConfig();
    }
  }, [user]);

  const fetchConversations = async (selectId = null) => {
    try {
      const res = await api.get('/conversations');
      if (res.data.success) {
        setConversations(res.data.data);
        
        if (res.data.data.length > 0) {
          if (selectId) {
            const found = res.data.data.find(c => c.sessionId === selectId);
            setSelectedConversation(found || res.data.data[0]);
          } else if (!selectedConversation) {
            setSelectedConversation(res.data.data[0]);
          } else {
            // Update currently selected conversation in case of updates
            const updated = res.data.data.find(c => c.sessionId === selectedConversation.sessionId);
            setSelectedConversation(updated || res.data.data[0]);
          }
        } else {
          setSelectedConversation(null);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const handleSelect = (conv) => {
    setSelectedConversation(conv);
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.delete(`/conversations/${sessionId}`);
      if (res.data.success) {
        toast.success('Conversation deleted successfully');
        // Reload conversations, set selected to null or next conversation
        const remaining = conversations.filter(c => c.sessionId !== sessionId);
        setConversations(remaining);
        if (remaining.length > 0) {
          setSelectedConversation(remaining[0]);
        } else {
          setSelectedConversation(null);
        }
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
      toast.error('Failed to delete conversation');
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(c => {
    const q = searchQuery.toLowerCase();
    const name = (c.customerName || '').toLowerCase();
    const session = c.sessionId.toLowerCase();
    const firstMsg = c.messages[0] ? c.messages[0].content.toLowerCase() : '';
    return name.includes(q) || session.includes(q) || firstMsg.includes(q);
  });

  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      
      <main className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '20px' }}>
        <div style={{ marginBottom: '24px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
            Customer Conversations
          </h1>
          <p style={{ color: '#8B949E' }}>Browse, inspect, and manage active chat logs between client users and your AI.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#1E90FF' }}></i>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '35fr 65fr',
            gap: '24px',
            flex: 1,
            minHeight: 0
          }} className="conversations-grid">
            
            {/* LEFT PANEL: Conversation List */}
            <div style={{
              background: '#161B22',
              border: '1px solid #30363D',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '20px', flexShrink: 0 }}>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '35px' }}
                />
                <i className="fa-solid fa-magnifying-glass" style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#8B949E',
                  fontSize: '0.9rem'
                }}></i>
              </div>

              {/* Scrollable List */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => (
                    <ConversationCard
                      key={conv.sessionId}
                      conversation={conv}
                      isActive={selectedConversation?.sessionId === conv.sessionId}
                      onClick={() => handleSelect(conv)}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: '#8B949E', padding: '30px 10px' }}>
                    <i className="fa-solid fa-circle-question" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                    <p style={{ fontSize: '0.85rem' }}>No conversations found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL: Conversation Detail */}
            <div style={{
              background: '#161B22',
              border: '1px solid #30363D',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              overflow: 'hidden'
            }}>
              {selectedConversation ? (
                <>
                  {/* Detail Header */}
                  <div style={{
                    padding: '16px 20px',
                    background: '#0D1117',
                    borderBottom: '1px solid #30363D',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>
                        {selectedConversation.customerName || `Session ${selectedConversation.sessionId.substring(0, 8)}`}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#8B949E' }}>
                        Session ID: {selectedConversation.sessionId}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(selectedConversation.sessionId)}
                      className="btn btn-danger btn-secondary"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.85rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#EF4444'
                      }}
                      title="Delete Conversation"
                    >
                      <i className="fa-solid fa-trash-can" style={{ marginRight: '6px' }}></i> Delete Chat
                    </button>
                  </div>

                  {/* Messages replica list */}
                  <div style={{
                    flex: 1,
                    padding: '24px',
                    overflowY: 'auto',
                    background: '#0D1117'
                  }}>
                    {/* Welcome message replica */}
                    <div style={{
                      textAlign: 'center',
                      margin: '10px 0 30px 0',
                      opacity: 0.8
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: config?.primaryColor || '#1E90FF',
                        margin: '0 auto 10px auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '1rem'
                      }}>
                        {config?.botName ? config.botName.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: '600' }}>Welcome Chat initialized</h5>
                      <p style={{ fontSize: '0.8rem', color: '#8B949E', margin: '4px auto 0 auto', maxWidth: '380px' }}>
                        "{config?.welcomeMessage}"
                      </p>
                    </div>

                    {/* Messages */}
                    {selectedConversation.messages && selectedConversation.messages.map((msg, idx) => (
                      <ChatMessage
                        key={idx}
                        message={msg}
                        botName={config?.botName || 'Assistant'}
                        primaryColor={config?.primaryColor || '#1E90FF'}
                      />
                    ))}
                  </div>

                  {/* Detail Footer (Metadata info) */}
                  <div style={{
                    padding: '12px 20px',
                    background: '#161B22',
                    borderTop: '1px solid #30363D',
                    fontSize: '0.8rem',
                    color: '#8B949E',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexShrink: 0
                  }}>
                    <span>Started: {new Date(selectedConversation.startedAt).toLocaleString()}</span>
                    <span>Total messages: {selectedConversation.totalMessages || selectedConversation.messages.length}</span>
                  </div>
                </>
              ) : (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8B949E',
                  padding: '40px'
                }}>
                  <i className="fa-solid fa-comments" style={{ fontSize: '3rem', marginBottom: '15px', color: '#30363D' }}></i>
                  <h3>Select a conversation</h3>
                  <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Click a chat session on the left panel to inspect message details.</p>
                </div>
              )}
            </div>
            
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .conversations-grid {
            grid-template-columns: 1fr !important;
          }
          .conversations-grid > div:nth-child(2) {
            display: none !important; /* Hide details panel on mobile for simplified master view */
          }
        }
      `}</style>
    </div>
  );
};

export default ConversationsPage;
