'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function EditProfileNameModal ({ onClose, user, onUpdated }) {
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [loading, setLoading] = useState(false)
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

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/user/${user._id}`,
        { firstName, lastName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const updatedUser = res.data
      onUpdated(updatedUser) // ✅ refresh parent
      onClose()
    } catch (err) {
      console.error('Update error:', err)
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='modal-overlay'>
      <div className='edit-modal'>
        <div className='modal-header'>
          <h3>Edit profile</h3>
          <button className='close-btn' onClick={onClose}>
            ✕
          </button>
        </div>

        <div className='modal-body'>
          {error && <p className='error'>{error}</p>}

          <input
            type='text'
            placeholder='First name'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <input
            type='text'
            placeholder='Last name'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          <input type='text' value={user?.email || ''} disabled />
          <p className='note'>Email used for login can't be changed</p>
        </div>

        <div className='modal-footer'>
          <button className='cancel-btn' onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className='save-btn' onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
