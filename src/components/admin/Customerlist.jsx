'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Search, Filter } from 'lucide-react'

/**
 * LoadingScreen Component
 */
function LoadingScreen () {
  return (
    <div className='loading-screen'>
      <div className='loading-content'>
        <svg
          className='spinner'
          width='40'
          height='40'
          viewBox='0 0 40 40'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle
            cx='20'
            cy='20'
            r='18'
            stroke='currentColor'
            strokeWidth='2'
            opacity='0.1'
          />
          <path
            d='M20 2C10.6 2 2.9 9.7 2.9 19'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
        <p>Loading, please wait...</p>
      </div>
    </div>
  )
}

/**
 * CustomersList Component - Customers table with search and filter
 */
export default function CustomersList () {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedRows, setSelectedRows] = useState(new Set())

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

  // Filter customers based on search
  const filteredCustomers = customers.filter(user =>
    `${user.firstName || ''} ${user.lastName || ''} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // Toggle row selection
  const toggleRow = userId => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedRows(newSelected)
  }

  // Toggle all rows
  const toggleAllRows = () => {
    if (selectedRows.size === filteredCustomers.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(filteredCustomers.map(c => c._id)))
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className='customers'>
      {/* Header Section */}
      <div className='customers__header'>
        <div>
          <h2>Customers List</h2>
          <p>Total {customers.length}</p>
        </div>

        <div className='customers__actions'>
          {/* Search Input */}
          <div className='search'>
            <Search size={18} />
            <input
              type='text'
              placeholder='Search customers...'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <button className='filter-btn' type='button'>
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      {/* Table Section */}
      <table className='customers__table'>
        <thead>
          <tr>
            <th style={{ width: '40px' }}>
              <input
                type='checkbox'
                checked={
                  selectedRows.size === filteredCustomers.length &&
                  filteredCustomers.length > 0
                }
                onChange={toggleAllRows}
                aria-label='Select all customers'
              />
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
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(user => (
              <tr key={user._id}>
                <td style={{ width: '40px' }}>
                  <input
                    type='checkbox'
                    checked={selectedRows.has(user._id)}
                    onChange={() => toggleRow(user._id)}
                    aria-label={`Select ${user.firstName} ${user.lastName}`}
                  />
                </td>
                <td className='customer' data-label='Customer Name'>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                        user.email.split('@')[0]
                    )}&background=3b82f6&color=fff&size=32`}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={32}
                    height={32}
                  />
                  <div>
                    <strong>
                      {user.firstName} {user.lastName}
                    </strong>
                    <span>{user.email}</span>
                  </div>
                </td>
                <td data-label='Email'>{user.email}</td>
                <td data-label='Role'>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      background:
                        user.role === 'admin'
                          ? 'rgba(59, 130, 244, 0.1)'
                          : 'rgba(107, 114, 128, 0.1)',
                      color: user.role === 'admin' ? '#3b82f6' : '#6b7280',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td className='status' data-label='Verified'>
                  {user.isVerified ? (
                    <span style={{ color: '#10b981' }}>✓ Verified</span>
                  ) : (
                    <span style={{ color: '#ef4444' }}>✗ Unverified</span>
                  )}
                </td>
                <td className='date' data-label='Last Login'>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : '-'}
                </td>
                <td className='date' data-label='Date Joined'>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan='7'
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280'
                }}
              >
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
