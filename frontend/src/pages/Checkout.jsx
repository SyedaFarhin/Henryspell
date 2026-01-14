import React, { useState } from 'react'
import useCart from '../hooks/useCart'
import api from '../utils/api'
import { loadStripe } from '@stripe/stripe-js'

export default function Checkout(){
  const { items, totalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const handleCheckout = async () => {
    setLoading(true);
    try{
      const res = await api.post('/api/stripe/create-order-session', { items });
      const { url } = res.data;
      // Redirect using Stripe.js to allow better UX
      const stripe = await stripePromise;
      // If backend returned session url, redirect there
      if(url) window.location.href = url;
    }catch(e){ alert('Checkout failed'); }
    setLoading(false);
  };

  if(items.length===0) return <p>Your cart is empty</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold">Checkout</h2>
      <div className="mt-4">Total: ${(totalCents/100).toFixed(2)}</div>
      <div className="mt-4">
        <button disabled={loading} onClick={handleCheckout} className="px-4 py-2 bg-indigo-600 text-white rounded">Pay with Stripe</button>
      </div>
    </div>
  )
}
