'use client'
import React from 'react'
import { Loader2 } from 'lucide-react' // icon spinner

export default function LoadingScreen () {
  return (
    <div className='loading-screen'>
      <div className='loading-content'>
        <Loader2 className='spinner' size={40} />
        <p>Loading, please wait...</p>
      </div>
    </div>
  )
}
