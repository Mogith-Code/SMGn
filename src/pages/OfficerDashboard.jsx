import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function OfficerDashboard({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Retrieve username and officerId from navigation state if available (defaults to Kamal Perera)
  const successUser = location.state?.successUser || 'Kamal Perera'
  
  // Extract first name for the personal greeting
  const firstName = successUser.split(' ')[0]
  const officerIdVal = location.state?.officerId || '200324511540'

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true)

  // State for dynamic active disasters count
  const [activeDisastersCount, setActiveDisastersCount] = useState(2)

  useEffect(() => {
    const saved = localStorage.getItem('smartgn_disaster_reports')
    if (saved) {
      const allDisasters = JSON.parse(saved)
      const activeCount = allDisasters.filter(item => item.status !== 'Resolved').length
      setActiveDisastersCount(activeCount)
    } else {
      setActiveDisastersCount(2)
    }
  }, [])

  return (
    <div className="dashboard-container">
      
      {/* 1. Header */}
      <header className="dashboard-header">
        <div className="landing-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-smart">Smart</span>
          <span className="logo-gn">GN</span>
          <p className="logo-subtext">Digital Grama Niladhari Service Management System</p>
        </div>

        <div className="header-right">
          {/* Language Selector */}
          <div className="landing-lang-selector">
            <div className="lang-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lang-globe-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>English</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" className="lang-chevron">
                <path d="M1 1.5L6 6.5L11 1.5"></path>
              </svg>
            </div>
          </div>

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
              <span className="user-division">{officerIdVal}</span>
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

      {/* 2. Main Dashboard Layout */}
      <div className="dashboard-main-layout">
        
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-menu">
            <button className="menu-btn" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Home</span>
            </button>

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>Dashboard</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/profile', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile & Settings</span>
            </button>

            <button className="menu-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>Family & Household Details</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/login')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>Certificates Services</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/appointments', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Appointments</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/login')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>Allowance Programs</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/disasters', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Disaster Report</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span>Announcements</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel Content */}
        <main className="dashboard-content">
          
          {/* Top warning Alert */}
          {showAlert && (
            <div className="dashboard-alert-banner">
              <div className="alert-text-wrapper">
                <span>Please upload a high-quality image of your National Identity Card</span>
              </div>
              <button className="alert-close-btn" onClick={() => setShowAlert(false)} aria-label="Close Warning">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          {/* Heading Greeting */}
          <h2 className="content-greeting">Have a Nice Day {firstName}!</h2>

          {/* Stats Widgets */}
          <div className="stats-row-grid">
            
            {/* Card 1: Total Residents */}
            <div className="stat-card">
              <div className="stat-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
              </div>
              <span className="stat-label">Total Residents</span>
              <span className="stat-value">1,2400</span>
              <span className="stat-subtext-note">+12 this month</span>
            </div>

            {/* Card 2: Pending Requests */}
            <div className="stat-card">
              <div className="stat-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <circle cx="12" cy="14" r="3"></circle>
                  <polyline points="12 12 12 14 14 14"></polyline>
                </svg>
              </div>
              <span className="stat-label">Pending requests</span>
              <span className="stat-value">20</span>
            </div>

            {/* Card 3: Active Disaster */}
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/officer/disasters', { state: { successUser, officerId: officerIdVal } })}>
              <div className="stat-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 22h20L12 2z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                </svg>
              </div>
              <span className="stat-label">Active Disaster</span>
              <span className="stat-value">{activeDisastersCount}</span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="quick-actions-card">
            <h3 className="card-inner-title">Quick Actions</h3>
            
            <div className="quick-actions-button-grid">
              
              <button className="action-button-item" onClick={() => navigate('/login')}>
                <div className="action-left-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Approved Certificates</span>
                <span className="action-right-arrow">➔</span>
              </button>

              <button className="action-button-item" onClick={() => navigate('/login')}>
                <div className="action-left-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <span>Check Appointments</span>
                <span className="action-right-arrow">➔</span>
              </button>

              <button className="action-button-item" onClick={() => navigate('/login')}>
                <div className="action-left-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                </div>
                <span>Review Allowances</span>
                <span className="action-right-arrow">➔</span>
              </button>

              <button className="action-button-item" onClick={() => navigate('/dashboard/officer/disasters', { state: { successUser, officerId: officerIdVal } })}>
                <div className="action-left-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                    <path d="M12 2L2 22h20L12 2z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                  </svg>
                </div>
                <span>Review Disaster</span>
                <span className="action-right-arrow">➔</span>
              </button>
            </div>
          </div>

          {/* Announcements Card */}
          <div className="dashboard-announcements-card">
            <div className="announcements-card-header">
              <h3 className="card-inner-title" style={{ margin: 0 }}>Announcements</h3>
              <span className="view-all-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser, officerId: officerIdVal } })}>View all</span>
            </div>

            <div className="announcements-rows-list">
              
              {/* Row 1: Active item */}
              <div className="announcement-row-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser, officerId: officerIdVal } })}>
                <div className="announcement-left-group">
                  <span className="announcement-icon-bullet">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    </svg>
                  </span>
                  <span className="announcement-title-txt">Community Health Camp</span>
                </div>
                <div className="announcement-right-group">
                  <span className="announcement-date">April 10, 2026</span>
                  <span className="announcement-tag">Health</span>
                </div>
              </div>

              {/* Rows 2, 3, 4, 5: Interactive Add Announcement Placeholders */}
              <div className="announcement-row-placeholder clickable-placeholder" onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser, officerId: officerIdVal } })}>
                <span>Add new Announcement</span>
              </div>
              <div className="announcement-row-placeholder clickable-placeholder" onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser, officerId: officerIdVal } })}>
                <span>Add new Announcement</span>
              </div>
              <div className="announcement-row-placeholder clickable-placeholder" onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser, officerId: officerIdVal } })}>
                <span>Add new Announcement</span>
              </div>
              <div className="announcement-row-placeholder clickable-placeholder" onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser, officerId: officerIdVal } })}>
                <span>Add new Announcement</span>
              </div>
            </div>
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

export default OfficerDashboard
