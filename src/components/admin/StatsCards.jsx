'use client'
import React from 'react'
import { CheckSquare } from 'lucide-react'

export default function StatCard ({ icon, label, value, color }) {
  const Icon = icon || CheckSquare

  return (
    <div className='stat-card'>
      <div className='icon' style={{ backgroundColor: color || '#d1fae5' }}>
        {icon}
      </div>
      <div className='details'>
        <p className='label'>{label}</p>
        <h3 className='value'>{value}</h3>
      </div>
    </div>
  )
}
