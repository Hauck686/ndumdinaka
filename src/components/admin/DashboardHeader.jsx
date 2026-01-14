'use client'
import { BellIcon, DollarSign, ShoppingCart, Truck, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import StatCard from './StatsCards'

export default function DashboardHeader () {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setStats(res.data)
      } catch (err) {
        console.error('❌ Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div>Loading stats...</div>
  }

  return (
    <header className='section-one'>
      <StatCard
        label='Total Customers'
        value={stats?.totalCustomers.toLocaleString()}
        color='#25714aff'
        icon={<Users />}
      />
      <StatCard
        label='Orders'
        value={stats?.totalOrders.toLocaleString()}
        color='#367eebff'
        icon={<ShoppingCart />}
      />
      <StatCard
        label='Total Revenue'
        value={`$${stats?.totalRevenue.toLocaleString()}`}
        color='#d1fae5'
        icon={<DollarSign />}
      />
      <StatCard
        label='Orders Shipped'
        value={stats?.ordersShipped.toLocaleString()}
        color='#d1fae5'
        icon={<Truck />}
      />
    </header>
  )
}
