'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function AuthPage () {
  const router = useRouter()
  const [step, setStep] = useState('email') // "email" | "otp"
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1 → Request OTP
  const handleContinue = async () => {
    if (!email) {
      setError('Please enter your email')
      return
    }
    try {
      setLoading(true)
      setError('')
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        { email }
      )
      const data = res.data
      console.log('✅ Login response:', data)

      // Save to localStorage for later
      localStorage.setItem('email', email)
      if (data.user?._id) {
        localStorage.setItem('userId', data.user._id)
      }

      setStep('otp') // go to OTP step
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.response?.data?.msg || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 → Verify OTP
  const handleVerify = async e => {
    e.preventDefault()
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }
    try {
      setLoading(true)
      setError('')
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
        { email, code }
      )
      const data = res.data
      console.log('✅ Verify response:', data)

      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }
      if (data.user?._id) {
        localStorage.setItem('userId', data.user._id)
        localStorage.setItem('token', data.token)
      }

      // cleanup
      localStorage.removeItem('email')

      // redirect based on role
      if (data.user?.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/user-profile')
      }
    } catch (err) {
      console.error('❌ Verify error:', err)
      setError(err.response?.data?.msg || 'Invalid code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h1 className='logo'>NAKACHI NDUMDI</h1>

        {/* Step 1 → Email */}
        {step === 'email' && (
          <>
            <h2 className='signin-title'>Sign in</h2>
            <p className='signin-subtitle'>Sign in using your email</p>

            <input
              type='email'
              className='input'
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            {error && <p className='error'>{error}</p>}

            <button
              className='btn btn-continue'
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? 'Sending code...' : 'Continue'}
            </button>
          </>
        )}

        {/* Step 2 → OTP */}
        {step === 'otp' && (
          <>
            <h2 className='signin-title'>Enter code</h2>
            <p className='signin-subtitle'>Sent to {email}</p>

            <input
              type='text'
              className='input'
              maxLength={6}
              placeholder='6-digit code'
              value={code}
              onChange={e => setCode(e.target.value)}
            />

            {error && <p className='error'>{error}</p>}

            <button
              className='btn btn-continue'
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Submit'}
            </button>
          </>
        )}

        {/* Footer Links */}
        <div className='links'>
          <a href='/auth/privacy-cookies'>Privacy policy</a>
          <a href='/auth/privacy-cookies'>Terms of service</a>
        </div>
      </div>
    </div>
  )
}
