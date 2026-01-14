const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function auth(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if(!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = { id: user._id, roles: user.roles };
    next();
  }catch(e){ return res.status(401).json({ error: 'Invalid token' }); }
};
