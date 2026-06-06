import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function OfficerAppointments({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and officerId from navigation state or localStorage (defaults to Kamal Perera)
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || 'GN-BORELLA'

  // Dynamic appointments list state
  const [appointments, setAppointments] = useState([])
  const [showFullQueue, setShowFullQueue] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments/officer', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load appointments queue.')
      const data = await response.json()
      const formatted = data.map(item => ({
        id: item.appointment_id,
        name: item.resident_name || 'Resident',
        residentId: item.resident_nic,
        time: `${item.date} at ${item.time}`,
        purpose: item.purpose,
        avatarUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100`, // Default fallback avatar
        status: item.status === 'PENDING' ? 'Pending' : item.status === 'CONFIRMED' ? 'Confirmed' : 'Declined'
      }))
      setAppointments(formatted)
    } catch (err) {
      console.error(err)
      const saved = localStorage.getItem('smartgn_officer_appointments')
      if (saved) setAppointments(JSON.parse(saved))
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  // Action Handlers
  const handleConfirm = async (id, name) => {
    try {
      const response = await fetch(`/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'CONFIRMED' })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to confirm appointment.')
      }

      alert(`Appointment for ${name} has been successfully confirmed.`)
      loadAppointments()
    } catch (err) {
      alert(err.message || 'Error confirming appointment.')
    }
  }

  const handleDecline = async (id, name) => {
    const confirmDecline = window.confirm(`Are you sure you want to decline the appointment for ${name}?`)
    if (confirmDecline) {
      try {
        const response = await fetch(`/api/appointments/${id}/status`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: 'DECLINED' })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to decline appointment.')
        }

        alert(`Appointment for ${name} has been declined.`)
        loadAppointments()
      } catch (err) {
        alert(err.message || 'Error declining appointment.')
      }
    }
  }

  // Filter pending requests
  const pendingRequests = appointments.filter(item => item.status === 'Pending')

  // Real-time search query filtering
  const filteredQueue = pendingRequests.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.residentId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Visible requests logic (mockup shows 4 items initially)
  const visibleRequests = showFullQueue ? filteredQueue : filteredQueue.slice(0, 4)
  
  // Total pending count dynamically derived from remaining items in the queue
  const totalPending = pendingRequests.length
  
  // Dynamic remaining count for the dotted card
  const remainingCount = totalPending > 4 ? totalPending - 4 : 0

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
          {/* Language Selector */}
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

      {/* 2. Main Layout */}
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

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>{t.dashboard}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/profile', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{t.profile}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/household', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/certificates', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/allowances', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/disasters', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>{t.disaster}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser, officerId: officerIdVal } })}>
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
            <button className="btn-back" onClick={() => navigate('/dashboard/officer', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          </div>

          {/* Heading Row with Title and Search/Filters */}
          <div className="appointment-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 className="content-greeting" style={{ margin: 0 }}>Appointment Management</h2>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Review and manage upcoming community service and administrative requests.</p>
            </div>
            
            <div className="appointment-search-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="search-input-wrapper" style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="register-control" 
                  placeholder="Search residents..."
                  style={{ minWidth: '240px', paddingLeft: '36px', height: '40px', borderRadius: '8px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ position: 'absolute', left: '12px', top: '12px' }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <button className="nic-upload-select-btn" style={{ height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Centered Stats widgets matching the mockup */}
          <div className="stats-row-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            
            <div className="stat-card" style={{ padding: '20px 24px' }}>
              <span className="stat-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Pending</span>
              <span className="stat-value" style={{ color: '#1a2e56', fontSize: '28px', marginTop: '8px' }}>{totalPending}</span>
            </div>

            <div className="stat-card" style={{ padding: '20px 24px' }}>
              <span className="stat-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Slots</span>
              <span className="stat-value" style={{ color: '#d97706', fontSize: '28px', marginTop: '8px' }}>08</span>
            </div>

            <div className="stat-card" style={{ padding: '20px 24px' }}>
              <span className="stat-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Wait</span>
              <span className="stat-value" style={{ color: '#1e293b', fontSize: '28px', marginTop: '8px' }}>4 Days</span>
            </div>

            <div className="stat-card" style={{ padding: '20px 24px' }}>
              <span className="stat-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capacity</span>
              <span className="stat-value" style={{ color: '#1e293b', fontSize: '28px', marginTop: '8px' }}>84%</span>
            </div>

          </div>

          {/* Main Appointment queue list grid */}
          <div className="officer-appointments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            {visibleRequests.map((item) => (
              <div key={item.id} className="officer-appointment-card">
                
                {/* Header row */}
                <div className="appt-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="appt-avatar-wrapper" style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                      <img src={item.avatarUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800', color: '#1e293b' }}>{item.name}</h4>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>RESIDENT ID: {item.residentId}</span>
                    </div>
                  </div>
                  <span className="badge-status pending" style={{ padding: '2px 10px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.status}</span>
                </div>

                {/* Info block */}
                <div className="appt-info-block" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{item.time}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                    {item.purpose === 'Household verification' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    )}
                    <span>{item.purpose}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="appt-actions-row" style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn-appt-confirm" 
                    onClick={() => handleConfirm(item.id, item.name)}
                    style={{ flex: 1, backgroundColor: '#1a2e56', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '750', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Confirm
                  </button>

                  <button 
                    className="btn-appt-decline" 
                    onClick={() => handleDecline(item.id, item.name)}
                    style={{ flex: 1, backgroundColor: '#ffffff', color: '#ef4444', border: '1.5px solid #ef4444', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '750', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Decline
                  </button>
                </div>

              </div>
            ))}

            {/* Dotted Wait Queue card */}
            {!showFullQueue && remainingCount > 0 && (
              <div className="officer-appointment-card queue-waiting-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', backgroundColor: 'transparent', boxShadow: 'none', minHeight: '235px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ marginBottom: '12px' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <circle cx="12" cy="14" r="3"></circle>
                  <polyline points="12 12 12 14 14 14"></polyline>
                </svg>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '750', color: '#64748b' }}>{remainingCount} More Requests Waiting</h4>
                <button 
                  className="view-queue-link-btn" 
                  onClick={() => setShowFullQueue(true)}
                  style={{ background: 'none', border: 'none', color: '#d97706', fontWeight: '750', fontSize: '13px', textDecoration: 'underline', marginTop: '8px', cursor: 'pointer' }}
                >
                  View all in queue
                </button>
              </div>
            )}
          </div>

          {/* Fallback for empty filtered query queue */}
          {visibleRequests.length === 0 && (
            <div className="empty-summary-placeholder" style={{ padding: '48px', margin: '24px 0' }}>
              <div className="placeholder-icon" style={{ marginBottom: '16px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <p style={{ margin: 0, fontWeight: '750', fontSize: '14.5px', color: '#475569' }}>No pending appointments found matching "{searchQuery}"</p>
            </div>
          )}

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

export default OfficerAppointments
