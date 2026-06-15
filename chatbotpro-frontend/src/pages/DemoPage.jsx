import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

const DemoPage = () => {
  const [autofillValue, setAutofillValue] = useState('');

  // Frequently asked questions for the demo restaurant
  const suggestedQuestions = [
    "Do you deliver to Mombasa?",
    "What are your payment options?",
    "Where is your office in Nairobi?",
    "What is your most popular dish?",
    "How do I make a reservation?"
  ];

  const demoBotConfig = {
    botName: "Bella (AI Assistant)",
    welcomeMessage: "Jambo! 👋 I'm Bella. Ask me anything about Bella Bites Restaurant!",
    primaryColor: "#0070f3",
    businessInfo: "Bella Bites Restaurant, Nairobi. Italian & local cuisine. Open Mon-Sat 9am-10pm, Sun 10am-9pm. Menu: Pizza KSh 800, Pasta KSh 700, Burger KSh 600, Salad KSh 500. Deliveries: Countrywide via G4S (Mombasa KSh 350). Payments: Lipa na M-Pesa STK Push, Visa, Mastercard. Located in Westlands, Nairobi, near Inceptor Hub. Popular dishes: Pasta Carbonara and Grilled Tilapia.",
    personality: "friendly",
    language: "English",
    isActive: true,
    fallbackMessage: "I'm not sure about that. Please contact us directly at +254700000000."
  };

  const handleQuestionClick = (q) => {
    // Append a space to force change detection
    setAutofillValue(q + ' ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--dark-bg)' }}>
      <Navbar />

      <main className="container" style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '4fr 6fr',
        gap: '40px',
        padding: '50px 20px',
        alignItems: 'start'
      }}>
        {/* Left Info Panel */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '30px'
        }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px', color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}>
            See ChatBot Pro in Action
          </h1>
          <p style={{ color: 'var(--text-color)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
            We've set up a demo chatbot named <strong>Bella</strong> for a fictional business called <strong>Bella Bites Restaurant</strong>.
          </p>
          <div style={{
            background: 'var(--dark-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px',
            fontSize: '0.85rem',
            lineHeight: '1.5'
          }}>
            <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: '700' }}>Demo Restaurant Details</h4>
            <div style={{ display: 'grid', gap: '8px', color: 'var(--text-color)' }}>
              <p><strong>Name:</strong> Bella Bites Restaurant</p>
              <p><strong>Cuisine:</strong> Italian & Local Kenyan</p>
              <p><strong>Hours:</strong> Mon-Sat 9am-10pm, Sun 10am-9pm</p>
              <p><strong>Menu:</strong> Pizza KSh 800, Pasta KSh 700, Burger KSh 600, Salad KSh 500</p>
              <p><strong>Contact:</strong> +254700000000</p>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', fontWeight: '700', color: 'var(--text-color)' }}>Suggested Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuestionClick(q)}
                style={{
                  textAlign: 'left',
                  background: 'var(--dark-bg)',
                  border: '1px solid var(--border-color)',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: 'var(--text-color)',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                className="suggested-q-btn"
              >
                <i className="fa-solid fa-circle-question" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Right Chat Widget Preview Panel */}
        <div style={{
          position: 'relative',
          height: '520px',
          border: '1px dashed var(--border-color)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, rgba(0, 112, 243, 0.05) 0%, transparent 70%)',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-arrow-down-right" style={{ fontSize: '2.5rem', marginBottom: '15px', color: 'var(--primary-color)' }}></i>
            <h3 style={{ color: 'var(--text-color)', fontWeight: '700' }}>Test the widget here</h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '300px', margin: '8px auto 0 auto' }}>
              Click on the suggested questions on the left or tap the chat bubble in the bottom right corner of the page to start a conversation.
            </p>
          </div>
        </div>
      </main>

      <ChatWidget botConfig={demoBotConfig} previewMode={true} autofillText={autofillValue} />
      <Footer />

      <style>{`
        .suggested-q-btn:hover {
          border-color: var(--primary-color) !important;
          background: rgba(0, 112, 243, 0.05) !important;
          transform: translateX(4px);
        }
        @media (max-width: 768px) {
          main {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DemoPage;
