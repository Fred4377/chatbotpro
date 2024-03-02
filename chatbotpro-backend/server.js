const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models for seeding
const User = require('./models/User');
const BotConfig = require('./models/BotConfig');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().then(() => {
  // Seed demo data once connected
  seedDemoData();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/config', require('./routes/configRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ChatBot Pro Backend is running smoothly!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server' });
});

// Seed data function
async function seedDemoData() {
  try {
    const demoEmail = 'demo@chatbotpro.com';
    const demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      console.log('Seeding demo user...');
      const user = await User.create({
        name: 'Bella Bites Admin',
        email: demoEmail,
        password: 'demo123', // Will be encrypted by mongoose pre-save hook
        businessName: 'Bella Bites Restaurant',
        businessType: 'Restaurant'
      });

      console.log('Seeding demo bot config...');
      await BotConfig.create({
        owner: user._id,
        botName: 'Bella',
        welcomeMessage: "Hi! I'm Bella, your dining assistant. How can I help you today?",
        primaryColor: '#C0392B',
        businessInfo: 'Bella Bites Restaurant, Nairobi Kenya. We serve Italian and local cuisine. Hours: Mon-Sat 9am-10pm, Sun 10am-9pm. Menu: Margherita Pizza $8, Pasta Carbonara $9, Beef Burger $7, Caesar Salad $6, Tiramisu $4. Reservations: +254700000000 or WhatsApp. Free parking. Delivery available via Uber Eats.',
        personality: 'friendly',
        language: 'English',
        isActive: true,
        fallbackMessage: "I'm not sure about that. Please contact us directly at +254700000000."
      });

      console.log('Demo data seeded successfully!');
    } else {
      // Check if config exists for the demo user
      const config = await BotConfig.findOne({ owner: demoUser._id });
      if (!config) {
        console.log('Seeding missing demo config...');
        await BotConfig.create({
          owner: demoUser._id,
          botName: 'Bella',
          welcomeMessage: "Hi! I'm Bella, your dining assistant. How can I help you today?",
          primaryColor: '#C0392B',
          businessInfo: 'Bella Bites Restaurant, Nairobi Kenya. We serve Italian and local cuisine. Hours: Mon-Sat 9am-10pm, Sun 10am-9pm. Menu: Margherita Pizza $8, Pasta Carbonara $9, Beef Burger $7, Caesar Salad $6, Tiramisu $4. Reservations: +254700000000 or WhatsApp. Free parking. Delivery available via Uber Eats.',
          personality: 'friendly',
          language: 'English',
          isActive: true,
          fallbackMessage: "I'm not sure about that. Please contact us directly at +254700000000."
        });
        console.log('Demo bot config seeded successfully!');
      }
    }
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
