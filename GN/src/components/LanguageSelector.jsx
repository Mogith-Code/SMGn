import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../utils/translate'

function LanguageSelector() {
  const { lang, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'SI', name: 'සිංහල' },
    { code: 'TA', name: 'தமிழ்' }
  ]

  const activeLanguage = languages.find(l => l.code === lang) || languages[0]

  return (
    <div className="landing-lang-selector" ref={dropdownRef}>
      <div className="lang-wrapper" onClick={() => setIsOpen(!isOpen)} role="button" aria-haspopup="true" aria-expanded={isOpen}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lang-globe-icon">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>{activeLanguage.name}</span>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" className={`lang-chevron ${isOpen ? 'open' : ''}`}>
          <path d="M1 1.5L6 6.5L11 1.5"></path>
        </svg>
      </div>

      {isOpen && (
        <ul className="lang-dropdown-options">
          {languages.map((item) => (
            <li
              key={item.code}
              className={`lang-dropdown-option ${lang === item.code ? 'selected' : ''}`}
              onClick={() => {
                changeLanguage(item.code)
                setIsOpen(false)
              }}
            >
              {item.name}
              {lang === item.code && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSelector
