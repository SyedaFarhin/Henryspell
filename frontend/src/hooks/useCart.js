import { useState, useEffect, useContext } from 'react'
import { CartContext } from '../context/CartProvider'

const STORAGE_KEY = 'henryspell_cart'

export default function useCart(){
  const ctx = useContext(CartContext)
  if(ctx) return ctx

  // fallback standalone behaviour if CartProvider not present
  const [items, setItems] = useState([])

  useEffect(()=>{
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      if(raw) setItems(JSON.parse(raw))
    }catch(e){ setItems([]) }
  },[])

  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  },[items])

  const add = (product, qty=1) => {
    setItems(prev => {
      const found = prev.find(p=>p.productId===product._id)
      if(found){ return prev.map(p => p.productId===product._id ? { ...p, qty: p.qty + qty } : p) }
      return [...prev, { productId: product._id, title: product.title, priceCents: product.priceCents, qty }]
    })
  }

  const remove = (productId) => setItems(prev => prev.filter(p=>p.productId!==productId))
  const updateQty = (productId, qty) => setItems(prev => prev.map(p=>p.productId===productId?{...p, qty}:p))
  const clear = () => setItems([])
  const totalCents = items.reduce((a,b)=>a + (b.priceCents||0)*b.qty, 0)

  return { items, add, remove, updateQty, clear, totalCents }
}
