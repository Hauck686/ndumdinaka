'use client'

import DashboardHeader from '@/components/admin/DashboardHeader'
import Customerlist from '@/components/admin/Customerlist'
import React from 'react'

/**
 * Dashboard Page Component
 * Main admin dashboard with stats and customers list
 */
export default function Dashboard () {
  return (
    <div className='dashboard'>
      {/* Stats Section */}
      <DashboardHeader />

      {/* Customers Section */}
      <Customerlist />
    </div>
  )
}
