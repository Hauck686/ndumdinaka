'use client'
import React from 'react'
import { Search, ShoppingCart, Bell, Menu } from 'lucide-react'
import Sidebar from '../user/Sidebar'

export default function DashboardNav ({ onMenuToggle }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className='top-nav'>
      {/* Left - Profile & Greeting */}
      <div className='left-section'>
        <div className='profile-pic'>
          <img
            src='https://plus.unsplash.com/premium_photo-1739178656495-8109a8bc4f53?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='User'
          />
        </div>
        <div className='welcome-text'>
          <p className='small'>Hi,Admin</p>
          <h4>Welcome Back!</h4>
        </div>
      </div>

      {/* Middle - Search */}
      {/* <div className='search-bar'>
        <input type='text' placeholder='Search' />
        <Search className='icon' size={18} />
      </div> */}

      {/* Right - Icons */}
      <div className='right-section'>
        {/* <div className='icon-wrapper'>
          <ShoppingCart size={22} />
          <span className='dot'></span>
        </div>
        <div className='icon-wrapper'>
          <Bell size={22} />
          <span className='dot'></span>
        </div> */}
        {/* Menu Icon (Left) */}
        <div className='menu-icon' onClick={() => setIsOpen(!isOpen)}>
          <Menu strokeWidth={1.75} size={20} />
        </div>
      </div>

      {/* Sidebar */}
      {isOpen && <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </header>
  )
}
