import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'
import { CartContext } from '../context/CartProvider'

export default function Navbar(){
  const { user, signout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const cartCount = items.reduce((a,b)=>a + (b.qty||0), 0);
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-semibold text-lg">HenrySpell</Link>
        <div className="flex gap-4 items-center">
          <Link to="/services" className="text-gray-700">Services</Link>
          <Link to="/bookings" className="text-gray-700">Bookings</Link>
          <Link to="/shop" className="text-gray-700">Shop</Link>
          <Link to="/cart" className="text-gray-700">Cart{cartCount>0 && <span className="ml-1 text-sm text-indigo-600">({cartCount})</span>}</Link>
          {user ? (
            <>
              <Link to="/account" className="text-gray-700">Account</Link>
              <button onClick={signout} className="text-gray-700">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-gray-700">Sign In</Link>
              <Link to="/signup" className="text-gray-700">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
