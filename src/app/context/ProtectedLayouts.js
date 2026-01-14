'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from './AuthContext'
import LoadingScreen from '@/components/LoadingScreen'

export default function ProtectedLayout ({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return // wait until auth is resolved

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Only redirect if they are on root or login
    if (pathname === '/' || pathname.startsWith('/auth')) {
      if (user.role === 'user') {
        router.push('/user/user-profile')
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard')
      }
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    )
  }

  return <>{children}</>
}
