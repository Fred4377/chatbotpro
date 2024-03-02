import React, { useState, useEffect, useContext } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import ChatWidget from '../../components/ChatWidget';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ConfigurePage = () => {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    botName: 'Assistant',
    welcomeMessage: 'Hi! How can I help you today?',
    primaryColor: '#1E90FF',
    businessInfo: '',
    personality: 'friendly',
    language: 'English',
    fallbackMessage: "I'm not sure about that. Please contact us directly.",
    isActive: true
  });
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customColor, setCustomColor] = useState('#1E90FF');

  const presetColors = [
    { name: 'Blue', hex: '#1E90FF' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Black', hex: '#1F2937' }
  ];

  const personalityMapping = {
    'friendly': 'Friendly and Warm',
    'professional': 'Professional and Formal',
    'casual': 'Casual and Fun',
    'formal': 'Direct and Efficient'
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/config');
        if (res.data.success && res.data.data) {
          const config = res.data.data;
          setFormData({
            botName: config.botName || 'Assistant',
            welcomeMessage: config.welcomeMessage || 'Hi! How can I help you today?',
            primaryColor: config.primaryColor || '#1E90FF',
            businessInfo: config.businessInfo || '',
            personality: config.personality || 'friendly',
            language: config.language || 'English',
            fallbackMessage: config.fallbackMessage || "I'm not sure about that. Please contact us directly.",
            isActive: config.isActive !== undefined ? config.isActive : true
          });
          
          // Check if primaryColor matches preset, if not set customColor
          const isPreset = presetColors.some(c => c.hex.toLowerCase() === config.primaryColor?.toLowerCase());
          if (!isPreset && config.primaryColor) {
            setCustomColor(config.primaryColor);
          }
        }
      } catch (err) {
        console.error('Error fetching config:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConfig();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleColorPreset = (hex) => {
    setFormData(prev => ({ ...prev, primaryColor: hex }));
  };

  const handleCustomColorChange = (e) => {
    const hex = e.target.value;
    setCustomColor(hex);
    setFormData(prev => ({ ...prev, primaryColor: hex }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.businessInfo.trim()) {
      toast.error('Please enter details about your business. This is the knowledge base!');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.put('/config', formData);
      if (res.data.success) {
        toast.success('Your bot has been updated!');
      }
    } catch (err) {
      console.error('Error updating bot config:', err);
      toast.error(err.response?.data?.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      
      <main className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        {/* Left Column: Form */}
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
              Configure Your Chatbot
            </h1>
            <p style={{ color: '#8B949E' }}>Configure identity details, business knowledge settings, colors, and fallbacks.</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#1E90FF' }}></i>
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '50px' }}>
              
              {/* SECTION 1 — Bot Identity */}
              <div className="glow-card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-circle-user" style={{ color: '#1E90FF' }}></i>
                  <span>Section 1: Bot Identity</span>
                </h3>
                
                <div className="form-group">
                  <label htmlFor="botName">Bot Name</label>
                  <input
                    type="text"
                    id="botName"
                    name="botName"
                    className="form-control"
                    value={formData.botName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="welcomeMessage">Welcome Message</label>
                  <textarea
                    id="welcomeMessage"
                    name="welcomeMessage"
                    className="form-control"
                    rows="3"
                    value={formData.welcomeMessage}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="personality">Bot Personality</label>
                  <select
                    id="personality"
                    name="personality"
                    className="form-control"
                    style={{ background: '#0D1117' }}
                    value={formData.personality}
                    onChange={handleChange}
                  >
                    {Object.entries(personalityMapping).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION 2 — Business Information */}
              <div className="glow-card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-database" style={{ color: '#1E90FF' }}></i>
                  <span>Section 2: Business Information</span>
                </h3>
                
                <div className="form-group">
                  <label htmlFor="businessInfo">Business Details (AI Knowledge Base)</label>
                  <textarea
                    id="businessInfo"
                    name="businessInfo"
                    className="form-control"
                    rows="10"
                    placeholder="Describe your business in detail. Include: your business name, location, opening hours, services/menu with prices, phone number, website, FAQs, and anything a customer might ask about. The more detail you provide, the smarter your chatbot will be."
                    value={formData.businessInfo}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#8B949E', marginTop: '6px' }}>
                    <span>💡 Include opening hours, menu prices, location, and contacts for best results.</span>
                    <span>{formData.businessInfo.length} characters</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3 — Appearance */}
              <div className="glow-card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-palette" style={{ color: '#1E90FF' }}></i>
                  <span>Section 3: Appearance</span>
                </h3>
                
                <div className="form-group">
                  <label>Primary Theme Color</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                    {presetColors.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => handleColorPreset(color.hex)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: color.hex,
                          border: formData.primaryColor === color.hex ? '3px solid #fff' : '1px solid #30363D',
                          cursor: 'pointer',
                          boxShadow: formData.primaryColor === color.hex ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                          transition: 'transform 0.1s'
                        }}
                        title={color.name}
                      ></button>
                    ))}
                    
                    {/* Custom Hex Color Picker */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={customColor}
                        onChange={handleCustomColorChange}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          background: 'none'
                        }}
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="form-control"
                        style={{ width: '100px', padding: '5px 10px', fontSize: '0.85rem' }}
                        placeholder="#1E90FF"
                      />
                    </div>
                  </div>
                  
                  {/* Live color bubble indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: formData.primaryColor
                    }}></div>
                    <span style={{ fontSize: '0.85rem', color: '#8B949E' }}>Active color preview</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4 — Advanced */}
              <div className="glow-card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-gears" style={{ color: '#1E90FF' }}></i>
                  <span>Section 4: Advanced Settings</span>
                </h3>

                <div className="form-group">
                  <label htmlFor="fallbackMessage">Fallback Message</label>
                  <input
                    type="text"
                    id="fallbackMessage"
                    name="fallbackMessage"
                    className="form-control"
                    value={formData.fallbackMessage}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '30px' }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="language">Response Language</label>
                    <select
                      id="language"
                      name="language"
                      className="form-control"
                      style={{ background: '#0D1117' }}
                      value={formData.language}
                      onChange={handleChange}
                    >
                      <option value="English">English</option>
                      <option value="Swahili">Swahili</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span>Chatbot Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  type="submit"
                  className={`btn ${isSaving ? 'btn-disabled' : ''}`}
                  style={{ flex: 1, padding: '12px' }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Saving changes...
                    </>
                  ) : (
                    'Save Configuration'
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

        {/* Right Column: Live Chat Preview Panel */}
        <div className="live-preview-panel" style={{
          position: 'sticky',
          top: '100px',
          height: 'calc(100vh - 140px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid #30363D',
          paddingLeft: '30px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Live Preview</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginTop: '6px' }}>Test Your Chatbot Here</h3>
            <p style={{ fontSize: '0.8rem', color: '#8B949E', maxWidth: '280px', margin: '4px auto 0 auto' }}>
              Changes update instantly. Click the widget in the corner to chat with your configuration.
            </p>
          </div>
          
          <ChatWidget 
            botConfig={formData} 
            botOwnerId={user?._id} 
            previewMode={true} 
          />
        </div>
      </main>

      <style>{`
        @media (max-width: 992px) {
          .dashboard-content {
            grid-template-columns: 1fr !important;
          }
          .live-preview-panel {
            position: relative !important;
            top: 0 !important;
            height: auto !important;
            border-left: none !important;
            padding-left: 0 !important;
            margin-top: 40px;
            padding-bottom: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default ConfigurePage;
