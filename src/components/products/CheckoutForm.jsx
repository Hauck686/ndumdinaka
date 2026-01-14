'use client'
import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

export default function CheckoutForm ({ clientSecret, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    const cardElement = elements.getElement(CardElement)

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: cardElement }
      }
    )

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='checkout-form'>
      <CardElement />
      {error && <p className='error'>{error}</p>}
      <button type='submit' disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  )
}
