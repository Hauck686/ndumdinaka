'use client'

import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'

export default function DropDown ({ onClose }) {
  const [activeMenu, setActiveMenu] = useState(null)
  const [token, setToken] = useState(null)
  const [mounted, setMounted] = useState(false)

  // ✅ Safe hydration for localStorage
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'))
    }
  }, [])

  const handleClose = useCallback(() => {
    if (typeof onClose === 'function') {
      onClose()
    }
  }, [onClose])

  const links = [
    {
      title: '',
      items: [
        {
          label: 'Ready To Wear',
          href: '#',
          children: [
            { label: 'Shirts', href: '/Products/category/Shirts' },
            {
              label: 'Jackets & Blousons',
              href: '/Products/category/Jackets%20%26%20Blousons'
            },
            {
              label: 'Coats & Blazers',
              href: '/Products/category/Coats%20%26%20Blazers'
            },
            { label: 'Trousers', href: '/Products/category/Trousers' }
          ]
        },
        {
          label: 'Bags & Small Leather Goods',
          href: '/Products/category/Bags%20%26%20Small%20Leather%20Goods'
        },
        { label: 'Shoes', href: '/Products/category/Shoes' },
        { label: 'Accessories', href: '/Products/category/Accessories' }
      ]
    }
  ]

  // ⛔ Prevent hydration mismatch
  if (!mounted) return null

  return (
    <div className='menu-overlay'>
      <div className='overlay-content'>
        <div className='overlay-sections'>
          {links.map((section, idx) => (
            <div className='overlay-section' key={idx}>
              <div className='section-title'>{section.title}</div>

              {/* If submenu is active, show only it */}
              {activeMenu ? (
                <div className='submenu-wrapper'>
                  <span
                    className='back-btn'
                    onClick={() => setActiveMenu(null)}
                  >
                    ← Back
                  </span>
                  {activeMenu.children.map((child, j) => (
                    <Link key={j} href={child.href} onClick={handleClose}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                section.items.map((item, i) => (
                  <div key={i} className='menu-item'>
                    {item.children ? (
                      <span
                        className='menu-toggle'
                        onClick={() => setActiveMenu(item)}
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link href={item.href} onClick={handleClose}>
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='overlay-footer'>
        <div onClick={handleClose}>
          <Link href={token ? '/user/user-profile' : '/auth/login'}>
            {token ? 'Profile' : 'Account'}
          </Link>
        </div>
      </div>
    </div>
  )
}
