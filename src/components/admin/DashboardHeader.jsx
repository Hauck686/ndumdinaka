'use client'
import { DollarSign, ShoppingCart, Truck, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import StatCard from './StatsCards'

/**
 * StatCard Component - Individual stat display
 */
// function StatCard({ label, value, icon, color, isLoading }) {
//   const getColorClass = () => {
//     if (color === '#25714aff') return 'success'
//     if (color === '#367eebff') return 'primary'
//     if (color === '#f59e0b' || color === '#d1fae5') return 'warning'
//     return 'primary'
//   }

//   return (
//     <div className={`stat-card ${getColorClass()}`}>
//       <div className="stat-header">
//         <p className="stat-label">{label}</p>
//         <div className="stat-icon">
//           {icon}
//         </div>
//       </div>
//       <div className="stat-value">
//         {isLoading ? (
//           <div style={{
//             height: '32px',
//             background: '#f0f0f0',
//             borderRadius: '4px',
//             animation: 'pulse 2s infinite'
//           }} />
//         ) : (
//           value || '0'
//         )}
//       </div>
//     </div>
//   )
// }

/**
 * DashboardHeader Component - Stats cards section
 */
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

  return (
    <section className='section-one'>
      <StatCard
        label='Total Customers'
        value={stats?.totalCustomers?.toLocaleString() || '0'}
        icon={<Users />}
        color='#25714aff'
        isLoading={loading}
      />
      <StatCard
        label='Orders'
        value={stats?.totalOrders?.toLocaleString() || '0'}
        icon={<ShoppingCart />}
        color='#367eebff'
        isLoading={loading}
      />
      <StatCard
        label='Total Revenue'
        value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
        icon={<DollarSign />}
        color='#f59e0b'
        isLoading={loading}
      />
      <StatCard
        label='Orders Shipped'
        value={stats?.ordersShipped?.toLocaleString() || '0'}
        icon={<Truck />}
        color='#d1fae5'
        isLoading={loading}
      />
    </section>
  )
}
