import React from 'react'
import Cart from '../components/Cart'
import { Link } from 'react-router-dom'

export default function CartPage(){
  return (
    <div>
      <h2 className="text-2xl font-semibold">Your Cart</h2>
      <div className="mt-4">
        <Cart />
      </div>
      <div className="mt-4">
        <Link to="/checkout" className="px-4 py-2 bg-indigo-600 text-white rounded">Proceed to Checkout</Link>
      </div>
    </div>
  )
}
