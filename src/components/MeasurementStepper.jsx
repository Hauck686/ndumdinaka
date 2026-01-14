'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const MEASUREMENT_GUIDES = {
  Suits: [
    { name: 'Jacket Sleeve Length', description: 'Top of shoulder to wrist' },
    { name: 'Natural Waist', description: 'Around natural waist' },
    { name: 'Waist', description: 'Around waist' },
    { name: 'Hips', description: 'Around fullest hips' },
    { name: 'Cross Back', description: 'Shoulder across back' },
    { name: 'Jacket Length', description: 'Shoulder to hip' },
    { name: 'Arm Hole', description: 'Arm hole circumference' },
    { name: 'Shoulder', description: 'Shoulder bone to bone' },
    { name: 'Cross Front', description: 'From shoulder across front' },
    { name: 'Neck', description: 'Base of neck' },
    { name: 'Chest', description: 'Full chest circumference' },
    { name: 'Slope (Left Shoulder)', description: 'Left shoulder slope' },
    { name: 'Slope (Right Shoulder)', description: 'Right shoulder slope' },
    { name: 'Strap', description: 'Strap if applicable' },
    { name: 'Depth of Scye', description: 'Depth from shoulder to scye' },
    { name: 'Height', description: 'Person height' },
    { name: 'Trouser Length', description: 'Waist to ankle' },
    { name: 'Knee Length', description: 'Waist to knee' },
    { name: 'Fixed Thigh', description: 'Thigh measurement' },
    { name: 'Fixed Knee', description: 'Knee circumference' },
    { name: 'Leg Opening', description: 'Hem opening' },
    { name: 'Crotch', description: 'Front to back crotch length' }
  ],
  Shirts: [
    { name: 'Neck', description: 'Base of neck' },
    { name: 'Sleeve Length', description: 'Shoulder to wrist' },
    { name: 'Chest', description: 'Full chest circumference' },
    { name: 'Waist', description: 'Natural waist' }
  ],
  Trousers: [
    { name: 'Waist', description: 'Around waist' },
    { name: 'Hip', description: 'Around widest hip' },
    { name: 'Inseam', description: 'Crotch to ankle' },
    { name: 'Outseam', description: 'Waist to ankle' }
  ],
  Native: [
    { name: 'Shoulder', description: 'Shoulder bone to shoulder bone' },
    { name: 'Chest', description: 'Around chest' },
    { name: 'Sleeve', description: 'Shoulder to wrist' },
    { name: 'Kaftan Length', description: 'Shoulder to knee/ankle' }
  ],
  Dresses: [
    { name: 'Bust', description: 'Around fullest bust' },
    { name: 'Waist', description: 'Natural waist' },
    { name: 'Hip', description: 'Full hip circumference' },
    { name: 'Dress Length', description: 'From shoulder down' }
  ]
}

/**
 * MeasurementStepper component (client)
 * props:
 * - productId: optional product id to attach measurement to
 * - initialType: optional (Suits, Shirts, Trousers, Native, Dresses). If provided the clothing selector is hidden.
 *
 * Behavior:
 * - Two-step flow: form -> review
 * - Attempts to POST measurement to backend at /api/measurements (NEXT_PUBLIC_BACKEND_URL). If backend fails, falls back to localStorage.
 * - On success, navigates to /Products/{productId}?measurementId={id} (if productId provided) or simply calls onSaved callback.
 */
