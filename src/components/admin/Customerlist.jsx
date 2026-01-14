'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Search, Filter } from 'lucide-react'
import LoadingScreen from '@/components/LoadingScreen'

export default function CustomersList () {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token')

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setCustomers(res.data || [])
      } catch (err) {
        console.error('❌ Failed to fetch users:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredCustomers = customers.filter(user =>
    `${user.firstName || ''} ${user.lastName || ''} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  if (loading)
    return (
      <div>
        <LoadingScreen />
      </div>
    )

  return (
    <div className='customers'>
      {/* Header */}
      <div className='customers__header'>
        <div>
          <h2>Customers List</h2>
          <p>Total {customers.length}</p>
        </div>
        <div className='customers__actions'>
          <div className='search'>
            <Search size={18} />
            <input
              type='text'
              placeholder='Search...'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className='filter-btn'>
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <table className='customers__table'>
        <thead>
          <tr>
            <th>
              <input type='checkbox' />
            </th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Last Login</th>
            <th>Date Joined</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(u => (
            <tr key={u._id}>
              <td>
                <input type='checkbox' />
              </td>
              <td className='customer'>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    u.email.split('@')[0]
                  )}&background=25714a&color=fff&size=28`}
                  alt={u.email}
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%' }}
                />
                <div>
                  <strong>
                    {u.firstName} {u.lastName}
                  </strong>
                  <span>{u.email}</span>
                </div>
              </td>

              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isVerified ? '✅' : '❌'}</td>
              <td>
                {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '-'}
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
