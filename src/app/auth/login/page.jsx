'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

/**
 * AuthPage with a "Resend OTP" (request OTP again) feature.
 * - Resend uses the same /api/auth/login endpoint (POST { email }) to send a new code.
 * - A cooldown prevents repeated clicks (default 30s). You can adjust cooldownSeconds.
 * - Limited resend attempts can be enforced (default maxResendAttempts = 5).
 * - Status messages are announced via an aria-live region for accessibility.
 *
 * Drop-in replacement for your original component.
 */

export default function AuthPage () {
  const router = useRouter()

  // Steps: "email" | "otp"
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('') // friendly messages
  const [resendCooldown, setResendCooldown] = useState(0) // seconds
  const cooldownSeconds = 30
  const maxResendAttempts = 5
  const [resendAttempts, setResendAttempts] = useState(0)
  const cooldownTimerRef = useRef(null)
  const announceRef = useRef(null) // for aria-live focus (not required but handy)

  // Read persisted email (if any) so page refresh keeps you in OTP step
  useEffect(() => {
    const saved = localStorage.getItem('email')
    if (saved) {
      setEmail(saved)
      setStep('otp')
      // If you want to auto-start a cooldown on load, uncomment:
      // setResendCooldown(cooldownSeconds)
    }
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current)
      }
    }
  }, [])

  // manage cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current)
        cooldownTimerRef.current = null
      }
      return
    }

    // start interval if not already started
    if (!cooldownTimerRef.current) {
      cooldownTimerRef.current = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current)
            cooldownTimerRef.current = null
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      // cleanup handled above when timer ends or component unmounts
    }
  }, [resendCooldown])

  // Utility to format cooldown as mm:ss or ss
  const formatCooldown = secs => {
    if (!secs) return ''
    const mm = Math.floor(secs / 60)
    const ss = secs % 60
    return mm > 0
      ? `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
      : `${ss}s`
  }

  // Step 1 → Request OTP (initial)
  const handleContinue = async () => {
    if (!email) {
      setError('Please enter your email')
      return
    }

    try {
      setLoading(true)
      setError('')
      setStatus('')

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        { email }
      )

      const data = res.data
      console.log('✅ Login response:', data)

      // Save to localStorage for later (persist to allow refresh)
      localStorage.setItem('email', email)
      if (data.user?._id) {
        localStorage.setItem('userId', data.user._id)
      }

      setStep('otp')
      setStatus('Code sent. Check your email.')
      // start resend cooldown
      setResendCooldown(cooldownSeconds)
      setResendAttempts(0) // reset attempts on initial send
      // Announce to screen readers (aria-live)
      if (announceRef.current)
        announceRef.current.textContent = 'Code sent to your email.'
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.response?.data?.msg || err.message || 'Something went wrong')
      if (announceRef.current)
        announceRef.current.textContent = 'Failed to send code.'
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP (clickable from OTP step)
  const handleResend = async () => {
    // Prevent resending if cooldown active or too many attempts
    if (!email) {
      setError('Email missing. Please re-enter your email.')
      return
    }
    if (resendCooldown > 0) {
      setError(
        `Please wait ${formatCooldown(resendCooldown)} before resending.`
      )
      return
    }
    if (resendAttempts >= maxResendAttempts) {
      setError(
        'You have reached the maximum number of resend attempts. Try again later.'
      )
      return
    }

    try {
      setLoading(true)
      setError('')
      setStatus('')

      // Use same endpoint as initial login to issue a new OTP
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        { email }
      )
      const data = res.data
      console.log('🔁 Resend response:', data)

      setResendAttempts(prev => prev + 1)
      setResendCooldown(cooldownSeconds)
      setStatus('A new code has been sent to your email.')
      if (announceRef.current)
        announceRef.current.textContent =
          'A new code has been sent to your email.'
    } catch (err) {
      console.error('❌ Resend error:', err)
      setError(
        err.response?.data?.msg || err.message || 'Failed to resend code'
      )
      if (announceRef.current)
        announceRef.current.textContent = 'Failed to resend code.'
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
      setStatus('')

      const currentEmail = email || localStorage.getItem('email')
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
        { email: currentEmail, code }
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
      if (announceRef.current) announceRef.current.textContent = 'Invalid code.'
    } finally {
      setLoading(false)
    }
  }

  // Allow user to go back and change email
  const handleBackToEmail = () => {
    setStep('email')
    setCode('')
    setStatus('')
    setError('')
    // optionally clear persisted email
    // localStorage.removeItem('email')
  }

  return (
    <div className='login-container'>
      <div className='login-box' role='main' aria-labelledby='auth-heading'>
        <h1 id='auth-heading' className='logo'>
          NAKACHI NDUMDI
        </h1>

        {/* Status / accessibility announcement */}
        <div
          ref={announceRef}
          aria-live='polite'
          style={{
            position: 'absolute',
            left: -9999,
            top: 'auto',
            width: 1,
            height: 1,
            overflow: 'hidden'
          }}
        />

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
              aria-label='Email address'
            />

            {error && (
              <p className='error' role='alert'>
                {error}
              </p>
            )}
            {status && <p className='status'>{status}</p>}

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
            <p className='signin-subtitle'>
              Sent to <strong>{email}</strong>
            </p>

            <input
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              className='input'
              maxLength={6}
              placeholder='6-digit code'
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              aria-label='6-digit verification code'
            />

            {error && (
              <p className='error' role='alert'>
                {error}
              </p>
            )}
            {status && <p className='status'>{status}</p>}

            <div className='button-group'>
              <button
                className='btn btn-continue'
                onClick={handleVerify}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Submit'}
              </button>

              <button
                className='btn btn-link'
                onClick={handleResend}
                disabled={
                  loading ||
                  resendCooldown > 0 ||
                  resendAttempts >= maxResendAttempts
                }
                aria-disabled={
                  loading ||
                  resendCooldown > 0 ||
                  resendAttempts >= maxResendAttempts
                }
                title={
                  resendCooldown > 0
                    ? `Resend available in ${formatCooldown(resendCooldown)}`
                    : 'Resend code'
                }
              >
                {resendAttempts >= maxResendAttempts
                  ? 'Resend disabled'
                  : resendCooldown > 0
                  ? `Resend in ${formatCooldown(resendCooldown)}`
                  : 'Resend code'}
              </button>

              <button
                className='btn btn-ghost'
                onClick={handleBackToEmail}
                disabled={loading}
              >
                Change email
              </button>
            </div>

            <div className='attempts-info'>
              Attempts: {resendAttempts} / {maxResendAttempts}
            </div>
          </>
        )}

        {/* Footer Links */}
        <div className='links'>
          <a href='/auth/privacy-cookies'>Privacy policy</a>
          <span className='separator'>|</span>
          <a href='/auth/privacy-cookies'>Terms of service</a>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-box {
          width: 100%;
          max-width: 440px;
          background: white;
          // border-radius: 16px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          text-align: center;
        }

        .logo {
          font-size: 22px;
          margin-bottom: 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .signin-title {
          font-size: 24px;
          margin: 8px 0 6px;
          font-weight: 800;
          color: #1f2937;
        }

        .signin-subtitle {
          color: #6b7280;
          margin-bottom: 20px;
          font-size: 15px;
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          // border-radius: 10px;
          margin-bottom: 12px;
          font-size: 15px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
          align-items: center;
          width: 100%;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          // border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.25s ease;
          width: 100%;
          max-width: 100%;
        }

        .btn[disabled],
        button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-continue {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .btn-continue:hover:not([disabled]) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }

        .btn-link {
          background: transparent;
          color: #2563eb;
          border: none;
          padding: 10px 16px;
          text-decoration: underline;
          font-weight: 600;
        }

        .btn-link:disabled {
          color: #9ca3af;
          text-decoration: none;
        }

        .btn-link:hover:not([disabled]) {
          color: #1d4ed8;
          background: rgba(37, 99, 235, 0.05);
        }

        .btn-ghost {
          background: #f3f4f6;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }

        .btn-ghost:hover:not([disabled]) {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .error {
          color: #dc2626;
          margin-top: 8px;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          text-align: center;
        }

        .status {
          color: #059669;
          margin-top: 8px;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          text-align: center;
        }

        .attempts-info {
          margin-top: 16px;
          color: #6b7280;
          font-size: 13px;
          text-align: center;
        }

        .links {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
          margin-top: 24px;
          color: #6366f1;
          font-weight: 600;
          font-size: 14px;
        }

        .separator {
          color: #d1d5db;
          user-select: none;
        }

        a {
          color: #6366f1;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        a:hover {
          color: #4f46e5;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 16px;
          }

          .login-box {
            padding: 24px 20px;
            // border-radius: 12px;
          }

          .logo {
            font-size: 18px;
          }

          .signin-title {
            font-size: 20px;
          }

          .signin-subtitle {
            font-size: 14px;
          }

          .input {
            padding: 12px 14px;
            font-size: 14px;
          }

          .btn {
            padding: 11px 16px;
            font-size: 14px;
          }

          .button-group {
            gap: 10px;
          }

          .links {
            flex-direction: column;
            gap: 12px;
          }

          .separator {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
