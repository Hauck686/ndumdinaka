'use client'
import React, { useState } from 'react'
import axios from 'axios'

export default function NewsletterComp () {
  const [formData, setFormData] = useState({
    email: '',
    gender: 'none',
    consentMarketing: false,
    consentPersonalized: false
  })
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.consentPersonalized) {
      setMessage('You must agree to the Privacy Policy to subscribe.')
      return
    }
    try {
      setLoading(true)
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletters/subscribe`,
        formData
      )
      setMessage('Subscription successful!')
      setFormData({
        email: '',
        gender: 'none',
        consentMarketing: false,
        consentPersonalized: false
      })
    } catch (err) {
      setMessage(err.response?.data?.message || 'Subscription failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='newslettercomp'>
      <div className='formSection'>
        <h2>SUBSCRIBE </h2>

        <form onSubmit={handleSubmit}>
          <div className='inputGroup'>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Your email address'
              required
              value={formData.email}
              onChange={handleChange}
            />
            {/* <label htmlFor='email'>Email</label> */}
            <span className='underline'></span>
          </div>

          <div className='checkboxGroup'>
            <input
              type='checkbox'
              id='policy2'
              name='consentPersonalized'
              checked={formData.consentPersonalized}
              onChange={handleChange}
            />
            <label htmlFor='policy2'>
              I have read and understood the Privacy Policy
            </label>
          </div>

          <button type='submit' className='submitBtn' disabled={loading}>
            {loading ? 'Signing up...' : 'Submit'}
          </button>

          {message && <p className='status-message'>{message}</p>}
        </form>
      </div>
    </div>
  )
}
