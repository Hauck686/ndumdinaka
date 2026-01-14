'use client'
import React, { useContext, useEffect, useState } from 'react'
import EditAddressModal from '@/components/user/EditAddressModal'
import EditProfileNameModal from '@/components/user/EditProfileNameModal'
import { UserPen } from 'lucide-react'
import axios from 'axios'

export default function ProfilePage () {
  const [showNameEditor, setShowNameEditor] = useState(false)
  const [showAddressEditor, setShowAddressEditor] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)

  // Load userId from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'))
      setToken(localStorage.getItem('token'))
    }
  }, [])

  // Fetch user when userId + token are available
  useEffect(() => {
    if (!userId || !token) return // ✅ wait until both exist

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setUser(res.data)
      } catch (err) {
        setError(err.response?.data?.msg || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, token])

  if (loading) return <p>Loading profile...</p>
  if (error) return <p className='error'>Error: {error}</p>
  if (!user) return <p>No user data found</p>

  return (
    <>
      <div className='profile-page'>
        <h2 className='section-title'>Profile</h2>

        {/* Profile Info Box */}
        <div className='info-box'>
          <div className='row'>
            <span className='label'>
              Name
              <button
                className='pen-btn'
                onClick={() => setShowNameEditor(true)}
                disabled={user.firstName && user.lastName}
              >
                <UserPen strokeWidth={1.5} />
              </button>
            </span>
            <span className='value'>
              {user.firstName || user.lastName
                ? `${user.firstName || ''} ${user.lastName || ''}`
                : 'No name set'}
            </span>
          </div>
          <div className='row'>
            <span className='label'>Email</span>
            <span className='value'>{user.email}</span>
          </div>
        </div>

        {/* Addresses Box */}
        <div className='info-box'>
          <div className='row header'>
            <span className='label'>Addresses</span>
            <button
              className='add-btn'
              onClick={() => setShowAddressEditor(true)}
              disabled={user.addresses && user.addresses.length > 0} // ✅ disable if already exists
            >
              + Add
            </button>
          </div>

          {user.addresses && user.addresses.length > 0 ? (
            user.addresses.map((addr, index) => (
              <div key={index} className='address-box'>
                <p>
                  <strong>{addr.label}</strong>
                </p>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>
                  {addr.city}, {addr.state} {addr.zip}
                </p>
                <p>{addr.country}</p>
                <p>📞 {addr.phone}</p>
              </div>
            ))
          ) : (
            <div className='empty-box'>
              <span>ⓘ No addresses added</span>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showNameEditor && (
        <EditProfileNameModal
          onClose={() => setShowNameEditor(false)}
          user={user}
          onUpdated={updatedUser => setUser(updatedUser)} // update state after save
        />
      )}

      {showAddressEditor && (
        <EditAddressModal
          onClose={() => setShowAddressEditor(false)}
          user={user}
          onUpdated={updatedUser => setUser(updatedUser)} // ✅ refresh user after adding
        />
      )}
    </>
  )
}
