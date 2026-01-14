'use client'
import React, { useEffect, useState, useRef } from 'react'

export default function FloatingLogo ({ lastSectionId }) {
  const [visible, setVisible] = useState(true)
  const observerRef = useRef(null)

  useEffect(() => {
    const target = document.getElementById(lastSectionId)

    if (!target) return

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setVisible(!entry.isIntersecting)
        })
      },
      {
        threshold: 0.3
      }
    )

    observerRef.current.observe(target)

    return () => {
      if (observerRef.current && target) {
        observerRef.current.unobserve(target)
      }
    }
  }, [lastSectionId])

  if (!visible) return null

  return (
    <div className='floating-logo'>
      <h4>NAKACHI NDUMDI </h4>
    </div>
  )
}
