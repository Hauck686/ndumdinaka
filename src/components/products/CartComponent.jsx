'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
// import { useNotification } from '@/app/context/NotificationContext'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import SkeletonProductCard from '../SkeletonProductCard'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function CartComponent ({ onClose }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // const { //} = useNotification()
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'))
      setToken(localStorage.getItem('token'))
    }
  }, [])

  // fetch cart (reads localStorage for both guest and logged-in users)
  const fetchCart = async (uid, tok) => {
    setLoading(true)
    try {
      if (uid && tok) {
        // Logged-in user: fetch from backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${uid}`,
          { headers: { Authorization: `Bearer ${tok}` } }
        )
        setItems(res.data.cart || [])
      } else {
        // Guest user: fetch from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
        setItems(guestCart)
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message)
      showNotification('Failed to load cart ❌', 'error')
    } finally {
      setLoading(false)
    }
  }

  // run once: read localStorage THEN fetch cart
  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        const uid = localStorage.getItem('userId')
        const tok = localStorage.getItem('token')
        setUserId(uid)
        setToken(tok)
        await fetchCart(uid, tok)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // remove item
  const removeItem = async idx => {
    const item = items[idx]
    const updated = items.filter((_, i) => i !== idx)
    setItems(updated)

    if (userId && token) {
      // Logged-in user: remove from backend
      try {
        const sizeParam =
          item.size && typeof item.size === 'object'
            ? JSON.stringify(item.size)
            : item.size || null

        const colorParam = item.color || null
        const measurementIdParam = item.measurementId || null

        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${userId}/${
            typeof item.productId === 'object' && item.productId._id
              ? item.productId._id
              : item.productId
          }`,
          {
            params: {
              size: sizeParam,
              color: colorParam,
              measurementId: measurementIdParam
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        setItems(res.data.cart || [])
        showNotification(`${item.name} removed from cart 🗑️`, 'success')
      } catch (err) {
        console.error('❌ Failed to remove item:', err.response?.data || err)
        setItems(items) // rollback
        showNotification('Failed to remove item ❌', 'error')
      }
    } else {
      // Guest user: remove from localStorage
      localStorage.setItem('guestCart', JSON.stringify(updated))
      showNotification(`${item.name} removed from cart 🗑️`, 'success')
    }
  }

  // Merge guest cart AND measurements to user account after login
  const mergeGuestDataToUser = async (uid, tok) => {
    // Merge guest cart
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')

    if (guestCart.length > 0) {
      try {
        for (const item of guestCart) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add-cart`,
            { ...item, userId: uid },
            { headers: { Authorization: `Bearer ${tok}` } }
          )
        }
        localStorage.removeItem('guestCart')
        console.log('✅ Guest cart merged successfully')
      } catch (err) {
        console.error('Failed to merge guest cart:', err)
      }
    }

    // Merge guest measurements
    const guestMeasurements = JSON.parse(
      localStorage.getItem('customMeasurements') || '[]'
    )

    if (guestMeasurements.length > 0) {
      try {
        for (const measurement of guestMeasurements) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/measurements`,
            { ...measurement, userId: uid },
            { headers: { Authorization: `Bearer ${tok}` } }
          )
        }
        localStorage.removeItem('customMeasurements')
        console.log('✅ Guest measurements merged successfully')
      } catch (err) {
        console.error('Failed to merge guest measurements:', err)
      }
    }

    if (guestCart.length > 0 || guestMeasurements.length > 0) {
      showNotification('Cart and measurements synced! 🎉', 'success')
    }
  }

  // Merge guest cart to user account after login
  const mergeGuestCartToUser = async (uid, tok) => {
    const guestCart = JSON.parse(
      localStorage.getItem('guestCart') ||
        localStorage.getItem('customMeasurements') ||
        '[]'
    )

    if (guestCart.length > 0) {
      try {
        for (const item of guestCart) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add-cart`,
            { ...item, userId: uid },
            { headers: { Authorization: `Bearer ${tok}` } }
          )
        }
        // Clear guest cart after successful merge
        localStorage.removeItem('guestCart')
        showNotification('Cart items merged successfully! 🎉', 'success')
      } catch (err) {
        console.error('Failed to merge guest cart:', err)
        showNotification('Failed to merge cart items', 'error')
      }
    }
  }

  // Handle login callback (call this after successful login)
  const handlePostLogin = async () => {
    const uid = localStorage.getItem('userId')
    const tok = localStorage.getItem('token')

    if (uid && tok) {
      setUserId(uid)
      setToken(tok)

      // Merge guest cart to user account
      await mergeGuestCartToUser(uid, tok)

      // Refresh cart from backend
      await fetchCart(uid, tok)

      // Hide login prompt and proceed to checkout
      setShowLoginPrompt(false)
      await initiateCheckout(uid, tok)
    }
  }

  handlePostLogin()

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const isEmpty = items.length === 0

  // Initiate checkout with payment intent
  const initiateCheckout = async (uid, tok) => {
    try {
      const payloadItems = items.map(item => {
        const measurementSizes =
          (item.measurementData && item.measurementData.values) ||
          (item.size && typeof item.size === 'object' ? item.size : null)

        return {
          ...item,
          measurementSizes
        }
      })

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-payment-intent`,
        { items: payloadItems, userId: uid },
        { headers: { Authorization: `Bearer ${tok}` } }
      )
      setClientSecret(res.data.clientSecret)
    } catch (err) {
      console.error('❌ Checkout error:', err)
      showNotification('Failed to start checkout ❌', 'error')
    }
  }

  // Handle checkout button click
  const handleCheckout = async () => {
    if (items.length === 0) {
      showNotification('Cart is empty 🛒', 'error')
      return
    }

    // Check if user is logged in
    if (!userId || !token) {
      // Show login prompt for guest users
      setShowLoginPrompt(true)
      showNotification('Please login to proceed with checkout 🔐', 'info')
      return
    }

    // User is logged in, proceed with checkout
    await initiateCheckout(userId, token)
  }

  if (loading) {
    return (
      <div className='cart-overlay'>
        <div className='backdrop' onClick={onClose}></div>
        <div className='cart-panel loading-skeletons'>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) return <p>Error: {error}</p>

  // helper to render a compact measurement summary for display in cart
  const renderMeasurementSummary = measurementObj => {
    if (!measurementObj) return null
    try {
      const keys = Object.keys(measurementObj)
      const preview = keys
        .slice(0, 3)
        .map(k => `${k}: ${measurementObj[k]}`)
        .join(', ')
      return `${preview}${keys.length > 3 ? '…' : ''}`
    } catch {
      return 'Custom'
    }
  }

  return (
    <div className='cart-overlay'>
      <div className='backdrop' onClick={onClose}></div>
      <div className='cart-panel'>
        {!loading && isEmpty ? (
          <div className='empty-cart'>
            <p>No Order yet</p>
            <button className='continue-btn' onClick={onClose}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className='cart-items'>
              <span className='cart-count'>Cart ({items.length})</span>
              {items.map((item, idx) => {
                const isMeasuredSize =
                  item.size && typeof item.size === 'object'
                const measurementSummary =
                  item.measurementData?.values ||
                  (isMeasuredSize ? item.size : null)

                return (
                  <div key={idx} className='cart-item'>
                    <div className='item-image'>
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className='item-info'>
                      <div className='left'>
                        <span className='item-qty-name'>
                          ({item.quantity}×) {item.name}
                        </span>
                        <span className='item-color'>{item.brand}</span>
                        <span className='item-size'>
                          {isMeasuredSize ? (
                            `Custom (${renderMeasurementSummary(
                              measurementSummary
                            )})`
                          ) : item.size ? (
                            item.size
                          ) : item.initials ? (
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              Initials:
                              {item.initials}
                            </span>
                          ) : (
                            ''
                          )}
                        </span>
                      </div>
                      <div className='right'>
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                    <button
                      className='delete-btn'
                      onClick={() => removeItem(idx)}
                    >
                      Delete
                    </button>
                  </div>
                )
              })}
            </div>

            <div className='cart-footer'>
              <div className='subtotal'>
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              {/* Login Prompt */}
              {showLoginPrompt && (
                <div
                  className='login-prompt'
                  style={{
                    padding: '15px',
                    marginBottom: '15px',
                    backgroundColor: '#f0f9ff',
                    // borderRadius: '8px',
                    border: '1px solid #000'
                  }}
                >
                  <p style={{ marginBottom: '10px', color: '#000' }}>
                    submit and verify email to complete checkout
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div
                      style={{
                        flex: 1,
                        padding: '10px',
                        color: 'white',
                        backgroundColor: '#000',
                        border: 'none',
                        // borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                      onClick={() => {
                        localStorage.setItem('redirectAfterLogin', 'cart')
                        window.location.href = '/auth/login' // or use your login route
                      }}
                    >
                      Login
                    </div>
                  </div>
                </div>
              )}

              {clientSecret ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    onSuccess={pi => {
                      showNotification('Payment successful 🎉', 'success')
                      setClientSecret(null)
                      // Clear cart after successful payment
                      if (!userId) {
                        localStorage.removeItem('guestCart')
                      }
                      onClose()
                    }}
                  />
                </Elements>
              ) : (
                <button className='checkout-btn' onClick={handleCheckout}>
                  Proceed with payment
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
