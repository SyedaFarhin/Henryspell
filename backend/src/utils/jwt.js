const jwt = require('jsonwebtoken');

exports.signAccess = (payload) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
exports.signRefresh = (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
exports.verifyAccess = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
exports.verifyRefresh = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);
exports.verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);
