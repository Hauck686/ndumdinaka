'use client'

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import './MeasurementForm.scss'
import { useNotification } from '@/app/context/NotificationContext'

const MEASUREMENT_GUIDES = {
  'Jackets & Blousons': [
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
  Trousers: [
    { name: 'Trouser Length', description: 'Trouser Length' },
    { name: 'Hip', description: 'Around hip' },
    { name: 'Thigh', description: 'Around thigh' },
    { name: 'Ankle', description: 'Around ankle' },
    { name: 'Knee', description: 'Around knee' },
    { name: 'Calf', description: 'Around calf' },
    { name: 'Crotch', description: 'Around crotch' },
    { name: 'Inseam', description: 'Around inseam' },
    { name: 'Waist', description: 'Around waist' }
  ]
}

export default function MeasurementForm ({
  productId = '',
  initialType = null,
  onSaved = null
}) {
  const router = useRouter()
  const { showNotification } = useNotification()
  const [triedSubmit, setTriedSubmit] = useState(false)

  // choose a sensible default type (fall back to the first guide if initialType isn't valid)
  const defaultType =
    initialType && MEASUREMENT_GUIDES[initialType]
      ? initialType
      : Object.keys(MEASUREMENT_GUIDES)[0]

  const [unit, setUnit] = useState('cm')
  const [activeType, setActiveType] = useState(defaultType)
  const [values, setValues] = useState({})
  const [step, setStep] = useState(1) // 1 = form, 2 = review
  const [saving, setSaving] = useState(false)

  const fields = MEASUREMENT_GUIDES[activeType] || []
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
    // initialize fields if empty (keep existing values)
    setValues(prev => {
      const base = {}
      fields.forEach(f => {
        base[f.name] = prev[f.name] ?? ''
      })
      return { ...base, ...prev }
    })
    // reset step to form when type changes
    setStep(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType])

  // sanitize numeric inputs
  function handleChange (name, raw) {
    const cleaned = String(raw).replace(/[^\d.]/g, '')
    setValues(prev => ({ ...prev, [name]: cleaned }))
  }

  // helper: persist measurement to localStorage and return saved object (with id)
  function persistLocally (payload) {
    try {
      const existing = JSON.parse(
        typeof window !== 'undefined'
          ? localStorage.getItem('customMeasurements') || '[]'
          : '[]'
      )
      const saved = { id: Date.now().toString(), ...payload }
      existing.push(saved)
      if (typeof window !== 'undefined') {
        localStorage.setItem('customMeasurements', JSON.stringify(existing))
      }
      return saved
    } catch (err) {
      console.error('Failed to persist measurement locally', err)
      return { id: Date.now().toString(), ...payload }
    }
  }

  // simple check: ensure at least one field has a value before saving
  function hasAnyValue () {
    return fields.some(f => {
      const v = values[f.name]
      return v !== undefined && v !== null && String(v).trim() !== ''
    })
  }

  async function saveMeasurement () {
    setSaving(true)

    if (!areAllFieldsFilled()) {
      showNotification(
        'Please fill in all measurements before saving.',
        'warning'
      )
      setSaving(false)
      return
    }

    const userId =
      typeof window !== 'undefined' ? localStorage.getItem('userId') : null

    const payload = {
      type: activeType,
      unit,
      values,
      productId: productId || null,
      userId: userId,
      createdAt: new Date().toISOString()
    }

    // ALWAYS save to localStorage first (for both guests and logged-in users)
    let savedMeasurement
    try {
      savedMeasurement = persistLocally(payload)
      showNotification('✅ Measurement saved!', 'success')
    } catch (err) {
      console.error('Failed to save measurement to localStorage', err)
      showNotification(
        'Unable to save measurements. Please try again.',
        'error'
      )
      setSaving(false)
      return
    }

    // If user is logged in, ALSO save to backend as backup
    if (userId && process.env.NEXT_PUBLIC_BACKEND_URL) {
      try {
        const token = localStorage.getItem('token')

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/measurements`,
          payload,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        )

        // Update the saved measurement with backend ID if available
        if (res?.data?._id) {
          savedMeasurement = { ...savedMeasurement, _id: res.data._id }
        }

        console.log('✅ Measurement also synced to backend')
      } catch (err) {
        console.warn(
          'Backend sync failed, but measurement is saved locally',
          err
        )
        // Don't show error - localStorage save already succeeded
      }
    }

    // Call onSaved callback if provided
    if (onSaved) onSaved(savedMeasurement)

    // Redirect back to product page with measurementId param
    if (productId) {
      const idToUse = savedMeasurement._id || savedMeasurement.id
      const url = `/Products/id/${productId}?measurementId=${encodeURIComponent(
        idToUse
      )}&fromMeasurement=1`
      router.replace(url)
    } else {
      router.back()
    }

    setSaving(false)
  }

  // check that every field has a value
  function areAllFieldsFilled () {
    return fields.every(f => {
      const v = values[f.name]
      return v !== undefined && v !== null && String(v).trim() !== ''
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        className='mf-wrap'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className='mf-container'>
          <header className='mf-header'>
            <div className='mf-left'>
              {/* <h1>{activeType} Measurements</h1> */}
              <p className='mf-sub'>ENTER YOUR MEASUREMENTS</p>
              <p className='mf-text'>
                To ensure a flawless silhouette and fit, we require accurate
                body measurements, which serve as the foundation of your custom
                pattern. A $250 pattern-making fee applies for drafting a design
                exclusively tailored to your proportions. By submitting your
                measurements, you acknowledge that you have read and understood
                our Custom Sizing & Tailoring Terms and Conditions.
              </p>
            </div>

            <div className='mf-right'>
              <div className='mf-units' role='tablist' aria-label='Units'>
                <button
                  className={`btn-unit ${unit === 'cm' ? 'on' : ''}`}
                  onClick={() => setUnit('cm')}
                  type='button'
                >
                  CM
                </button>
                <button
                  className={`btn-unit ${unit === 'inches' ? 'on' : ''}`}
                  onClick={() => setUnit('inches')}
                  type='button'
                >
                  INCHES
                </button>
              </div>
            </div>
          </header>

          {!initialType && (
            <div className='mf-type-row'>
              {Object.keys(MEASUREMENT_GUIDES).map(t => (
                <button
                  key={t}
                  className={`type-btn ${t === activeType ? 'active' : ''}`}
                  onClick={() => setActiveType(t)}
                  type='button'
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <main className='mf-main'>
            {step === 1 && (
              <form
                className='mf-form'
                onSubmit={e => {
                  e.preventDefault()
                  setTriedSubmit(true)

                  if (!areAllFieldsFilled()) {
                    showNotification(
                      'Please fill in all measurements before reviewing.',
                      'warning'
                    )
                    return
                  }

                  setStep(2)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <div className='mf-grid'>
                  {fields.map(f => (
                    <label key={f.name} className='mf-field'>
                      <span className='mf-label'>{f.name}</span>
                      <input
                        className='mf-input'
                        inputMode='decimal'
                        value={values[f.name] ?? ''}
                        placeholder=' '
                        onChange={e => handleChange(f.name, e.target.value)}
                        aria-label={f.name}
                      />
                      <span className='mf-underline' />
                    </label>
                  ))}
                </div>

                <div className='mf-actions'>
                  <button type='submit' className='btn primary'>
                    Review To Proceed
                  </button>
                </div>
                {triedSubmit && !areAllFieldsFilled() && (
                  <p className='mf-validation-msg'>
                    Please complete all required measurements to proceed.
                  </p>
                )}
              </form>
            )}

            {step === 2 && (
              <section className='mf-review'>
                <h2>Review Measurements</h2>

                <div className='mf-review-list'>
                  {fields.map(f => (
                    <div key={f.name} className='mf-review-row'>
                      <div className='mf-r-label'>{f.name}</div>
                      <div className='mf-r-value'>
                        {values[f.name] || '—'}
                        {values[f.name] ? ` ${unit}` : ''}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mf-actions'>
                  <button
                    type='button'
                    className='btn primary'
                    onClick={() => setStep(1)}
                  >
                    Edit
                  </button>
                </div>
                <div className='mf-actions'>
                  <button
                    type='button'
                    className='btn primary'
                    onClick={saveMeasurement}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Proceed'}
                  </button>
                </div>
              </section>
            )}
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

MeasurementForm.propTypes = {
  productId: PropTypes.string,
  initialType: PropTypes.string,
  onSaved: PropTypes.func
}
