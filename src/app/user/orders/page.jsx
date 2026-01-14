'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '@/components/products/CheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function OrdersPage () {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [payingOrder, setPayingOrder] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const token = localStorage.getItem('token')
        if (!userId) return

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/orders/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setOrders(res.data || [])
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleRepay = async order => {
    try {
      const userId = localStorage.getItem('userId')
      const token = localStorage.getItem('token')

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-payment-intent`,
        { items: order.items, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setPayingOrder(order._id)
      setClientSecret(res.data.clientSecret)
    } catch (err) {
      console.error('❌ Repayment error:', err)
    }
  }

  if (loading) return <p>Loading your orders...</p>

  if (!orders.length) return <p>No orders found 📦</p>

  return (
    <div className='orders container'>
      <div className='orders__list'>
        {orders.map(order => (
          <div key={order._id} className='order-card'>
            <div className='order-card__header'>
              <h2>Order #{order._id.slice(-6)}</h2>
              <span className={`status status--${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className='order-card__items'>
              {order.items.map((item, i) => (
                <div key={i} className='order-item'>
                  <img src={item.image} alt={item.name} />
                  <div className='order-item__info'>
                    <h3>{item.name}</h3>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <p className='order-item__price'>${item.price}</p>
                </div>
              ))}
            </div>

            <div className='order-card__footer'>
              <p>Total: ${order.total}</p>

              {order.status === 'pending' && payingOrder === order._id
                ? clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm
                        clientSecret={clientSecret}
                        onSuccess={pi => {
                          alert('Payment successful 🎉')
                          setClientSecret(null)
                          setPayingOrder(null)
                        }}
                      />
                    </Elements>
                  )
                : order.status === 'pending' && (
                    <button
                      className='status
'
                      onClick={() => handleRepay(order)}
                    >
                      Complete Payment
                    </button>
                  )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
