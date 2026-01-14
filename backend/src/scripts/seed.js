require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Product = require('../models/Product');

async function main(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log('connected for seeding');

  const services = [
    { slug: 'tarot-reading', title: 'Tarot Reading', description: 'Online tarot reading', category: 'online', durations: [{minutes:15, priceCents:2000},{minutes:30, priceCents:3500},{minutes:60, priceCents:6000},{minutes:90, priceCents:8500}], active: true },
    { slug: 'spell-work', title: 'Spell Work', description: 'Custom spell work', category: 'online', durations: [{minutes:1440, priceCents:5000},{minutes:4320, priceCents:12000},{minutes:10080, priceCents:25000}], active: true },
    { slug: 'sound-healing', title: 'Sound Healing', description: 'In-person sound healing', category: 'in-person', durations: [{minutes:45, priceCents:4500}], availableFrom: new Date('2026-02-15'), active: true },
    { slug: 'energetic-massage', title: 'Energetic Alignment Massage', description: 'In-person massage', category: 'in-person', durations: [{minutes:60, priceCents:6000}], availableFrom: new Date('2026-02-15'), active: true }
  ];

  const products = [
    { title: 'Herbal Spell Mix - Protection', slug: 'herbal-protection', sku: 'herbal-protection', description: 'A curated herbal mix', priceCents:1500, inventory:20, active:true },
    { title: 'Incense Bundle', slug: 'incense-bundle', sku: 'incense-bundle', description: 'Handmade incense', priceCents:1200, inventory:50, active:true }
  ];

  // use ordered:false so a duplicate won't stop other inserts
  await Service.deleteMany({});
  await Product.deleteMany({});
  try{
    await Service.insertMany(services, { ordered: false });
  }catch(e){ console.warn('Some services may already exist or failed to insert', e.message); }

  try{
    await Product.insertMany(products, { ordered: false });
  }catch(e){ console.warn('Some products may already exist or failed to insert', e.message); }

  console.log('seed complete');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
