import ImageSection from '../../components/sections/ImageSection.jsx'
import React from 'react'
import CookiesPopup from '@/components/CookiesPopup.jsx'
import NewsletterComp from '@/components/NewsletterComp.jsx'

export default function page () {
  return (
    <div className='home-page'>
      {/* <FloatingLogo /> */}
      {/* <NewsletterPopup /> */}
      <CookiesPopup />

      <ImageSection
        images={[
          {
            src: '/landing1.png',
            width: '80%',
            height: '80%'
          },
          {
            src: '/landing1.png',
            width: '80%',
            height: '80%'
          }
        ]}
      />

      <div style={{ marginTop: '2rem', width: '100%' }}>
        <NewsletterComp />
      </div>
    </div>
  )
}
