const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.get('/', async (req,res,next) => {
  try{ const services = await Service.find({ active: true }); res.json(services); }catch(e){ next(e); }
});

router.get('/:slug', async (req,res,next) => {
  try{ const svc = await Service.findOne({ slug: req.params.slug }); if(!svc) return res.status(404).end(); res.json(svc); }catch(e){ next(e); }
});

module.exports = router;
