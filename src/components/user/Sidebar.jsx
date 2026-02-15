'use client'
import { CircleUser, LogOut, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'

export default function Sidebar ({ isOpen, onClose }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load userId + token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'))
      setToken(localStorage.getItem('token'))
      setEmail(localStorage.getItem('email'))
    }
  }, [])

  // Fetch user when userId & token are ready
  useEffect(() => {
    if (!userId || !token) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setUser(res.data)
      } catch (err) {
        setError(err.response?.data?.msg || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, token])

  // Detect role by checking current path
  const isAdmin = pathname.startsWith('/admin')

  const userLinks = [
    { href: '/', label: 'Shop' },
    { href: '/user/orders', label: 'Orders' },
    { href: '/user/user-profile', label: 'Profile' }
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/customers', label: 'Customers' },
    { href: '/admin/product-upload', label: 'Products Upload' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/orders', label: 'Orders' }
    // { href: '/admin/user-measurement', label: 'Measurement' },
    // { href: '/admin/waiting-list', label: 'Waiting List' }
  ]

  const mainLinks = isAdmin ? adminLinks : userLinks

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('authToken')
      localStorage.removeItem('email')
    }
    router.push('/auth/login')
    onClose?.()
  }

  const footerLinks = isAdmin
    ? [
        {
          href: '/admin/newsletter-subscribers',
          label: 'Newsletter Subscriber'
        },
        { href: '/admin/cookies', label: 'Cookies Consent' },
        { action: handleLogout, label: 'Log out' }
      ]
    : [
        // { href: '/user/user-profile', label: 'Profile' },
        { action: handleLogout, label: 'Log out' }
      ]

  // Check if link is active
  const isLinkActive = href =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        role='presentation'
      ></div>

      {/* Sidebar */}
      <aside className={`modern-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className='sidebar-header'>
          <div className='sidebar-user-info'>
            <div className='sidebar-avatar'>
              <CircleUser size={24} />
            </div>
            <div className='sidebar-user-details'>
              <p className='sidebar-user-label'>
                {loading ? 'Loading...' : error ? 'Super Admin' : 'User'}
              </p>
              <p className='sidebar-user-email'>
                {loading
                  ? 'Loading...'
                  : error
                  ? 'Super Admin'
                  : email || (user ? user.email : 'No Email')}
              </p>
            </div>
          </div>
          <button
            className='sidebar-close-btn'
            onClick={onClose}
            aria-label='Close sidebar'
          >
            <X size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className='sidebar-divider'></div>

        {/* Main Navigation */}
        <nav className='sidebar-nav'>
          <ul className='sidebar-links'>
            {mainLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  onClick={onClose}
                  className={`sidebar-link ${
                    isLinkActive(link.href) ? 'active' : ''
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className='sidebar-footer'>
          <div className='sidebar-divider'></div>
          <ul className='sidebar-links'>
            {footerLinks.map((link, idx) => (
              <li key={idx}>
                {link.action ? (
                  <button
                    onClick={link.action}
                    className='sidebar-link sidebar-logout-btn'
                  >
                    <LogOut size={16} />
                    {link.label}
                  </button>
                ) : (
                  <a
                    href={link.href}
                    onClick={onClose}
                    className={`sidebar-link ${
                      isLinkActive(link.href) ? 'active' : ''
                    }`}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}
