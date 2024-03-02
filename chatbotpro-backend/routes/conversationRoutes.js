const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/conversations
// @desc    Get all conversations for the authenticated user's chatbot
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({ botOwner: req.user._id })
      .sort({ lastMessageAt: -1 });
    
    res.json({ success: true, count: conversations.length, data: conversations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/conversations/:sessionId
// @desc    Get a single conversation by sessionId
// @access  Private
router.get('/:sessionId', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      sessionId: req.params.sessionId,
      botOwner: req.user._id
    });

    if (conversation) {
      res.json({ success: true, data: conversation });
    } else {
      res.status(404).json({ success: false, message: 'Conversation not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/conversations/:sessionId
// @desc    Delete a conversation
// @access  Private
router.delete('/:sessionId', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      sessionId: req.params.sessionId,
      botOwner: req.user._id
    });

    if (conversation) {
      res.json({ success: true, message: 'Conversation deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Conversation not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
