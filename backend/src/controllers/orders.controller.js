const Order = require('../models/Order');

exports.getMine = async (req,res,next) => {
  try{
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  }catch(e){ next(e); }
};

exports.create = async (req,res,next) => {
  try{
    const { items } = req.body;
    const order = await Order.create({ user: req.user?.id, items: items.map(i=>({ product: i.productId, qty: i.qty, priceCents: i.priceCents })), totalCents: items.reduce((a,b)=>a+b.priceCents*b.qty,0) });
    res.json(order);
  }catch(e){ next(e); }
};
