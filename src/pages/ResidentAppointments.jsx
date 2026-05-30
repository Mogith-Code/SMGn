import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function ResidentAppointments({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Retrieve username and division/ID from navigation state if available (defaults to Nimal Perera)
  const successUser = location.state?.successUser || 'Nimal Perera'
  const userDivision = location.state?.division || 'Colombo'
  const firstName = successUser.split(' ')[0]

  // Booking states
  const [appointments, setAppointments] = useState([])
  const [selectedDay, setSelectedDay] = useState(16) // Default selected day May 16 matching screenshot
  const [isBookingMode, setIsBookingMode] = useState(false)

  // Booking Form States
  const [purpose, setPurpose] = useState('Certificate Collection')
  const [bookDay, setBookDay] = useState(17)
  const [bookTime, setBookTime] = useState('2:00 PM')
  const [officerName, setOfficerName] = useState('Kamal Silva')
  const [contactNumber, setContactNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Load appointments from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('smartgn_appointments')
    if (saved) {
      setAppointments(JSON.parse(saved))
    } else {
      // Seed default appointments matching the counts: 5 Pending, 3 Approved
      const defaultAppointments = [
        {
          id: 1,
          purpose: 'Certificate Collection',
          date: 'Thursday, 15 May 2026',
          day: 15,
          time: '2:00 PM',
          officer: 'Kamal Silva',
          status: 'Approved'
        },
        {
          id: 2,
          purpose: 'Address Verification',
          date: 'Friday, 08 May 2026',
          day: 8,
          time: '11:00 AM',
          officer: 'Kamala Silva',
          status: 'Approved'
        },
        {
          id: 3,
          purpose: 'Land Valuation Report',
          date: 'Friday, 22 May 2026',
          day: 22,
          time: '3:00 PM',
          officer: 'Nimal Perera',
          status: 'Approved'
        },
        {
          id: 4,
          purpose: 'Allowance Inquiry',
          date: 'Saturday, 16 May 2026',
          day: 16,
          time: '10:30 AM',
          officer: 'Kamal Silva',
          status: 'Pending'
        },
        {
          id: 5,
          purpose: 'General Inquiry',
          date: 'Wednesday, 06 May 2026',
          day: 6,
          time: '9:00 AM',
          officer: 'Kamala Perera',
          status: 'Pending'
        },
        {
          id: 6,
          purpose: 'Income Certificate Verification',
          date: 'Tuesday, 12 May 2026',
          day: 12,
          time: '1:30 PM',
          officer: 'Kamal Silva',
          status: 'Pending'
        },
        {
          id: 7,
          purpose: 'Signature Certification',
          date: 'Wednesday, 20 May 2026',
          day: 20,
          time: '11:30 AM',
          officer: 'Kamala Silva',
          status: 'Pending'
        },
        {
          id: 8,
          purpose: 'Identity Certification',
          date: 'Thursday, 28 May 2026',
          day: 28,
          time: '2:30 PM',
          officer: 'Kamal Silva',
          status: 'Pending'
        }
      ]
      localStorage.setItem('smartgn_appointments', JSON.stringify(defaultAppointments))
      setAppointments(defaultAppointments)
    }
  }, [])

  // Calculate dynamic stats
  const pendingCount = appointments.filter(item => item.status === 'Pending').length
  const approvedCount = appointments.filter(item => item.status === 'Approved').length

  // Find active appointment on selected day
  const activeAppointment = appointments.find(item => item.day === selectedDay)

  // Handle Cancel Appointment
  const handleCancelAppointment = (id) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this appointment?')
    if (confirmCancel) {
      const updated = appointments.filter(item => item.id !== id)
      localStorage.setItem('smartgn_appointments', JSON.stringify(updated))
      setAppointments(updated)
      alert('Appointment cancelled successfully.')
    }
  }

  // Handle Book New Appointment
  const handleCreateBooking = (e) => {
    e.preventDefault()

    if (!contactNumber) {
      setErrorMessage('Please enter your contact phone number.')
      return
    }

    setErrorMessage('')

    // Date construction
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dateObj = new Date(2026, 4, bookDay) // May 2026
    const dayOfWeek = weekdays[dateObj.getDay()]
    const formattedDate = `${dayOfWeek}, ${bookDay < 10 ? '0' + bookDay : bookDay} May 2026`

    const nextId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1

    const newBooking = {
      id: nextId,
      purpose: purpose,
      date: formattedDate,
      day: parseInt(bookDay),
      time: bookTime,
      officer: officerName,
      status: 'Pending'
    }

    const updated = [...appointments, newBooking]
    localStorage.setItem('smartgn_appointments', JSON.stringify(updated))
    setAppointments(updated)
    
    // Select the newly booked day
    setSelectedDay(parseInt(bookDay))
    setIsBookingMode(false)
    setContactNumber('')
    alert('Appointment requested successfully! Pending Grama Niladhari review.')
  }

  // Calendar cells generation for May 2026
  // Sunday 31 is wrapped to row 1, Mon/Tue/Wed/Thu are empty, Fri 01, Sat 02
  const calendarCells = [
    { day: 31, isCurrent: true, wrapped: true },
    { day: null, isCurrent: false },
    { day: null, isCurrent: false },
    { day: null, isCurrent: false },
    { day: null, isCurrent: false },
    { day: 1, isCurrent: true },
    { day: 2, isCurrent: true },
    
    { day: 3, isCurrent: true },
    { day: 4, isCurrent: true },
    { day: 5, isCurrent: true },
    { day: 6, isCurrent: true },
    { day: 7, isCurrent: true },
    { day: 8, isCurrent: true },
    { day: 9, isCurrent: true },
    
    { day: 10, isCurrent: true },
    { day: 11, isCurrent: true },
    { day: 12, isCurrent: true },
    { day: 13, isCurrent: true },
    { day: 14, isCurrent: true },
    { day: 15, isCurrent: true },
    { day: 16, isCurrent: true },
    
    { day: 17, isCurrent: true },
    { day: 18, isCurrent: true },
    { day: 19, isCurrent: true },
    { day: 20, isCurrent: true },
    { day: 21, isCurrent: true },
    { day: 22, isCurrent: true },
    { day: 23, isCurrent: true },
    
    { day: 24, isCurrent: true },
    { day: 25, isCurrent: true },
    { day: 26, isCurrent: true },
    { day: 27, isCurrent: true },
    { day: 28, isCurrent: true },
    { day: 29, isCurrent: true },
    { day: 30, isCurrent: true }
  ]

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
              <span>Home</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>Dashboard</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/profile', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile & Settings</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/household', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>Family & Household</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>Certificates Services</span>
            </button>

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Appointments</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/allowances', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>Allowance Programs</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/disaster', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Disaster Report</span>
            </button>

            <button className="menu-btn">
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
          
          {/* Back button */}
          <div className="form-header" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
            <button className="btn-back" onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          </div>

          <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Appointments</h2>

          {/* Centered Stats Widget Cards */}
          <div className="stats-grid-appointments">
            <div className="stat-card-appointment">
              <div className="stat-appointment-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="stat-appointment-label">Pending appointment requests</span>
              <span className="stat-appointment-value">{pendingCount}</span>
            </div>

            <div className="stat-card-appointment">
              <div className="stat-appointment-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="stat-appointment-label">Approved appointment requests</span>
              <span className="stat-appointment-value">{approvedCount}</span>
            </div>

            <div className="stat-card-appointment action-card" onClick={() => setIsBookingMode(!isBookingMode)}>
              <div className="stat-appointment-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <span className="stat-appointment-label">Book an appointment</span>
              <span className="stat-appointment-value">{isBookingMode ? 'Close Form' : 'Book Now'}</span>
            </div>
          </div>

          {/* Interactive Layout Content */}
          <div className="appointments-layout">
            
            {/* Left Box: Calendar Widget or Booking Form */}
            {!isBookingMode ? (
              <div className="calendar-widget-card">
                <div className="calendar-widget-header">
                  <button className="calendar-nav-btn">{"<"}</button>
                  <span>May 2026</span>
                  <button className="calendar-nav-btn">{">"}</button>
                </div>

                <div className="calendar-grid">
                  {/* Weekdays headers */}
                  <span className="calendar-weekday-label">Sun</span>
                  <span className="calendar-weekday-label">Mon</span>
                  <span className="calendar-weekday-label">Tue</span>
                  <span className="calendar-weekday-label">Wed</span>
                  <span className="calendar-weekday-label">Thu</span>
                  <span className="calendar-weekday-label">Fri</span>
                  <span className="calendar-weekday-label">Sat</span>

                  {/* Calendar Days */}
                  {calendarCells.map((cell, index) => {
                    const hasBooking = appointments.some(app => app.day === cell.day)
                    const isSelected = selectedDay === cell.day
                    
                    if (cell.day === null) {
                      return <span key={index} className="calendar-day-cell other-month"></span>
                    }

                    return (
                      <span
                        key={index}
                        className={`calendar-day-cell ${cell.wrapped ? 'other-month' : ''} ${hasBooking ? 'has-booking' : ''} ${isSelected ? 'selected-day' : ''}`}
                        onClick={() => cell.day && setSelectedDay(cell.day)}
                      >
                        {cell.day < 10 ? '0' + cell.day : cell.day}
                      </span>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="dashboard-announcements-card" style={{ padding: '32px' }}>
                <h3 className="card-inner-title" style={{ borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
                  Request New Appointment
                </h3>

                <form onSubmit={handleCreateBooking}>
                  <div className="form-grid" style={{ gap: '16px' }}>
                    
                    <div className="form-group">
                      <label htmlFor="purposeSelect">Appointment Purpose</label>
                      <div className="select-wrapper">
                        <select 
                          id="purposeSelect"
                          className="register-control register-select"
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          required
                        >
                          <option value="Certificate Collection">Certificate Collection</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Family Details Verification">Family Details Verification</option>
                          <option value="Allowance Inquiry">Allowance Inquiry</option>
                          <option value="Land Dispute Negotiation">Land Dispute Negotiation</option>
                        </select>
                        <span className="select-arrow">▼</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="daySelect">Date in May 2026</label>
                      <div className="select-wrapper">
                        <select 
                          id="daySelect"
                          className="register-control register-select"
                          value={bookDay}
                          onChange={(e) => setBookDay(parseInt(e.target.value))}
                          required
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>May {d < 10 ? '0' + d : d}, 2026</option>
                          ))}
                        </select>
                        <span className="select-arrow">▼</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="timeSelect">Preferred Time Slot</label>
                      <div className="select-wrapper">
                        <select 
                          id="timeSelect"
                          className="register-control register-select"
                          value={bookTime}
                          onChange={(e) => setBookTime(e.target.value)}
                          required
                        >
                          <option value="9:00 AM">9:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                        </select>
                        <span className="select-arrow">▼</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="officerSelect">Assigned Officer</label>
                      <div className="select-wrapper">
                        <select 
                          id="officerSelect"
                          className="register-control register-select"
                          value={officerName}
                          onChange={(e) => setOfficerName(e.target.value)}
                          required
                        >
                          <option value="Kamal Silva">Grama Niladhari Kamal Silva</option>
                          <option value="Kamala Silva">Assistant Officer Kamala Silva</option>
                          <option value="Nimal Perera">Officer Nimal Perera</option>
                        </select>
                        <span className="select-arrow">▼</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="contactPhone">Your Phone Number</label>
                      <input 
                        type="text" 
                        id="contactPhone"
                        className="register-control"
                        placeholder="07XXXXXXXX"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        required
                      />
                    </div>

                  </div>

                  {errorMessage && (
                    <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0', textAlign: 'left' }}>
                      {errorMessage}
                    </p>
                  )}

                  <div className="form-action-row" style={{ marginTop: '24px' }}>
                    <button type="button" className="btn-form-reset" onClick={() => setIsBookingMode(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-form-submit">
                      Confirm Appointment Booking
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Right Box: Appointment Summary Card */}
            <div className="appointment-summary-outer">
              <h3 className="appointment-summary-header">Appointment Summary</h3>

              {activeAppointment ? (
                <div>
                  <div className="appointment-summary-box">
                    <div className="appointment-summary-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>

                    <div className="appointment-summary-details">
                      <div>
                        <h4 className="appointment-summary-title">{activeAppointment.purpose}</h4>
                        <span className={`badge-status ${activeAppointment.status === 'Approved' ? 'approved' : 'pending'}`} style={{ padding: '2px 10px', fontSize: '10.5px' }}>
                          {activeAppointment.status}
                        </span>
                      </div>

                      <div className="summary-detail-row">
                        <div className="summary-detail-item">
                          <span className="summary-label">Date</span>
                          <span className="summary-value">{activeAppointment.date}</span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">Time</span>
                          <span className="summary-value">{activeAppointment.time}</span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">Officer</span>
                          <span className="summary-value">{activeAppointment.officer}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="appointment-actions-row">
                    <button 
                      className="btn-appointment-cancel"
                      onClick={() => handleCancelAppointment(activeAppointment.id)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn-appointment-action"
                      onClick={() => alert('Appointment rescheduling initiated. Please pick a new date/time.')}
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-summary-placeholder">
                  <div className="placeholder-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '13.5px' }}>No Appointments scheduled for May {selectedDay < 10 ? '0' + selectedDay : selectedDay}, 2026.</p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Click highlighted days in amber to check booking summaries, or click "Book Now" to schedule a meeting.</p>
                </div>
              )}
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

export default ResidentAppointments
