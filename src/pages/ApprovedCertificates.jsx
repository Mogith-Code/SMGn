import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'

function ApprovedCertificates({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state if available
  const successUser = location.state?.successUser || 'Nimal Perera'
  const userDivision = location.state?.division || '200324511540'

  // Alternating mock history based on the screenshot
  const approvedList = [
    {
      id: 1,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '26/05/2026',
      purpose: 'For certify residence',
      isActive: true, // First card has a golden-beige active background
    },
    {
      id: 2,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '21/04/2026',
      purpose: 'For income verification',
      isActive: false,
    },
    {
      id: 3,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '26/05/2026',
      purpose: 'For certify residence',
      isActive: false,
    },
    {
      id: 4,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '21/04/2026',
      purpose: 'For income verification',
      isActive: false,
    },
    {
      id: 5,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '26/05/2026',
      purpose: 'For certify residence',
      isActive: false,
    },
    {
      id: 6,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '21/04/2026',
      purpose: 'For income verification',
      isActive: false,
    },
  ]

  const handleDownload = (cert) => {
    alert(`Downloading ${cert.type} issued on ${cert.approvedDate}...`)
  }

  return (
    <div className="dashboard-container">
      
      {/* 1. Header */}
      <header className="dashboard-header">
        <div className="landing-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-smart">Smart</span>
          <span className="logo-gn">GN</span>
          <p className="logo-subtext">{t.tagline}</p>
        </div>

        <div className="header-right">
          <LanguageSelector />

          {/* Notifications */}
          <div className="notification-bell">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="bell-badge">2</span>
          </div>

          {/* User Profile Info */}
          <div className="user-profile-info">
            <div className="user-text-details">
              <span className="user-division">{userDivision}</span>
              <span className="user-name">{successUser}</span>
            </div>
            <div className="user-avatar-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="avatar-svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Layout Grid */}
      <div className="dashboard-main-layout">
        
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-menu">
            <button className="menu-btn" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>{t.home}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>{t.dashboard}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/profile', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{t.profile}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/household', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button className="menu-btn active" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/appointments', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/allowances', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/disaster', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>{t.disaster}</span>
            </button>

            <button className="menu-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span>{t.announcements}</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel Content */}
        <main className="dashboard-content">
          
          {/* Back button */}
          <div className="form-header" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
            <button className="btn-back" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          </div>

          {/* Heading */}
          <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Approved Certificates</h2>

          {/* Approved History List */}
          <div className="approved-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {approvedList.map((cert) => (
              <div 
                key={cert.id} 
                className={`approved-cert-card ${cert.isActive ? 'active-cert-card' : ''}`}
                style={{
                  backgroundColor: cert.isActive ? '#fdf8f0' : '#ffffff',
                  border: cert.isActive ? '1.5px solid #fedc9b' : '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.01)',
                  position: 'relative'
                }}
              >
                {/* Left Area: Certificate Details */}
                <div style={{ textAlign: 'left' }}>
                  <h4 
                    style={{ 
                      margin: '0 0 12px 0', 
                      fontSize: '16px', 
                      fontWeight: '750', 
                      color: '#1a2e56' 
                    }}
                  >
                    {cert.type}
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13.5px' }}>
                    <div>
                      <span style={{ color: '#475569', fontWeight: '600' }}>Requested Date: </span>
                      <span style={{ color: '#1e293b', fontWeight: '700' }}>{cert.requestedDate}</span>
                    </div>
                    <div>
                      <span style={{ color: '#475569', fontWeight: '600' }}>Purpose: </span>
                      <span style={{ color: '#1e293b', fontWeight: '700' }}>{cert.purpose}</span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Approved Date & Download Action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
                    {cert.approvedDate}
                  </span>
                  
                  <button 
                    onClick={() => handleDownload(cert)}
                    className="btn-form-submit" 
                    style={{ 
                      margin: 0, 
                      padding: '8px 20px', 
                      fontSize: '13px', 
                      borderRadius: '50px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    Download
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Help Trigger */}
          <button className="floating-dashboard-help" aria-label="Help Trigger" onClick={onOpenHelp}>
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <footer className="landing-footer" style={{ padding: '16px 64px', borderTop: 'none' }}>
        <div className="footer-copyright">
          <p>© 2026 SmartGN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default ApprovedCertificates
