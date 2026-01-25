'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import DropDown from './DropDown'
import CartComponent from './products/CartComponent'
import { Search, X, Menu } from 'lucide-react'
import SearchComponent from './SearchComponent'

const navMenu = [
  {
    label: 'Ready To Wear',
    dropdown: [
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
    label: 'Bags and small leather',
    dropdown: [
      {
        label: 'Bags & Small Leather Goods',
        href: '/Products/category/Bags%20%26%20Small%20Leather%20Goods'
      }
    ]
  },
  {
    label: 'Shoes',
    dropdown: [{ label: 'Shoes', href: '/Products/category/Shoes' }]
  },
  {
    label: 'Accessories',
    dropdown: [{ label: 'Accessories', href: '/Products/category/Accessories' }]
  }
]

export default function Header () {
  const [open, setOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  const [token, setToken] = useState(null)
  const [mounted, setMounted] = useState(false)

  // ✅ Mount check + token load
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'))
    }
  }, [])

  // ✅ Load cart count safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart')) || []
      setCartCount(cart.length)
    }
  }, [openCart])

  // 🚨 Early return AFTER hooks
  if (!mounted) return null

  const accountMenu = [
    { label: 'Search', href: null },
    // { label: 'Subscribe', href: '/en/subscribe' },
    {
      label: token ? 'Profile' : 'Login',
      href: token ? '/user/user-profile' : '/auth/login'
    },
    { label: 'Cart', href: null }
  ]

  return (
    <>
      <header>
        <nav className='site-header'>
          {/* Mobile / Left navigation */}
          <div className='nav-left'>
            <div
              className='hamburger-menu'
              onClick={() => setOpen(prev => !prev)}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <X strokeWidth={2} size={19} />
              ) : (
                // <Menu strokeWidth={2} size={19} />

                <div>
                  <Menu strokeWidth={1} size={19} />
                </div>
              )}
            </div>

            <ul>
              {navMenu.map((item, idx) => (
                <li
                  key={item.label}
                  onMouseEnter={() => setDropdownOpen(idx)}
                  onMouseLeave={() => setDropdownOpen(null)}
                  className='nav-item'
                >
                  <span>{item.label}</span>
                  {dropdownOpen === idx && (
                    <ul className='dropdown'>
                      {item.dropdown.map((sub, subIdx) => (
                        <li key={subIdx}>
                          <Link href={sub.href}>{sub.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Center logo */}
          <div className='logo'>
            <Link href='/'>NAKACHI NDUMDI</Link>
          </div>

          {/* Right navigation */}
          <div className='nav-right'>
            <ul>
              {accountMenu.map(item => (
                <li key={item.label}>
                  {item.label === 'Cart' ? (
                    <span
                      onClick={() => setOpenCart(!openCart)}
                      className='cart-link'
                    >
                      {openCart ? `Close` : `Cart`}
                    </span>
                  ) : item.label === 'Search' ? (
                    <span
                      onClick={() => setIsSearchOpen(true)}
                      className='search-link'
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link href={item.href}>{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile icons */}
            <div className='mobile-icon'>
              {isSearchOpen ? (
                <div
                  className='search-icon'
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X strokeWidth={1} size={19} />
                </div>
              ) : (
                <div
                  className='search-icon'
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search strokeWidth={1} size={19} />
                </div>
              )}

              {/* <div className='cartIcon'> */}
              {openCart ? (
                <div
                  className='cartIcon'
                  onClick={() => setOpenCart(false)}
                  aria-label='Close cart'
                >
                  <X strokeWidth={2} size={19} />
                </div>
              ) : (
                <div
                  className='cartIcon'
                  onClick={() => setOpenCart(true)}
                  aria-label='Open cart'
                >
                  BAG
                </div>
              )}
              {/* </div> */}
            </div>
          </div>
        </nav>
      </header>

      {/* Cart drawer */}
      {openCart && <CartComponent onClose={() => setOpenCart(false)} />}
      {isSearchOpen && (
        <SearchComponent onClose={() => setIsSearchOpen(false)} />
      )}
      {/* DropDown mobile menu (controlled by same state) */}
      {open && <DropDown onClose={() => setOpen(false)} isOpen={open} />}
    </>
  )
}
