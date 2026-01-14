const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');

exports.signup = async (req,res,next) => {
  try{
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ error: 'Email exists' });
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS||12,10);
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ email, passwordHash: hash, name });
    res.status(201).json({ id: user._id, email: user.email });
  }catch(err){ next(err); }
};

exports.signin = async (req,res,next) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ error: 'Invalid' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({ error: 'Invalid' });
    const access = signAccess({ id: user._id, roles: user.roles });
    const refresh = signRefresh({ id: user._id });
    // store hashed refresh token
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS||12,10);
    const hashed = await bcrypt.hash(refresh, saltRounds);
    user.refreshTokens.push({ token: hashed, createdAt: new Date() });
    await user.save();
    res.json({ accessToken: access, refreshToken: refresh });
  }catch(err){ next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) return res.status(400).json({ error: 'No refresh token' });
    let payload;
    try { payload = verifyRefresh(refreshToken); } catch (e) { return res.status(401).json({ error: 'Invalid refresh token' }); }
    const user = await User.findById(payload.id);
    if(!user) return res.status(401).json({ error: 'Invalid token' });
    // verify hashed stored tokens
    const found = await (async ()=>{
      for(const rt of user.refreshTokens){
        const ok = await bcrypt.compare(refreshToken, rt.token);
        if(ok) return rt;
      }
      return null;
    })();
    if(!found) return res.status(401).json({ error: 'Refresh token not recognized' });
    const access = signAccess({ id: user._id, roles: user.roles });
    res.json({ accessToken: access });
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) return res.status(400).json({ error: 'No refresh token' });
    let payload;
    try { payload = verifyRefresh(refreshToken); } catch (e) { return res.status(200).json({}); }
    const user = await User.findById(payload.id);
    if(!user) return res.status(200).json({});
    // remove matching hashed token(s)
    user.refreshTokens = (await (async ()=>{
      const arr = [];
      for(const rt of user.refreshTokens){
        const ok = await bcrypt.compare(refreshToken, rt.token);
        if(!ok) arr.push(rt);
      }
      return arr;
    })());
    await user.save();
    res.json({});
  } catch (err) { next(err); }
};
