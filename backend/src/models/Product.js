const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  description: String,
  priceCents: Number,
  inventory: Number,
  images: [String],
  active: { type: Boolean, default: true },
  createdAt: Date
});
module.exports = mongoose.model('Product', productSchema);
