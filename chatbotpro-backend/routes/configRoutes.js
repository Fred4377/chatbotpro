const express = require('express');
const router = express.Router();
const BotConfig = require('../models/BotConfig');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/config
// @desc    Get user's bot config
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const config = await BotConfig.findOne({ owner: req.user._id });
    if (config) {
      res.json({ success: true, data: config });
    } else {
      res.status(404).json({ success: false, message: 'Configuration not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/config
// @desc    Create user's bot config
// @access  Private
router.post('/', protect, async (req, res) => {
  const { botName, welcomeMessage, primaryColor, businessInfo, personality, language, fallbackMessage } = req.body;

  try {
    let config = await BotConfig.findOne({ owner: req.user._id });
    if (config) {
      return res.status(400).json({ success: false, message: 'Config already exists for this user' });
    }

    config = await BotConfig.create({
      owner: req.user._id,
      botName,
      welcomeMessage,
      primaryColor,
      businessInfo,
      personality,
      language,
      fallbackMessage
    });

    res.status(201).json({ success: true, data: config });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/config
// @desc    Update user's bot config
// @access  Private
router.put('/', protect, async (req, res) => {
  const { botName, welcomeMessage, primaryColor, businessInfo, personality, language, isActive, fallbackMessage } = req.body;

  try {
    let config = await BotConfig.findOne({ owner: req.user._id });

    if (!config) {
      // Create if it doesn't exist
      config = await BotConfig.create({
        owner: req.user._id,
        botName,
        welcomeMessage,
        primaryColor,
        businessInfo: businessInfo || 'Business details',
        personality,
        language,
        isActive,
        fallbackMessage
      });
      return res.json({ success: true, data: config });
    }

    // Update fields
    if (botName !== undefined) config.botName = botName;
    if (welcomeMessage !== undefined) config.welcomeMessage = welcomeMessage;
    if (primaryColor !== undefined) config.primaryColor = primaryColor;
    if (businessInfo !== undefined) config.businessInfo = businessInfo;
    if (personality !== undefined) config.personality = personality;
    if (language !== undefined) config.language = language;
    if (isActive !== undefined) config.isActive = isActive;
    if (fallbackMessage !== undefined) config.fallbackMessage = fallbackMessage;

    await config.save();
    res.json({ success: true, data: config });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/config/embed-code
// @desc    Get the widget HTML embed code
// @access  Private
router.get('/embed-code', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const embedScript = `<script src="https://chatbotpro.app/widget.js" data-bot-id="${userId}"></script>`;
    res.json({ success: true, embedCode: embedScript, botId: userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
