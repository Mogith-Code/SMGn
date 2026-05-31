import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function OfficerHouseholdDetails({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Session context (defaults to কামাল পেরেরা Kamal Perera)
  const successUser = location.state?.successUser || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || '200324511540'

  // Verification List State
  const [residents, setResidents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedResident, setSelectedResident] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Seed default dynamic residents list on component mount
  useEffect(() => {
    const saved = localStorage.getItem('smartgn_residents_verification_list')
    if (saved) {
      setResidents(JSON.parse(saved))
    } else {
      const defaultList = [
        {
          id: 1,
          name: 'Nimal Perera',
          nic: '200324511540',
          phone: '+94771234567',
          email: 'Nimal.Perera@example.com',
          status: 'Verified',
          occupation: 'Farmer',
          gender: 'Male',
          dob: '28/05/2000',
          division: 'Colombo, Borella',
          serviceTime: '2',
          householdNumber: '123456',
          address: '123 Main Street, Colombo',
          landSize: '2 acres',
          landOwner: 'Kumara',
          idCardFront: null,
          idCardBack: null,
          familyMembers: [
            { id: 1, fullName: 'Dissanayake Mudiyanselage Nimal Perera', nic: '197215644896', age: 54, occupation: 'Government Officer', relationship: 'Father' },
            { id: 2, fullName: 'Dissanayake Kusumawathi Perera', nic: '197684511520', age: 50, occupation: 'Housewife', relationship: 'Mother' },
            { id: 3, fullName: 'Dissanayake Kasun Perera', nic: '200215421530', age: 24, occupation: 'Engineer', relationship: 'Son' },
            { id: 4, fullName: 'Dissanayake Sanduni Perera', nic: 'None', age: 12, occupation: 'Student', relationship: 'Daughter' },
            { id: 5, fullName: 'Dissanayake Piyumi Perera', nic: 'None', age: 8, occupation: 'Student', relationship: 'Daughter' }
          ]
        },
        {
          id: 2,
          name: 'Kamala Silva',
          nic: '234567890V',
          phone: '+94771234568',
          email: 'kamala.silva@example.com',
          status: 'Verified',
          occupation: 'Teacher',
          gender: 'Female',
          dob: '14/08/1985',
          division: 'Colombo, Borella',
          serviceTime: '5',
          householdNumber: '987654',
          address: '45 Temple Road, Borella',
          landSize: '0.5 acres',
          landOwner: 'Kamala Silva',
          idCardFront: null,
          idCardBack: null,
          familyMembers: [
            { id: 1, fullName: 'Kamala Silva', nic: '234567890V', age: 41, occupation: 'Teacher', relationship: 'Self' },
            { id: 2, fullName: 'Sunil Silva', nic: '198032451234', age: 45, occupation: 'Engineer', relationship: 'Spouse' },
            { id: 3, fullName: 'Dinuka Silva', nic: 'None', age: 10, occupation: 'Student', relationship: 'Son' }
          ]
        },
        {
          id: 3,
          name: 'Saman Fernando',
          nic: '345678901V',
          phone: '+94771234569',
          email: 'saman.f@example.com',
          status: 'Pending',
          occupation: 'Shopkeeper',
          gender: 'Male',
          dob: '03/12/1990',
          division: 'Colombo, Borella',
          serviceTime: '1',
          householdNumber: '554321',
          address: '78 Station Road, Borella',
          landSize: '1.2 acres',
          landOwner: 'Saman Fernando',
          idCardFront: null,
          idCardBack: null,
          familyMembers: [
            { id: 1, fullName: 'Saman Fernando', nic: '345678901V', age: 36, occupation: 'Shopkeeper', relationship: 'Self' },
            { id: 2, fullName: 'Priyanthi Fernando', nic: 'None', age: 33, occupation: 'Housewife', relationship: 'Spouse' },
            { id: 3, fullName: 'Roshi Fernando', nic: 'None', age: 5, occupation: 'Student', relationship: 'Daughter' }
          ]
        }
      ]
      localStorage.setItem('smartgn_residents_verification_list', JSON.stringify(defaultList))
      setResidents(defaultList)
    }
  }, [])

  // Live filter search logic
  const filteredResidents = residents.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.nic.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Audit / Action Operations
  const handleOpenAudit = (resident) => {
    setSelectedResident(resident)
    setIsModalOpen(true)
  }

  // Toggle Verification status to Verified
  const handleVerify = (id) => {
    const updated = residents.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Verified' }
      }
      return item
    })
    localStorage.setItem('smartgn_residents_verification_list', JSON.stringify(updated))
    setResidents(updated)
    setIsModalOpen(false)
    alert(`Resident profile for ${selectedResident.name} is successfully verified.`)
  }

  // Toggle Verification status back to Pending
  const handleMarkPending = (id) => {
    const updated = residents.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Pending' }
      }
      return item
    })
    localStorage.setItem('smartgn_residents_verification_list', JSON.stringify(updated))
    setResidents(updated)
    setIsModalOpen(false)
    alert(`Resident profile for ${selectedResident.name} marked as Pending verification.`)
  }

  // Delete Resident Account Action
  const handleDeleteResident = (id, name) => {
    const confirmDelete = window.confirm(`WARNING: Are you sure you want to permanently delete the profile and household registry for "${name}"? This action cannot be undone.`)
    if (confirmDelete) {
      const updated = residents.filter(item => item.id !== id)
      localStorage.setItem('smartgn_residents_verification_list', JSON.stringify(updated))
      setResidents(updated)
      setIsModalOpen(false)
      alert(`Resident profile for "${name}" has been deleted successfully.`)
    }
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
              <span>Home</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer', { state: { successUser, officerId: officerIdVal } })}>
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

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>Family & Household Details</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer', { state: { successUser, officerId: officerIdVal } })}>
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

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer', { state: { successUser, officerId: officerIdVal } })}>
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

          {/* Table Header Row */}
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <h2 className="content-greeting" style={{ margin: 0 }}>Resident Verification</h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Search and verify the details of village residents.</p>
          </div>

          {/* Search Box Card */}
          <div className="dashboard-announcements-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div className="search-input-wrapper" style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="register-control" 
                placeholder="Search by name or NIC..."
                style={{ paddingLeft: '40px', height: '44px', borderRadius: '8px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ position: 'absolute', left: '14px', top: '13px' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Verification Table */}
          <div className="dashboard-announcements-card" style={{ padding: '0', overflow: 'hidden' }}>
            <table className="household-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>NIC</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Phone</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.map((resident) => (
                  <tr key={resident.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '18px 24px', fontSize: '14px', fontWeight: '750', color: '#1e293b', textAlign: 'left' }}>{resident.name}</td>
                    <td style={{ padding: '18px 24px', fontSize: '13.5px', fontWeight: '600', color: '#475569', textAlign: 'left' }}>
                      {resident.nic.includes('V') ? resident.nic : resident.nic.substring(0, 4) + ' •••• ••••'}
                    </td>
                    <td style={{ padding: '18px 24px', fontSize: '13.5px', fontWeight: '600', color: '#475569', textAlign: 'left' }}>{resident.phone}</td>
                    <td style={{ padding: '18px 24px', textAlign: 'left' }}>
                      <span className={`badge-status ${resident.status === 'Verified' ? 'approved' : 'pending'}`} style={{ display: 'inline-block', padding: '3px 12px', fontSize: '11px', textTransform: 'capitalize' }}>
                        {resident.status}
                      </span>
                    </td>
                    <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleOpenAudit(resident)}
                        style={{ padding: '6px 14px', borderRadius: '6px', border: '1.5px solid #1a2e56', background: '#eff6ff', color: '#1a2e56', fontSize: '12px', fontWeight: '750', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Verify Details
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredResidents.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '48px', color: '#64748b', fontSize: '13.5px', fontWeight: '600', textAlign: 'center' }}>
                      No residents found matching "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1.5px solid #e2e8f0', background: '#f8fafc' }}>
              <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: '600' }}>Showing {filteredResidents.length} of {residents.length} residents</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-back" style={{ margin: 0, padding: '6px 12px', fontSize: '12.5px', borderRadius: '6px', border: '1.5px solid #cbd5e1' }} disabled>Previous</button>
                <button className="btn-appt-confirm" style={{ margin: 0, padding: '6px 16px', fontSize: '12.5px', borderRadius: '6px', backgroundColor: '#1a2e56', color: '#ffffff', border: 'none', cursor: 'pointer' }}>Next</button>
              </div>
            </div>
          </div>

          {/* Floating Help Button */}
          <button className="floating-dashboard-help" aria-label="Help Trigger" onClick={onOpenHelp}>
            ?
          </button>
        </main>
      </div>

      {/* 3. Audit Details Modal */}
      {isModalOpen && selectedResident && (
        <div className="modal-backdrop-overlay">
          <div className="modal-form-card" style={{ maxWidth: '820px' }}>
            
            <div className="modal-header-row">
              <h3 className="modal-form-title">Resident Profile Audit & Household Verification</h3>
              <button className="modal-close-btn-x" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '28px', maxHeight: '70vh', overflowY: 'auto', textAlign: 'left' }}>
              
              {/* Card 1: Resident Personal Info */}
              <div className="quick-actions-card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '800', color: '#1a2e56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resident Profile Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Full Name</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{selectedResident.name}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>National Identity Card (NIC)</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{selectedResident.nic}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Mobile Contact</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{selectedResident.phone}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Email Address</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{selectedResident.email}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Occupation</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{selectedResident.occupation}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Date of Birth / Gender</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{selectedResident.dob} • {selectedResident.gender}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Household Land Details */}
              <div className="quick-actions-card" style={{ background: '#fdf8f0', border: '1.5px solid #fedc9b' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '800', color: '#1a2e56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Household Property Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Household Number</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>#HN-{selectedResident.householdNumber}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Address</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{selectedResident.address}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Land Acreage</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{selectedResident.landSize}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Endorsed Land Owner</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{selectedResident.landOwner}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: ID Card Upload Preview */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '800', color: '#1a2e56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>National Identity Card Preview</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ height: '150px', border: '1.5px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
                    {selectedResident.idCardFront ? (
                      <img src={selectedResident.idCardFront} alt="NIC Front" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Front NIC image not uploaded</span>
                    )}
                  </div>
                  <div style={{ height: '150px', border: '1.5px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
                    {selectedResident.idCardBack ? (
                      <img src={selectedResident.idCardBack} alt="NIC Back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Back NIC image not uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 4: Family Members list table */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '800', color: '#1a2e56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Household Family Members</h4>
                <table className="household-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Full Name</th>
                      <th style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>NIC</th>
                      <th style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Age</th>
                      <th style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Occupation</th>
                      <th style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Relation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedResident.familyMembers.map((member) => (
                      <tr key={member.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                        <td style={{ padding: '10px 16px', fontSize: '12.5px', fontWeight: '750', color: '#1e293b' }}>{member.fullName}</td>
                        <td style={{ padding: '10px 16px', fontSize: '12px', color: '#475569' }}>{member.nic}</td>
                        <td style={{ padding: '10px 16px', fontSize: '12px', color: '#475569' }}>{member.age}</td>
                        <td style={{ padding: '10px 16px', fontSize: '12px', color: '#475569' }}>{member.occupation}</td>
                        <td style={{ padding: '10px 16px', fontSize: '12px', fontWeight: '750', color: '#d97706' }}>{member.relationship}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Modal action rows */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #cbd5e1', paddingTop: '20px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => handleDeleteResident(selectedResident.id, selectedResident.name)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '750', cursor: 'pointer' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete Account
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-back" style={{ border: '1.5px solid #cbd5e1' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                {selectedResident.status !== 'Verified' ? (
                  <button 
                    type="button" 
                    className="btn-appt-confirm" 
                    onClick={() => handleVerify(selectedResident.id)}
                    style={{ backgroundColor: '#22c55e', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '750', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Verify Account
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => handleMarkPending(selectedResident.id)}
                    style={{ backgroundColor: '#d97706', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '750', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Mark as Pending
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. Footer */}
      <footer className="landing-footer" style={{ padding: '16px 64px', borderTop: 'none' }}>
        <div className="footer-copyright">
          <p>© 2026 SmartGN. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default OfficerHouseholdDetails
