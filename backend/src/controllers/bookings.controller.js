const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { stripe } = require('../config');

// Helpers
const allowedWeekday = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  const wd = d.getUTCDay(); // 0=Sun
  // Available Fri (5), Sat (6), Sun (0), Mon (1), Tue (2)
  return [5,6,0,1,2].includes(wd);
};

const inBusinessHours = (timeStr, durationMinutes) => {
  const [hh,mm] = timeStr.split(':').map(Number);
  const start = hh*60 + mm;
  const end = start + durationMinutes;
  const open = 8*60; const close = 15*60;
  return start >= open && end <= close;
};

exports.getSlots = async (req,res,next) => {
  try{
    const { serviceId, date } = req.query;
    if(!serviceId || !date) return res.status(400).json({ error: 'serviceId and date required' });
    const svc = await Service.findById(serviceId);
    if(!svc) return res.status(404).json({ error: 'Service not found' });
    if(svc.category === 'in-person' && svc.availableFrom && new Date(svc.availableFrom) > new Date()){
      return res.json({ slots: [], message: 'Service coming soon' });
    }
    if(!allowedWeekday(date)) return res.json({ slots: [] });
    // use smallest duration (15) for slot grid
    const grid = 15;
    const open = 8*60; const close = 15*60;
    const slots = [];
    for(let t=open;t+grid<=close;t+=grid){
      const hh = Math.floor(t/60).toString().padStart(2,'0');
      const mm = (t%60).toString().padStart(2,'0');
      slots.push(`${hh}:${mm}`);
    }
    // remove taken slots for that date and service
    const taken = await Booking.find({ service: serviceId, date }).select('time');
    const takenSet = new Set(taken.map(x=>x.time));
    const available = slots.filter(s => !takenSet.has(s));
    res.json({ slots: available });
  }catch(e){ next(e); }
};

exports.createBooking = async (req,res,next) => {
  try{
    const { serviceId, date, time, durationMinutes, extras = [] } = req.body;
    const userId = req.user.id;
    const svc = await Service.findById(serviceId);
    if(!svc || !svc.active) return res.status(400).json({ error: 'Service unavailable' });
    if(svc.category === 'in-person' && svc.availableFrom && new Date(svc.availableFrom) > new Date()) return res.status(400).json({ error: 'Service not yet available' });
    if(!allowedWeekday(date)) return res.status(400).json({ error: 'Date not available' });
    if(!inBusinessHours(time, durationMinutes)) return res.status(400).json({ error: 'Time outside business hours' });

    // compute price
    const durationObj = svc.durations.find(d => d.minutes === durationMinutes);
    const priceCents = (durationObj?.priceCents || 0) + (extras.reduce((a,b)=>a+(b.priceCents||0),0));

    // create booking (unique index on service+date+time enforces atomicity)
    let booking;
    try {
      booking = await Booking.create({ user: userId, service: serviceId, durationMinutes, date, time, extras, isOnline: svc.category === 'online' });
    } catch (err) {
      if(err.code === 11000) return res.status(409).json({ error: 'Time slot already booked' });
      throw err;
    }

    // create stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price_data: { currency: 'usd', product_data: { name: `${svc.title} - ${durationMinutes}min` }, unit_amount: priceCents }, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/bookings`,
      metadata: { bookingId: booking._id.toString() }
    });
    booking.stripeSessionId = session.id; await booking.save();
    res.json({ url: session.url, bookingId: booking._id });
  }catch(err){ next(err); }
};
