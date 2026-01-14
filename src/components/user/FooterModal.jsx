'use client'
import { footerModalData } from '@/app/utilies/footerData'
import ContactUs from '../modalContents/ContactUs'
import ShippingInfo from '../modalContents/ShippingInfo'
import Cookies from '../modalContents/Cookies'
import TermsAndConditions from '../modalContents/TermsAndConditions'
import ReactCountryFlag from 'react-country-flag'

const modalComponents = {
  'Contact Us': ContactUs,
  'Shipping & Return Policy': ShippingInfo
  // 'Privacy Policy': Cookies,
  // 'Terms & Conditions': TermsAndConditions
}

export default function FooterModal ({ open, onClose, content, onSelect }) {
  if (!open || !content) return null

  const { language, country, note } = footerModalData
  const SpecificComponent = modalComponents[content.label] || null

  // inside changeLanguage()
  const changeLanguage = lang => {
    const langMap = {
      English: 'en',
      Spanish: 'es',
      French: 'fr',
      German: 'de',
      Italian: 'it',
      Portuguese: 'pt',
      Russian: 'ru',
      Japanese: 'ja',
      Korean: 'ko',
      'Simplified Chinese': 'zh-CN',
      'Traditional Chinese': 'zh-TW',
      Arabic: 'ar',
      Hindi: 'hi',
      Turkish: 'tr',
      Dutch: 'nl',
      Swedish: 'sv',
      Norwegian: 'no',
      Danish: 'da',
      Polish: 'pl',
      Greek: 'el'
    }

    const code = langMap[lang] || 'en'

    // Save choice
    localStorage.setItem('preferredLang', code)

    // Apply immediately if combo exists
    const combo = document.querySelector('.goog-te-combo')
    // console.log(combo)
    if (combo) {
      combo.value = code
      combo.dispatchEvent(new Event('change'))
    } else {
      console.warn('Google Translate combo not found yet')
    }

    onSelect(lang, 'language')
    onClose()
  }

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className='footer-modal-overlay' onClick={handleOverlayClick}>
      <div className='footer-modal modal--wide'>
        <div className='footer-modal-header'>
          <span onClick={onClose} className='footer-modal-close'>
            ×
          </span>
        </div>

        <div className='footer-modal-body modal-grid'>
          {/* Language Modal */}
          {content.type === 'language' && (
            <div>
              <h3>{language.title}</h3>
              <ul className='country-grid'>
                {language.items.map((item, idx) => (
                  <li key={idx}>
                    {item.type === 'link' ? (
                      <span onClick={() => changeLanguage(item.label)}>
                        {item.label}
                      </span>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className='modal-footer'>
                <span className='modal-footer-text'>{note.text}</span>
              </div>
            </div>
          )}

          {/* Country Modal */}
          {content.type === 'country' && (
            <div>
              <p style={{ fontSize: '10px' }}>{country.title}</p>
              <ul className='country-grid'>
                {country.items.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => {
                        onSelect(item.label, 'country')
                        onClose()
                      }}
                    >
                      <ReactCountryFlag
                        countryCode={item.code}
                        svg
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '3px'
                        }}
                      />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className='modal-footer'>
                <span className='modal-footer-text'>{note.text}</span>
              </div>
            </div>
          )}

          {/* Info Modal */}
          {content.type === 'info' && SpecificComponent && (
            <div className='modal-info-content'>
              <SpecificComponent />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
