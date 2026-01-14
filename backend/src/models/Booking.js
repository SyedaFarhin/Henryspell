const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  durationMinutes: Number,
  date: { type: String, required: true },
  time: { type: String, required: true },
  timezone: String,
  isOnline: Boolean,
  extras: [{ key: String, priceCents: Number }],
  stripeSessionId: String,
  paid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
bookingSchema.index({ service: 1, date: 1, time: 1 }, { unique: true });
module.exports = mongoose.model('Booking', bookingSchema);
