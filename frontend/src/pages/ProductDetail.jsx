import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
import { CartContext } from '../context/CartProvider'

export default function ProductDetail(){
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { add } = useContext(CartContext)

  useEffect(()=>{ let mounted=true; (async ()=>{ try{ const res = await api.get(`/api/products/${slug}`); if(mounted) setProduct(res.data); }catch(e){ setError('Failed to load'); } finally{ if(mounted) setLoading(false); } })(); return ()=>mounted=false; },[slug]);

  if(loading) return <p>Loading...</p>
  if(error) return <p className="text-red-600">{error}</p>
  if(!product) return <p>Not found</p>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow">
        <div className="h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src={product.images?.[0] || '/placeholder.png'} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="mt-2 text-gray-600">${(product.priceCents/100).toFixed(2)}</p>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <div className="mt-6 flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={()=>add(product,1)}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}
