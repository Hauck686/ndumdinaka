'use client'

import { useState } from 'react'
import CookiesPolicy from '@/components/CookiesPolicy'
import PrivacyPolicy from '@/components/PrivacyPolicy'

export default function PoliciesPage () {
  const [activePolicy, setActivePolicy] = useState('')

  const handleToggle = policy => {
    setActivePolicy(activePolicy === policy ? '' : policy)
  }

  return (
    <div className='policies-page'>
      <h5>Policies</h5>

      <div className='policy-section'>
        <div className='policy-header' onClick={() => handleToggle('privacy')}>
          Privacy policy
          <span>{activePolicy === 'privacy' ? '-' : '+'}</span>
        </div>
        {activePolicy === 'privacy' && (
          <div className='policy-content'>
            <PrivacyPolicy />
          </div>
        )}
      </div>

      <div className='policy-section'>
        <div className='policy-header' onClick={() => handleToggle('cookies')}>
          Cookie policy
          <span>{activePolicy === 'cookies' ? '-' : '+'}</span>
        </div>
        {activePolicy === 'cookies' && (
          <div className='policy-content'>
            <CookiesPolicy />
          </div>
        )}
      </div>
    </div>
  )
}
