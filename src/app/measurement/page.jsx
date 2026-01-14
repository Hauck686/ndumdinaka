'use client'

import React from 'react'
import MeasurementStepper from '@/components/MeasurementStepper'

export default function MeasurementPage () {
  // expose the same stepper on a standalone page
  return (
    <MeasurementStepper
      initialType='Suits'
      onClose={() => {
        /* no-op on page */
      }}
    />
  )
}
