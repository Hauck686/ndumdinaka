'use client'
import React, { useState } from 'react'
import axios from 'axios'

export default function NewsletterComponent () {
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
    <div className='newsletter'>
      <div className='formSection'>
        <h2>SUBSCRIBE AND GET 10% OFF</h2>
        <p>
          Get to know our world and be the first to shop new collections or
          online exclusives and enjoy 10% off your first order
        </p>

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
            <label htmlFor='email'>Email</label>
            <span className='underline'></span>
          </div>

          <div className='radioGroup'>
            <label>Gender</label>
            <div>
              <input
                type='radio'
                id='man'
                name='gender'
                value='man'
                checked={formData.gender === 'man'}
                onChange={handleChange}
              />
              <label htmlFor='man'>Man</label>
            </div>
            <div>
              <input
                type='radio'
                id='woman'
                name='gender'
                value='woman'
                checked={formData.gender === 'woman'}
                onChange={handleChange}
              />
              <label htmlFor='woman'>Woman</label>
            </div>
            <div>
              <input
                type='radio'
                id='none'
                name='gender'
                value='none'
                checked={formData.gender === 'none'}
                onChange={handleChange}
              />
              <label htmlFor='none'>Prefer not to say</label>
            </div>
          </div>

          <div className='checkboxGroup'>
            <input
              type='checkbox'
              id='policy1'
              name='consentMarketing'
              checked={formData.consentMarketing}
              onChange={handleChange}
              required
            />
            <label htmlFor='policy1'>
              I have read and understood the <a href='#'>privacy policy</a> and
              I give my consent for the processing of my personal data for
              marketing purposes.
            </label>
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
              I have read and understood the <a href='#'>privacy policy</a> and
              I give my consent for the processing of my personal data to
              receive personalized offers and services based on my preferences
              and habits.
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
