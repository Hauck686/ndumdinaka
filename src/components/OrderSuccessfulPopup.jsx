import React, { useState, useEffect } from 'react'

// ⚠️ FIX: Import html2pdf only on client side
let html2pdf = null

// Load html2pdf only in browser
if (typeof window !== 'undefined') {
  import('html2pdf.js').then(module => {
    html2pdf = module.default
  })
}

export default function OrderSuccessfulPopup ({
  isOpen = true,
  onClose,
  orderId = '#US94785213',
  isGuest = false,
  items = [],
  shippingAddress = {},
  total = 0,
  subtotal = 0,
  shippingCost = 10,
  tax = 0,
  brandName = 'Your Brand'
}) {
  const [orderData, setOrderData] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

  useEffect(() => {
    if (orderId) {
      setOrderData({
        orderId,
        items,
        shippingAddress,
        total,
        subtotal,
        shippingCost,
        tax
      })
    }
  }, [orderId, items, shippingAddress, total, subtotal, shippingCost, tax])

  if (!isOpen || !orderData) return null

  // ═══════════════════════════════════════════════════════════════
  // 🖨️ PRINT FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════
  const handlePrint = () => {
    window.print()
  }

  // ═══════════════════════════════════════════════════════════════
  // 📥 PDF DOWNLOAD FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true)
      setDownloadError(null)

      // Check if html2pdf is loaded
      if (!html2pdf) {
        throw new Error('PDF library is loading, please try again in a moment')
      }

      const element = document.getElementById('order-receipt')

      if (!element) {
        throw new Error('Receipt element not found')
      }

      // Create a clean filename
      const cleanOrderId = orderId.replace(/[#\s]/g, '')
      const filename = `order-${cleanOrderId}.pdf`

      // PDF generation options
      const opt = {
        margin: 10,
        filename: filename,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true
        },
        jsPDF: {
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy']
        }
      }

      console.log('📥 Generating PDF:', filename)

      await html2pdf().set(opt).from(element).save()

      console.log('✅ PDF downloaded successfully:', filename)
      setIsDownloading(false)
    } catch (error) {
      console.error('❌ Error downloading PDF:', error)
      setDownloadError(error.message || 'Failed to download PDF')
      setIsDownloading(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 📧 EMAIL RECEIPT (OPTIONAL)
  // ═══════════════════════════════════════════════════════════════
  const handleEmailReceipt = async () => {
    try {
      setIsDownloading(true)
      setDownloadError(null)

      if (!html2pdf) {
        throw new Error('PDF library is loading, please try again in a moment')
      }

      const element = document.getElementById('order-receipt')
      if (!element) {
        throw new Error('Receipt element not found')
      }

      // Generate PDF as data URL
      const pdfDataUrl = await new Promise((resolve, reject) => {
        html2pdf()
          .set({
            margin: 10,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
          })
          .from(element)
          .outputPdf('datauristring')
          .then(resolve)
          .catch(reject)
      })

      // Send to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email/send-receipt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: shippingAddress.email,
            orderId: orderId,
            pdfData: pdfDataUrl,
            customerName:
              `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
            brandName: brandName
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      const data = await response.json()
      alert(`✅ Receipt sent to ${shippingAddress.email}`)
      console.log('📧 Email sent successfully')
    } catch (error) {
      console.error('❌ Error sending email:', error)
      setDownloadError(error.message || 'Failed to send email')
      alert('Failed to send email. You can download the PDF instead.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className='order-receipt-overlay' onClick={onClose}>
      <div
        className='order-receipt-container'
        onClick={e => e.stopPropagation()}
      >
        {/* Web Version Badge */}
        {/* <div className='receipt-web-badge'>Web version</div> */}

        {/* Close Button */}
        <button className='receipt-close-btn' onClick={onClose}>
          ✕
        </button>

        {/* Receipt Content */}
        <div id='order-receipt' className='order-receipt'>
          {/* BRAND HEADER */}
          <div className='receipt-header'>
            <h1 className='brand-name'>{brandName.toUpperCase()}</h1>
          </div>

          {/* THANK YOU MESSAGE */}
          <div className='receipt-greeting'>
            <p className='greeting-text'>Dear Customer,</p>
            <p className='greeting-message'>
              Thank you for shopping with {brandName}.
            </p>
            <p className='greeting-subtext'>
              We would like to confirm that your order is now being processed
              and prepared for shipment.
            </p>
            <p className='receipt-detail-intro'>
              Below are your order details for your personal records.
            </p>
          </div>

          {/* ORDER NUMBER */}
          <div className='order-number-section'>
            <p className='order-label'>Order Number</p>
            <h2 className='order-number'>{orderId}</h2>
          </div>

          {/* SHIPPING NOTICE */}
          <div className='shipping-notice'>
            <p>
              Once your order is shipped, your credit card will be charged and
              you will receive a shipping confirmation email with a FedEx link
              to track your package(s). Through the link, you will also have the
              ability to sign up for text message updates regarding the delivery
              status of your order. Please contact us should you require further
              assistance or have any questions.
            </p>
          </div>

          <hr className='receipt-divider' />

          {/* ORDER ITEMS */}
          <div className='receipt-items'>
            {items && items.length > 0 ? (
              items.map((item, idx) => (
                <div key={idx} className='receipt-item'>
                  <div className='item-image-container'>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className='receipt-item-image'
                      />
                    ) : (
                      <div className='no-image'>No Image</div>
                    )}
                  </div>

                  <div className='item-details'>
                    <div className='item-header'>
                      <h3 className='item-name'>
                        {item.name}
                        {item.quantity > 1 && ` (x${item.quantity})`}
                      </h3>
                      <span className='item-price'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className='item-meta'>
                      {item.sku && (
                        <p className='item-sku'>
                          <span className='meta-label'>Style:</span> {item.sku}
                        </p>
                      )}

                      {item.color && (
                        <p className='item-color'>
                          <span className='meta-label'>Color:</span>{' '}
                          {item.color}
                        </p>
                      )}

                      {item.size && (
                        <p className='item-size'>
                          <span className='meta-label'>Size:</span>{' '}
                          {typeof item.size === 'object'
                            ? JSON.stringify(item.size)
                            : item.size}
                        </p>
                      )}

                      {item.brand && (
                        <p className='item-brand'>
                          <span className='meta-label'>Brand:</span>{' '}
                          {item.brand}
                        </p>
                      )}
                    </div>

                    <div className='item-availability'>
                      <span className='availability-badge'>Available</span>
                      <p className='availability-text'>
                        Your selection is available for immediate purchase
                        online.
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in order</p>
            )}
          </div>

          <hr className='receipt-divider' />

          {/* PRICING SUMMARY */}
          <div className='receipt-pricing'>
            <div className='pricing-row'>
              <span className='pricing-label'>Subtotal</span>
              <span className='pricing-value'>${subtotal.toFixed(2)}</span>
            </div>

            <div className='pricing-row'>
              <span className='pricing-label'>
                Shipping - Next Business Day
              </span>
              <span className='pricing-value'>${shippingCost.toFixed(2)}</span>
            </div>

            <div className='pricing-row total-row'>
              <span className='pricing-label total-label'>Total</span>
              <span className='pricing-value total-value'>
                ${total.toFixed(2)}
              </span>
            </div>

            {tax > 0 && (
              <div className='pricing-row'>
                <span className='pricing-label'>Estimated Tax</span>
                <span className='pricing-value'>${tax.toFixed(2)}</span>
              </div>
            )}
          </div>

          <hr className='receipt-divider' />

          {/* SHIPPING INFORMATION */}
          <div className='receipt-shipping-info'>
            <h3 className='shipping-title'>SHIPPING</h3>
            <p className='shipping-method'>Next Business Day</p>
            <p className='shipping-details'>
              Order by 2 pm EST on a business day. Delivery between 8 am – 8 pm,
              Monday to Friday. A signature will be required upon delivery.
            </p>

            {shippingAddress && Object.keys(shippingAddress).length > 0 && (
              <div className='shipping-address'>
                <h4>Ship To:</h4>
                <p>
                  <strong>
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </strong>
                </p>
                <p>{shippingAddress.address}</p>
                {shippingAddress.apartment && (
                  <p>{shippingAddress.apartment}</p>
                )}
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{' '}
                  {shippingAddress.postcode}
                </p>
                <p>{shippingAddress.country}</p>
                {shippingAddress.phone && <p>Phone: {shippingAddress.phone}</p>}
                {shippingAddress.email && <p>Email: {shippingAddress.email}</p>}
              </div>
            )}
          </div>

          {/* GUEST NOTE */}
          {isGuest && (
            <div className='receipt-guest-note'>
              <h4>Welcome!</h4>
              <p>
                An account has been created for you using your email address.
                Please check your inbox to set your password and track your
                orders in the future.
              </p>
            </div>
          )}
        </div>

        {/* ERROR MESSAGE */}
        {downloadError && (
          <div className='error-message'>
            <span>❌ {downloadError}</span>
            <button
              className='error-close'
              onClick={() => setDownloadError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className='receipt-actions'>
          <button
            className='btn btn-primary'
            onClick={onClose}
            disabled={isDownloading}
          >
            Close Receipt
          </button>

          <button
            className='btn btn-secondary'
            onClick={handlePrint}
            disabled={isDownloading}
            title='Print this receipt'
          >
            🖨️ Print
          </button>

          <button
            className='btn btn-tertiary'
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            title='Download receipt as PDF'
          >
            {isDownloading ? (
              <>
                <span className='spinner'></span> Generating PDF...
              </>
            ) : (
              '📥 Download PDF'
            )}
          </button>

          {shippingAddress.email && (
            <button
              className='btn btn-tertiary'
              onClick={handleEmailReceipt}
              disabled={isDownloading}
              title='Send receipt to your email'
            >
              {isDownloading ? (
                <>
                  <span className='spinner'></span> Sending...
                </>
              ) : (
                '📧 Email Receipt'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
