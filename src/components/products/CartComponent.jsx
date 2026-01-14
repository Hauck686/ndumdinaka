'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNotification } from '@/app/context/NotificationContext'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import SkeletonProductCard from '../SkeletonProductCard'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function CartComponent ({ onClose }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { showNotification } = useNotification()
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)

  // load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'))
      setToken(localStorage.getItem('token'))
    }
  }, [])

  // fetch cart (reads localStorage token/userId and then fetches)
  const fetchCart = async (uid, tok) => {
    // ensure loading state while we decide/ fetch
    setLoading(true)
    try {
      if (uid) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${uid}`,
          { headers: { Authorization: `Bearer ${tok}` } }
        )
        setItems(res.data.cart || [])
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || []
        setItems(localCart)
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message)
      showNotification('Failed to load cart ❌', 'error')
    } finally {
      setLoading(false)
    }
  }

  // run once: read localStorage THEN fetch cart (so we don't fetch prematurely)
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

    if (userId) {
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
      localStorage.setItem('cart', JSON.stringify(updated))
      showNotification(`${item.name} removed from cart 🗑️`, 'success')
    }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const isEmpty = items.length === 0

  // start checkout: create PaymentIntent
  const handleCheckout = async () => {
    if (items.length === 0) {
      showNotification('Cart is empty 🛒', 'error')
      return
    }

    try {
      // Ensure measurement sizes (if present) are sent alongside each item
      // If item.size is an object (we replaced sizes with measurement values), prefer that.
      const payloadItems = items.map(item => {
        const measurementSizes =
          (item.measurementData && item.measurementData.values) ||
          (item.size && typeof item.size === 'object' ? item.size : null)

        // keep original item shape but include measurementSizes explicitly
        return {
          ...item,
          measurementSizes
        }
      })

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-payment-intent`,
        { items: payloadItems, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setClientSecret(res.data.clientSecret)
    } catch (err) {
      console.error('❌ Checkout error:', err)
      showNotification('Failed to start checkout ❌', 'error')
    }
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
      // Show up to first 3 key:value pairs for compactness
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
                // If item.size is an object, it's a custom measurement (we replaced size)
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

              {clientSecret ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    onSuccess={pi => {
                      showNotification('Payment successful 🎉', 'success')
                      setClientSecret(null)
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
