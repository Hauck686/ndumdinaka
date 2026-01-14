import { ChevronDown, Globe } from 'lucide-react'

export default function Footer () {
  return (
    <div className='User-footer'>
      <ul className='User-footer-links'>
        <div className='User-footer-country'>
          <Globe size={16} strokeWidth={1.25} />

          <a href='#'>United States</a>

          <ChevronDown strokeWidth={1.25} />
        </div>

        <li>
          <a href='#'>Refund Policy</a>
        </li>
        <li>
          <a href='#'>Terms of Service</a>
        </li>
        <li>
          <a href='#'>Privacy Policy</a>
        </li>
        <li>
          <a href='#'>Shipping</a>
        </li>
        <li>
          <a href='#'>Cancellations</a>
        </li>
        <li>
          <a href='#'>Contact Information</a>
        </li>
      </ul>
    </div>
  )
}
