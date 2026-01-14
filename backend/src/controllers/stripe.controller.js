const { stripe } = require('../config');
const Order = require('../models/Order');
const Booking = require('../models/Booking');

exports.createOrderSession = async (req,res,next) => {
  try{
    const { items } = req.body; // [{ productId, qty, priceCents }]
    const line_items = items.map(i => ({ price_data: { currency: 'usd', product_data: { name: i.name || 'Item' }, unit_amount: i.priceCents }, quantity: i.qty }));
    const order = await Order.create({ user: req.user?.id, items: items.map(i=>({ product: i.productId, qty: i.qty, priceCents: i.priceCents })), totalCents: items.reduce((a,b)=>a+b.priceCents*b.qty,0) });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.FRONTEND_URL}/orders/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: { orderId: order._id.toString() }
    });
    order.stripeSessionId = session.id; await order.save();
    res.json({ url: session.url, orderId: order._id });
  }catch(e){ next(e); }
};

exports.createBookingSession = async (req,res,next) => {
  try{
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('service');
    if(!booking) return res.status(404).json({ error: 'Booking not found' });
    const priceCents = booking.extras.reduce((a,b)=>a+(b.priceCents||0),0) + (booking.durationMinutes ? (booking.service.durations.find(d=>d.minutes===booking.durationMinutes)?.priceCents||0) : 0);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price_data: { currency: 'usd', product_data: { name: `${booking.service.title} - ${booking.durationMinutes}m` }, unit_amount: priceCents }, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/bookings`,
      metadata: { bookingId: booking._id.toString() }
    });
    booking.stripeSessionId = session.id; await booking.save();
    res.json({ url: session.url });
  }catch(e){ next(e); }
};
