import React, { useState, useEffect, useContext } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import ChatWidget from '../../components/ChatWidget';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EmbedPage = () => {
  const { user } = useContext(AuthContext);
  
  const [botId, setBotId] = useState('');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadEmbedDetails = async () => {
      try {
        const resEmbed = await api.get('/config/embed-code');
        if (resEmbed.data.success) {
          setBotId(resEmbed.data.botId);
        }

        const resConfig = await api.get('/config');
        if (resConfig.data.success) {
          setConfig(resConfig.data.data);
        }
      } catch (err) {
        console.error('Error fetching embed settings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadEmbedDetails();
    }
  }, [user]);

  const embedSnippet = `<script src="https://chatbotpro.app/widget.js" data-bot-id="${botId || 'YOUR_BOT_ID'}"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    toast.success('Snippet copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      
      <main className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px', paddingBottom: '50px' }}>
        {/* Left Column: Embed Guide */}
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
              Add ChatBot Pro to Your Website
            </h1>
            <p style={{ color: '#8B949E' }}>Follow these simple steps to install the assistant widget on any web page.</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#1E90FF' }}></i>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Step 1 */}
              <div className="glow-card">
                <span style={{
                  color: '#1E90FF',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Step 1</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '4px 0 15px 0' }}>Copy this one line of code</h3>
                
                <div style={{
                  background: '#0D1117',
                  border: '1px solid #30363D',
                  borderRadius: '6px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <code style={{
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: '#E6EDF3',
                    wordBreak: 'break-all',
                    flex: 1
                  }}>
                    {embedSnippet}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="btn"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    <i className={`fa-solid ${copied ? 'fa-circle-check' : 'fa-copy'}`}></i>
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="glow-card">
                <span style={{
                  color: '#1E90FF',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Step 2</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '4px 0 15px 0' }}>
                  Paste it in your website's HTML, before closing body tag
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#8B949E', marginBottom: '15px', lineHeight: '1.5' }}>
                  Open your site template files and add the script line right before the closing <code>&lt;/body&gt;</code> element.
                </p>
                <div style={{
                  background: '#0D1117',
                  border: '1px solid #30363D',
                  borderRadius: '6px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#8B949E',
                  lineHeight: '1.5'
                }}>
                  <p>&lt;html&gt;</p>
                  <p>&nbsp;&nbsp;&lt;body&gt;</p>
                  <p style={{ color: '#58a6ff' }}>&nbsp;&nbsp;&nbsp;&nbsp;&lt;!-- Your website content --&gt;</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;Hello World&lt;/h1&gt;</p>
                  <br />
                  <p style={{ color: '#10B981', fontWeight: '600' }}>&nbsp;&nbsp;&nbsp;&nbsp;&lt;!-- Paste here --&gt;</p>
                  <p style={{ color: '#10B981', background: 'rgba(16,185,129,0.05)', display: 'inline-block', padding: '2px 4px', borderRadius: '4px', wordBreak: 'break-all' }}>
                    {embedSnippet}
                  </p>
                  <p>&nbsp;&nbsp;&lt;/body&gt;</p>
                  <p>&lt;/html&gt;</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="glow-card">
                <span style={{
                  color: '#1E90FF',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Step 3</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '4px 0 10px 0' }}>Your widget will appear automatically</h3>
                <p style={{ fontSize: '0.85rem', color: '#8B949E', lineHeight: '1.5' }}>
                  Save your HTML and refresh the page. The floating bot bubble will appear in the bottom-right corner, immediately ready to help.
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Right Column: Preview & Live Test */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Browser Mockup Preview */}
          <div className="glow-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '15px' }}>Browser Mockup Preview</h3>
            
            {/* Mock Browser Container */}
            <div style={{
              background: '#0D1117',
              border: '1px solid #30363D',
              borderRadius: '8px',
              height: '240px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              {/* Browser Address Bar */}
              <div style={{
                background: '#161B22',
                borderBottom: '1px solid #30363D',
                padding: '8px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: '#8B949E'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                </div>
                <div style={{
                  background: '#0D1117',
                  borderRadius: '4px',
                  padding: '2px 30px',
                  flex: 1,
                  textAlign: 'center',
                  border: '1px solid #30363D',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}>
                  https://yourbusiness.com
                </div>
              </div>
              
              {/* Browser Content Mockup */}
              <div style={{ flex: 1, padding: '20px', fontSize: '0.8rem', color: '#8B949E' }}>
                <h4 style={{ color: '#E6EDF3', marginBottom: '6px', fontSize: '0.95rem' }}>Welcome to Our Web Store</h4>
                <p style={{ lineHeight: '1.4' }}>We offer premium quality products and outstanding support. Scroll down to see options.</p>
                
                {/* Floating mock chat bubble */}
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: config?.primaryColor || '#1E90FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  fontSize: '0.9rem'
                }}>
                  <i className="fa-solid fa-comments"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Test Section */}
          <div className="glow-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '10px' }}>Test your live chatbot below</h3>
            <p style={{ fontSize: '0.8rem', color: '#8B949E', marginBottom: '15px', lineHeight: '1.4' }}>
              Click the chatbot bubble in the bottom right corner of this screen to test it in production mode.
            </p>
          </div>
        </div>
      </main>

      {/* Embedding actual ChatWidget with configuration in production mode (non-preview) */}
      {!loading && config && (
        <ChatWidget 
          botConfig={config} 
          botOwnerId={botId} 
          previewMode={false} 
        />
      )}

      <style>{`
        @media (max-width: 992px) {
          .dashboard-content {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EmbedPage;
