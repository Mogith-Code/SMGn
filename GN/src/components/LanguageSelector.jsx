import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../utils/translate'
import languageIcon from '../assets/language_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import arrowDownIcon from '../assets/keyboard_arrow_down_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import selectedIcon from '../assets/check_small_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'

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
        <img src={languageIcon} alt="Language" className="lang-globe-icon" />
        <span>{activeLanguage.name}</span>
        <img src={arrowDownIcon} alt="Select Language" className={`lang-chevron ${isOpen ? 'open' : ''}`} /> 
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
                <img src={selectedIcon} alt="Language" className="lang-globe-icon" style={{ width: '16px', height: '16px' }} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSelector
