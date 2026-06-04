// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import logoImage from '../assets/images/logo.png';
import homeIcon from '../assets/images/home_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg';
import aboutIcon from '../assets/images/info_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg';
import servicesIcon from '../assets/images/accessibility_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg';
import languageIcon from '../assets/images/language_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg';
import dropdownIcon from '../assets/images/keyboard_arrow_down_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg';

function Navbar() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Language management state
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  
  // Mobile menu management state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Refs for detecting clicks outside elements
  // IMPORTANT: Separate refs for desktop and mobile to avoid conflicts
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Available language options
  const languages = ['English', 'Sinhala', 'Tamil'];

  // Navigation links data
  const navLinks = [
    { name: 'Home', icon: homeIcon, href: '#home' },
    { name: 'About', icon: aboutIcon, href: '#about' },
    { name: 'Services', icon: servicesIcon, href: '#services' }
  ];

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Toggles the language dropdown menu visibility
   */
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  /**
   * Changes the current language and closes the dropdown
   * @param {string} lang - The selected language ('English', 'Sinhala', or 'Tamil')
   */
  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setIsLanguageDropdownOpen(false);
    console.log(`Language changed to: ${lang}`);
    // TODO: Implement actual language change logic (i18n, context, etc.)
  };

  /**
   * Toggles the mobile sidebar menu visibility
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Closes the mobile sidebar menu
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ============================================================================
  // SIDE EFFECTS (useEffect Hooks)
  // ============================================================================
  
  /**
   * EFFECT 1: Close language dropdown when clicking outside
   * Works for both desktop and mobile using their respective refs
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside desktop dropdown AND outside mobile dropdown
      const isOutsideDesktop = desktopDropdownRef.current && 
        !desktopDropdownRef.current.contains(event.target);
      const isOutsideMobile = mobileDropdownRef.current && 
        !mobileDropdownRef.current.contains(event.target);
      
      // Close dropdown if click is outside both desktop and mobile dropdowns
      if (isOutsideDesktop && isOutsideMobile) {
        setIsLanguageDropdownOpen(false);
      }
    };

    // Only add event listener when dropdown is open
    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup: remove event listener
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLanguageDropdownOpen]); // Re-run when dropdown state changes

  /**
   * EFFECT 2: Close mobile menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  /**
   * EFFECT 3: Prevent body scroll when mobile sidebar is open
   * Improves UX by preventing background scrolling
   */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // ============================================================================
  // HELPER COMPONENTS
  // ============================================================================
  
  /**
   * Language Dropdown Menu Component
   * Reused for both desktop and mobile to avoid code duplication
   * @param {string} variant - 'desktop' or 'mobile' for different styling
   */
  const LanguageDropdownMenu = ({ variant = 'desktop' }) => {
    const isDesktop = variant === 'desktop';
    
    return (
      <div className={`
        absolute top-full right-0 mt-2 
        bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50
        ${isDesktop ? 'w-40' : 'w-36'}
      `}>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`
              w-full text-left hover:bg-gray-50 transition-colors duration-200
              ${isDesktop ? 'px-4 py-3 text-sm' : 'px-4 py-2.5 text-[0.813rem]'}
              ${currentLanguage === lang 
                ? 'bg-[#EBF8FF] text-[#2c5f8a] font-medium' 
                : 'text-[#2D3748]'
              }
            `}
          >
            {lang}
          </button>
        ))}
      </div>
    );
  };

  /**
   * Language Selector Button Component
   * Reused for both desktop and mobile
   * @param {string} variant - 'desktop' or 'mobile' for different styling
   */
  const LanguageSelector = ({ variant = 'desktop' }) => {
    const isDesktop = variant === 'desktop';
    const dropdownRef = isDesktop ? desktopDropdownRef : mobileDropdownRef;
    
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleLanguageDropdown}
          className={`
            flex items-center gap-2.5 
            border border-[#2D3748] border-opacity-50 
            rounded-[9.375rem] bg-transparent 
            hover:bg-white/50 transition-all duration-300 cursor-pointer
            ${isDesktop ? 'px-5 py-2.5' : 'px-3 py-2'}
          `}
          aria-label="Select language"
          aria-expanded={isLanguageDropdownOpen}
        >
          {/* Language Icon */}
          <img 
            src={languageIcon} 
            alt="Language icon" 
            className={`w-auto ${isDesktop ? 'h-5' : 'h-4'}`}
          />
          
          {/* Current Language Text */}
          <span className={`
            text-[#2D3748] font-medium
            ${isDesktop ? 'text-[1rem]' : 'text-[0.875rem] max-sm:text-[0.75rem]'}
          `}>
            {currentLanguage}
          </span>
          
          {/* Dropdown Arrow Icon */}
          <img 
            src={dropdownIcon} 
            alt="Dropdown arrow" 
            className={`
              w-auto ${isDesktop ? 'h-5' : 'h-4'} 
              transition-transform duration-300 
              ${isLanguageDropdownOpen ? 'rotate-180' : ''}
            `}
          />
        </button>

        {/* Language Dropdown Menu */}
        {isLanguageDropdownOpen && <LanguageDropdownMenu variant={variant} />}
      </div>
    );
  };

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================
  
  return (
    <nav className="w-full bg-[#EBF8FF] shadow-[0_5px_25px_rgba(0,0,0,0.2)] sticky top-0 z-50">
      
      {/* ====================================================================== */}
      {/* DESKTOP NAVBAR (Visible on screens 1024px and above)                    */}
      {/* ====================================================================== */}
      <div className="hidden lg:block w-full h-25 px-25">
        <div className="w-full h-full flex justify-between items-center">
          
          {/* LEFT SECTION: Logo */}
          <div className="shrink-0">
            <img 
              src={logoImage} 
              alt="SmartGN Logo" 
              className="w-70 h-auto"
            />
          </div>

          {/* CENTER SECTION: Navigation Tabs */}
          <div className="flex items-center gap-20">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-2.5 text-[#2D3748] font-medium text-[1rem] hover:text-[#005BBD] hover:underline underline-offset-4 decoration-[#D69E2E] decoration-2 transition-colors duration-300"
              >
                <img 
                  src={link.icon} 
                  alt={`${link.name} icon`} 
                  className="w-auto h-5"
                />
                <span>{link.name}</span>
              </a>
            ))}
          </div>

          {/* RIGHT SECTION: Language Selector (Desktop) */}
          <LanguageSelector variant="desktop" />
        </div>
      </div>

      {/* ====================================================================== */}
      {/* MOBILE NAVBAR (Visible on screens below 1024px)                         */}
      {/* ====================================================================== */}
      <div className="lg:hidden w-full h-20 px-4">
        <div className="w-full h-full flex justify-between items-center">
          
          {/* LEFT SECTION: Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col gap-1.5 p-2 z-50 relative"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {/* Hamburger icon lines - transform to 'X' when menu is open */}
            <span className={`w-6 h-0.5 bg-[#2D3748] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-[#2D3748] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-[#2D3748] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          {/* CENTER SECTION: Logo (Mobile) */}
          <div className="shrink-0">
            <img 
              src={logoImage} 
              alt="SmartGN Logo" 
              className="w-45 h-auto max-sm:w-35"
            />
          </div>

          {/* RIGHT SECTION: Language Selector (Mobile) */}
          <LanguageSelector variant="mobile" />
        </div>
      </div>

      {/* ====================================================================== */}
      {/* MOBILE SIDEBAR MENU (Conditionally rendered)                            */}
      {/* ====================================================================== */}
      
      {/* Overlay Background - Darkens page content when sidebar is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-label="Close menu overlay"
          role="presentation"
        />
      )}
      
      {/* Vertical Navigation Sidebar - Slides in from left */}
      <div 
        ref={mobileMenuRef}
        className={`
          fixed top-0 left-0 w-50 h-full bg-white shadow-2xl z-50 
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Navigation menu"
        role="navigation"
      >
        {/* Sidebar Header */}
        <div className="px-8 py-4 border-b border-gray-200">
          <h2 className="text-[1rem] text-left font-bold text-[#2c5f8a]">
            Navigation <br />
            Menu
          </h2>
        </div>

        {/* Vertical Navigation Links - Optimized for mobile touch targets */}
        <div className="flex flex-col">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-4 text-[#2D3748] font-medium text-[0.813rem] hover:bg-[#EBF8FF] hover:text-[#2c5f8a] transition-all duration-300 rounded-lg border-b border-gray-100"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img 
                src={link.icon} 
                alt={`${link.name} icon`} 
                className="w-auto h-4"
              />
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;