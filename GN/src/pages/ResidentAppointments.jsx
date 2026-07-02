import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function ResidentAppointments({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state or localStorage (defaults to Nimal Perera)
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'
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

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments/resident', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load appointments.')
      const data = await response.json()
      const formatted = data.map(item => {
        // Parse day from SQL date (e.g. '2026-05-15')
        const parts = item.date.split('-')
        const dayVal = parts.length === 3 ? parseInt(parts[2]) : 15
        
        // Format date string for display
        const dateObj = new Date(item.date)
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const formattedDate = `${weekdays[dateObj.getDay()] || 'Thursday'}, ${dayVal < 10 ? '0' + dayVal : dayVal} ${months[dateObj.getMonth()] || 'May'} ${dateObj.getFullYear() || '2026'}`

        return {
          id: item.appointment_id,
          purpose: item.purpose,
          date: formattedDate,
          day: dayVal,
          time: item.time,
          officer: item.officer_name || 'Kamal Silva',
          status: item.status === 'PENDING' ? 'Pending' : item.status === 'CONFIRMED' ? 'Approved' : 'Declined'
        }
      })
      setAppointments(formatted)
    } catch (err) {
      console.error(err)
      const saved = localStorage.getItem('smartgn_appointments')
      if (saved) setAppointments(JSON.parse(saved))
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  // Calculate dynamic stats
  const pendingCount = appointments.filter(item => item.status === 'Pending').length
  const approvedCount = appointments.filter(item => item.status === 'Approved').length

  // Find active appointment on selected day
  const activeAppointment = appointments.find(item => item.day === selectedDay)

  // Handle Cancel Appointment
  const handleCancelAppointment = (id) => {
    alert('Appointment cancellation requested. Please contact your Grama Niladhari division officer.')
  }

  // Handle Book New Appointment
  const handleCreateBooking = async (e) => {
    e.preventDefault()

    if (!contactNumber) {
      setErrorMessage('Please enter your contact phone number.')
      return
    }

    setErrorMessage('')

    try {
      const dateString = `2026-05-${String(bookDay).padStart(2, '0')}`

      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          date: dateString,
          time: bookTime,
          purpose: purpose
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to book appointment.')
      }

      setSelectedDay(parseInt(bookDay))
      setIsBookingMode(false)
      setContactNumber('')
      loadAppointments()
      alert('Appointment requested successfully! Pending Grama Niladhari review.')
    } catch (err) {
      setErrorMessage(err.message || 'Error booking appointment.')
    }
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
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col items-stretch border border-red-500 text-center">
      
      {/* 1. Header */}
      <header className="flex justify-between items-center py-3 px-16 bg-white border-b-[1.5px] border-slate-300 sticky top-0 z-[100] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="landing-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-smart">Smart</span>
          <span className="logo-gn">GN</span>
          <p className="logo-subtext">{t.tagline}</p>
        </div>

        <div className="flex items-center gap-7">
          <LanguageSelector />

          {/* Notifications */}
          <div className="relative cursor-pointer text-slate-600 flex items-center justify-center transition-colors duration-200">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-[1.5px] border-white">2</span>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end text-right leading-[1.35]">
              <span className="text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.5px]">{userDivision}</span>
              <span className="text-[13.5px] font-bold text-[#1a2e56]">{successUser}</span>
            </div>
            <div className="w-[38px] h-[38px] rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border-[1.5px] border-slate-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Layout */}
      <div className="flex gap-[20px]">
        
        {/* Sidebar Nav */}
        <aside className="w-[280px] bg-white border-r border-[#2D37482D] py-[60px] pr-[20px]">
          <nav className="flex flex-col gap-[5px]">
            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>{t.home}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>{t.dashboard}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/profile', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{t.profile}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/household', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button className="bg-[#1c355e] flex gap-3.5 py-3 px-7 items-center text-white rounded-r-full cursor-pointer shadow-[0_4px_10px_rgba(28,53,94,0.15)]" onClick={() => navigate('/dashboard/resident/appointments', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/allowances', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/disaster', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>{t.disaster}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/announcements', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span>{t.announcements}</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel Content */}
        <main className="flex-grow bg-slate-50 py-8 px-14 flex flex-col gap-6 text-left relative">
          
          {/* Back button */}
          <div className="flex justify-start mb-4">
            <button className="bg-transparent border-none text-gray-500 text-sm font-medium cursor-pointer flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-700" onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          </div>

          <h2 className="mb-6">Appointments</h2>

          {/* Centered Stats Widget Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white border-[1.5px] border-slate-300 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3.5 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="text-[13.5px] font-semibold text-slate-600 leading-[1.4] mb-2">Pending appointment requests</span>
              <span className="text-2xl font-extrabold text-slate-800">{pendingCount}</span>
            </div>

            <div className="bg-white border-[1.5px] border-slate-300 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3.5 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="text-[13.5px] font-semibold text-slate-600 leading-[1.4] mb-2">Approved appointment requests</span>
              <span className="text-2xl font-extrabold text-slate-800">{approvedCount}</span>
            </div>

            <div className="stat-card-appointment action-card" onClick={() => setIsBookingMode(!isBookingMode)}>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3.5 flex-shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <span className="text-[13.5px] font-semibold text-slate-600 leading-[1.4] mb-2">Book an appointment</span>
              <span className="text-2xl font-extrabold text-slate-800">{isBookingMode ? 'Close Form' : 'Book Now'}</span>
            </div>
          </div>

          {/* Interactive Layout Content */}
          <div className="grid-cols-1 gap-6">
            
            {/* Left Box: Calendar Widget or Booking Form */}
            {!isBookingMode ? (
              <div className="bg-white border-[1.5px] border-slate-300 rounded-2xl p-8 shadow-sm w-full">
                <div className="flex justify-center items-center gap-12 mb-6 text-[15px] font-[750] text-[#1a2e56]">
                  <button className="bg-transparent border-none text-base font-extrabold text-slate-600 cursor-pointer py-1 px-2 rounded transition-all duration-200 outline-none focus:outline-none hover:bg-slate-100 hover:text-slate-800">{"<"}</button>
                  <span>May 2026</span>
                  <button className="bg-transparent border-none text-base font-extrabold text-slate-600 cursor-pointer py-1 px-2 rounded transition-all duration-200 outline-none focus:outline-none hover:bg-slate-100 hover:text-slate-800">{">"}</button>
                </div>

                <div className="grid grid-cols-7 gap-3 w-full text-center">
                  {/* Weekdays headers */}
                  <span className="text-[13.5px] font-[750] text-[#1a2e56] pb-2 border-b-[1.5px] border-slate-300 mb-2">Sun</span>
                  <span className="text-[13.5px] font-[750] text-[#1a2e56] pb-2 border-b-[1.5px] border-slate-300 mb-2">Mon</span>
                  <span className="text-[13.5px] font-[750] text-[#1a2e56] pb-2 border-b-[1.5px] border-slate-300 mb-2">Tue</span>
                  <span className="text-[13.5px] font-[750] text-[#1a2e56] pb-2 border-b-[1.5px] border-slate-300 mb-2">Wed</span>
                  <span className="text-[13.5px] font-[750] text-[#1a2e56] pb-2 border-b-[1.5px] border-slate-300 mb-2">Thu</span>
                  <span className="text-[13.5px] font-[750] text-[#1a2e56] pb-2 border-b-[1.5px] border-slate-300 mb-2">Fri</span>
                  <span className="text-[13.5px] font-[750] text-[#1a2e56] pb-2 border-b-[1.5px] border-slate-300 mb-2l">Sat</span>

                  {/* Calendar Days */}
                  {calendarCells.map((cell, index) => {
                    const hasBooking = appointments.some(app => app.day === cell.day)
                    const isSelected = selectedDay === cell.day
                    
                    if (cell.day === null) {
                      return <span key={index} className="text-slate-300 cursor-not-allowed"></span>
                    }

                    return (
                      <span
                        key={index}
                        className={`aspect-[1.4] flex flex-col items-center justify-center text-[13.5px] font-semibold text-slate-800 cursor-pointer rounded-lg transition-all duration-200 relative border-[1.5px] border-transparent select-none hover:bg-slate-100 ${cell.wrapped ? 'other-month' : ''} ${hasBooking ? 'has-booking' : ''} ${isSelected ? 'selected-day' : ''}`}
                        onClick={() => cell.day && setSelectedDay(cell.day)}
                      >
                        {cell.day < 10 ? '0' + cell.day : cell.day}
                      </span>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8">
                <h3 className="border-b-[1.5px] border-slate-300 pb-3 mb-5">
                  Request New Appointment
                </h3>

                <form onSubmit={handleCreateBooking}>
                  <div className="gap-4">
                    
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
