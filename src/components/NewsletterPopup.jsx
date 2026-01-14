'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function NewsletterPopup () {
  const [showPopup, setShowPopup] = useState(false)
  const [email, setEmail] = useState('')
  const [policyChecked, setPolicyChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenNewsletter')
    if (!hasSeenPopup) {
      setTimeout(() => setShowPopup(true), 1000)
    }
  }, [])

  const handleClose = () => {
    setShowPopup(false)
    localStorage.setItem('hasSeenNewsletter', 'true')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!policyChecked) {
      setMessage('Please agree to the privacy policy.')
      return
    }

    try {
      setLoading(true)
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletters/subscribe`,
        {
          email,
          gender: 'none',
          consentMarketing: true,
          consentPersonalized: false
        }
      )
      setMessage('Subscribed successfully!')
      localStorage.setItem('hasSeenNewsletter', 'true')
      setTimeout(() => handleClose(), 1500)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error subscribing.')
    } finally {
      setLoading(false)
    }
  }

  if (!showPopup) return null

  return (
    <div className='newsletter-overlay'>
      <div className='newsletter-modal'>
        <button className='close-btn' onClick={handleClose}>
          &times;
        </button>

        <div className='newsletter-image'>
          <img
            src='https://7503080.hs-sites.com/hs-fs/hubfs/2025/FW25/POP-UP-NL-800x614-Prefall.jpg?width=400&height=307&name=POP-UP-NL-800x614-Prefall.jpg'
            alt='Newsletter banner'
          />
        </div>

        <div className='newsletter-content'>
          <h2>SIGN UP AND ENJOY 10% OFF</h2>
          <p>
            Subscribe now for <strong>10% off</strong> your first order and
            exclusive updates.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor='email'>Email *</label>
            <input
              type='email'
              id='email'
              required
              placeholder='Your email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <div className='checkbox'>
              <input
                type='checkbox'
                id='policy'
                checked={policyChecked}
                onChange={e => setPolicyChecked(e.target.checked)}
                required
              />
              <label htmlFor='policy'>
                I have read and understood the <a href='#'>privacy policy</a>{' '}
                and I consent to the processing of my personal data for
                marketing purposes.
              </label>
            </div>

            <button type='submit' disabled={loading}>
              {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
            </button>

            {message && <p className='status-message'>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
