import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'

function OfficerAnnouncements({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and officerId from navigation state if available (defaults to Kamal Perera)
  const successUser = location.state?.successUser || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || '200324511540'

  // Announcements lists state
  const [announcements, setAnnouncements] = useState([])
  const [viewMode, setViewMode] = useState('DASHBOARD') // 'DASHBOARD' | 'CREATE' | 'EDIT'
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [showPreviousAnnouncements, setShowPreviousAnnouncements] = useState(false)

  // Form Field States
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Seed default dataset on mount matching the screenshots
  useEffect(() => {
    const saved = localStorage.getItem('smartgn_announcements')
    if (saved) {
      setAnnouncements(JSON.parse(saved))
    } else {
      const defaultData = [
        {
          id: 1,
          title: 'Community Health Clinic Schedule',
          category: 'Health',
          date: 'Oct 24, 2026 • 09:00 AM',
          content: 'The upcoming health clinic will focus on pediatric vaccinations and seasonal flu shots. Please ensure all residents bring their health cards and local identification documents. Registration...',
          status: 'Live'
        },
        {
          id: 2,
          title: 'Water Supply Maintenance Update',
          category: 'Utilities',
          date: 'Oct 23, 2026 • 02:45 PM',
          content: 'Emergency maintenance work is scheduled for the main reservoir. Residents in Zone B will experience low pressure or complete outage for 4 hours. We apologize for the inconvenience and...',
          status: 'Urgent'
        },
        {
          id: 3,
          title: 'School Mid-term Holidays',
          category: 'Education',
          date: 'Oct 15, 2026 • 10:00 AM',
          content: 'Local primary schools will be closed for the mid-term break from October 20th to October 25th. Parents are advised to coordinate childcare. Extracurricular sports activities will still proceed at...',
          status: 'Archived'
        }
      ]
      localStorage.setItem('smartgn_announcements', JSON.stringify(defaultData))
      setAnnouncements(defaultData)
    }
  }, [])

  // Create Announcement Handlers
  const handleOpenCreate = () => {
    setTitle('')
    setCategory('')
    setContent('')
    setIsUrgent(false)
    setEditingId(null)
    setViewMode('CREATE')
  }

  const handlePublish = (e) => {
    e.preventDefault()

    if (!title || !category || !content) {
      alert('Please fill in all required fields.')
      return
    }

    // Format current date and time
    const today = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const formattedDate = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()} • ${today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    const nextId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1

    const newAnnouncement = {
      id: nextId,
      title,
      category,
      date: formattedDate,
      content,
      status: isUrgent ? 'Urgent' : 'Live'
    }

    const updated = [newAnnouncement, ...announcements]
    localStorage.setItem('smartgn_announcements', JSON.stringify(updated))
    setAnnouncements(updated)
    setShowSuccessBanner(true)
    setViewMode('DASHBOARD')
  }

  // Edit Announcement Handlers
  const handleOpenEdit = (item) => {
    setEditingId(item.id)
    setTitle(item.title)
    setCategory(item.category)
    setContent(item.content)
    setIsUrgent(item.status === 'Urgent')
    setViewMode('EDIT')
  }

  const handleSaveChanges = (e) => {
    e.preventDefault()

    if (!title || !category || !content) {
      alert('Please fill in all required fields.')
      return
    }

    const updated = announcements.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          title,
          category,
          content,
          status: isUrgent ? 'Urgent' : item.status === 'Archived' ? 'Archived' : 'Live'
        }
      }
      return item
    })

    localStorage.setItem('smartgn_announcements', JSON.stringify(updated))
    setAnnouncements(updated)
    setViewMode('DASHBOARD')
    alert('Announcement updated successfully.')
  }

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this announcement permanently?')
    if (confirmDelete) {
      const updated = announcements.filter(item => item.id !== editingId)
      localStorage.setItem('smartgn_announcements', JSON.stringify(updated))
      setAnnouncements(updated)
      setViewMode('DASHBOARD')
      alert('Announcement deleted successfully.')
    }
  }

  // Restore Archived Announcement
  const handleRestore = (id, titleText) => {
    const updated = announcements.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Live' }
      }
      return item
    })
    localStorage.setItem('smartgn_announcements', JSON.stringify(updated))
    setAnnouncements(updated)
    alert(`"${titleText}" has been restored to Live status.`)
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

            <button className="menu-btn active">
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
          {(viewMode === 'CREATE' || viewMode === 'EDIT') && (
            <div className="form-header" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
              <button className="btn-back" onClick={() => setViewMode('DASHBOARD')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
              </button>
            </div>
          )}

          {/* Sub-view: DASHBOARD (Dashboard Announcement Lists) */}
          {viewMode === 'DASHBOARD' && (
            <>
              {/* Success alert published block */}
              {showSuccessBanner && (
                <div className="dashboard-alert-banner" style={{ backgroundColor: '#22c55e', border: '1px solid #16a34a', color: '#ffffff', marginBottom: '24px' }}>
                  <div className="alert-text-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span style={{ fontWeight: '600' }}>Announcement Published Successfully!</span>
                    <span style={{ fontSize: '12.5px', opacity: 0.9 }}>Your announcement is now live for all registered residents in the GN division.</span>
                  </div>
                  <button className="alert-close-btn" onClick={() => setShowSuccessBanner(false)} aria-label="Close Alert" style={{ color: '#ffffff' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}

              {/* Title & Publish Trigger Action Row */}
              <div className="appointment-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
                <div style={{ textAlign: 'left' }}>
                  <h2 className="content-greeting" style={{ margin: 0 }}>Announcements Dashboard</h2>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Manage and track all public notifications sent to the community.</p>
                </div>
                
                <button className="btn-appt-confirm" onClick={handleOpenCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', backgroundColor: '#1a2e56', color: '#ffffff', border: 'none', fontWeight: '750' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create New Announcement
                </button>
              </div>

              {/* Active Announcements List */}
              <div className="allowance-requests-status-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {announcements.map((item) => {
                  const isUrgentType = item.status === 'Urgent'
                  const isArchivedType = item.status === 'Archived'
                  
                  const borderLeftStyle = isUrgentType 
                    ? '4.5px solid #ef4444' 
                    : isArchivedType 
                      ? '4.5px solid #94a3b8' 
                      : '4.5px solid #22c55e'

                  return (
                    <div 
                      key={item.id} 
                      className="allowance-status-row" 
                      style={{ 
                        borderLeft: borderLeftStyle, 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '24px 28px',
                        background: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      <div className="announcement-content-left" style={{ flex: 1, textAlign: 'left', paddingRight: '24px' }}>
                        
                        {/* Status Badge Bullet */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <span style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: isUrgentType ? '#ef4444' : isArchivedType ? '#94a3b8' : '#22c55e',
                            display: 'inline-block'
                          }}></span>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '800', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            color: isUrgentType ? '#ef4444' : isArchivedType ? '#64748b' : '#22c55e'
                          }}>
                            {isUrgentType ? '! Urgent' : isArchivedType ? 'Archived' : 'Live'}
                          </span>
                        </div>

                        {/* Title & Meta Info */}
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>{item.title}</h3>
                        <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                          <span style={{ textTransform: 'uppercase', color: '#d97706', marginRight: '6px' }}>[{item.category}]</span> 
                          {item.date}
                        </p>

                        {/* Content text */}
                        <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: '1.6', fontWeight: '500' }}>{item.content}</p>
                      </div>

                      {/* Right Action Button */}
                      {!isArchivedType ? (
                        <button 
                          className="btn-edit-row" 
                          onClick={() => handleOpenEdit(item)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            padding: '8px 16px', 
                            borderRadius: '6px', 
                            border: '1.5px solid #cbd5e1', 
                            background: '#eff6ff', 
                            color: '#1d4ed8', 
                            fontSize: '12.5px', 
                            fontWeight: '700', 
                            cursor: 'pointer',
                            minWidth: '90px',
                            justifyContent: 'center'
                          }}
                          title="Edit announcement"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pencil-icon">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                          Edit
                        </button>
                      ) : (
                        <button 
                          className="btn-edit-row" 
                          onClick={() => handleRestore(item.id, item.title)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            padding: '8px 16px', 
                            borderRadius: '6px', 
                            border: '1.5px solid #cbd5e1', 
                            background: '#eff6ff', 
                            color: '#1d4ed8', 
                            fontSize: '12.5px', 
                            fontWeight: '700', 
                            cursor: 'pointer',
                            minWidth: '90px',
                            justifyContent: 'center'
                          }}
                          title="Restore announcement to Live feed"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                          </svg>
                          Restore
                        </button>
                      )}

                    </div>
                  )
                })}
              </div>

              {/* Bottom Load Previous Dropdown Widget */}
              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <button 
                  className="nic-upload-select-btn" 
                  onClick={() => setShowPreviousAnnouncements(!showPreviousAnnouncements)}
                  style={{ borderRadius: '24px', padding: '10px 24px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  Load Previous Announcements
                  <span style={{ transform: showPreviousAnnouncements ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
                </button>

                {showPreviousAnnouncements && (
                  <div className="animate-zoom-in" style={{ marginTop: '20px', padding: '20px', borderRadius: '16px', border: '1.5px dashed #cbd5e1', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                    No older announcements archived in the history folder currently.
                  </div>
                )}
              </div>
            </>
          )}

          {/* Sub-view: CREATE (Create Announcement View Form) */}
          {viewMode === 'CREATE' && (
            <>
              <h2 className="content-greeting" style={{ marginBottom: '24px', textAlign: 'left' }}>Create Announcement</h2>

              <div className="dashboard-announcements-card" style={{ padding: '36px' }}>
                <form onSubmit={handlePublish}>
                  <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="apptTitle" style={{ fontWeight: '700', color: '#334155', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Title *</label>
                      <input 
                        type="text" 
                        id="apptTitle"
                        className="register-control" 
                        placeholder="Announcement title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="apptCategory" style={{ fontWeight: '700', color: '#334155', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Category *</label>
                      <input 
                        type="text" 
                        id="apptCategory"
                        className="register-control" 
                        placeholder="e.g. Health, Utilities, Education"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="apptContent" style={{ fontWeight: '700', color: '#334155', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Content *</label>
                      <textarea 
                        id="apptContent"
                        className="register-control" 
                        rows="5"
                        placeholder="Write your announcement content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ height: '140px', fontFamily: 'inherit', resize: 'none' }}
                        required
                      />
                    </div>

                    {/* Checkbox Urgent Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                      <input 
                        type="checkbox" 
                        id="urgentCheck" 
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        checked={isUrgent}
                        onChange={(e) => setIsUrgent(e.target.checked)}
                      />
                      <label htmlFor="urgentCheck" style={{ fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                        Mark as urgent announcement
                      </label>
                    </div>

                  </div>

                  {/* Form Action Publish Buttons */}
                  <div className="form-action-row" style={{ marginTop: '28px', justifyContent: 'flex-start' }}>
                    <button type="submit" className="btn-form-submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                      Publish Announcement
                    </button>
                  </div>

                </form>
              </div>
            </>
          )}

          {/* Sub-view: EDIT (Edit/Delete Announcement Form View) */}
          {viewMode === 'EDIT' && (
            <>
              <h2 className="content-greeting" style={{ marginBottom: '24px', textAlign: 'left' }}>Edit Announcement</h2>

              <div className="dashboard-announcements-card" style={{ padding: '36px' }}>
                <form onSubmit={handleSaveChanges}>
                  <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="editTitle" style={{ fontWeight: '700', color: '#334155', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Title *</label>
                      <input 
                        type="text" 
                        id="editTitle"
                        className="register-control" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="editCategory" style={{ fontWeight: '700', color: '#334155', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Category *</label>
                      <input 
                        type="text" 
                        id="editCategory"
                        className="register-control" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="editContent" style={{ fontWeight: '700', color: '#334155', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Content *</label>
                      <textarea 
                        id="editContent"
                        className="register-control" 
                        rows="5"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ height: '140px', fontFamily: 'inherit', resize: 'none' }}
                        required
                      />
                    </div>

                    {/* Checkbox Urgent Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                      <input 
                        type="checkbox" 
                        id="editUrgentCheck" 
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        checked={isUrgent}
                        onChange={(e) => setIsUrgent(e.target.checked)}
                      />
                      <label htmlFor="editUrgentCheck" style={{ fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                        Mark as urgent announcement
                      </label>
                    </div>

                  </div>

                  {/* Form Action buttons */}
                  <div className="form-action-row" style={{ marginTop: '32px', justifyContent: 'space-between', gap: '16px' }}>
                    <button type="button" className="btn-form-reset" onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete Announcement
                    </button>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" className="btn-form-reset" onClick={() => setViewMode('DASHBOARD')}>
                        Cancel
                      </button>
                      <button type="submit" className="btn-form-submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '150px', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Save Changes
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </>
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

export default OfficerAnnouncements
