const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const ordersController = require('../controllers/orders.controller');

router.get('/mine', auth, ordersController.getMine);
router.post('/', auth, ordersController.create);

module.exports = router;
