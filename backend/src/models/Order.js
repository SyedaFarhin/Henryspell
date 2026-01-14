const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number, priceCents: Number }],
  totalCents: Number,
  stripeSessionId: String,
  paid: { type: Boolean, default: false },
  createdAt: Date
});
module.exports = mongoose.model('Order', orderSchema);
