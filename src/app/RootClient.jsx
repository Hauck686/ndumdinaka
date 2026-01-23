'use client'
import { usePathname } from 'next/navigation'
import Header from '../components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import { NotificationProvider } from './context/NotificationContext.js'
import '../scss/index.scss'

export default function RootClient ({ children }) {
  const pathname = usePathname()

  const hiddenRoutes = [
    '/auth/login',
    '/auth/verify-code',
    '/user/dashboard',
    '/user/shop',
    '/user/orders',
    '/user/user-profile',
    '/user/settings',
    '/admin/dashboard',
    '/admin/orders',
    '/admin/shipping',
    '/admin/products',
    '/admin/customers',
    '/admin/payments',
    '/admin/product-upload',
    '/admin/waiting-list',
    '/admin/user-measurement',
    '/admin/cookies',
    '/admin/newsletter-subscribers',
    '/admin/sales',
    '/'
  ]

  const hideLayout = hiddenRoutes.includes(pathname)

  return (
    <NotificationProvider>
      <div id='google_translate_element' style={{ display: 'none' }}></div>

      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </NotificationProvider>
  )
}
