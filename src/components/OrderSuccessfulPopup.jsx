import React from 'react'

export default function OrderSuccessfulPopup ({
  isOpen = true,
  onClose,
  orderId,
  isGuest = false
}) {
  if (!isOpen) return null

  return (
    <div className='order-popup-overlay' onClick={onClose}>
      <div className='order-popup'>
        <div className='icon-wrapper'>
          <span className='checkmark'>✓</span>
        </div>

        <h2>Order Successful </h2>

        <p className='message'>
          Thank you for your purchase! Your order has been placed successfully.
        </p>

        {orderId && (
          <p className='order-id'>
            <span>Order ID:</span> {orderId}
          </p>
        )}

        {isGuest && (
          <div className='guest-note'>
            <p>
              An account has been created for you using your email. Please check
              your inbox to set your password and track your orders.
            </p>
          </div>
        )}

        <div className='actions'>
          <button className='primary-btn' onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
