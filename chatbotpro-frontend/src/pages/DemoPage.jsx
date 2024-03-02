import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

const DemoPage = () => {
  const [autofillValue, setAutofillValue] = useState('');

  // Frequently asked questions for the demo restaurant
  const suggestedQuestions = [
    "What are your opening hours?",
    "What food do you serve?",
    "How do I make a reservation?",
    "Where are you located?",
    "What is your most popular dish?"
  ];

  const demoBotConfig = {
    botName: "Bella (AI Assistant)",
    welcomeMessage: "Hi! I'm Bella. Ask me anything about Bella Bites Restaurant!",
    primaryColor: "#0ea5e9", // changed from generic red to ocean blue
    businessInfo: "Bella Bites Restaurant, Nairobi. Italian cuisine. Open Mon-Sat 9am-10pm, Sun 10am-9pm. Menu: Pizza $8, Pasta $7, Burger $6, Salad $5. Reservations: +254700000000. Located at central business area in Nairobi. Most popular dish is our Pasta Carbonara and Margherita Pizza.",
    personality: "friendly",
    language: "English",
    isActive: true,
    fallbackMessage: "I'm not sure about that. Please contact us directly at +254700000000."
  };

  const handleQuestionClick = (q) => {
    // Append a space to force change detection in useEffect - hacky but it works lol
    setAutofillValue(q + ' ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
          background: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '30px'
        }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '15px', color: '#0ea5e9' }}>
            See ChatBot Pro in Action
          </h1>
          <p style={{ color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
            We've set up a demo chatbot named <strong>Bella</strong> for a fictional business called <strong>Bella Bites Restaurant</strong>.
          </p>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px',
            fontSize: '0.85rem',
            lineHeight: '1.5'
          }}>
            <h4 style={{ color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Demo Restaurant Details</h4>
            <div style={{ display: 'grid', gap: '8px', color: '#f8fafc' }}>
              <p><strong>Name:</strong> Bella Bites Restaurant</p>
              <p><strong>Cuisine:</strong> Italian & Local</p>
              <p><strong>Hours:</strong> Mon-Sat 9am-10pm, Sun 10am-9pm</p>
              <p><strong>Menu:</strong> Pizza $8, Pasta $7, Burger $6, Salad $5</p>
              <p><strong>Contact:</strong> +254700000000</p>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', fontWeight: '600' }}>Suggested Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuestionClick(q)}
                style={{
                  textAlign: 'left',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#f8fafc',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                className="suggested-q-btn"
              >
                <i className="fa-solid fa-circle-question" style={{ color: '#0ea5e9', marginRight: '10px' }}></i>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Right Chat Widget Preview Panel */}
        <div style={{
          position: 'relative',
          height: '520px',
          border: '1px dashed rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <i className="fa-solid fa-arrow-down-right" style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#0ea5e9' }}></i>
            <h3>Test the widget here</h3>
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
          border-color: #0ea5e9 !important;
          background: rgba(14, 165, 233, 0.05) !important;
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
