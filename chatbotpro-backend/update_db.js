const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BotConfig = require('./models/BotConfig');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const demoEmail = 'demo@chatbotpro.com';
    const demoUser = await User.findOne({ email: demoEmail });
    if (demoUser) {
      const businessInfo = 'Bella Bites Restaurant, Westlands, Nairobi, near Inceptor Hub. We serve Italian & local Kenyan cuisine. Open Mon-Sat 9am-10pm, Sun 10am-9pm. Menu: Pizza KSh 800, Pasta KSh 700, Burger KSh 600, Salad KSh 500. Deliveries: Countrywide via G4S or Wells Fargo Courier (Mombasa KSh 350, Nairobi CBD KSh 100). Payments: Lipa na M-Pesa (C2B Paybill or STK Push), Visa, Mastercard, and Cash on Delivery. Reservations: +254700000000 or WhatsApp. Popular dishes: Pasta Carbonara and Grilled Tilapia.';
      
      const res = await BotConfig.updateOne(
        { owner: demoUser._id },
        { $set: { businessInfo } }
      );
      console.log('Update result:', res);
    } else {
      console.log('Demo user not found');
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error connecting:', err);
  });
