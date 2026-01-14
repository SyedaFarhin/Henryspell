import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }){
  const img = product.images?.[0] || '/placeholder.png'
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src={img} alt={product.title} className="w-full h-full object-cover" />
        </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${product.slug}`} className="text-lg font-semibold hover:underline">{product.title}</Link>
        <p className="text-sm text-gray-600 mt-2 flex-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-semibold">${(product.priceCents/100).toFixed(2)}</div>
          <Link to={`/product/${product.slug}`} className="text-sm px-3 py-1 bg-indigo-600 text-white rounded">View</Link>
        </div>
      </div>
    </div>
  )
}
