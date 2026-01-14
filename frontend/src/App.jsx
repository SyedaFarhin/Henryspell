import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import Bookings from './pages/Bookings'
import Shop from './pages/Shop'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import ProductDetail from './pages/ProductDetail'
import Account from './pages/Account'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/bookings" element={<Bookings/>} />
          <Route path="/shop" element={<Shop/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/product/:slug" element={<ProductDetail/>} />
          <Route path="/account" element={<ProtectedRoute><Account/></ProtectedRoute>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
        </Routes>
      </main>
    </div>
  )
}
