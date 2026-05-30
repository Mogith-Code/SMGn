import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function ApplyCharacterCertificate({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Retrieve username and division/ID from navigation state if available (defaults to Nimal Perera)
  const successUser = location.state?.successUser || 'Nimal Perera'
  const userDivision = location.state?.division || '200324511540'

  // Form Field States
  const [divisionalSecretariat, setDivisionalSecretariat] = useState('')
  const [gnDivisionNumber, setGnDivisionNumber] = useState('')
  const [fullName, setFullName] = useState(successUser)
  const [age, setAge] = useState('')
  const [address, setAddress] = useState('')
  const [sex, setSex] = useState('')
  const [civilStatus, setCivilStatus] = useState('')
  const [nationality, setNationality] = useState('Sri Lankan')
  const [religion, setReligion] = useState('')
  const [occupation, setOccupation] = useState('')
  const [villagePeriod, setVillagePeriod] = useState('')
  const [electoralRegister, setElectoralRegister] = useState('')
  const [nicNumber, setNicNumber] = useState(userDivision.length === 12 || userDivision.length === 10 ? userDivision : '')
  const [fatherNameAddress1, setFatherNameAddress1] = useState('')
  const [fatherNameAddress2, setFatherNameAddress2] = useState('')
  const [purpose, setPurpose] = useState('')
  const [gnPeriod, setGnPeriod] = useState('')
  
  const [errorMessage, setErrorMessage] = useState('')

  const handleReset = () => {
    setDivisionalSecretariat('')
    setGnDivisionNumber('')
    setFullName('')
    setAge('')
    setAddress('')
    setSex('')
    setCivilStatus('')
    setNationality('Sri Lankan')
    setReligion('')
    setOccupation('')
    setVillagePeriod('')
    setElectoralRegister('')
    setNicNumber('')
    setFatherNameAddress1('')
    setFatherNameAddress2('')
    setPurpose('')
    setGnPeriod('')
    setErrorMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!divisionalSecretariat || !gnDivisionNumber || !fullName || !age || !address || !sex || !civilStatus || !nationality || !religion || !nicNumber || !purpose || !gnPeriod) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    setErrorMessage('')
    alert('Application submitted successfully!')
    
    // Redirect back to Certificates panel
    navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })
  }

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
              <span>Profile</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/household', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>Family & Household</span>
            </button>

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>Certificates</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/appointments', { state: { successUser, division: userDivision } })}>
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
            <button className="btn-back" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          </div>

          {/* Heading */}
          <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Application for Character Certificates</h2>

          {/* Form Container Card */}
          <div className="dashboard-announcements-card" style={{ padding: '32px' }}>
            
            {/* Warning block note */}
            <div className="form-alert-note">
              <span>This certificate is issued by the Grama Niladhari of the division in which the applicant resides is valid only for 06 months from the date issued.</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="register-grid">
                
                {/* Row 1 */}
                <div className="form-group">
                  <label htmlFor="divSecretariat">District and Divisional Secretary's Division :</label>
                  <input 
                    type="text" 
                    id="divSecretariat" 
                    className="register-control" 
                    value={divisionalSecretariat}
                    onChange={(e) => setDivisionalSecretariat(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gnDivNumber">Grama Niladhari Division and Number :</label>
                  <input 
                    type="text" 
                    id="gnDivNumber" 
                    className="register-control" 
                    value={gnDivisionNumber}
                    onChange={(e) => setGnDivisionNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Row 2 */}
                <div className="form-group">
                  <label htmlFor="fullName">Name :</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    className="register-control" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age :</label>
                  <input 
                    type="text" 
                    id="age" 
                    className="register-control" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>

                {/* Row 3 - Full Width */}
                <div className="form-group col-span-2">
                  <label htmlFor="address">Address</label>
                  <input 
                    type="text" 
                    id="address" 
                    className="register-control" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Row 4 */}
                <div className="form-group">
                  <label htmlFor="sex">Sex :</label>
                  <input 
                    type="text" 
                    id="sex" 
                    className="register-control" 
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="civilStatus">Civil Status :</label>
                  <input 
                    type="text" 
                    id="civilStatus" 
                    className="register-control" 
                    value={civilStatus}
                    onChange={(e) => setCivilStatus(e.target.value)}
                    required
                  />
                </div>

                {/* Row 5 */}
                <div className="form-group">
                  <label htmlFor="nationality">Whether Sri Lankan :</label>
                  <input 
                    type="text" 
                    id="nationality" 
                    className="register-control" 
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="religion">Religion :</label>
                  <input 
                    type="text" 
                    id="religion" 
                    className="register-control" 
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    required
                  />
                </div>

                {/* Row 6 */}
                <div className="form-group">
                  <label htmlFor="occupation">Present Occupation :</label>
                  <input 
                    type="text" 
                    id="occupation" 
                    className="register-control" 
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="villagePeriod">Period of residence in the village :</label>
                  <input 
                    type="text" 
                    id="villagePeriod" 
                    className="register-control" 
                    value={villagePeriod}
                    onChange={(e) => setVillagePeriod(e.target.value)}
                  />
                </div>

                {/* Row 7 */}
                <div className="form-group">
                  <label htmlFor="electoral">Number of the Electoral Register and Particulars of Registration :</label>
                  <input 
                    type="text" 
                    id="electoral" 
                    className="register-control" 
                    value={electoralRegister}
                    onChange={(e) => setElectoralRegister(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nic">National Identity Card No. :</label>
                  <input 
                    type="text" 
                    id="nic" 
                    className="register-control" 
                    value={nicNumber}
                    onChange={(e) => setNicNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Row 8 - Full Width Father details (Dual stacked input) */}
                <div className="form-group col-span-2">
                  <label htmlFor="fatherDetails">Name and Address of the Father :</label>
                  <input 
                    type="text" 
                    id="fatherDetails" 
                    className="register-control" 
                    style={{ marginBottom: '12px' }}
                    placeholder="Father's Name"
                    value={fatherNameAddress1}
                    onChange={(e) => setFatherNameAddress1(e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="register-control" 
                    placeholder="Father's Address"
                    value={fatherNameAddress2}
                    onChange={(e) => setFatherNameAddress2(e.target.value)}
                  />
                </div>

                {/* Row 9 - Full Width Purpose */}
                <div className="form-group col-span-2">
                  <label htmlFor="purpose">Purpose for which the certificate is required :</label>
                  <input 
                    type="text" 
                    id="purpose" 
                    className="register-control" 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>

                {/* Row 10 - GN Period (Left column) */}
                <div className="form-group">
                  <label htmlFor="gnPeriod">Period of residence in the Grama Niladhari Division :</label>
                  <input 
                    type="text" 
                    id="gnPeriod" 
                    className="register-control" 
                    value={gnPeriod}
                    onChange={(e) => setGnPeriod(e.target.value)}
                    required
                  />
                </div>

              </div>

              {errorMessage && (
                <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0', textAlign: 'left' }}>
                  {errorMessage}
                </p>
              )}

              {/* Submit / Reset Actions Row */}
              <div className="form-action-row">
                <button type="button" className="btn-form-reset" onClick={handleReset}>
                  Reset
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-action-icon">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                  </svg>
                </button>
                
                <button type="submit" className="btn-form-submit">
                  Submit
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-action-icon">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>

            </form>
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

export default ApplyCharacterCertificate
