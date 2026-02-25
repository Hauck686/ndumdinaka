'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import SkeletonProductCard from '../SkeletonProductCard'
import OrderSuccessfulPopup from '../OrderSuccessfulPopup'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function EnhancedCheckoutForm ({
  clientSecret,
  onSuccess,
  userId,
  token,
  items,
  isGuest
}) {
  const stripe = useStripe()
  const elements = useElements()

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [paymentRequest, setPaymentRequest] = useState(null)

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    country: 'United States'
  })

  // Load saved address
  useEffect(() => {
    const loadUserProfile = async () => {
      if (userId && token && !isGuest) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`
          )

          if (res.data.addresses && res.data.addresses.length > 0) {
            const primaryAddress = res.data.addresses[0]
            const [firstName, ...lastNameParts] = (
              primaryAddress.fullName || ''
            ).split(' ')

            setShippingData(prev => ({
              ...prev,
              firstName: firstName || '',
              lastName: lastNameParts.join(' ') || '',
              address: primaryAddress.addressLine1 || '',
              apartment: primaryAddress.addressLine2 || '',
              city: primaryAddress.city || '',
              state: primaryAddress.state || '',
              postcode: primaryAddress.zip || '',
              phone: primaryAddress.phone || '',
              country: primaryAddress.country || 'United States',
              email: res.data.email || prev.email
            }))
          } else {
            setShippingData(prev => ({
              ...prev,
              firstName: res.data.firstName || '',
              lastName: res.data.lastName || '',
              email: res.data.email || prev.email
            }))
          }
        } catch (err) {
          console.error('Failed to load profile:', err)
        }
      }
    }
    loadUserProfile()
  }, [userId, token, isGuest])

  useEffect(() => {
    if (!stripe) return

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Order Total',
        amount: Math.round(
          items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
        )
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: true,
      shippingOptions: [
        {
          id: 'standard',
          label: 'Standard Shipping',
          detail: '5-7 business days',
          amount: 0
        }
      ]
    })

    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr)

        pr.on('paymentmethod', async event => {
          try {
            const { error: stripeError, paymentIntent } =
              await stripe.confirmCardPayment(clientSecret, {
                payment_method: event.paymentMethod.id
              })

            if (stripeError) {
              event.complete('fail')
              setError(stripeError.message)
              return
            }

            const shippingAddress = event.shippingAddress
            const payerName = event.payerName?.split(' ') || ['', '']

            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/complete-order`,
              {
                userId,
                items,
                shippingAddress: {
                  firstName: payerName[0],
                  lastName: payerName.slice(1).join(' '),
                  email: event.payerEmail,
                  phone: event.payerPhone,
                  address: shippingAddress?.addressLine?.[0] || '',
                  apartment: shippingAddress?.addressLine?.[1] || '',
                  city: shippingAddress?.city || '',
                  state: shippingAddress?.region || '',
                  postcode: shippingAddress?.postalCode || '',
                  country: shippingAddress?.country || 'US'
                },
                paymentIntentId: paymentIntent.id,
                totalAmount: paymentIntent.amount / 100,
                isGuestCheckout: isGuest
              }
            )

            event.complete('success')
            console.log('✅ Order completed successfully via Payment Request')

            if (isGuest && response.data.newUserData) {
              localStorage.setItem('userId', response.data.newUserData.userId)
              localStorage.setItem('token', response.data.newUserData.token)
            }

            // PASS FULL ORDER DATA to success handler
            onSuccess(paymentIntent, response.data)
          } catch (err) {
            event.complete('fail')
            console.error('Payment error:', err)
            setError(err.response?.data?.msg || err.message || 'Payment failed')
          }
        })
      }
    })
  }, [stripe, items, clientSecret, userId, isGuest, onSuccess])

  const handleShippingChange = e => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value })
  }

  const validateShipping = () => {
    const required = [
      'firstName',
      'lastName',
      'email',
      'address',
      'city',
      'postcode',
      'phone'
    ]
    for (const field of required) {
      if (!shippingData[field]?.trim()) {
        setError(`${field.replace(/([A-Z])/g, ' $1').trim()} is required`)
        return false
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    setError(null)
    return true
  }

  const handlePaymentSubmit = async e => {
    e.preventDefault()

    if (!stripe || !elements) return

    if (!validateShipping()) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${shippingData.firstName} ${shippingData.lastName}`,
              email: shippingData.email,
              phone: shippingData.phone,
              address: {
                line1: shippingData.address,
                line2: shippingData.apartment,
                city: shippingData.city,
                state: shippingData.state,
                postal_code: shippingData.postcode,
                country: 'US'
              }
            }
          },
          shipping: {
            name: `${shippingData.firstName} ${shippingData.lastName}`,
            phone: shippingData.phone,
            address: {
              line1: shippingData.address,
              line2: shippingData.apartment,
              city: shippingData.city,
              state: shippingData.state,
              postal_code: shippingData.postcode,
              country: 'US'
            }
          }
        })

      if (stripeError) {
        setError(stripeError.message)
        setProcessing(false)
        return
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/complete-order`,
        {
          userId,
          items,
          shippingAddress: shippingData,
          paymentIntentId: paymentIntent.id,
          totalAmount: paymentIntent.amount / 100,
          isGuestCheckout: isGuest
        }
      )

      console.log('✅ Order completed successfully')

      if (isGuest && response.data.newUserData) {
        localStorage.setItem('userId', response.data.newUserData.userId)
        localStorage.setItem('token', response.data.newUserData.token)
      }

      // PASS FULL ORDER DATA
      onSuccess(paymentIntent, response.data)
    } catch (err) {
      console.error('Payment error:', err)
      setError(err.response?.data?.msg || err.message || 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form className='checkout-form payment-form' onSubmit={handlePaymentSubmit}>
      <div className='form-section'>
        <h3 className='section-title'>Contact</h3>
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={shippingData.email}
          onChange={handleShippingChange}
          required
          className='form-input'
        />
      </div>

      <div className='form-section'>
        <h3 className='section-title'>Shipping Information</h3>

        <div className='form-row'>
          <input
            type='text'
            name='firstName'
            placeholder='First name'
            value={shippingData.firstName}
            onChange={handleShippingChange}
            required
            className='form-input'
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last name'
            value={shippingData.lastName}
            onChange={handleShippingChange}
            required
            className='form-input'
          />
        </div>

        <input
          type='text'
          name='address'
          placeholder='Address'
          value={shippingData.address}
          onChange={handleShippingChange}
          required
          className='form-input'
        />

        <input
          type='text'
          name='apartment'
          placeholder='Apartment, suite, etc. (optional)'
          value={shippingData.apartment}
          onChange={handleShippingChange}
          className='form-input'
        />

        <div className='form-row'>
          <input
            type='text'
            name='city'
            placeholder='City'
            value={shippingData.city}
            onChange={handleShippingChange}
            required
            className='form-input'
          />
          <input
            type='text'
            name='state'
            placeholder='State'
            value={shippingData.state}
            onChange={handleShippingChange}
            className='form-input'
          />
        </div>

        <input
          type='text'
          name='postcode'
          placeholder='Postcode'
          value={shippingData.postcode}
          onChange={handleShippingChange}
          required
          className='form-input'
        />

        <input
          type='tel'
          name='phone'
          placeholder='Phone'
          value={shippingData.phone}
          onChange={handleShippingChange}
          required
          className='form-input'
        />
      </div>

      <div className='form-section'>
        <h3 className='section-title'>Payment</h3>
        <p className='secure-text'>
          All transactions are secure and encrypted.
        </p>

        <div className='payment-method-box'>
          <div className='payment-method-header'>
            <label className='payment-option'>
              <input type='radio' name='payment' checked readOnly />
              <span>Credit card</span>
            </label>
            <div className='card-icons'>
              <span style={{ fontSize: '11px', color: '#666' }}>
                💳 Visa • Mastercard • Amex
              </span>
            </div>
          </div>

          <div className='card-element-container'>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4'
                    },
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  },
                  invalid: {
                    color: '#9e2146'
                  }
                }
              }}
            />
          </div>

          {paymentRequest && (
            <div style={{ marginTop: '20px' }}>
              <div
                style={{
                  textAlign: 'center',
                  margin: '15px 0',
                  fontSize: '12px',
                  color: '#999'
                }}
              >
                or pay with
              </div>
              <PaymentRequestButtonElement
                options={{ paymentRequest }}
                style={{
                  paymentRequestButton: {
                    theme: 'dark',
                    height: '40px'
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {error && <div className='error-message'>{error}</div>}

      <button
        type='submit'
        disabled={!stripe || processing}
        className='pay-now-btn'
      >
        {processing ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 🔥 MAIN CART COMPONENT - UPDATED
// ════════════════════════════════════════════════════════════════════════════

export default function CartComponent ({ onClose }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [isGuest, setIsGuest] = useState(true)

  // ✨ NEW: Order success state
  const [orderSuccess, setOrderSuccess] = useState({
    isOpen: false,
    orderId: null,
    orderData: null
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId')
      const storedToken = localStorage.getItem('token')

      setUserId(storedUserId)
      setToken(storedToken)
      setIsGuest(!storedUserId)
    }
  }, [])

  const fetchCart = async (uid, tok, isGuestUser) => {
    setLoading(true)
    try {
      if (uid && tok && !isGuestUser) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${uid}`,
          { headers: { Authorization: `Bearer ${tok}` } }
        )
        setItems(res.data.cart || [])
      } else {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
        setItems(guestCart)
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        const uid = localStorage.getItem('userId')
        const tok = localStorage.getItem('token')
        const isGuestUser = !uid || !tok

        setUserId(uid)
        setToken(tok)
        setIsGuest(isGuestUser)
        await fetchCart(uid, tok, isGuestUser)
      }
    }
    init()
  }, [])

  const removeItem = async idx => {
    const item = items[idx]
    const updated = items.filter((_, i) => i !== idx)
    setItems(updated)

    if (userId && token && !isGuest) {
      try {
        const sizeParam =
          item.size && typeof item.size === 'object'
            ? JSON.stringify(item.size)
            : item.size || null

        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${userId}/${
            typeof item.productId === 'object' && item.productId._id
              ? item.productId._id
              : item.productId
          }`,
          {
            params: {
              size: sizeParam,
              color: item.color || null,
              measurementId: item.measurementId || null
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setItems(res.data.cart || [])
      } catch (err) {
        console.error('Failed to remove item:', err)
        setItems(items)
      }
    } else {
      localStorage.setItem('guestCart', JSON.stringify(updated))
    }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const isEmpty = items.length === 0

  const initiateCheckout = async (uid, tok, isGuestCheckout) => {
    try {
      const payloadItems = items.map(item => ({
        productId:
          typeof item.productId === 'object'
            ? item.productId._id
            : item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        brand: item.brand,
        size: item.size,
        color: item.color,
        measurementId: item.measurementId
      }))

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-payment-intent`,
        {
          items: payloadItems,
          userId: uid,
          shippingAddress: null,
          isGuestCheckout
        }
      )
      setClientSecret(res.data.clientSecret)
    } catch (err) {
      console.error('Checkout error:', err)
      alert(err.response?.data?.msg || 'Failed to start checkout')
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) return
    await initiateCheckout(userId, token, isGuest)
  }

  // ✨ NEW: Handle successful order
  const handleOrderSuccess = (paymentIntent, orderData) => {
    console.log('Order successful:', {
      paymentIntent,
      orderData,
      items
    })

    // Calculate totals
    const subtotalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const shippingCost = orderData.shippingCost || 10
    const taxAmount = orderData.tax || 0
    const totalAmount = paymentIntent.amount / 100

    // Show success popup
    setOrderSuccess({
      isOpen: true,
      orderId:
        orderData.orderId || orderData._id || paymentIntent.id.substring(0, 20),
      orderData: {
        items: items,
        subtotal: subtotalAmount,
        shippingCost: shippingCost,
        tax: taxAmount,
        total: totalAmount,
        shippingAddress: orderData.shippingAddress || {}
      }
    })

    // Clear checkout form
    setClientSecret(null)

    // Clear cart data
    if (isGuest) {
      localStorage.removeItem('guestCart')
    }
    setItems([])
  }

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

  return (
    <div className='cart-overlay'>
      <div className='backdrop' onClick={onClose}></div>

      <div className='cart-panel'>
        {!loading && isEmpty && !clientSecret && !orderSuccess.isOpen ? (
          <div className='empty-cart'>
            <p>No Order yet</p>
            <button className='continue-shopping-btn' onClick={onClose}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            {!clientSecret && !orderSuccess.isOpen && (
              <div className='cart-items'>
                <div className='cart-header-inline'>
                  <span className='cart-count'>Cart ({items.length})</span>
                  <button className='close-cart-btn' onClick={onClose}>
                    ✕
                  </button>
                </div>

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
                          <span className='item-brand'>{item.brand}</span>
                          <span className='item-size'>
                            {isMeasuredSize
                              ? `Custom (${renderMeasurementSummary(
                                  measurementSummary
                                )})`
                              : item.size || ''}
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
            )}

            {clientSecret && !orderSuccess.isOpen && (
              <div className='cart-items'>
                <div className='cart-header-inline'>
                  <span className='cart-count'>Checkout</span>
                  <button className='close-cart-btn' onClick={() => setClientSecret(null)}>
                    ✕
                  </button>
                </div>
                <Elements stripe={stripePromise}>
                  <EnhancedCheckoutForm
                    clientSecret={clientSecret}
                    userId={userId}
                    token={token}
                    items={items}
                    isGuest={isGuest}
                    onSuccess={handleOrderSuccess}
                  />
                </Elements>
              </div>
            )}

            <div className='cart-footer'>
              {!clientSecret && !orderSuccess.isOpen && (
                <>
                  <div className='subtotal'>
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>

                  <button className='checkout-btn' onClick={handleCheckout}>
                    Checkout
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {/* ✨ NEW: Professional Order Receipt Popup */}
        {orderSuccess.isOpen && (
          <OrderSuccessfulPopup
            isOpen={orderSuccess.isOpen}
            onClose={() => {
              setOrderSuccess({ isOpen: false, orderId: null, orderData: null })
              onClose()
            }}
            orderId={orderSuccess.orderId}
            isGuest={isGuest}
            items={orderSuccess.orderData?.items || []}
            shippingAddress={orderSuccess.orderData?.shippingAddress || {}}
            total={orderSuccess.orderData?.total || 0}
            subtotal={orderSuccess.orderData?.subtotal || 0}
            shippingCost={orderSuccess.orderData?.shippingCost || 10}
            tax={orderSuccess.orderData?.tax || 0}
            brandName='NAKACHI NDUMDI'
          />
        )}
      </div>
    </div>
  )
}
