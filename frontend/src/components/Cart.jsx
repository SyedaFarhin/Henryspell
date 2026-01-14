import React, { useContext } from 'react'
import { CartContext } from '../context/CartProvider'

export default function Cart(){
  const { items, totalCents, updateQty, remove, clear } = useContext(CartContext)
  if(items.length===0) return <div className="p-4 bg-white rounded">Cart is empty</div>
  return (
    <div className="p-4 bg-white rounded">
      {items.map(it => (
        <div key={it.productId} className="flex justify-between items-center py-2">
          <div>
            <div className="font-semibold">{it.title}</div>
            <div className="text-sm text-gray-600">${(it.priceCents/100).toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-2">
            <input type="number" min={1} value={it.qty} onChange={e=>updateQty(it.productId, parseInt(e.target.value||1,10))} className="w-16 p-1 border rounded" />
            <button onClick={()=>remove(it.productId)} className="text-red-600">Remove</button>
          </div>
        </div>
      ))}
      <div className="mt-4 font-semibold">Total: ${(totalCents/100).toFixed(2)}</div>
      <div className="mt-4 flex gap-2">
        <button onClick={clear} className="px-3 py-1 bg-gray-200 rounded">Clear</button>
      </div>
    </div>
  )
}
