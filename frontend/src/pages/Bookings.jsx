import React, { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Bookings(){
  const [services, setServices] = useState([]);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{ let mounted=true; (async ()=>{ try{ const res = await api.get('/api/services'); if(mounted) setServices(res.data || []); }catch(e){ setError('Failed to load services'); } })(); return ()=>mounted=false; },[]);

  const fetchSlots = async () => {
    if(!selected || !date) return;
    setLoading(true); setError(null);
    try{
      const res = await api.get(`/api/bookings/slots?serviceId=${selected._id}&date=${date}`);
      setSlots(res.data.slots || []);
    }catch(e){ setError('Failed to fetch slots'); }
    setLoading(false);
  };

  const confirm = async () => {
    setLoading(true); setError(null);
    try{
      const res = await api.post('/api/bookings', { serviceId: selected._id, date, time: selectedSlot, durationMinutes: duration });
      if(res.data.url) window.location.href = res.data.url;
      else setError(res.data.error || 'Failed to create booking');
    }catch(e){ setError(e.response?.data?.error || e.message || 'Error'); }
    setLoading(false);
  };

  if(error) return <p className="text-red-600">{error}</p>;
  if(step === 1) return (
    <div>
      <h2 className="text-2xl font-semibold">Select a service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {services.map(s => (
          <div key={s._id} className="p-4 bg-white rounded shadow" onClick={()=>{ setSelected(s); setStep(2); }}>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if(step === 2) return (
    <div>
      <button onClick={()=>setStep(1)} className="text-sm">Back</button>
      <h2 className="text-2xl font-semibold">Choose duration</h2>
      <div className="mt-4 flex gap-2">
        {selected.durations.map(d => (
          <button key={d.minutes} className={`px-3 py-1 rounded ${duration===d.minutes?'bg-indigo-600 text-white':'bg-emerald-100 text-emerald-800'}`} onClick={()=>{ setDuration(d.minutes); setStep(3); }}>{d.minutes}m</button>
        ))}
      </div>
    </div>
  );

  if(step === 3) return (
    <div>
      <button onClick={()=>setStep(2)} className="text-sm">Back</button>
      <h2 className="text-2xl font-semibold">Pick a date</h2>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-4" />
      <div className="mt-4">
        <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={async ()=>{ await fetchSlots(); setStep(4); }}>Check times</button>
      </div>
    </div>
  );

  return (
    <div>
      <button onClick={()=>setStep(3)} className="text-sm">Back</button>
      <h2 className="text-2xl font-semibold">Choose time</h2>
      {loading ? <p>Loading slots...</p> : (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {slots.map(s => (
            <button key={s} onClick={()=>setSelectedSlot(s)} className={`px-3 py-2 rounded ${selectedSlot===s?'bg-indigo-600 text-white':'bg-emerald-100 text-emerald-800'}`}>{s}</button>
          ))}
        </div>
      )}
      <div className="mt-6">
        <button disabled={!selectedSlot || loading} className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={confirm}>Confirm & Pay</button>
      </div>
    </div>
  );
}
