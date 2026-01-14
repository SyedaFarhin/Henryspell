const express = require('express');
const router = express.Router();
const { createOrderSession, createBookingSession } = require('../controllers/stripe.controller');
const auth = require('../middleware/auth.middleware');

// protected endpoints for creating sessions
router.post('/create-order-session', auth, createOrderSession);
router.post('/create-booking-session', auth, createBookingSession);

// webhook remains public and uses raw body
const { stripe } = require('../config');
const Booking = require('../models/Booking');
const Order = require('../models/Order');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req,res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try{ event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch(e){ return res.status(400).send(`Webhook error: ${e.message}`); }

  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    const orderId = session.metadata?.orderId;
    if(bookingId){ await Booking.findOneAndUpdate({ _id: bookingId, stripeSessionId: session.id }, { paid: true }); }
    if(orderId){ await Order.findByIdAndUpdate(orderId, { paid: true }); }
  }

  res.json({ received: true });
});

module.exports = router;
