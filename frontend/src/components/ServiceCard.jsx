import React from 'react'

export default function ServiceCard({service}){
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold">{service.title}</h3>
      <p className="text-sm text-gray-600 mt-2">{service.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {service.durations?.map(d => (
          <span key={d.minutes} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded">{d.minutes}m</span>
        ))}
      </div>
    </div>
  )
}
