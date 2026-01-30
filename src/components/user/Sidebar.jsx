'use client'
import { CircleUser } from 'lucide-react'
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

  // detect role by checking current path
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
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/user-measurement', label: 'Measurement' },
    { href: '/admin/waiting-list', label: 'Waiting List' }
    // { href: '/admin/sales', label: 'Sales' },
    // { href: '/admin/payments', label: 'Payments' },
    // { href: '/admin/shipping', label: 'Shipping' }
  ]

  const mainLinks = isAdmin ? adminLinks : userLinks

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('authToken')
    }
    router.push('/auth/login') // redirect to login
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
        { href: '/user/user-profile', label: 'Profile' },
        // { href: '/user/settings', label: 'Settings' },
        { action: handleLogout, label: 'Log out' }
      ]

  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`user-sidebar ${isOpen ? 'open' : ''}`}>
        <div className='user-sidebar__header'>
          <CircleUser />
          <span className='user-sidebar__email'>
            {loading
              ? 'Loading...'
              : error
              ? 'Super Admin'
              : email || (user ? user.email : 'No Email')}
          </span>
        </div>

        <hr className='divider' />

        <ul className='user-sidebar__links'>
          {mainLinks.map((link, idx) => (
            <li key={idx}>
              <a href={link.href} onClick={onClose}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className='user-sidebar__footer'>
          <hr className='divider' />
          <ul className='user-sidebar__links'>
            {footerLinks.map((link, idx) => (
              <li key={idx}>
                {link.action ? (
                  <button onClick={link.action} className='logout-btn'>
                    {link.label}
                  </button>
                ) : (
                  <a href={link.href} onClick={onClose}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
