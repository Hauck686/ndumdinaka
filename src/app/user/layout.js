'use client'

import Footer from '../../components/Footer'
import Header from '../../components/user/Header'
import React from 'react'
import { AuthProvider } from '../context/AuthContext'
import ProtectedLayout from '../context/ProtectedLayouts'

export default function userLayout ({ children }) {
  return (
    <AuthProvider>
      <ProtectedLayout role={'user'}>
        <Header />
        <main>{children}</main>
        <Footer />
      </ProtectedLayout>
    </AuthProvider>
  )
}
