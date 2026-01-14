import React, { useEffect, useState } from 'react'
import ServiceCard from '../components/ServiceCard'
import api from '../utils/api'

export default function Services(){
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const res = await api.get('/api/services');
        if(mounted) setServices(res.data || []);
      }catch(e){ setError(e.message || 'Failed to load'); }
      finally{ if(mounted) setLoading(false); }
    })();
    return ()=>{ mounted = false; }
  },[]);
  if(loading) return <p>Loading services...</p>;
  if(error) return <p className="text-red-600">{error}</p>;
  if(services.length === 0) return <p>No services available.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map(s => <ServiceCard key={s._id} service={s} />)}
    </div>
  )
}
