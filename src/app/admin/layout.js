'use client'
import DashboardNav from '@/components/admin/DashboardNav'
import React from 'react'
import { AuthProvider } from '../context/AuthContext'
import ProtectedLayout from '../context/ProtectedLayouts'

export default function AuthLayout ({ children }) {
  return (
    <AuthProvider>
      <ProtectedLayout role='admin'>
        <DashboardNav />
        <main>{children}</main>
      </ProtectedLayout>
    </AuthProvider>
  )
}
