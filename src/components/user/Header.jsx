import { Menu } from 'lucide-react'
import React, { useState } from 'react'
import Sidebar from './Sidebar'

export default function Header () {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className='user-header'>
        {/* Menu Icon (Left) */}
        <div className='menu-icon' onClick={() => setIsOpen(!isOpen)}>
          <Menu strokeWidth={1.75} size={20} />
        </div>

        {/* Center Logo */}
        <div className='header-logo'>NAKACHI NDUMDI</div>
      </div>

      {/* Sidebar */}
      {isOpen && <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
}
