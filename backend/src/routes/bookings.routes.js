const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const bookingsController = require('../controllers/bookings.controller');

router.get('/mine', auth, bookingsController.getMine || (async (req,res,next)=>{ // fallback
  try{ const list = await require('../models/Booking').find({ user: req.user.id }).populate('service'); res.json(list); }catch(e){ next(e); }
}));

router.get('/slots', bookingsController.getSlots);
router.post('/', auth, bookingsController.createBooking);

module.exports = router;
