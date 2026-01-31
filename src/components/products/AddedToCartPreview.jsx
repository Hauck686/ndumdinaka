import React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function AddedToCartPreview ({
  open,
  onClose,
  item,
  cartCount = 1
}) {
  const router = useRouter()
  if (!item) return null

  const {
    image,
    name,
    size,
    initials,
    price,
    quantity = 1,
    reserved = false
  } = item

  const handleViewBag = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className='acp-overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className='acp-sheet'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <button className='acp-close' aria-label='Close' onClick={onClose}>
              ✕
            </button>

            <p className='acp-title'>Added To Cart</p>

            <div className='acp-body'>
              <div className='acp-image'>
                <img src={image || '/placeholder.png'} alt={name} />
              </div>

              <div className='acp-details'>
                <p className='acp-title'>{name}</p>

                {size && (
                  <p className='acp-meta'>
                    Size: {typeof size === 'object' ? 'Customed Size' : size}
                  </p>
                )}

                {initials && String(initials).trim() !== '' && (
                  <p className='acp-meta'>
                    Initial:{' '}
                    {typeof initials === 'object'
                      ? initials.value || 'Custom Initial'
                      : initials}
                  </p>
                )}

                <p className='acp-price'>${Number(price)}</p>
                <p className='acp-qty'>Quantity: {quantity}</p>
              </div>
            </div>

            <div className='acp-actions'>
              <button className='acp-viewbag' onClick={onClose}>
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
