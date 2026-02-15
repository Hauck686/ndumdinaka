'use client'
import {
  DollarSign,
  ShoppingCart,
  Truck,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  TrendingUp,
  Eye,
  Heart,
  CreditCard,
  Globe,
  Activity
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import StatCard from './StatsCards'

/**
 * StatCard Component - Individual stat display
 */
// function StatCard ({ label, value, icon, color, isLoading, subtext }) {
//   return (
//     <div className='stat-card' style={{ borderLeftColor: color }}>
//       <div className='stat-header'>
//         <p className='stat-label'>{label}</p>
//         <div className='stat-icon' style={{ color }}>
//           {icon}
//         </div>
//       </div>
//       <div className='stat-value'>
//         {isLoading ? (
//           <div
//             style={{
//               height: '32px',
//               background: '#f0f0f0',
//               borderRadius: '4px'
//             }}
//           />
//         ) : (
//           <>
//             <span>{value || '0'}</span>
//             {subtext && (
//               <p
//                 style={{
//                   fontSize: '12px',
//                   color: '#6b7280',
//                   margin: '4px 0 0'
//                 }}
//               >
//                 {subtext}
//               </p>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

/**
 * Enhanced DashboardHeader Component
 * Displays comprehensive admin statistics
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
        console.log('📊 Admin Stats:', res.data)
      } catch (err) {
        console.error('❌ Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <section className='section-one'>
        {[...Array(8)].map((_, i) => (
          <StatCard
            key={i}
            label='Loading...'
            value='-'
            icon={<Users />}
            color='#3b82f6'
            isLoading={true}
          />
        ))}
      </section>
    )
  }

  const {
    summary = {},
    engagement = {},
    activity = {},
    topCustomers = [],
    payments = {}
  } = stats || {}

  const {
    totalCustomers = 0,
    totalVerified = 0,
    totalUnverified = 0,
    adminCount = 0,
    userCount = 0,
    customerWithOrders = 0,
    totalOrders = 0,
    totalRevenue = 0,
    averageOrderValue = 0,
    ordersShipped = 0,
    ordersDelivered = 0,
    ordersPending = 0,
    ordersCancelled = 0
  } = summary

  return (
    <div>
      {/* Primary Metrics */}
      <section className='section-one'>
        {/* Total Customers */}
        <StatCard
          label='Total Customers'
          value={totalCustomers?.toLocaleString() || '0'}
          icon={<Users />}
          color='#10b981'
          isLoading={loading}
          subtext={`${totalVerified} verified`}
        />

        {/* Total Orders */}
        <StatCard
          label='Total Orders'
          value={totalOrders?.toLocaleString() || '0'}
          icon={<ShoppingCart />}
          color='#3b82f6'
          isLoading={loading}
          subtext={`Avg: $${averageOrderValue?.toFixed(2)}`}
        />

        {/* Total Revenue */}
        <StatCard
          label='Total Revenue'
          value={`$${totalRevenue?.toLocaleString() || '0'}`}
          icon={<DollarSign />}
          color='#f59e0b'
          isLoading={loading}
          subtext={`From ${customerWithOrders} customers`}
        />

        {/* Orders Delivered */}
        <StatCard
          label='Orders Delivered'
          value={ordersDelivered?.toLocaleString() || '0'}
          icon={<CheckCircle />}
          color='#06b6d4'
          isLoading={loading}
          subtext={`${((ordersDelivered / totalOrders) * 100).toFixed(
            1
          )}% completion`}
        />
      </section>

      {/* Order Status Breakdown */}
      <section className='section-one'>
        {/* Orders Shipped */}
        <StatCard
          label='Orders Shipped'
          value={ordersShipped?.toLocaleString() || '0'}
          icon={<Truck />}
          color='#8b5cf6'
          isLoading={loading}
        />

        {/* Orders Pending */}
        <StatCard
          label='Orders Pending'
          value={ordersPending?.toLocaleString() || '0'}
          icon={<Clock />}
          color='#ec4899'
          isLoading={loading}
        />

        {/* Orders Cancelled */}
        <StatCard
          label='Orders Cancelled'
          value={ordersCancelled?.toLocaleString() || '0'}
          icon={<AlertCircle />}
          color='#ef4444'
          isLoading={loading}
        />

        {/* Customers with Orders */}
        <StatCard
          label='Active Customers'
          value={customerWithOrders?.toLocaleString() || '0'}
          icon={<TrendingUp />}
          color='#14b8a6'
          isLoading={loading}
          subtext={`${((customerWithOrders / totalCustomers) * 100).toFixed(
            1
          )}% of total`}
        />
      </section>

      {/* User Engagement & Activity */}
      <section className='section-one'>
        {/* Admin Users */}
        <StatCard
          label='Admin Users'
          value={adminCount?.toLocaleString() || '0'}
          icon={<Eye />}
          color='#6366f1'
          isLoading={loading}
          subtext={`Out of ${totalCustomers}`}
        />

        {/* Regular Users */}
        <StatCard
          label='Regular Users'
          value={userCount?.toLocaleString() || '0'}
          icon={<Users />}
          color='#06b6d4'
          isLoading={loading}
        />

        {/* Users with Cart */}
        <StatCard
          label='Users with Cart'
          value={engagement?.usersWithCart?.toLocaleString() || '0'}
          icon={<ShoppingCart />}
          color='#f59e0b'
          isLoading={loading}
          subtext={`${engagement?.totalCartItems || 0} items`}
        />

        {/* Users with Wishlist */}
        <StatCard
          label='Users with Wishlist'
          value={engagement?.usersWithWishlist?.toLocaleString() || '0'}
          icon={<Heart />}
          color='#ef4444'
          isLoading={loading}
          subtext={`${engagement?.totalWishlistItems || 0} items`}
        />
      </section>

      {/* Activity & Verification */}
      <section className='section-one'>
        {/* Verified Users */}
        <StatCard
          label='Verified Users'
          value={totalVerified?.toLocaleString() || '0'}
          icon={<CheckCircle />}
          color='#10b981'
          isLoading={loading}
          subtext={`${((totalVerified / totalCustomers) * 100).toFixed(
            1
          )}% verified`}
        />

        {/* Unverified Users */}
        <StatCard
          label='Unverified Users'
          value={totalUnverified?.toLocaleString() || '0'}
          icon={<AlertCircle />}
          color='#ef4444'
          isLoading={loading}
          subtext={`${((totalUnverified / totalCustomers) * 100).toFixed(
            1
          )}% pending`}
        />

        {/* Recently Active */}
        <StatCard
          label='Active This Week'
          value={activity?.recentlyActiveUsers?.toLocaleString() || '0'}
          icon={<Activity />}
          color='#3b82f6'
          isLoading={loading}
          subtext={`Users in last 7 days`}
        />

        {/* Users with Last Login */}
        <StatCard
          label='Users Ever Logged In'
          value={activity?.usersWithLastLogin?.toLocaleString() || '0'}
          icon={<Eye />}
          color='#14b8a6'
          isLoading={loading}
        />
      </section>

      {/* Top Customers Section */}
      {topCustomers && topCustomers.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '18px',
                fontWeight: 600
              }}
            >
              Top 10 Customers
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        color: '#6b7280',
                        fontSize: '14px'
                      }}
                    >
                      Customer
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        color: '#6b7280',
                        fontSize: '14px'
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '12px',
                        color: '#6b7280',
                        fontSize: '14px'
                      }}
                    >
                      Total Spent
                    </th>
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '12px',
                        color: '#6b7280',
                        fontSize: '14px'
                      }}
                    >
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', fontWeight: 500 }}>
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          fontSize: '14px',
                          color: '#6b7280'
                        }}
                      >
                        {customer.email}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          textAlign: 'right',
                          fontWeight: 500
                        }}
                      >
                        ${customer.totalSpent?.toFixed(2) || '0.00'}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          textAlign: 'right',
                          color: '#6b7280'
                        }}
                      >
                        {customer.orderCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
