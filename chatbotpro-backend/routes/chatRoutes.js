const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Conversation = require('../models/Conversation');
const BotConfig = require('../models/BotConfig');
const User = require('../models/User');
const { chatLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/chat/message
// @desc    Send a message to the AI chatbot (Public, Rate-limited)
// @access  Public
router.post('/message', chatLimiter, async (req, res) => {
  const { sessionId, botOwnerId, message, history } = req.body;

  if (!sessionId || !botOwnerId || !message) {
    return res.status(400).json({ success: false, message: 'Please provide sessionId, botOwnerId, and message' });
  }

  try {
    // 1. Find bot config
    const config = await BotConfig.findOne({ owner: botOwnerId }).populate('owner');
    
    if (!config) {
      return res.status(404).json({ success: false, message: 'Chatbot configuration not found' });
    }

    if (!config.isActive) {
      return res.status(400).json({ success: false, message: 'This chatbot is currently offline.' });
    }

    const businessName = config.owner ? config.owner.businessName : 'the business';
    
    // 2. Build Gemini system prompt
    const systemPrompt = `You are ${config.botName}, a helpful AI customer support assistant for ${businessName}.
Business information (Your Knowledge Base):
${config.businessInfo}

Personality to adopt: ${config.personality}
Response language: ${config.language}

Rules:
1. ONLY answer questions related to this business and the information provided above.
2. If the user asks something unrelated to the business, politely redirect them to ask about the business.
3. Keep responses concise, clear, and under 100 words.
4. If you cannot answer a question based on the provided business information, use this fallback message or say it politely: "${config.fallbackMessage}".
5. Be conversational, helpful, and polite.`;

    let replyText = '';

    // Check if API key is provided
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_free_gemini_api_key_here' || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      console.warn('Gemini API key is not configured. Falling back to default message or mock.');
      // Simulating a response for testing when API key is missing
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('hours') || lowerMessage.includes('time') || lowerMessage.includes('open')) {
        replyText = "We are open Monday to Saturday from 9am to 10pm, and Sunday from 10am to 9pm. How else can I assist you?";
      } else if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('serve') || lowerMessage.includes('pricing') || lowerMessage.includes('price')) {
        replyText = "Our menu includes Margherita Pizza ($8), Pasta Carbonara ($9), Beef Burger ($7), Caesar Salad ($6), and Tiramisu ($4). Let me know if you want to place a reservation!";
      } else if (lowerMessage.includes('reservation') || lowerMessage.includes('book') || lowerMessage.includes('call') || lowerMessage.includes('contact')) {
        replyText = "You can make a reservation by calling us at +254700000000 or contacting us via WhatsApp.";
      } else {
        replyText = config.fallbackMessage;
      }
    } else {
      try {
        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash-lite',
          systemInstruction: systemPrompt
        });

        // Format history for Gemini API
        // Make sure history is alternating and only contains valid user/model messages
        const formattedHistory = [];
        let expectedRole = 'user'; // Start history alignment
        
        if (history && history.length > 0) {
          // Take last 10 messages
          const recentHistory = history.slice(-10);
          recentHistory.forEach(msg => {
            const currentRole = msg.role === 'bot' ? 'model' : 'user';
            if (currentRole === expectedRole) {
              formattedHistory.push({
                role: currentRole,
                parts: [{ text: msg.content }]
              });
              expectedRole = expectedRole === 'user' ? 'model' : 'user';
            }
          });
        }

        // If history ends with 'user', we can't send a new message properly as the next turn,
        // because startChat expects alternating turns and the next sendMessage is from 'user'.
        // So the history must end with a 'model' (bot) message.
        if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
          formattedHistory.pop();
        }

        const chat = model.startChat({
          history: formattedHistory
        });

        const result = await chat.sendMessage(message);
        replyText = result.response.text().trim();
      } catch (geminiError) {
        console.error('Gemini API Error:', geminiError);
        // Fallback message response if API fails
        replyText = `Sorry, I'm having trouble connecting to my brain. ${config.fallbackMessage}`;
      }
    }

    // 3. Save full conversation to MongoDB
    let conversation = await Conversation.findOne({ sessionId });

    const newUserMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    const newBotMessage = {
      role: 'bot',
      content: replyText,
      timestamp: new Date()
    };

    if (conversation) {
      conversation.messages.push(newUserMessage);
      conversation.messages.push(newBotMessage);
      conversation.lastMessageAt = new Date();
      conversation.totalMessages = conversation.messages.length;
      await conversation.save();
    } else {
      // Create new conversation session
      conversation = await Conversation.create({
        sessionId,
        botOwner: botOwnerId,
        messages: [newUserMessage, newBotMessage],
        startedAt: new Date(),
        lastMessageAt: new Date(),
        totalMessages: 2
      });
    }

    res.json({
      success: true,
      reply: replyText,
      sessionId
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'Server error during chat message processing' });
  }
});

// @route   GET /api/chat/session/:sessionId
// @desc    Get full conversation history for a sessionId
// @access  Public
router.get('/session/:sessionId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ sessionId: req.params.sessionId });
    if (conversation) {
      res.json({ success: true, data: conversation });
    } else {
      res.json({ success: true, data: { messages: [] } }); // Return empty messages if session not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
