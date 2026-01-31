'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function CookiesPopup () {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted')
    if (!hasAcceptedCookies) {
      setTimeout(() => setShowPopup(true), 800)
    }
  }, [])

  const handleAccept = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookies`, {
        consent: 'accepted'
      })
      localStorage.setItem('cookiesAccepted', 'true')
      setShowPopup(false)
    } catch (err) {
      console.error('Error saving consent:', err)
    }
  }

  const handleDecline = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookies`, {
        consent: 'declined'
      })
      setShowPopup(false)
    } catch (err) {
      console.error('Error saving decline:', err)
    }
  }

  if (!showPopup) return null

  return (
    <div className='cookie-overlay'>
      <div className='cookies-popup'>
        <div className='cookies-container'>
          <p>
            We use cookies to enhance your browsing experience, serve
            personalized content, and analyze our traffic. By clicking “Accept”,
            you consent to our use of cookies. For more information, please read
            our{' '}
            <a href='/privacy-policy' target='_blank'>
              privacy policy
            </a>
            .
          </p>

          <div className='cookies-actions'>
            <button className='accept-btn' onClick={handleAccept}>
              Accept
            </button>
            <button className='decline-btn' onClick={handleDecline}>
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
