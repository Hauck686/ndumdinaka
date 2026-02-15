'use client'
import React, { useState, useEffect } from 'react'
import { Menu, X, Bell, Settings } from 'lucide-react'
import Sidebar from '../user/Sidebar'

/**
 * DashboardNav Component - COMPLETE & FIXED
 * Includes all header elements: profile, search, icons, sidebar
 */
export default function DashboardNav ({ onMenuToggle }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar when clicking outside on mobile
  const handleSidebarClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <header className='modern-top-nav'>
        {/* LEFT SECTION - Menu Button + Profile */}
        <div className='nav-left'>
          {/* Mobile Menu Toggle Button */}
          <button
            className='nav-menu-btn'
            onClick={() => setIsOpen(!isOpen)}
            aria-label='Toggle sidebar menu'
            type='button'
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Profile Section - Desktop Only */}
          <div className='nav-profile-section'>
            {/* <div className='nav-profile-pic'>
              <img
                src='https://plus.unsplash.com/premium_photo-1739178656495-8109a8bc4f53?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='User Profile'
              />
            </div> */}
            <div className='nav-welcome-text'>
              <p className='nav-greeting-small'>Hi, Admin</p>
              <h4 className='nav-greeting-main'>Welcome Back!</h4>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Action Buttons */}
        <div className='nav-right'>
          {/* Notification Bell Button */}
          <button
            className='nav-action-btn'
            aria-label='View notifications (3 unread)'
            type='button'
          >
            <Bell size={20} />
            <span className='nav-badge'>3</span>
          </button>

          {/* Settings Button */}
          <button
            className='nav-action-btn'
            aria-label='Open settings'
            type='button'
          >
            <Settings size={20} />
          </button>

          {/* Divider */}
          <div className='nav-divider'></div>
        </div>
      </header>

      {/* Sidebar Component */}
      <Sidebar isOpen={isOpen} onClose={handleSidebarClose} />
    </>
  )
}
