import React from 'react'

export default function Types() {
  const types = [
    { name: 'Seeds', icon: '🌱', desc: 'High-quality seeds for crops' },
    { name: 'Fertilizer', icon: '🌿', desc: 'Soil nutrients and conditioners' },
    { name: 'Pesticides', icon: '💊', desc: 'Crop protection supplies' },
    { name: 'Equipment', icon: '🔧', desc: 'Machinery and equipment' },
    { name: 'Tools', icon: '🛠️', desc: 'Hand tools and implements' },
    { name: 'Irrigation', icon: '💧', desc: 'Watering and irrigation' },
    { name: 'Storage', icon: '🏪', desc: 'Storage and preservation' },
    { name: 'Monitoring', icon: '📊', desc: 'Sensors and monitoring' },
  ]

  return (
    <div className="page">
      <h1 style={{ textAlign: 'center', color: '#2d5a27', marginBottom: 30 }}>All Types</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {types.map(t => (
          <div key={t.name} style={{ background: 'white', padding: 24, borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 42 }}>{t.icon}</div>
            <h3 style={{ marginTop: 10, color: '#2d5a27' }}>{t.name}</h3>
            <p style={{ color: '#6c757d' }}>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}








