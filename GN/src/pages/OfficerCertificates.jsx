import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function OfficerCertificates({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session user defaults
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || 'GN-BORELLA'
  const initialFilter = location.state?.activeFilter || 'All'

  // Certificates list state
  const [certs, setCerts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState(initialFilter) // 'All' | 'Pending' | 'Approved' | 'Rejected'
  const [visibleCount, setVisibleCount] = useState(3) // Seed has 3 items initially, Load More loads more mock items

  const loadCerts = async () => {
    try {
      const response = await fetch('/api/certificates/officer', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load certificates.')
      const data = await response.json()
      
      const formatted = data.map(item => ({
        id: item.request_id,
        type: item.certificate_type === 'INCOME' ? 'Income Certificate' : 'Residence Certificate',
        status: item.status === 'PENDING' ? 'Pending' : item.status === 'APPROVED' ? 'Approved' : 'Rejected',
        name: item.resident_name || 'Resident',
        purpose: item.purpose,
        submittedDate: item.request_date ? item.request_date.split('T')[0] : '',
        division: item.division || 'Colombo',
        nic: item.resident_nic,
        address: item.resident_address || ''
      }))
      setCerts(formatted)
    } catch (err) {
      console.error(err)
      const saved = localStorage.getItem('smartgn_certificate_requests')
      if (saved) setCerts(JSON.parse(saved))
    }
  }

  useEffect(() => {
    loadCerts()
  }, [])

  // Approve action directly from list
  const handleApprove = async (id, e) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'APPROVED' })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve certificate.')
      }
      alert(`Certificate request ${id} approved successfully.`)
      loadCerts()
    } catch (err) {
      alert(err.message || 'Error approving request.')
    }
  }

  // Reject action directly from list
  const handleReject = async (id, e) => {
    e.stopPropagation()
    const reason = window.prompt(`Enter rejection reason for certificate request ${id}:`)
    if (reason !== null) {
      try {
        const response = await fetch(`/api/certificates/${id}/action`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: 'REJECTED', rejectionReason: reason })
        })
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to reject certificate.')
        }
        alert(`Certificate request ${id} has been rejected.`)
        loadCerts()
      } catch (err) {
        alert(err.message || 'Error rejecting request.')
      }
    }
  }

  // Load more requests
  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 2, certs.length))
  }

  // Filter & Search logic
  const filteredCerts = certs.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterStatus === 'All') return matchesSearch
    return matchesSearch && c.status === filterStatus
  })

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

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/appointments', { state: { successUser, officerId: officerIdVal } })}>
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 className="content-greeting" style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Certificate Approval</h2>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Review and manage resident certificate requests for your division.</span>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: '700',
                    borderRadius: '6px',
                    border: 'none',
                    background: filterStatus === status ? '#ffffff' : 'transparent',
                    color: filterStatus === status ? '#1a2e56' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: filterStatus === status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box Card Row */}
          <div className="stats-row-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '24px' }}>
            <div className="stat-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1.5px solid #fedc9b', backgroundColor: '#fdf8f0', borderRadius: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search residents by name, NIC, or tracking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    fontSize: '14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#1e293b',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" style={{ position: 'absolute', left: '14px', top: '14px' }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  cursor: 'pointer',
                  color: '#475569'
                }}
                aria-label="Filter Options"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Certificate Requests List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {filteredCerts.slice(0, visibleCount).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/dashboard/officer/certificates/${item.id}`, { state: { successUser, officerId: officerIdVal } })}
                className="pending-cert-card animate-zoom-in"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '24px 32px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d97706'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                {/* Left: Info Card */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {/* Circular Icon */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#e8edf3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1a2e56'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#1a2e56' }}>
                        {item.type}
                      </h4>
                      <span
                        className={`badge-status ${item.status.toLowerCase()}`}
                        style={{
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '50px'
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#475569' }}>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <strong>{item.name}</strong>
                      </span>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        Purpose: {item.purpose}
                      </span>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Submitted: {item.submittedDate}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontWeight: '700' }}>
                      Div: {item.division}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
                  {item.status === 'Pending' ? (
                    <>
                      <button
                        onClick={(e) => handleApprove(item.id, e)}
                        style={{
                          background: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 24px',
                          borderRadius: '50px',
                          fontSize: '13.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Approve
                      </button>

                      <button
                        onClick={(e) => handleReject(item.id, e)}
                        style={{
                          background: '#ffffff',
                          color: '#ef4444',
                          border: '1.5px solid #ef4444',
                          padding: '8px 24px',
                          borderRadius: '50px',
                          fontSize: '13.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ef4444'
                          e.currentTarget.style.color = '#ffffff'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff'
                          e.currentTarget.style.color = '#ef4444'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate(`/dashboard/officer/certificates/${item.id}`, { state: { successUser, officerId: officerIdVal } })}
                      style={{
                        background: '#ffffff',
                        color: '#475569',
                        border: '1.5px solid #cbd5e1',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        fontSize: '13px',
                        fontWeight: '750',
                        cursor: 'pointer'
                      }}
                    >
                      View Details ➔
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredCerts.length === 0 && (
              <div style={{ padding: '48px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '15px' }}>
                No certificate requests match the selected search or filter status.
              </div>
            )}
          </div>

          {/* Load More Button */}
          {filteredCerts.length > visibleCount && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                onClick={handleLoadMore}
                className="btn-form-submit"
                style={{
                  background: '#1a2e56',
                  color: '#ffffff',
                  padding: '12px 32px',
                  borderRadius: '50px',
                  fontSize: '14.5px',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(26, 46, 86, 0.15)'
                }}
              >
                Load More Requests
              </button>
            </div>
          )}

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

export default OfficerCertificates
