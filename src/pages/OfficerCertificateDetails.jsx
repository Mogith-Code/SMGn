import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'

function OfficerCertificateDetails({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session user details
  const successUser = location.state?.successUser || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || '200324511540'

  // States
  const [certRequest, setCertRequest] = useState(null)
  const [addressCheck, setAddressCheck] = useState(true)
  const [nicCheck, setNicCheck] = useState(true)
  const [documentAuditCheck, setDocumentAuditCheck] = useState(false)
  
  // Officer Quick Check states
  const [signatureMatch, setSignatureMatch] = useState(false)
  const [billsVerified, setBillsVerified] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('smartgn_certificate_requests')
    if (saved) {
      const allRequests = JSON.parse(saved)
      const found = allRequests.find(r => r.id === id)
      if (found) {
        setCertRequest(found)
        // Set checkboxes if already approved
        if (found.status === 'Approved') {
          setDocumentAuditCheck(true)
          setSignatureMatch(true)
          setBillsVerified(true)
        } else if (found.status === 'Rejected') {
          setDocumentAuditCheck(false)
          setSignatureMatch(false)
          setBillsVerified(false)
        }
      }
    }
  }, [id])

  if (!certRequest) {
    return (
      <div style={{ padding: '64px', textAlign: 'center', fontSize: '18px', color: '#64748b' }}>
        Loading request details...
      </div>
    )
  }

  const handleApprove = () => {
    if (!signatureMatch || !billsVerified) {
      const confirmApprove = window.confirm("You have not checked all Officer Quick Check items. Do you still want to approve this application?")
      if (!confirmApprove) return
    }

    const saved = localStorage.getItem('smartgn_certificate_requests')
    if (saved) {
      const allRequests = JSON.parse(saved)
      const updated = allRequests.map(r => r.id === id ? { ...r, status: 'Approved' } : r)
      localStorage.setItem('smartgn_certificate_requests', JSON.stringify(updated))
      setCertRequest({ ...certRequest, status: 'Approved' })
      setDocumentAuditCheck(true)
      alert(`Certificate request ${id} has been Approved and Issued successfully!`)
      navigate('/dashboard/officer/certificates', { state: { successUser, officerId: officerIdVal } })
    }
  }

  const handleReject = () => {
    const reason = window.prompt("Please enter the reason for rejection:")
    if (reason === null) return // cancelled prompt
    
    const saved = localStorage.getItem('smartgn_certificate_requests')
    if (saved) {
      const allRequests = JSON.parse(saved)
      const updated = allRequests.map(r => r.id === id ? { ...r, status: 'Rejected', rejectionReason: reason || 'Incomplete supporting documents.' } : r)
      localStorage.setItem('smartgn_certificate_requests', JSON.stringify(updated))
      setCertRequest({ ...certRequest, status: 'Rejected' })
      alert(`Certificate request ${id} has been Rejected.`)
      navigate('/dashboard/officer/certificates', { state: { successUser, officerId: officerIdVal } })
    }
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

            <button className="menu-btn active" onClick={() => navigate('/dashboard/officer/certificates', { state: { successUser, officerId: officerIdVal } })}>
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
          
          {/* Breadcrumb row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#64748b', marginBottom: '16px', fontWeight: '600' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/officer/certificates', { state: { successUser, officerId: officerIdVal } })}>Certificates Services</span>
            <span>➔</span>
            <span style={{ color: '#1e293b' }}>Request Details</span>
          </div>

          {/* Heading Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', textAlign: 'left' }}>
            <div>
              <h2 className="content-greeting" style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>
                Request Details - {certRequest.type}
              </h2>
              <span style={{ fontSize: '14.5px', color: '#64748b', fontWeight: '600' }}>
                Reviewing application ID: {certRequest.id}
              </span>
            </div>

            <span
              className={`badge-status ${certRequest.status.toLowerCase()}`}
              style={{
                fontSize: '13px',
                fontWeight: '800',
                padding: '6px 16px',
                borderRadius: '50px',
                textTransform: 'uppercase'
              }}
            >
              {certRequest.status === 'Pending' ? 'Pending Review' : certRequest.status}
            </span>
          </div>

          {/* Two Column Layout Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '32px', alignItems: 'start', marginBottom: '32px' }}>
            
            {/* Left Card: Applicant Info */}
            <div className="dashboard-announcements-card" style={{ padding: '32px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e8edf3', color: '#1a2e56' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3 className="card-inner-title" style={{ margin: 0, fontSize: '17px' }}>Applicant Information</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</span>
                  <span style={{ fontSize: '14.5px', fontWeight: '750', color: '#1e293b' }}>{certRequest.name}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>NIC Number</span>
                  <span style={{ fontSize: '14.5px', fontWeight: '750', color: '#1e293b' }}>{certRequest.nic || '789456123V'}</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Residential Address</span>
                <span style={{ fontSize: '14.5px', fontWeight: '750', color: '#1e293b' }}>{certRequest.address || '45/2, Temple Road, Maharagama.'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Division</span>
                  <span style={{ fontSize: '14.5px', fontWeight: '750', color: '#1e293b' }}>{certRequest.division} (Div 04)</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Submission Date</span>
                  <span style={{ fontSize: '14.5px', fontWeight: '750', color: '#1e293b' }}>{certRequest.submittedDate}</span>
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Purpose of Request</span>
                <div style={{ padding: '16px 20px', backgroundColor: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', fontSize: '13.5px', color: '#1e3a8a', fontWeight: '600', lineHeight: '1.5' }}>
                  "Required for secondary school admission for daughter at Maharagama Central College. Need to prove monthly income for scholarship consideration."
                </div>
              </div>
            </div>

            {/* Right Card: Verification Checks & History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
              
              {/* Verification Checklist card */}
              <div className="dashboard-announcements-card" style={{ padding: '24px' }}>
                <h3 className="card-inner-title" style={{ fontSize: '15.5px', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '16px' }}>
                  Verification
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Item 1 */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                    <input
                      type="checkbox"
                      checked={addressCheck}
                      onChange={(e) => setAddressCheck(e.target.checked)}
                      style={{ marginTop: '3px', cursor: 'pointer', width: '18px', height: '18px', accentColor: '#10b981' }}
                    />
                    <div>
                      <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '750', color: '#1e293b' }}>Address Verified</span>
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>Cross-checked with voter registry</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                    <input
                      type="checkbox"
                      checked={nicCheck}
                      onChange={(e) => setNicCheck(e.target.checked)}
                      style={{ marginTop: '3px', cursor: 'pointer', width: '18px', height: '18px', accentColor: '#10b981' }}
                    />
                    <div>
                      <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '750', color: '#1e293b' }}>NIC Verified</span>
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>Authenticated via DRP API</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: documentAuditCheck ? '#10b981' : '#f59e0b', color: '#ffffff', fontSize: '11px', fontWeight: '800', marginTop: '2px', flexShrink: 0 }}>
                      {documentAuditCheck ? '✓' : '!'}
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '750', color: '#1e293b' }}>
                        {certRequest.type.split(' ')[0]} Audit
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {documentAuditCheck ? 'Completed document review' : 'Requires document audit'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous History card */}
              <div className="dashboard-announcements-card" style={{ padding: '24px' }}>
                <h3 className="card-inner-title" style={{ fontSize: '15.5px', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '16px' }}>
                  Previous History
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '12px 16px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '13px' }}>
                      <span style={{ display: 'block', fontWeight: '750', color: '#1e293b' }}>Residence Cert</span>
                      <span style={{ color: '#64748b', fontSize: '12px' }}>Sept 2023 • Ref #4412</span>
                    </div>
                    <span className="badge-status approved" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '50px' }}>Issued</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Card: Supporting Documents */}
          <div className="dashboard-announcements-card" style={{ padding: '32px', textAlign: 'left', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', verticalAlign: 'middle' }}>📎</span>
                <h3 className="card-inner-title" style={{ margin: 0, fontSize: '17px' }}>Supporting Documents</h3>
              </div>
              <button 
                onClick={() => alert("Downloading all supportive files securely...")}
                style={{ background: 'none', border: 'none', color: '#1a2e56', fontWeight: '800', fontSize: '13.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                📥 Download All
              </button>
            </div>

            {/* Document Grid Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '32px', alignItems: 'start' }}>
              
              {/* Document Thumbnails */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* Utility bill doc */}
                <div style={{ width: '220px', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                  <div style={{ height: '110px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '28px', borderBottom: '1px solid #cbd5e1', position: 'relative' }}>
                    📄
                    <span style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '10px', fontWeight: '800', background: 'rgba(0,0,0,0.6)', color: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>PDF • 1.2MB</span>
                  </div>
                  <div style={{ padding: '12px', fontSize: '13px' }}>
                    <span style={{ display: 'block', fontWeight: '750', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Proof of Residence</span>
                    <span style={{ color: '#64748b', fontSize: '11.5px' }}>Utility Bill - March 2024</span>
                  </div>
                </div>

                {/* Notarized statement doc */}
                {certRequest.type === 'Income Certificate' && (
                  <div style={{ width: '220px', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                    <div style={{ height: '110px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '28px', borderBottom: '1px solid #cbd5e1', position: 'relative' }}>
                      🖼️
                      <span style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '10px', fontWeight: '800', background: 'rgba(0,0,0,0.6)', color: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>JPG • 2.5MB</span>
                    </div>
                    <div style={{ padding: '12px', fontSize: '13px' }}>
                      <span style={{ display: 'block', fontWeight: '750', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Income Declaration Form</span>
                      <span style={{ color: '#64748b', fontSize: '11.5px' }}>Signed & Notarized</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Officer Quick Check Box */}
              <div style={{ border: '1.5px dashed #fedc9b', backgroundColor: '#fdf8f0', padding: '24px', borderRadius: '16px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '12px', textTransform: 'uppercase', color: '#854d0e', fontWeight: '850', letterSpacing: '0.5px' }}>
                  Officer Quick Check
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', fontSize: '13.5px', color: '#1e293b', fontWeight: '700' }}>
                    <input
                      type="checkbox"
                      checked={signatureMatch}
                      onChange={(e) => setSignatureMatch(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#1a2e56' }}
                    />
                    <span>Signature matches record</span>
                  </label>

                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', fontSize: '13.5px', color: '#1e293b', fontWeight: '700' }}>
                    <input
                      type="checkbox"
                      checked={billsVerified}
                      onChange={(e) => setBillsVerified(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#1a2e56' }}
                    />
                    <span>Supporting bills verified</span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Action Row Buttons: Approve & Reject */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginBottom: '32px' }}>
            <button
              onClick={() => navigate('/dashboard/officer/certificates', { state: { successUser, officerId: officerIdVal } })}
              className="btn-form-reset"
              style={{ padding: '12px 28px', fontSize: '14px', borderRadius: '50px', margin: 0 }}
            >
              Cancel Review
            </button>

            {certRequest.status === 'Pending' && (
              <>
                <button
                  onClick={handleReject}
                  style={{
                    background: '#ffffff',
                    color: '#ef4444',
                    border: '2.5px solid #ef4444',
                    padding: '10px 32px',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
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
                  Reject Application
                </button>

                <button
                  onClick={handleApprove}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 36px',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  Approve Application
                </button>
              </>
            )}
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

export default OfficerCertificateDetails
