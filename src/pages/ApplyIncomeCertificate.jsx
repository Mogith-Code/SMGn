import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function ApplyIncomeCertificate({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Retrieve username and division/ID from navigation state if available (defaults to Nimal Perera)
  const successUser = location.state?.successUser || 'Nimal Perera'
  const userDivision = location.state?.division || '200324511540'

  // Form Field States
  const [fullName, setFullName] = useState(successUser)
  const [gnDivisionNumber, setGnDivisionNumber] = useState('')
  const [address, setAddress] = useState('')
  
  // Income stream
  const [incomeStream, setIncomeStream] = useState('Laborer') // Paddy, Business, Laborer
  
  // Paddy/Banana/Coconut details
  const [landOwnerName, setLandOwnerName] = useState('')
  const [landAmount, setLandAmount] = useState('')
  const [grantSheetNumber, setGrantSheetNumber] = useState('')
  const [ownerIdentity, setOwnerIdentity] = useState('')
  
  // Paddy Financial calculations
  const [amountObtained, setAmountObtained] = useState('')
  const [expenses, setExpenses] = useState('')
  const [pricePerKg, setPricePerKg] = useState('')
  const [totalIncome, setTotalIncome] = useState('')
  const [annualIncome, setAnnualIncome] = useState('')
  
  // Businesses / brands details
  const [businessName, setBusinessName] = useState('')
  const [businessNature, setBusinessNature] = useState('')
  const [businessFileName, setBusinessFileName] = useState('')
  const [taxReceiptNumber, setTaxReceiptNumber] = useState('')
  
  // Business Income
  const [dailyMonthlyIncome, setDailyMonthlyIncome] = useState('')
  const [businessAnnualIncome, setBusinessAnnualIncome] = useState('')
  const [netIncome, setNetIncome] = useState('')

  // Carpenter/ Masonry/ hired laborer/ Other details
  const [dailySalary, setDailySalary] = useState('')
  const [hoursWorked, setHoursWorked] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [laborerAnnualIncome, setLaborerAnnualIncome] = useState('')
  
  const [purpose, setPurpose] = useState('')
  const [fileName, setFileName] = useState('')
  
  const [errorMessage, setErrorMessage] = useState('')

  const handleReset = () => {
    setFullName('')
    setGnDivisionNumber('')
    setAddress('')
    setIncomeStream('Laborer')
    
    // Paddy states
    setLandOwnerName('')
    setLandAmount('')
    setGrantSheetNumber('')
    setOwnerIdentity('')
    setAmountObtained('')
    setExpenses('')
    setPricePerKg('')
    setTotalIncome('')
    setAnnualIncome('')
    
    // Business states
    setBusinessName('')
    setBusinessNature('')
    setBusinessFileName('')
    setTaxReceiptNumber('')
    setDailyMonthlyIncome('')
    setBusinessAnnualIncome('')
    setNetIncome('')

    // Laborer states
    setDailySalary('')
    setHoursWorked('')
    setMonthlyIncome('')
    setLaborerAnnualIncome('')
    
    setPurpose('')
    setFileName('')
    setErrorMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (incomeStream === 'Paddy') {
      if (!fullName || !gnDivisionNumber || !address || !landOwnerName || !landAmount || !ownerIdentity || !amountObtained || !expenses || !pricePerKg || !totalIncome || !annualIncome || !purpose) {
        setErrorMessage('Please fill in all required fields.')
        return
      }
    } else if (incomeStream === 'Business') {
      if (!fullName || !gnDivisionNumber || !address || !businessName || !businessNature || !taxReceiptNumber || !dailyMonthlyIncome || !businessAnnualIncome || !netIncome || !purpose) {
        setErrorMessage('Please fill in all required fields.')
        return
      }
    } else if (incomeStream === 'Laborer') {
      if (!fullName || !gnDivisionNumber || !address || !dailySalary || !hoursWorked || !monthlyIncome || !laborerAnnualIncome || !purpose) {
        setErrorMessage('Please fill in all required fields.')
        return
      }
    } else {
      if (!fullName || !gnDivisionNumber || !address || !purpose) {
        setErrorMessage('Please fill in all required fields.')
        return
      }
    }

    setErrorMessage('')
    alert('Income Certificate Application submitted successfully!')
    
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

            <button className="menu-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile</span>
            </button>

            <button className="menu-btn">
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

            <button className="menu-btn" onClick={() => navigate('/login')}>
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

            <button className="menu-btn" onClick={() => navigate('/login')}>
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
          <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Application for Income Certificates</h2>

          {/* Form Container Card */}
          <div className="dashboard-announcements-card" style={{ padding: '32px' }}>
            
            {/* Warning block note */}
            <div className="form-alert-note">
              <span>A commission of 1.27% of the value of the income certificate is charged by the government.</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="register-grid">
                
                {/* Row 1 */}
                <div className="form-group">
                  <label htmlFor="fullName">Full name of the applicant :</label>
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

                {/* Row 2 - Address spans both */}
                <div className="form-group col-span-2">
                  <label htmlFor="address">Address :</label>
                  <input 
                    type="text" 
                    id="address" 
                    className="register-control" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Row 3 - Income Stream Radio Buttons */}
                <div className="form-group col-span-2">
                  <label style={{ marginBottom: '10px' }}>Income stream :</label>
                  <div className="form-radio-row">
                    <label className="radio-label-item">
                      <input 
                        type="radio" 
                        name="incomeStream" 
                        value="Paddy" 
                        checked={incomeStream === 'Paddy'}
                        onChange={() => setIncomeStream('Paddy')}
                      />
                      <span>Paddy/ Banana/ Coconut etc.</span>
                    </label>

                    <label className="radio-label-item">
                      <input 
                        type="radio" 
                        name="incomeStream" 
                        value="Business" 
                        checked={incomeStream === 'Business'}
                        onChange={() => setIncomeStream('Business')}
                      />
                      <span>Businesses/ brands</span>
                    </label>

                    <label className="radio-label-item">
                      <input 
                        type="radio" 
                        name="incomeStream" 
                        value="Laborer" 
                        checked={incomeStream === 'Laborer'}
                        onChange={() => setIncomeStream('Laborer')}
                      />
                      <span>Carpenter/ Masonry/ hired laborer/ Other</span>
                    </label>
                  </div>
                </div>

                {/* DYNAMIC FORM SEGMENT: Active stream defaults to Paddy/Banana/Coconut */}
                {incomeStream === 'Paddy' && (
                  <>
                    {/* Row 4 */}
                    <div className="form-group">
                      <label htmlFor="landOwnerName">Name of the land owner :</label>
                      <input 
                        type="text" 
                        id="landOwnerName" 
                        className="register-control" 
                        value={landOwnerName}
                        onChange={(e) => setLandOwnerName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="landAmount">Amount of land :</label>
                      <input 
                        type="text" 
                        id="landAmount" 
                        className="register-control" 
                        value={landAmount}
                        onChange={(e) => setLandAmount(e.target.value)}
                        required
                      />
                    </div>

                    {/* Row 5 - File Upload Box */}
                    <div className="form-group">
                      <label htmlFor="uploadSheet">License/ Permit/ Grant sheet number (Upload a certified copy) :</label>
                      
                      <div className="upload-box-placeholder">
                        <input 
                          type="file" 
                          id="uploadSheet"
                          className="file-hidden-input"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setFileName(e.target.files[0].name)
                              setGrantSheetNumber(e.target.files[0].name)
                            }
                          }}
                        />
                        <label htmlFor="uploadSheet" className="upload-box-label">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" className="upload-svg-icon">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span className="upload-helper-txt">
                            {fileName ? fileName : 'Upload Certified Document'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="identityApplicant">The identity of the applicant as the land owner :</label>
                      <input 
                        type="text" 
                        id="identityApplicant" 
                        className="register-control" 
                        value={ownerIdentity}
                        onChange={(e) => setOwnerIdentity(e.target.value)}
                        required
                      />
                    </div>

                    {/* Financial details divider */}
                    <div className="form-group col-span-2">
                      <h4 className="income-section-divider">Income:</h4>
                    </div>

                    {/* Row 7 */}
                    <div className="form-group">
                      <label htmlFor="amountObtained">Amount of paddy/ banana/ coconut etc. obtained :</label>
                      <input 
                        type="text" 
                        id="amountObtained" 
                        className="register-control" 
                        value={amountObtained}
                        onChange={(e) => setAmountObtained(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="expenses">Expenses (Rs.) :</label>
                      <input 
                        type="text" 
                        id="expenses" 
                        className="register-control" 
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                        required
                      />
                    </div>

                    {/* Row 8 */}
                    <div className="form-group">
                      <label htmlFor="priceKg">Price per kilogram (Rs.) :</label>
                      <input 
                        type="text" 
                        id="priceKg" 
                        className="register-control" 
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group"></div>

                    {/* Row 9 */}
                    <div className="form-group">
                      <label htmlFor="totalIncomeVal">Total Income (Rs.) :</label>
                      <input 
                        type="text" 
                        id="totalIncomeVal" 
                        className="register-control" 
                        value={totalIncome}
                        onChange={(e) => setTotalIncome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group"></div>

                    {/* Row 10 */}
                    <div className="form-group">
                      <label htmlFor="totalAnnual">Total annual income (Rs.) :</label>
                      <input 
                        type="text" 
                        id="totalAnnual" 
                        className="register-control" 
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group"></div>
                  </>
                )}

                {incomeStream === 'Business' && (
                  <>
                    {/* Row 4: Business details */}
                    <div className="form-group">
                      <label htmlFor="businessName">Name of the business :</label>
                      <input 
                        type="text" 
                        id="businessName" 
                        className="register-control" 
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="businessNature">Nature of the business :</label>
                      <input 
                        type="text" 
                        id="businessNature" 
                        className="register-control" 
                        value={businessNature}
                        onChange={(e) => setBusinessNature(e.target.value)}
                        required
                      />
                    </div>

                    {/* Row 5: Business upload and Tax Receipt */}
                    <div className="form-group">
                      <label htmlFor="uploadReg">Business registration number (Upload a certified business registration certificate copy):</label>
                      
                      <div className="upload-box-placeholder" style={{ minHeight: '120px' }}>
                        <input 
                          type="file" 
                          id="uploadReg"
                          className="file-hidden-input"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setBusinessFileName(e.target.files[0].name)
                            }
                          }}
                        />
                        <label htmlFor="uploadReg" className="upload-box-label" style={{ flexDirection: 'column', gap: '8px' }}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="upload-svg-icon">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                            <polyline points="9 15 12 12 15 15"></polyline>
                          </svg>
                          <span className="upload-helper-txt">
                            {businessFileName ? businessFileName : ''}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="taxReceipt">Receipt number of tax paid to the Pradeshiya Sabha :</label>
                      <input 
                        type="text" 
                        id="taxReceipt" 
                        className="register-control" 
                        value={taxReceiptNumber}
                        onChange={(e) => setTaxReceiptNumber(e.target.value)}
                        required
                      />
                    </div>

                    {/* Financial details divider */}
                    <div className="form-group col-span-2">
                      <h4 className="income-section-divider">Income:</h4>
                    </div>

                    {/* Financial Calculations */}
                    <div className="form-group">
                      <label htmlFor="dailyMonthlyIncome">Daily/Monthly Income (Rs.) :</label>
                      <input 
                        type="text" 
                        id="dailyMonthlyIncome" 
                        className="register-control" 
                        value={dailyMonthlyIncome}
                        onChange={(e) => setDailyMonthlyIncome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group"></div>

                    <div className="form-group">
                      <label htmlFor="businessAnnualIncome">Annual income (Rs.) :</label>
                      <input 
                        type="text" 
                        id="businessAnnualIncome" 
                        className="register-control" 
                        value={businessAnnualIncome}
                        onChange={(e) => setBusinessAnnualIncome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group"></div>

                    <div className="form-group">
                      <label htmlFor="netIncome">Net income (Rs.) :</label>
                      <input 
                        type="text" 
                        id="netIncome" 
                        className="register-control" 
                        value={netIncome}
                        onChange={(e) => setNetIncome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group"></div>
                  </>
                )}

                {/* Dynamic form segment for Carpenter/Masonry/Laborer/Other */}
                {incomeStream === 'Laborer' && (
                  <>
                    {/* Row 4: Laborer details */}
                    <div className="form-group">
                      <label htmlFor="dailySalary">Daily Salary (Rs.) :</label>
                      <input 
                        type="text" 
                        id="dailySalary" 
                        className="register-control" 
                        value={dailySalary}
                        onChange={(e) => setDailySalary(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="hoursWorked">Number of hours worked per week :</label>
                      <input 
                        type="text" 
                        id="hoursWorked" 
                        className="register-control" 
                        value={hoursWorked}
                        onChange={(e) => setHoursWorked(e.target.value)}
                        required
                      />
                    </div>

                    {/* Financial details divider */}
                    <div className="form-group col-span-2">
                      <h4 className="income-section-divider">Income:</h4>
                    </div>

                    {/* Financial Calculations */}
                    <div className="form-group">
                      <label htmlFor="monthlyIncome">Monthly Income (Rs.) :</label>
                      <input 
                        type="text" 
                        id="monthlyIncome" 
                        className="register-control" 
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group"></div>

                    <div className="form-group">
                      <label htmlFor="laborerAnnualIncome">Annual income (Rs.) :</label>
                      <input 
                        type="text" 
                        id="laborerAnnualIncome" 
                        className="register-control" 
                        value={laborerAnnualIncome}
                        onChange={(e) => setLaborerAnnualIncome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group"></div>
                  </>
                )}

                {/* Row 11 - Purpose spans left or full */}
                <div className="form-group col-span-2" style={{ maxWidth: '400px' }}>
                  <label htmlFor="requireCert">Need to require the income certificate :</label>
                  <input 
                    type="text" 
                    id="requireCert" 
                    className="register-control" 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
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
              <div className="form-action-row" style={{ marginTop: '24px' }}>
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

export default ApplyIncomeCertificate
