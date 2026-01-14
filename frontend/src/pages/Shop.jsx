import React, { useEffect, useState, useContext } from 'react'
import api from '../utils/api'
import { CartContext } from '../context/CartProvider'
import ProductCard from '../components/ProductCard'

export default function Shop(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { add } = useContext(CartContext);

  useEffect(()=>{ let mounted=true; (async ()=>{ try{ const res = await api.get('/api/products'); if(mounted) setItems(res.data || []); }catch(e){ setError(e.message||'Failed'); } finally{ if(mounted) setLoading(false); } })(); return ()=>mounted=false; },[]);
  if(loading) return <p>Loading products...</p>;
  if(error) return <p className="text-red-600">{error}</p>;
  if(items.length===0) return <p>No products yet.</p>;
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">Shop</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => (
          <div key={p._id}>
            <ProductCard product={p} />
            <div className="mt-2 flex justify-between">
              <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={()=>add(p,1)}>Add to cart</button>
              <div className="text-gray-600">${(p.priceCents/100).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
