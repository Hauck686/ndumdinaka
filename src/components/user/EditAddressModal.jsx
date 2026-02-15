'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const EditAddressModal = ({ onClose, user, onUpdated }) => {
  const [form, setForm] = useState({
    label: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)

  // Load userId from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'))
      setToken(localStorage.getItem('token'))
    }
  }, [])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${user._id}/address`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // ✅ update parent user state with latest addresses
      if (onUpdated) {
        onUpdated({ ...user, addresses: res.data.addresses })
      }

      onClose()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.msg || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-container' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>Add address</h3>
          <button className='close-btn' onClick={onClose}>
            ✕
          </button>
        </div>

        <form className='modal-form' onSubmit={handleSave}>
          {/* Label */}
          <div className='form-group'>
            <input
              type='text'
              name='label'
              placeholder='Label (e.g. Home, Work)'
              value={form.label}
              onChange={handleChange}
            />
          </div>

          {/* Address fields */}
          <div className='form-group'>
            <input
              type='text'
              name='addressLine1'
              placeholder='Address line 1'
              value={form.addressLine1}
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              name='addressLine2'
              placeholder='Address line 2'
              value={form.addressLine2}
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              name='city'
              placeholder='City'
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              name='state'
              placeholder='State'
              value={form.state}
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              name='zip'
              placeholder='Zip code'
              value={form.zip}
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              name='country'
              placeholder='Country'
              value={form.country}
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              name='phone'
              placeholder='Phone'
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {error && <p className='error'>{error}</p>}

          {/* Footer */}
          <div className='actions'>
            <button type='button' className='cancel' onClick={onClose}>
              Cancel
            </button>
            <button type='submit' className='save' disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAddressModal
