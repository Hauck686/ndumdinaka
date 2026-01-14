'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  // Show a new notification
  const showNotification = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, msg, type }])

    // Auto remove after 3s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Render notifications */}
      <div className='notification-container'>
        {notifications.map(n => (
          <div key={n.id} className={`notification ${n.type}`}>
            {n.msg}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
