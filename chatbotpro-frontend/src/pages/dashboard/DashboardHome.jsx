import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/DashboardSidebar';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    activeToday: 0,
    commonQuestions: ['Opening hours', 'Menu items', 'Reservations']
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/conversations');
        if (res.data.success) {
          const list = res.data.data;
          
          // Calculate messages
          let totalMsgs = 0;
          let todayCount = 0;
          const todayStr = new Date().toDateString();

          list.forEach(c => {
            totalMsgs += c.messages ? c.messages.length : 0;
            const lastActive = new Date(c.lastMessageAt).toDateString();
            if (lastActive === todayStr) {
              todayCount++;
            }
          });

          // Extract mock/real common questions
          let questions = ['Opening hours', 'Menu items', 'Reservations'];
          // Look at user messages
          const userMsgs = [];
          list.forEach(c => {
            if (c.messages) {
              c.messages.forEach(m => {
                if (m.role === 'user') userMsgs.push(m.content.toLowerCase());
              });
            }
          });

          if (userMsgs.length > 0) {
            const freq = {};
            const terms = ['hour', 'open', 'menu', 'food', 'price', 'pricing', 'reserve', 'book', 'location', 'where'];
            userMsgs.forEach(m => {
              terms.forEach(t => {
                if (m.includes(t)) {
                  let label = '';
                  if (t === 'hour' || t === 'open') label = 'Opening Hours';
                  else if (t === 'menu' || t === 'food' || t === 'price' || t === 'pricing') label = 'Menu & Prices';
                  else if (t === 'reserve' || t === 'book') label = 'Bookings';
                  else if (t === 'location' || t === 'where') label = 'Location';
                  
                  if (label) freq[label] = (freq[label] || 0) + 1;
                }
              });
            });

            const sorted = Object.keys(freq).sort((a,b) => freq[b] - freq[a]);
            if (sorted.length > 0) {
              questions = sorted.slice(0, 3);
            }
          }

          setStats({
            totalConversations: list.length,
            totalMessages: totalMsgs,
            activeToday: todayCount,
            commonQuestions: questions
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      
      <main className="dashboard-content">
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
            Welcome, {user?.name || 'Partner'}!
          </h1>
          <p style={{ color: '#8B949E' }}>Here is what's happening with your chatbot helper.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#1E90FF' }}></i>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {/* Stat 1 */}
              <div className="glow-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  background: 'rgba(30, 144, 255, 0.1)',
                  color: '#1E90FF',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '1.5rem'
                }}>
                  <i className="fa-solid fa-comments"></i>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#8B949E', display: 'block' }}>Total Chats</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '700' }}>{stats.totalConversations}</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="glow-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '1.5rem'
                }}>
                  <i className="fa-solid fa-paper-plane"></i>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#8B949E', display: 'block' }}>Messages Traded</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '700' }}>{stats.totalMessages}</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="glow-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: '#8B5CF6',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '1.5rem'
                }}>
                  <i className="fa-solid fa-user-clock"></i>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#8B949E', display: 'block' }}>Active Today</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '700' }}>{stats.activeToday}</span>
                </div>
              </div>
            </div>

            {/* Common Questions & Actions Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '30px',
              alignItems: 'start'
            }}>
              {/* Left Column: Common Questions */}
              <div className="glow-card" style={{ height: '100%' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-chart-line" style={{ color: '#1E90FF' }}></i>
                  <span>Most Asked Questions</span>
                </h3>
                <p style={{ color: '#8B949E', fontSize: '0.9rem', marginBottom: '20px' }}>
                  These are the top topics customer users enquire about.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {stats.commonQuestions.map((q, i) => (
                    <span key={i} style={{
                      background: '#1C2128',
                      border: '1px solid #30363D',
                      color: '#E6EDF3',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="fa-solid fa-hashtag" style={{ color: '#1E90FF' }}></i>
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Quick Actions */}
              <div className="glow-card" style={{ height: '100%' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button onClick={() => navigate('/dashboard/configure')} className="btn" style={{ justifyContent: 'flex-start', padding: '12px 20px' }}>
                    <i className="fa-solid fa-sliders" style={{ width: '20px' }}></i> Configure Your Bot
                  </button>
                  <button onClick={() => navigate('/dashboard/conversations')} className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px 20px' }}>
                    <i className="fa-solid fa-comments" style={{ width: '20px' }}></i> View Conversations
                  </button>
                  <button onClick={() => navigate('/dashboard/embed')} className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px 20px' }}>
                    <i className="fa-solid fa-code" style={{ width: '20px' }}></i> Get Embed Code
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <style>{`
        @media (max-width: 992px) {
          .dashboard-content > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;
