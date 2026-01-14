const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  roles: { type: [String], default: ['user'] },
  refreshTokens: [{ token: String, createdAt: Date }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);
