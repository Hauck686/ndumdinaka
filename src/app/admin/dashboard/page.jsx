'use client'

import CustomersList from '@/components/admin/Customerlist'
import DashboardHeader from '@/components/admin/DashboardHeader'
import FeaturedItems from '@/components/admin/FeaturedItems'
import InsightCard from '@/components/admin/InsightCard'

import React, { useState } from 'react'

export default function Dashboard () {
  const [activeTab, setActiveTab] = useState('Last weeks')
  return (
    <div className='dashboard'>
      <DashboardHeader />
      <CustomersList />
      {/* <div className='section-two'>
        <InsightCard />
        <FeaturedItems />
      </div> */}
      {/* <main className='dashboard-main'>
        <div className='dashboard-controls'></div>
      </main> */}
    </div>
  )
}
