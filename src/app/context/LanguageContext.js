// context/LanguageContext.js
'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en') // default

  // Load from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage')
    if (savedLang) setLanguage(savedLang)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('appLanguage', language)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