export default function MeasurementStepper ({
  productId = '',
  initialType = 'Suits',
  onSaved = null
}) {
  const router = useRouter()
  const [unit, setUnit] = useState('cm')
  const [type, setType] = useState(initialType || 'Suits')
  const [values, setValues] = useState({})
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const fields = MEASUREMENT_GUIDES[type] || []

  useEffect(() => {
    // ensure fields exist in values
    setValues(prev => {
      const base = {}
      fields.forEach(f => {
        base[f.name] = prev[f.name] ?? ''
      })
      return { ...base, ...prev }
    })
    // reset to form when type changes
    setStep(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') {
        // navigate back to product page if productId, else close by history.back
        if (productId) router.push(`/Products/${productId}`)
        else router.back()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [productId, router])

  function handleChange (name, raw) {
    const cleaned = String(raw).replace(/[^\d.]/g, '')
    setValues(prev => ({ ...prev, [name]: cleaned }))
  }

  async function handleSave () {
    setSaving(true)
    const payload = {
      type,
      unit,
      values,
      productId: productId || null,
      userId:
        typeof window !== 'undefined'
          ? localStorage.getItem('userId') || null
          : null,
      createdAt: new Date().toISOString()
    }

    // try backend
    try {
      if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/measurements`,
          payload
        )
        const saved =
          res && res.data ? res.data : { id: Date.now().toString(), ...payload }
        if (onSaved) onSaved(saved)
        // redirect back to product with measurement id if productId provided
        if (productId) {
          const id =
            saved.id ||
            saved._id ||
            saved.measurementId ||
            Date.now().toString()
          router.push(`/Products/${productId}?measurementId=${id}`)
          return
        } else {
          // if no product, just call onSaved and go back
          router.back()
          return
        }
      }
    } catch (err) {
      // backend failed; fall through to localStorage fallback
      // eslint-disable-next-line no-console
      console.warn('Backend save failed:', err)
    }

    // localStorage fallback
    try {
      const existing = JSON.parse(
        localStorage.getItem('customMeasurements') || '[]'
      )
      const saved = { id: Date.now().toString(), ...payload }
      existing.push(saved)
      localStorage.setItem('customMeasurements', JSON.stringify(existing))
      if (onSaved) onSaved(saved)
      if (productId) {
        router.push(`/Products/${productId}?measurementId=${saved.id}`)
      } else {
        router.back()
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Fallback save failed:', err)
      alert('Failed to save measurements. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className='ms-overlay'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className='ms-panel'
          onClick={e => e.stopPropagation()}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          role='dialog'
          aria-modal='true'
        >
          <header className='ms-header'>
            <div>
              <h3 className='ms-title'>{type} Measurements</h3>
              <div className='ms-sub'>Enter measurements in {unit}</div>
            </div>

            <div className='ms-controls'>
              <div className='ms-units'>
                <button
                  className={`ms-unit ${unit === 'cm' ? 'active' : ''}`}
                  onClick={() => setUnit('cm')}
                  type='button'
                >
                  cm
                </button>
                <button
                  className={`ms-unit ${unit === 'inches' ? 'active' : ''}`}
                  onClick={() => setUnit('inches')}
                  type='button'
                >
                  inches
                </button>
              </div>

              <button
                className='ms-close'
                onClick={() => {
                  if (productId) router.push(`/Products/${productId}`)
                  else router.back()
                }}
                aria-label='Close'
              >
                ✕
              </button>
            </div>
          </header>

          {!initialType && (
            <div className='ms-typebar'>
              {Object.keys(MEASUREMENT_GUIDES).map(t => (
                <button
                  key={t}
                  className={`ms-type ${t === type ? 'active' : ''}`}
                  onClick={() => setType(t)}
                  type='button'
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <main className='ms-main'>
            {step === 1 && (
              <>
                <form
                  className='ms-form'
                  onSubmit={e => {
                    e.preventDefault()
                    setStep(2)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <div className='ms-grid'>
                    {fields.map(f => (
                      <label key={f.name} className='ms-field'>
                        <span className='ms-label'>{f.name}</span>
                        <input
                          className='ms-input'
                          inputMode='decimal'
                          value={values[f.name] ?? ''}
                          placeholder=' '
                          onChange={e => handleChange(f.name, e.target.value)}
                          aria-label={f.name}
                        />
                        <span className='ms-underline' />
                      </label>
                    ))}
                  </div>

                  <div className='ms-actions'>
                    <button
                      type='button'
                      className='ms-btn ghost'
                      onClick={() => {
                        if (productId) router.push(`/Products/${productId}`)
                        else router.back()
                      }}
                    >
                      Cancel
                    </button>
                    <button type='submit' className='ms-btn primary'>
                      Review
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 2 && (
              <section className='ms-review'>
                <h4 className='ms-review-title'>Review Measurements</h4>

                <div className='ms-review-grid'>
                  {fields.map(f => (
                    <div key={f.name} className='ms-review-row'>
                      <div className='ms-r-label'>{f.name}</div>
                      <div className='ms-r-value'>
                        {values[f.name] || '—'}
                        {values[f.name] ? ` ${unit}` : ''}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='ms-actions'>
                  <button
                    className='ms-btn ghost'
                    onClick={() => setStep(1)}
                    type='button'
                  >
                    Edit
                  </button>
                  <button
                    className='ms-btn save'
                    onClick={handleSave}
                    type='button'
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save & Return'}
                  </button>
                </div>
              </section>
            )}
          </main>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
