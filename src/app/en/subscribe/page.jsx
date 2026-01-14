'use client'

import React from 'react'

export default function NewsletterForm () {
  return (
    <div className={'newsletterContainer'}>
      <div className={'imageSection'}></div>
      <div className={'formSection'}>
        <form>
          <div className={'inputGroup'}>
            <input type='email' id='email' required />
            <label htmlFor='email'>Email*</label>
            <span className={'underline'}></span>
          </div>

          <div className={'checkboxGroup'}>
            <input type='checkbox' id='subscribe' />
            <label htmlFor='subscribe'>
              Please check the box if you would like to receive the NAKACHI
              NDUMDI Newsletter (information about our products, services and
              events). By subscribing, you agree to our{' '}
              <a href='#'>privacy policy</a>.
            </label>
          </div>

          <button type='submit' className={'submitBtn'}>
            Subscribe
          </button>
        </form>
      </div>
    </div>
  )
}
