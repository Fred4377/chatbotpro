import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

const LandingPage = () => {
  const [fakeMessages, setFakeMessages] = useState([
    { role: 'bot', content: "Hi! I'm Bella. How can I help you today?", timestamp: new Date().toISOString() }
  ]);
  const [fakeIndex, setFakeIndex] = useState(0);

  const conversationTimeline = [
    { role: 'user', content: "What time do you open on Saturdays?", delay: 2500 },
    { role: 'bot', content: "We open from 9:00 AM to 10:00 PM on Saturdays. Would you like to check our menu or make a reservation?", delay: 2500 },
    { role: 'user', content: "Do you have pizza? How much is it?", delay: 3000 },
    { role: 'bot', content: "Yes! We serve delicious Margherita Pizza for $8. We also serve Pasta Carbonara ($9) and Burgers ($7).", delay: 3000 },
    { role: 'user', content: "Awesome, how do I make a reservation?", delay: 2500 },
    { role: 'bot', content: "You can book directly by calling us at +254700000000 or sending us a WhatsApp message! I can help you with anything else.", delay: 3000 }
  ];

  useEffect(() => {
    if (fakeIndex < conversationTimeline.length) {
      const timer = setTimeout(() => {
        setFakeMessages(prev => [...prev, {
          role: conversationTimeline[fakeIndex].role,
          content: conversationTimeline[fakeIndex].content,
          timestamp: new Date().toISOString()
        }]);
        setFakeIndex(prev => prev + 1);
      }, conversationTimeline[fakeIndex].delay);
      return () => clearTimeout(timer);
    } else {
      // Loop it
      const resetTimer = setTimeout(() => {
        setFakeMessages([{ role: 'bot', content: "Hi! I'm Bella. How can I help you today?", timestamp: new Date().toISOString() }]);
        setFakeIndex(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [fakeIndex]);

  // Demo config for the restaurant preview on the page
  const demoBotConfig = {
    botName: "Bella",
    welcomeMessage: "Welcome to Bella Bites! Ask me about our opening hours, menu, or booking a table.",
    primaryColor: "#C0392B",
    businessInfo: "Bella Bites Restaurant, Nairobi Kenya. We serve Italian and local cuisine. Hours: Mon-Sat 9am-10pm, Sun 10am-9pm. Menu: Margherita Pizza $8, Pasta Carbonara $9, Beef Burger $7, Caesar Salad $6, Tiramisu $4. Reservations: +254700000000 or WhatsApp. Free parking. Delivery available via Uber Eats.",
    personality: "friendly",
    language: "English",
    isActive: true,
    fallbackMessage: "I'm not sure about that. Please contact us directly at +254700000000."
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{
        padding: '80px 0',
        background: 'radial-gradient(circle at 80% 20%, rgba(30, 144, 255, 0.08) 0%, transparent 50%)',
        borderBottom: '1px solid #30363D'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '50px',
          alignItems: 'center'
        }}>
          {/* Hero Left */}
          <div>
            <span style={{
              background: 'rgba(30, 144, 255, 0.1)',
              color: '#1E90FF',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'inline-block',
              marginBottom: '20px',
              border: '1px solid rgba(30, 144, 255, 0.2)'
            }}>
              <i className="fa-solid fa-sparkles" style={{ marginRight: '6px' }}></i>
              AI-Powered &bull; Available 24/7
            </span>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              lineHeight: '1.15',
              marginBottom: '20px',
              color: '#fff'
            }}>
              Give Your Business a <br />
              <span style={{
                background: 'linear-gradient(90deg, #1E90FF, #70b5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Smart AI Assistant</span>
            </h1>
            <p style={{
              fontSize: '1.15rem',
              color: '#8B949E',
              marginBottom: '35px',
              lineHeight: '1.6',
              maxWidth: '540px'
            }}>
              Your customers get instant answers anytime. You get more leads, happier clients, and less support workload. Instantly trained on your custom business details.
            </p>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn pulse-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                Get Started Free
              </Link>
              <Link to="/demo" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                Try the Demo
              </Link>
            </div>
          </div>

          {/* Hero Right: Animated Chat Preview */}
          <div className="hero-chat-preview-container" style={{
            background: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '12px',
            height: '420px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{
              padding: '12px 15px',
              background: '#0D1117',
              borderBottom: '1px solid #30363D',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#C0392B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}>
                B
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '600' }}>Bella (AI Assistant)</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
                  <span style={{ fontSize: '0.7rem', color: '#8B949E' }}>Online</span>
                </div>
              </div>
            </div>

            {/* Simulated Message List */}
            <div style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {fakeMessages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'bot' ? 'flex-start' : 'flex-end',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <div style={{
                    maxWidth: '80%',
                    background: msg.role === 'bot' ? '#1C2128' : '#1E4DB7',
                    border: msg.role === 'bot' ? '1px solid #30363D' : 'none',
                    color: '#E6EDF3',
                    padding: '8px 12px',
                    borderRadius: msg.role === 'bot' ? '0px 10px 10px 10px' : '10px 0px 10px 10px',
                    fontSize: '0.8rem',
                    lineHeight: '1.4'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input Overlay Mock */}
            <div style={{
              padding: '12px 15px',
              background: '#0D1117',
              borderTop: '1px solid #30363D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#8B949E',
              fontSize: '0.8rem'
            }}>
              <span>Customer is typing...</span>
              <i className="fa-solid fa-paper-plane" style={{ color: '#8B949E' }}></i>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid #30363D', background: '#0D1117' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '10px' }}>How ChatBot Pro Works</h2>
            <p style={{ color: '#8B949E', maxWidth: '600px', margin: '0 auto' }}>Set up your customized client chatbot helper in three straightforward steps.</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {/* Step 1 */}
            <div className="glow-card" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(30, 144, 255, 0.1)',
                color: '#1E90FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: '0 auto 20px auto'
              }}>1</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Create Your Account</h3>
              <p style={{ color: '#8B949E', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Sign up your business in seconds. Set your preferred colors, bot identity name, and custom support greetings.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="glow-card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(30, 144, 255, 0.1)',
                color: '#1E90FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: '0 auto 20px auto'
              }}>2</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Add Your Business Details</h3>
              <p style={{ color: '#8B949E', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Describe your operations: menu lists, service costs, open hours, and contacts. The AI learns everything instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glow-card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(30, 144, 255, 0.1)',
                color: '#1E90FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: '0 auto 20px auto'
              }}>3</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Embed Code & Launch</h3>
              <p style={{ color: '#8B949E', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Copy the single-line script embed tag and paste it on your website. Your AI assistant starts answering immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid #30363D', background: '#161B22' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '10px' }}>Powerful Bot Features</h2>
            <p style={{ color: '#8B949E', maxWidth: '600px', margin: '0 auto' }}>Equipped with modern generative AI features optimized for small business customer success.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {/* Card 1 */}
            <div className="glow-card" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ color: '#1E90FF', fontSize: '1.5rem', marginTop: '3px' }}><i className="fa-solid fa-brain"></i></div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Google Gemini AI</h3>
                <p style={{ color: '#8B949E', fontSize: '0.85rem', lineHeight: '1.5' }}>Driven by Gemini 1.5 Flash API, producing incredibly smart, rapid, and contextually matching interactions.</p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="glow-card" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ color: '#1E90FF', fontSize: '1.5rem', marginTop: '3px' }}><i className="fa-solid fa-clock"></i></div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Instant 24/7 Responses</h3>
                <p style={{ color: '#8B949E', fontSize: '0.85rem', lineHeight: '1.5' }}>Ensure your clients get instant answers at 2 AM without human support agents standing by.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glow-card" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ color: '#1E90FF', fontSize: '1.5rem', marginTop: '3px' }}><i className="fa-solid fa-palette"></i></div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Fully Customizable</h3>
                <p style={{ color: '#8B949E', fontSize: '0.85rem', lineHeight: '1.5' }}>Tailor the assistant's name, display colors, greeting messages, and personality configurations.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="glow-card" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ color: '#1E90FF', fontSize: '1.5rem', marginTop: '3px' }}><i className="fa-solid fa-rotate-left"></i></div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Contextual History</h3>
                <p style={{ color: '#8B949E', fontSize: '0.85rem', lineHeight: '1.5' }}>Integrates active conversational memory of past messages, allowing smooth multi-turn answers.</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="glow-card" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ color: '#1E90FF', fontSize: '1.5rem', marginTop: '3px' }}><i className="fa-solid fa-chart-column"></i></div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Dashboard Conversations</h3>
                <p style={{ color: '#8B949E', fontSize: '0.85rem', lineHeight: '1.5' }}>Inspect every user chat session details directly from the dashboard to track leads.</p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="glow-card" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ color: '#1E90FF', fontSize: '1.5rem', marginTop: '3px' }}><i className="fa-solid fa-shield-halved"></i></div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Rate Limited & Secure</h3>
                <p style={{ color: '#8B949E', fontSize: '0.85rem', lineHeight: '1.5' }}>Defends against spam queries with rate limits on the backend and input controls on the client.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '80px 0', borderBottom: '1px solid #30363D', background: '#0D1117' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '10px' }}>Simple, Transparent Pricing</h2>
            <p style={{ color: '#8B949E', maxWidth: '600px', margin: '0 auto' }}>Choose the plan that suits your client support needs. No credit card required to start.</p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            {/* Free */}
            <div style={{
              background: '#161B22',
              border: '1px solid #30363D',
              borderRadius: '12px',
              padding: '40px',
              width: '320px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Free Startup</h3>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '15px' }}>$0 <span style={{ fontSize: '1rem', color: '#8B949E', fontWeight: '400' }}>/ month</span></div>
              <p style={{ color: '#8B949E', fontSize: '0.85rem', marginBottom: '25px' }}>Perfect for trial testing and micro-businesses.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '35px', textAlign: 'left', fontSize: '0.9rem', color: '#E6EDF3' }}>
                <li><i className="fa-solid fa-circle-check" style={{ color: '#10B981', marginRight: '8px' }}></i> 100 Messages / month</li>
                <li><i className="fa-solid fa-circle-check" style={{ color: '#10B981', marginRight: '8px' }}></i> 1 AI Chatbot widget</li>
                <li><i className="fa-solid fa-circle-check" style={{ color: '#10B981', marginRight: '8px' }}></i> Contextual memory</li>
                <li><i className="fa-solid fa-circle-check" style={{ color: '#10B981', marginRight: '8px' }}></i> Business Dashboard</li>
              </ul>
              <Link to="/register" className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%' }}>Get Started</Link>
            </div>
            
            {/* Pro */}
            <div style={{
              background: '#161B22',
              border: '2px solid #1E90FF',
              borderRadius: '12px',
              padding: '40px',
              width: '320px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1E90FF',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '4px 12px',
                borderRadius: '12px',
                textTransform: 'uppercase'
              }}>Most Popular</span>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Professional</h3>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '15px' }}>$9 <span style={{ fontSize: '1rem', color: '#8B949E', fontWeight: '400' }}>/ month</span></div>
              <p style={{ color: '#8B949E', fontSize: '0.85rem', marginBottom: '25px' }}>For active websites requiring scaling support.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '35px', textAlign: 'left', fontSize: '0.9rem', color: '#E6EDF3' }}>
                <li><i className="fa-solid fa-circle-check" style={{ color: '#10B981', marginRight: '8px' }}></i> Unlimited Messages</li>
                <li><i className="fa-solid fa-circle-check" style={{ color: '#10B981', marginRight: '8px' }}></i> 1 AI Chatbot widget</li>
                <li><i className="fa-solid fa-circle-check" style={{ color: '#10B981', marginRight: '8px' }}></i> Priority support responses</li>
                <li><i className="fa-solid fa-circle-check" style={{ color: '#10B981', marginRight: '8px' }}></i> Premium customization</li>
                <li><i className="fa-solid fa-circle-check" style={{ color: '#10B981', marginRight: '8px' }}></i> Full history analytics</li>
              </ul>
              <Link to="/register" className="btn" style={{ marginTop: 'auto', width: '100%' }}>Go Pro</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Live Widget (Test preview on Landing Page) */}
      <div style={{
        padding: '50px 0',
        background: '#161B22',
        textAlign: 'center',
        borderBottom: '1px solid #30363D'
      }}>
        <div className="container">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Try the live Widget preview</h3>
          <p style={{ color: '#8B949E', fontSize: '0.9rem', marginBottom: '15px' }}>Click the red chat bubble in the bottom right corner of this page to talk to "Bella", configured for our sample restaurant.</p>
        </div>
      </div>

      <ChatWidget botConfig={demoBotConfig} previewMode={true} />
      <Footer />
      
      <style>{`
        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr !important;
          }
          .hero-chat-preview-container {
            max-width: 360px;
            margin: 0 auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
