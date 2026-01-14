const mongoose = require('mongoose');
const stripeLib = require('stripe');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if(!uri) throw new Error('MONGO_URI not set');
  await mongoose.connect(uri, {});
  console.log('MongoDB connected');
};

const stripe = stripeLib(process.env.STRIPE_SECRET_KEY || '');

module.exports = { connectDB, stripe };
