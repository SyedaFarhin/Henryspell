const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String,
  description: String,
  category: { type: String, enum: ['online','in-person'] },
  durations: [{ minutes: Number, priceCents: Number }],
  availableFrom: Date,
  active: { type: Boolean, default: true }
});
module.exports = mongoose.model('Service', serviceSchema);
