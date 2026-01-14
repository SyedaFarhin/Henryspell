import React, { useEffect, useState, useContext } from 'react'
import api from '../utils/api'
import { AuthContext } from '../context/AuthProvider'

export default function Account(){
  const { signout } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    const load = async () => {
      try{
        const [bRes, oRes] = await Promise.all([
          api.get('/api/bookings/mine'),
          api.get('/api/orders/mine')
        ])
        if(!mounted) return
        setBookings(bRes.data || [])
        setOrders(oRes.data || [])
      }catch(e){
        if(mounted) setError(e.response?.data?.error || e.message || 'Failed to load account data')
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  },[])

  if(loading) return <p>Loading account...</p>
  if(error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Account</h2>
        <button onClick={signout} className="px-3 py-1 bg-gray-200 rounded">Sign out</button>
      </div>

      <section className="mt-6">
        <h3 className="text-xl font-semibold">Upcoming Bookings</h3>
        {bookings.length===0 ? (
          <p className="mt-2 text-sm text-gray-600">No bookings found.</p>
        ) : (
          <ul className="mt-2 space-y-3">
            {bookings.map(b => (
              <li key={b._id} className="p-3 bg-white rounded shadow">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{b.service?.title || 'Service'}</div>
                    <div className="text-sm text-gray-600">{b.date} @ {b.time}</div>
                    <div className="text-sm text-gray-600">{b.durationMinutes} minutes</div>
                    {b.paid ? <div className="text-xs text-emerald-600">Paid</div> : <div className="text-xs text-amber-600">Awaiting payment</div>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold">Orders</h3>
        {orders.length===0 ? (
          <p className="mt-2 text-sm text-gray-600">No orders yet.</p>
        ) : (
          <ul className="mt-2 space-y-3">
            {orders.map(o => (
              <li key={o._id} className="p-3 bg-white rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Order #{o._id.slice(-6)}</div>
                    <div className="text-sm text-gray-600">Total: ${(o.totalCents/100).toFixed(2)}</div>
                    <div className="text-sm text-gray-600">{o.paid ? 'Paid' : 'Awaiting payment'}</div>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(o.createdAt || o._id.getTimestamp && o._id.getTimestamp()).toLocaleString ? new Date(o.createdAt || Date.now()).toLocaleString() : ''}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
