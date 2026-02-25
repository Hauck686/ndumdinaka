'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import FooterModal from './user/FooterModal'

function FooterSection ({
  title,
  links,
  section,
  onLinkClick,
  isOpen,
  onToggle
}) {
  const [expandedLink, setExpandedLink] = useState(null)

  return (
    <div className='footer-section'>
      <span className='footer-title' onClick={onToggle}>
        <span>{title}</span>
        <span className='toggle-icon'>{isOpen ? '−' : '+'}</span>
      </span>

      {isOpen && links && (
        <ul className='footer-links'>
          {links.map((link, i) => (
            <li key={i}>
              <a
                href='#'
                onClick={e => {
                  e.preventDefault()
                  if (link.subLinks) {
                    setExpandedLink(
                      expandedLink === link.label ? null : link.label
                    )
                  } else {
                    onLinkClick(section, link)
                  }
                }}
              >
                {link.label}
              </a>

              {link.subLinks && expandedLink === link.label && (
                <ul className='footer-sublinks'>
                  {link.subLinks.map((sub, j) => (
                    <li key={j}>
                      <a
                        href='#'
                        onClick={e => {
                          e.preventDefault()
                          onLinkClick(section, sub)
                        }}
                      >
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Footer () {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [selectedCountry, setSelectedCountry] = useState('United States')
  const [activeSection, setActiveSection] = useState(null)

  // Load Google Translate
  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      document.body.appendChild(script)
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,jp,zh,it'
        },
        'google_translate_element'
      )
    }
  }, [])

  const handleLinkClick = (section, item) => {
    // 🌐 Handle external links
    if (item.href && item.href.startsWith('http')) {
      window.open(item.href, '_blank')
      return
    }

    // 📄 Handle PDFs or files
    if (item.href && item.href.endsWith('.pdf')) {
      window.open(item.href, '_blank')
      return
    }

    // 🌍 Handle language modal
    if (section === 'language') {
      setModalContent({ type: 'language', selected: selectedLanguage })
      setModalOpen(true)
      return
    }

    // 🏳️ Handle country modal
    if (section === 'country') {
      setModalContent({ type: 'country', selected: selectedCountry })
      setModalOpen(true)
      return
    }

    // ✅ For all other links, go to their page
    if (item.href) {
      router.push(item.href)
    }
  }

  const item = {
    label: `<br />
  NAKACHI NDUMDI, a Division of NAKACHI NDUMDI<br />
  Limited Liability Company.
  Head Office: 6900 Lenox Village Dr, Apt. 575, Nashville,
   Tennessee 37211, USA.`,
    href: '#'
  }

  return (
    <footer className='main-footer'>
      <div className='footer-wrapper'>
        <FooterSection
          title='Company'
          links={[
            {
              label: 'Company Information',
              subLinks: [
                {
                  label: (
                    <span
                      className='footer-sublink'
                      dangerouslySetInnerHTML={{ __html: item.label }}
                    />
                  )
                }
              ]
            },

            { label: 'Impact', href: '/auth/impact' }
          ]}
          section='info'
          onLinkClick={handleLinkClick}
          isOpen={activeSection === 'customer'}
          onToggle={() =>
            setActiveSection(activeSection === 'customer' ? null : 'customer')
          }
        />

        <FooterSection
          title='Customer care'
          links={[
            {
              label: 'Email: support@nakachi.com',
              href: 'mailto:support@nakachi.com'
            },
            { label: 'Call: +1 123-456-7890', href: 'tel:+11234567890' }
          ]}
          section='legal'
          onLinkClick={handleLinkClick}
          isOpen={activeSection === 'legal'}
          onToggle={() =>
            setActiveSection(activeSection === 'legal' ? null : 'legal')
          }
        />

        <FooterSection
          title='Legal and Corporate'
          links={[
            {
              label: 'Terms and Conditions',
              href: '/auth/terms-and-conditions'
            },
            {
              label: 'Privacy Policy',
              href: '/auth/privacy-cookies'
            },
            {
              label: 'Shipping and Return Policy',
              href: '/auth/shipping-return-policy'
            }
          ]}
          section='legalcorporate'
          onLinkClick={handleLinkClick}
          isOpen={activeSection === 'legalcorporate'}
          onToggle={() =>
            setActiveSection(
              activeSection === 'legalcorporate' ? null : 'legalcorporate'
            )
          }
        />

        <FooterSection
          title='Follow Us'
          links={[{ label: 'Instagram', href: 'https://instagram.com' }]}
          section='follow'
          onLinkClick={handleLinkClick}
          isOpen={activeSection === 'follow'}
          onToggle={() =>
            setActiveSection(activeSection === 'follow' ? null : 'follow')
          }
        />

        <div
          className='footer-current'
          onClick={() => handleLinkClick('country', { label: selectedCountry })}
        >
          <span className='footer-title'>Country: {selectedCountry}</span>
        </div>

        <div className='footer-bottom'>
          <footer className='content-footer'>
            <p>
              ©{new Date().getFullYear()} NAKACHI NDUMDI. All rights reserved.
            </p>
          </footer>
        </div>
      </div>

      {/* 🌍 Modal for Language / Country */}
      <FooterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        content={modalContent}
        onSelect={(value, type) => {
          if (type === 'language') setSelectedLanguage(value)
          if (type === 'country') setSelectedCountry(value)
        }}
      />
    </footer>
  )
}
