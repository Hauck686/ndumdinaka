'use client'
import React, { useState } from 'react'
// import Image from 'next/image'
//
export default function CartComponent ({ onClose, cartItems = [] }) {
  const [items, setItems] = useState(
    cartItems.length
      ? cartItems
      : [
          {
            name: 'Manteau smoking en natté de laine',
            color: 'Noir',
            size: '34',
            price: 2290,
            quantity: 1,
            image: '/images/manteau.png' // put the uploaded file here
          }
        ]
  )

  const updateQuantity = (idx, delta) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === idx
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const removeItem = idx => {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const isEmpty = items.length === 0

  return (
    <div className='cart-overlay'>
      <div className='backdrop' onClick={onClose}></div>
      <div className='cart-panel'>
        <div className='cart-header'>
          <h2>Cart ({items.length})</h2>
          <button className='close-btn' onClick={onClose}>
            ✕
          </button>
        </div>

        {isEmpty ? (
          <div className='empty-cart'>
            <p>Your cart is empty.</p>
            <button className='continue-btn' onClick={onClose}>
              CONTNUE SHOPPING
            </button>
          </div>
        ) : (
          <>
            <div className='cart-items'>
              {items.map((item, idx) => (
                <div key={idx} className='cart-item'>
                  <div className='item-image'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='cart-img'
                      width={420}
                      height={420}
                    />
                  </div>
                  <div className='item-details'>
                    <h3>{item.name}</h3>
                    <p className='item-color'>{item.color}</p>
                    <p className='item-size'>Size {item.size}</p>
                    <p className='item-price'>{item.price}$</p>

                    <div className='quantity-control'>
                      <button onClick={() => updateQuantity(idx, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(idx, 1)}>+</button>
                    </div>

                    <button
                      className='delete-btn'
                      onClick={() => removeItem(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className='cart-footer'>
              <div className='subtotal'>
                <span>Subtotal</span>
                <span>{subtotal}$</span>
              </div>
              <button
                className='checkout-btn'
                style={{ textTransform: 'capitalize' }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
