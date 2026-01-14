const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req,res,next) => { try{ const p = await Product.find({ active: true }); res.json(p); }catch(e){ next(e); } });
router.get('/:slug', async (req,res,next) => { try{ const p = await Product.findOne({ slug: req.params.slug }); if(!p) return res.status(404).end(); res.json(p); }catch(e){ next(e); } });

module.exports = router;
