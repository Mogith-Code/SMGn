import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'

function ResidentHousehold({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state if available (defaults to Nimal Perera)
  const successUser = location.state?.successUser || 'Nimal Perera'
  const userDivision = location.state?.division || 'Colombo'
  const firstName = successUser.split(' ')[0]

  // View modes: 'VIEW' | 'EDIT_FAMILY' | 'EDIT_HOUSEHOLD'
  const [viewMode, setViewMode] = useState('VIEW')

  // Household Details State
  const [household, setHousehold] = useState({
    number: '123456',
    address: 'Colombo',
    landSize: '2 acres',
    landOwner: 'Kumara'
  })

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState([])
  
  // Member Form Field States
  const [fullName, setFullName] = useState('')
  const [nic, setNic] = useState('')
  const [age, setAge] = useState('')
  const [occupation, setOccupation] = useState('')
  const [relationship, setRelationship] = useState('')
  const [editingMemberId, setEditingMemberId] = useState(null)
  
  // Household Property Form States
  const [houseNumberInput, setHouseNumberInput] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [landSizeInput, setLandSizeInput] = useState('')
  const [landOwnerInput, setLandOwnerInput] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  // Load data from localStorage on mount
  useEffect(() => {
    // 1. Load family members
    const savedFamily = localStorage.getItem('smartgn_family_members')
    if (savedFamily) {
      setFamilyMembers(JSON.parse(savedFamily))
    } else {
      const defaultFamily = [
        {
          id: 1,
          fullName: 'Dissanayake Mudiyanselage Nimal Perera',
          nic: '197215644896',
          age: 54,
          occupation: 'Government Officer',
          relationship: 'Father'
        },
        {
          id: 2,
          fullName: 'Dissanayake Kusumawathi Perera',
          nic: '197684511520',
          age: 50,
          occupation: 'Housewife',
          relationship: 'Mother'
        },
        {
          id: 3,
          fullName: 'Dissanayake Kasun Perera',
          nic: '200215421530',
          age: 24,
          occupation: 'Engineer',
          relationship: 'Son'
        },
        {
          id: 4,
          fullName: 'Dissanayake Sanduni Perera',
          nic: 'None',
          age: 12,
          occupation: 'Student',
          relationship: 'Daughter'
        },
        {
          id: 5,
          fullName: 'Dissanayake Piyumi Perera',
          nic: 'None',
          age: 8,
          occupation: 'Student',
          relationship: 'Daughter'
        }
      ]
      localStorage.setItem('smartgn_family_members', JSON.stringify(defaultFamily))
      setFamilyMembers(defaultFamily)
    }

    // 2. Load household details
    const savedHouse = localStorage.getItem('smartgn_household')
    if (savedHouse) {
      setHousehold(JSON.parse(savedHouse))
    } else {
      const defaultHouse = {
        number: '123456',
        address: 'Colombo',
        landSize: '2 acres',
        landOwner: 'Kumara'
      }
      localStorage.setItem('smartgn_household', JSON.stringify(defaultHouse))
      setHousehold(defaultHouse)
    }
  }, [])

  // Calculate dynamic stats
  const totalMembers = familyMembers.length
  const adultMembers = familyMembers.filter(m => parseInt(m.age) >= 18).length
  const childrenMembers = familyMembers.filter(m => parseInt(m.age) < 18).length

  // Switch to Editing family details
  const handleOpenEditFamily = () => {
    handleResetFamilyForm()
    setViewMode('EDIT_FAMILY')
  }

  // Switch to Editing household details
  const handleOpenEditHousehold = () => {
    setHouseNumberInput(household.number)
    setAddressInput(household.address)
    setLandSizeInput(household.landSize)
    setLandOwnerInput(household.landOwner)
    setViewMode('EDIT_HOUSEHOLD')
  }

  // Save Household Property updates
  const handleSaveHousehold = (e) => {
    e.preventDefault()
    const updated = {
      number: houseNumberInput,
      address: addressInput,
      landSize: landSizeInput,
      landOwner: landOwnerInput
    }
    localStorage.setItem('smartgn_household', JSON.stringify(updated))
    setHousehold(updated)
    setViewMode('VIEW')
    alert('Household details updated successfully.')
  }

  // Add or Save Family Member
  const handleSaveFamilyMember = (e) => {
    e.preventDefault()

    if (!fullName || !age || !relationship) {
      setErrorMessage('Please fill in Name, Age, and Relationship.')
      return
    }

    setErrorMessage('')

    if (editingMemberId !== null) {
      // Modify existing member
      const updated = familyMembers.map(item => {
        if (item.id === editingMemberId) {
          return {
            ...item,
            fullName,
            nic: nic || 'None',
            age: parseInt(age),
            occupation: occupation || 'None',
            relationship
          }
        }
        return item
      })
      localStorage.setItem('smartgn_family_members', JSON.stringify(updated))
      setFamilyMembers(updated)
      setEditingMemberId(null)
      alert('Family member details updated.')
    } else {
      // Create new member
      const nextId = familyMembers.length > 0 ? Math.max(...familyMembers.map(f => f.id)) + 1 : 1
      const newMember = {
        id: nextId,
        fullName,
        nic: nic || 'None',
        age: parseInt(age),
        occupation: occupation || 'None',
        relationship
      }
      const updated = [...familyMembers, newMember]
      localStorage.setItem('smartgn_family_members', JSON.stringify(updated))
      setFamilyMembers(updated)
      alert('New family member added.')
    }

    handleResetFamilyForm()
  }

  // Populate form fields for editing family member
  const handleEditMemberClick = (member) => {
    setFullName(member.fullName)
    setNic(member.nic === 'None' ? '' : member.nic)
    setAge(member.age.toString())
    setOccupation(member.occupation === 'None' ? '' : member.occupation)
    setRelationship(member.relationship)
    setEditingMemberId(member.id)
  }

  // Delete family member row
  const handleDeleteMemberClick = (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove ${name} from your family records?`)
    if (confirmDelete) {
      const updated = familyMembers.filter(item => item.id !== id)
      localStorage.setItem('smartgn_family_members', JSON.stringify(updated))
      setFamilyMembers(updated)
      alert(`${name} removed successfully.`)
      // If we were currently editing the deleted member, reset form
      if (editingMemberId === id) {
        handleResetFamilyForm()
      }
    }
  }

  // Reset member form
  const handleResetFamilyForm = () => {
    setFullName('')
    setNic('')
    setAge('')
    setOccupation('')
    setRelationship('')
    setEditingMemberId(null)
    setErrorMessage('')
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

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}>
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
          
          {/* Sub-view: VIEW (Family and Household details dashboard) */}
          {viewMode === 'VIEW' && (
            <>
              {/* Back Button */}
              <div className="form-header" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
                <button className="btn-back" onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              </div>

              <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Family and household details</h2>

              {/* Stats Widgets */}
              <div className="stats-grid-appointments" style={{ marginBottom: '24px' }}>
                <div className="stat-card-appointment">
                  <div className="stat-appointment-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <span className="stat-appointment-label">Total members</span>
                  <span className="stat-appointment-value">{totalMembers}</span>
                </div>

                <div className="stat-card-appointment">
                  <div className="stat-appointment-icon">
                    <span style={{ fontSize: '18px', fontWeight: '800' }}>18+</span>
                  </div>
                  <span className="stat-appointment-label">Adult members (18+)</span>
                  <span className="stat-appointment-value">{adultMembers}</span>
                </div>

                <div className="stat-card-appointment">
                  <div className="stat-appointment-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <span className="stat-appointment-label">Children</span>
                  <span className="stat-appointment-value">{childrenMembers}</span>
                </div>
              </div>

              {/* Family Members Card List */}
              <div className="dashboard-announcements-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '8px' }}>
                  <h3 className="card-inner-title" style={{ margin: 0 }}>Family Members</h3>
                  <span className="edit-link-icon" onClick={handleOpenEditFamily}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pencil-icon">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Edit family details
                  </span>
                </div>

                <div className="household-table-wrapper">
                  <table className="household-table">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>NIC</th>
                        <th>Age</th>
                        <th>Occupation</th>
                        <th>Relationship</th>
                      </tr>
                    </thead>
                    <tbody>
                      {familyMembers.map((member) => (
                        <tr key={member.id}>
                          <td>{member.fullName}</td>
                          <td>{member.nic}</td>
                          <td>{member.age}</td>
                          <td>{member.occupation}</td>
                          <td>{member.relationship}</td>
                        </tr>
                      ))}
                      {/* Placeholder row matching visual spacing */}
                      {familyMembers.length < 4 && Array.from({ length: 4 - familyMembers.length }).map((_, i) => (
                        <tr key={`empty-${i}`}>
                          <td style={{ height: '48px' }}></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Household Details Card */}
              <div className="appointment-summary-outer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '8px' }}>
                  <h3 className="card-inner-title" style={{ margin: 0 }}>Household Details</h3>
                  <span className="edit-link-icon" onClick={handleOpenEditHousehold}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pencil-icon">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Edit household details
                  </span>
                </div>

                <div className="household-info-list">
                  <div className="household-info-item">
                    <span className="household-info-label">Household Number</span>
                    <span className="household-info-value">{household.number}</span>
                  </div>
                  <div className="household-info-item">
                    <span className="household-info-label">Address</span>
                    <span className="household-info-value">{household.address}</span>
                  </div>
                  <div className="household-info-item">
                    <span className="household-info-label">Size of the land</span>
                    <span className="household-info-value">{household.landSize}</span>
                  </div>
                  <div className="household-info-item">
                    <span className="household-info-label">Land Owner</span>
                    <span className="household-info-value">{household.landOwner}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sub-view: EDIT_FAMILY (Edit family details form + actions) */}
          {viewMode === 'EDIT_FAMILY' && (
            <>
              {/* Back Button */}
              <div className="form-header" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
                <button className="btn-back" onClick={() => setViewMode('VIEW')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              </div>

              <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Edit your family details</h2>

              {/* Form Input Card */}
              <div className="dashboard-announcements-card" style={{ padding: '32px', marginBottom: '24px' }}>
                <form onSubmit={handleSaveFamilyMember}>
                  <div className="register-grid">
                    
                    <div className="form-group col-span-2">
                      <label htmlFor="fullNameInput">Full Name :</label>
                      <input 
                        type="text" 
                        id="fullNameInput" 
                        className="register-control" 
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="nicInput">NIC :</label>
                      <input 
                        type="text" 
                        id="nicInput" 
                        className="register-control" 
                        placeholder="e.g. 1999XXXXXXXX"
                        value={nic}
                        onChange={(e) => setNic(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="ageInput">Age :</label>
                      <input 
                        type="number" 
                        id="ageInput" 
                        className="register-control" 
                        placeholder="e.g. 24"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="occupInput">Occupation :</label>
                      <input 
                        type="text" 
                        id="occupInput" 
                        className="register-control" 
                        placeholder="e.g. Engineer"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="relSelect">Relationship :</label>
                      <div className="select-wrapper">
                        <select 
                          id="relSelect" 
                          className="register-control register-select"
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          required
                        >
                          <option value="">Select Relationship</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Grandfather">Grandfather</option>
                          <option value="Grandmother">Grandmother</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="select-arrow">▼</span>
                      </div>
                    </div>

                  </div>

                  {errorMessage && (
                    <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0', textAlign: 'left' }}>
                      {errorMessage}
                    </p>
                  )}

                  {/* Form Action Row */}
                  <div className="form-action-row" style={{ marginTop: '20px' }}>
                    <button type="button" className="btn-form-reset" onClick={handleResetFamilyForm}>
                      Reset
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-action-icon">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                      </svg>
                    </button>
                    
                    <button type="submit" className="btn-form-submit" style={{ minWidth: '160px' }}>
                      {editingMemberId !== null ? 'Save Changes' : 'Add member +'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Members grid list below form */}
              <div className="dashboard-announcements-card">
                <h3 className="card-inner-title" style={{ borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '8px' }}>
                  Registered Members
                </h3>

                <div className="household-table-wrapper">
                  <table className="household-table">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>NIC</th>
                        <th>Age</th>
                        <th>Occupation</th>
                        <th>Relationship</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {familyMembers.map((member) => (
                        <tr key={member.id} style={{ backgroundColor: editingMemberId === member.id ? '#fffbeb' : '#ffffff' }}>
                          <td>{member.fullName}</td>
                          <td>{member.nic}</td>
                          <td>{member.age}</td>
                          <td>{member.occupation}</td>
                          <td>{member.relationship}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-row-actions">
                              <button 
                                className="btn-edit-row" 
                                onClick={() => handleEditMemberClick(member)}
                                title="Edit member details"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20h9"></path>
                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                              </button>
                              
                              <button 
                                className="btn-delete-row" 
                                onClick={() => handleDeleteMemberClick(member.id, member.fullName)}
                                title="Remove member"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Sub-view: EDIT_HOUSEHOLD (Edit household property details) */}
          {viewMode === 'EDIT_HOUSEHOLD' && (
            <>
              {/* Back Button */}
              <div className="form-header" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
                <button className="btn-back" onClick={() => setViewMode('VIEW')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              </div>

              <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Edit household details</h2>

              <div className="dashboard-announcements-card" style={{ padding: '32px' }}>
                <form onSubmit={handleSaveHousehold}>
                  <div className="register-grid">
                    
                    <div className="form-group">
                      <label htmlFor="houseNum">Household Number :</label>
                      <input 
                        type="text" 
                        id="houseNum" 
                        className="register-control" 
                        value={houseNumberInput}
                        onChange={(e) => setHouseNumberInput(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="addressLoc">Address :</label>
                      <input 
                        type="text" 
                        id="addressLoc" 
                        className="register-control" 
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="landSize">Size of the land :</label>
                      <input 
                        type="text" 
                        id="landSize" 
                        className="register-control" 
                        value={landSizeInput}
                        onChange={(e) => setLandSizeInput(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="landOwner">Land Owner :</label>
                      <input 
                        type="text" 
                        id="landOwner" 
                        className="register-control" 
                        value={landOwnerInput}
                        onChange={(e) => setLandOwnerInput(e.target.value)}
                        required
                      />
                    </div>

                  </div>

                  {/* Actions row */}
                  <div className="form-action-row" style={{ marginTop: '32px' }}>
                    <button type="button" className="btn-form-reset" onClick={() => setViewMode('VIEW')}>
                      Cancel
                    </button>
                    
                    <button type="submit" className="btn-form-submit">
                      Save Household Details
                    </button>
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

export default ResidentHousehold
