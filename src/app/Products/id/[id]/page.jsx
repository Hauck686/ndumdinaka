'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotification } from '@/app/context/NotificationContext'
import SkeletonProductCard from '@/components/SkeletonProductCard'
import AddedToCartPreview from '@/components/products/AddedToCartPreview'

export default function ProductDetailsPage () {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showNotification } = useNotification()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [initials, setInitials] = useState('')
  const [cartQty, setCartQty] = useState(1)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [sizeError, setSizeError] = useState('')
  const [colorError, setColorError] = useState('')
  const [showInitialsInput, setShowInitialsInput] = useState(false)

  // state to avoid double-processing the same measurementId
  const [processedMeasurementId, setProcessedMeasurementId] = useState(null)
  // track current image index
  const [currentIndex, setCurrentIndex] = useState(0)

  // preview state
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState(null)
  const [previewCartCount, setPreviewCartCount] = useState(1)

  // guard for in-flight processing to prevent concurrent duplicate adds
  const processingMeasurementIdsRef = useRef(new Set())

  const scrollImages = direction => {
    const container = document.getElementById('imageRow')
    if (!container) return

    const width = window.innerWidth

    if (direction === 'left') {
      setCurrentIndex(prev => Math.max(prev - 1, 0))
      container.scrollBy({ left: -width, behavior: 'smooth' })
    } else {
      setCurrentIndex(prev => Math.min(prev + 1, product.images.length - 1))
      container.scrollBy({ left: width, behavior: 'smooth' })
    }
  }

  const scrollToIndex = index => {
    const container = document.getElementById('imageRow')
    if (!container) return

    const width = window.innerWidth
    setCurrentIndex(index)
    container.scrollTo({ left: index * width, behavior: 'smooth' })
  }

  // Handle swipe gestures
  const handleSwipe = info => {
    const swipe = info.offset.x

    if (swipe < -50) {
      scrollImages('right')
    } else if (swipe > 50) {
      scrollImages('left')
    }
  }

  const toggleDropdown = section => {
    setOpenDropdown(prev => (prev === section ? null : section))
  }

  const checkLogin = () => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      showNotification('⚠️ Please log in to continue', 'warning')
      router.push('/auth/login')
      return false
    }
    return true
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/products/${id}`
        )
        setProduct(res.data)
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  async function fetchMeasurementById (measurementId) {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/measurements/${measurementId}`
        )
        if (res && res.data) return res.data
      } catch (err) {
        console.warn('Failed to fetch measurement from backend', err)
      }
    }

    try {
      const existing = JSON.parse(
        localStorage.getItem('customMeasurements') || '[]'
      )
      const found = existing.find(
        m =>
          String(m.id) === String(measurementId) ||
          String(m._id) === String(measurementId)
      )
      if (found) return found
    } catch (err) {
      console.error('Failed to read measurement from localStorage', err)
    }

    return null
  }

  // If route contains ?measurementId=..., automatically attach it to cart then remove the param
  useEffect(() => {
    if (!product) return
    const measurementId = searchParams?.get('measurementId')
    if (!measurementId) return
    if (processedMeasurementId === measurementId) return
    if (processingMeasurementIdsRef.current.has(measurementId)) return

    async function attachAndNotify () {
      processingMeasurementIdsRef.current.add(measurementId)

      if (!checkLogin()) {
        processingMeasurementIdsRef.current.delete(measurementId)
        return
      }

      const measurement = await fetchMeasurementById(measurementId)
      if (!measurement) {
        showNotification('Saved measurement not found', 'warning')
        setProcessedMeasurementId(measurementId)
        processingMeasurementIdsRef.current.delete(measurementId)
        // remove param from URL without navigation
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.delete('measurementId')
          window.history.replaceState(null, '', url.toString())
        }
        return
      }

      const isReserve = product.quantity <= 0
      const numericPrice = Number(product.price) || 0
      let priceToCharge = isReserve
        ? parseFloat((numericPrice * 0.5).toFixed(2))
        : numericPrice

      // 🔥 ADD CUSTOM MEASUREMENT FEE (₦250)
      priceToCharge += 250

      const cartItem = {
        userId: localStorage.getItem('userId'),
        productId: product._id,
        name: product.name,
        price: priceToCharge,
        size: measurement.values || null,
        measurementId,
        initials,
        measurementData: measurement,
        measurementSizes: measurement.values || null,
        quantity: cartQty,
        image: product.images?.[0] || '/placeholder.png',
        brand: product.brand,
        reserved: isReserve
      }

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add-cart`,
          cartItem
        )
        if (res.data && res.data.success) {
          showNotification(
            'Measurement saved and product added to cart',
            'success'
          )
          // mark processed
          setProcessedMeasurementId(measurementId)

          // remove measurementId from URL without a full page navigation
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            url.searchParams.delete('measurementId')
            window.history.replaceState(null, '', url.toString())
          }

          // Show the preview sheet; use cartCount if backend returned it, else default to 1
          setPreviewItem(cartItem)
          setPreviewCartCount(res.data.cartCount || 1)
          setPreviewOpen(true)
        } else {
          showNotification(
            'Failed to add product with measurement to cart',
            'error'
          )
        }
      } catch (err) {
        showNotification(
          'Something went wrong adding measured product to cart',
          'error'
        )
      } finally {
        processingMeasurementIdsRef.current.delete(measurementId)
      }
    }

    attachAndNotify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, searchParams, id])

  const handleAddToCart = async () => {
    if (!product) return
    if (!checkLogin()) return

    const isReserve = product.quantity <= 0
    const numericPrice = Number(product.price) || 0
    const priceToCharge = isReserve
      ? parseFloat((numericPrice * 0.5).toFixed(2))
      : numericPrice

    const measurementId = searchParams?.get('measurementId')
    if (measurementId) {
      showNotification(
        'This product will use your custom measurement. Size selection is ignored.',
        'info'
      )
      if (processedMeasurementId === measurementId) {
        showNotification('Measurement already processed', 'info')
        return
      }
      if (processingMeasurementIdsRef.current.has(measurementId)) {
        showNotification(
          'Measurement is being processed, please wait...',
          'info'
        )
        return
      }

      const measurement = await fetchMeasurementById(measurementId)
      if (!measurement) {
        showNotification('Saved measurement not found', 'warning')
        return
      }

      processingMeasurementIdsRef.current.add(measurementId)

      const cartItem = {
        userId: localStorage.getItem('userId'),
        productId: product._id,
        name: product.name,
        price: priceToCharge,
        size: selectedSize || null,
        color: selectedColor || null,
        initials: initialsToSend,
        uniqueKey: `${product._id}-${selectedColor || ''}-${
          initialsToSend || ''
        }`,
        quantity: cartQty,
        image: product.images?.[0] || '/placeholder.png',
        brand: product.brand,
        reserved: isReserve
      }

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add-cart`,
          cartItem
        )
        if (res.data && res.data.success) {
          showNotification(
            isReserve
              ? `Product reserved and added to cart — charged ${priceToCharge}`
              : 'Product added to cart with your measurements',
            'success'
          )
          setProcessedMeasurementId(measurementId)

          // remove measurement param without reload
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            url.searchParams.delete('measurementId')
            window.history.replaceState(null, '', url.toString())
          }

          // open preview
          setPreviewItem(cartItem)
          setPreviewCartCount(res.data.cartCount || 1)
          setPreviewOpen(true)
        } else {
          showNotification(
            'Failed to add product with measurement to cart',
            'error'
          )
        }
      } catch (err) {
        showNotification(
          'Something went wrong adding measured product to cart',
          'error'
        )
      } finally {
        processingMeasurementIdsRef.current.delete(measurementId)
      }

      return
    }
    let initialsToSend = initials || null

    // Normal add-to-cart (no measurement)
    if (!measurementId) {
      // 1. Wallets need color
      if (product.category === 'Wallets') {
        if (!selectedColor) {
          setColorError('select a color')
          return
        }
      }

      // 2. Bags, Shirts, Coats do not need size/color
      else if (product.category === 'Bags & Small Leather Goods') {
        // no size or color required
      }

      // 3. Accessories (belts inside Accessories also require nothing)
      else if (
        product.category === 'Accessories' ||
        product.name.toLowerCase().includes('belt')
      ) {
        // no size or color required
      }

      // 4. Everything else — require size if sizes exist
      else {
        if (product.sizes?.length > 0 && !selectedSize) {
          setSizeError('select a size')
          return
        }
      }
    }

    const cartItem = {
      userId: localStorage.getItem('userId'),
      productId: product._id,
      name: product.name,
      price: priceToCharge,
      size: selectedSize || null,
      color: selectedColor || null,
      initials: initialsToSend,
      uniqueKey: `${product._id}-${selectedColor || ''}-${
        initialsToSend || ''
      }`,
      quantity: cartQty,
      image: product.images?.[0] || '/placeholder.png',
      brand: product.brand,
      reserved: isReserve
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add-cart`,
        cartItem
      )
      if (res.data && res.data.success) {
        showNotification(
          isReserve
            ? `Reserved ${cartQty} ${product.name} — charged ${priceToCharge} each`
            : `${cartQty} ${product.name} added to cart!`,
          'success'
        )

        // show preview
        setPreviewItem(cartItem)
        setPreviewCartCount(res.data.cartCount || 1)
        setPreviewOpen(true)
      } else {
        showNotification('❌ Failed to add item.', 'error')
      }
    } catch {
      showNotification('Something went wrong adding to cart', 'error')
    }
  }

  if (loading) return <SkeletonProductCard />
  if (error) return <div className='error'>{error}</div>
  if (!product) return <div className='error'>❌ Product not found</div>

  const isWallet =
    product.name?.toLowerCase().includes('wallet') &&
    (Array.isArray(product.category)
      ? product.category
          .map(c => c.toLowerCase())
          .includes('bags & small leather goods')
      : String(product.category).toLowerCase() === 'bags & small leather goods')

  const addToCartLabel =
    isWallet && initials.trim() !== ''
      ? 'Validate And Add to Bag'
      : 'Add INITIALS'

  return (
    <>
      <div className='product-container'>
        {/* Left: Image */}
        <motion.div
          className='product-image'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* LEFT ARROW */}
          {product.images.length > 1 && (
            <button
              className='carousel-btn left'
              onClick={() => scrollImages('left')}
            >
              ‹
            </button>
          )}

          <div className='image-row' id='imageRow'>
            {product.images.map((img, i) => (
              <motion.img
                key={i}
                src={img}
                alt={product.name}
                draggable={false}
                drag='x'
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => handleSwipe(info)}
              />
            ))}
          </div>

          {/* RIGHT ARROW */}
          {product.images.length > 1 && (
            <button
              className='carousel-btn right'
              onClick={() => scrollImages('right')}
            >
              ›
            </button>
          )}

          {/* PAGINATION DOTS */}
          {product.images.length > 1 && (
            <div className='carousel-dots'>
              {product.images.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${currentIndex === i ? 'active' : ''}`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
          )}
        </motion.div>
        {/* Right: Details */}
        <motion.div
          className='product-details'
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className='product-header'>
            <div>
              <p className='price'>{product.name}</p>
            </div>
            <p className='price'>${product.price}</p>
          </div>
          <div className='accordion-item'>
            {/* Reservation  */}

            {product.quantity <= 0 ? (
              <div className='margin-top'>
                <div className='accordion-title'>
                  <span>
                    <p style={{ fontSize: '8px' }}>
                      This item is produced in very limited quantities and is
                      available exclusively by reservation. A 50% deposit will
                      be collected at checkout, with the remaining balance
                      charged upon completion of tailoring and prior to
                      shipment. For full details, please refer to our Terms &
                      Conditions page.
                    </p>
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Dropdowns */}
          <div className='accordion'>
            {product.category !== 'Wallets' &&
              product.category !== 'Bags & Small Leather Goods' &&
              // belts allowed only inside Accessories
              (product.name.toLowerCase().includes('belt') ||
                product.category !== 'Accessories') && (
                <div className='accordion-item'>
                  {sizeError && (
                    <p
                      style={{
                        color: 'red',
                        fontSize: '7px',
                        marginTop: '8px'
                      }}
                    >
                      {sizeError}
                    </p>
                  )}

                  <div
                    className='accordion-title size'
                    onClick={() => toggleDropdown('size')}
                  >
                    <span>SIZE</span>
                  </div>
                  <AnimatePresence>
                    {openDropdown === 'size' && (
                      <motion.div
                        className='accordion-content'
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className='sizes'>
                          {product.sizes?.length > 0 ? (
                            product.sizes.map(size => (
                              <span
                                key={size}
                                className={
                                  selectedSize === size ? 'active' : ''
                                }
                                onClick={() => {
                                  setSelectedSize(size)
                                  setSizeError('')
                                }}
                              >
                                {size}
                              </span>
                            ))
                          ) : (
                            <p>No sizes available</p>
                          )}

                          {(() => {
                            const rawCat = product?.category ?? ''
                            const cats = Array.isArray(rawCat)
                              ? rawCat.map(c => String(c).trim().toLowerCase())
                              : [String(rawCat).trim().toLowerCase()]

                            const allowed = ['trousers', 'jackets & blousons']
                            const canCustomMeasure = cats.some(c =>
                              allowed.includes(c)
                            )

                            return canCustomMeasure ? (
                              <p style={{ color: '#1f1f1fff' }}>
                                This item is also available in custom sizing and
                                tailoring.{' '}
                                <a
                                  onClick={() =>
                                    router.push(`/Products/${id}/measurement`)
                                  }
                                  className='link-button'
                                >
                                  Click here
                                </a>{' '}
                                if you want to proceed with custom tailoring.
                              </p>
                            ) : null
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className='accordion-title guide'
                    onClick={() => toggleDropdown('SizeGuide')}
                  >
                    <span>Size Guide</span>
                  </div>
                  <AnimatePresence>
                    {openDropdown === 'SizeGuide' && (
                      <motion.div
                        className='accordion-content'
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <span>Size Guide Content</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            {isWallet && (
              <div className='accordion-item'>
                {sizeError && (
                  <p
                    style={{
                      color: 'red',
                      fontSize: '7px',
                      marginTop: '8px'
                    }}
                  >
                    {sizeError}
                  </p>
                )}
                <button
                  className='initials-btn'
                  onClick={() => {
                    if (initials.trim().length > 0) {
                      handleAddToCart() // submit directly
                      setShowInitialsInput(prev => !prev)
                      setInitials('')
                    } else {
                      setShowInitialsInput(prev => !prev) // open input
                    }
                  }}
                >
                  {addToCartLabel}
                </button>

                {showInitialsInput && (
                  <motion.div
                    className='accordion-content'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <input
                      className='initials_form'
                      type='text'
                      placeholder='Enter initials'
                      maxLength={2}
                      value={initials}
                      onChange={e => setInitials(e.target.value)}
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Add to bag */}
            {!isWallet && (
              <button className='add-btn' onClick={handleAddToCart}>
                {product.quantity <= 0 ? ' ADD TO CART' : 'ADD TO CART'}
              </button>
            )}

            {product.name.toLowerCase().includes('wallet') &&
              (Array.isArray(product.category)
                ? product.category
                    .map(c => c.toLowerCase())
                    .includes('Bags & Small Leather Goods')
                : String(product.category).toLowerCase() ===
                  'bags & small leather goods') && (
                <div className='accordion-item'>
                  {sizeError && (
                    <p
                      style={{
                        color: 'red',
                        fontSize: '7px',
                        marginTop: '8px'
                      }}
                    >
                      {sizeError}
                    </p>
                  )}
                </div>
              )}

            {/* DESCRIPTION */}
            <div className='accordion-item'>
              <div
                className='accordion-title'
                onClick={() => toggleDropdown('description')}
              >
                <span>
                  <span>{product.name}</span>
                  <span>{product.description}</span>
                </span>
              </div>
            </div>

            {/* DETAILS */}
            <div className='accordion-item'>
              <div
                className='accordion-title'
                onClick={() => toggleDropdown('info')}
              >
                <span>
                  <span>DETAILS</span>
                  <span>{product.brand}</span>
                </span>
              </div>
            </div>
            {/* NEED HELP */}
            <div className='accordion-item'>
              <div
                className='accordion-title'
                onClick={() => toggleDropdown('info')}
              >
                <span>
                  <span>DO you need help? </span>
                  <span>
                    Contact us 0000 000 0000 Or, Email Us
                    Support@nakachindumdi.com
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AddedToCartPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        item={previewItem}
        cartCount={previewCartCount}
      />
    </>
  )
}
