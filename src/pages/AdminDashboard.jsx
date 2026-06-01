import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function AdminDashboard({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Session user details
  const successUser = location.state?.successUser || 'System Admin'

  // Tabs state: 'overview' | 'officers' | 'residents' | 'troubleshoot'
  const [activeTab, setActiveTab] = useState('overview')

  // LocalStorage statuses states
  const [officerStatuses, setOfficerStatuses] = useState({})
  const [residentStatuses, setResidentStatuses] = useState({})

  // Diagnostic states
  const [runningDiagnostic, setRunningDiagnostic] = useState(false)
  const [diagnosticProgress, setDiagnosticProgress] = useState(0)
  const [diagnosticLogs, setDiagnosticLogs] = useState([])

  useEffect(() => {
    // Seed and load officers statuses
    const savedOfficers = localStorage.getItem('smartgn_officers_profiles_status')
    if (savedOfficers) {
      setOfficerStatuses(JSON.parse(savedOfficers))
    } else {
      const defaultOfficers = {
        '200324511540': 'Active', // Kamal Perera
        'Sunil Silva ID': 'Active', // Sunil Silva
        'Kamal Perera': 'Active',
        'Sunil Silva': 'Active'
      }
      localStorage.setItem('smartgn_officers_profiles_status', JSON.stringify(defaultOfficers))
      setOfficerStatuses(defaultOfficers)
    }

    // Seed and load residents statuses
    const savedResidents = localStorage.getItem('smartgn_residents_profiles_status')
    if (savedResidents) {
      setResidentStatuses(JSON.parse(savedResidents))
    } else {
      const defaultResidents = {
        '200324511540': 'Active', // Nimal Perera
        '789456123V': 'Active',   // Kamala Silva
        'Nimal Perera': 'Active',
        'Kamala Silva': 'Active'
      }
      localStorage.setItem('smartgn_residents_profiles_status', JSON.stringify(defaultResidents))
      setResidentStatuses(defaultResidents)
    }
  }, [])

  // Toggle Officer status
  const toggleOfficerStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active'
    
    // Determine the name to keep both in sync in mock logins
    const nameMap = {
      '200324511540': 'Kamal Perera',
      'Sunil Silva ID': 'Sunil Silva'
    }
    const name = nameMap[id]

    const updated = { ...officerStatuses, [id]: nextStatus }
    if (name) {
      updated[name] = nextStatus
    }

    localStorage.setItem('smartgn_officers_profiles_status', JSON.stringify(updated))
    setOfficerStatuses(updated)
    alert(`Grama Niladhari Officer (${name || id}) has been successfully ${nextStatus === 'Active' ? 'Activated' : 'Deactivated & Suspended'}.`)
  }

  // Toggle Resident status
  const toggleResidentStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active'

    const nameMap = {
      '200324511540': 'Nimal Perera',
      '789456123V': 'Kamala Silva'
    }
    const name = nameMap[id]

    const updated = { ...residentStatuses, [id]: nextStatus }
    if (name) {
      updated[name] = nextStatus
    }

    localStorage.setItem('smartgn_residents_profiles_status', JSON.stringify(updated))
    setResidentStatuses(updated)
    alert(`Resident profile (${name || id}) has been successfully ${nextStatus === 'Active' ? 'Activated' : 'Deactivated & Suspended'}.`)
  }

  // Troubleshooter Diagnostic simulation
  const startTroubleshoot = () => {
    setRunningDiagnostic(true)
    setDiagnosticProgress(0)
    setDiagnosticLogs([])

    const logSteps = [
      'RTGS-Gateway: Connecting secure fund settlement clearing nodes...',
      'Registry Audit: Fetching National Voter registries for Division Mahargama & Colombo...',
      'System Audit: Scanning active Gramaseva certifications indices...',
      'Troubleshoot: Cleaning redundant cache logs and flushed DB memory blocks...',
      'Security Sweep: Verifying signature hashes match records... No issues found.',
      'System Diagnostics: Flush Cache Success! All nodes returned clean status 200 OK.'
    ]

    let step = 0
    const interval = setInterval(() => {
      if (step < logSteps.length) {
        setDiagnosticLogs(prev => [...prev, `[INFO] ${logSteps[step]}`])
        setDiagnosticProgress(prev => Math.min(prev + 18, 100))
        step++
      } else {
        clearInterval(interval)
        setDiagnosticProgress(100)
        setRunningDiagnostic(false)
        alert('Diagnostics Sweep & Cache optimization completed successfully!')
      }
    }, 600)
  }

  return (
    <div className="dashboard-container" style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 1. Header */}
      <header className="dashboard-header" style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
        <div className="landing-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-smart" style={{ color: '#d97706' }}>Smart</span>
          <span className="logo-gn" style={{ color: '#ffffff' }}>GN</span>
          <p className="logo-subtext" style={{ color: '#94a3b8' }}>Divisional System Admin Console</p>
        </div>

        <div className="header-right">
          <span style={{ fontSize: '13px', background: '#334155', color: '#fedc9b', padding: '4px 12px', borderRadius: '50px', fontWeight: '800' }}>
            System ROOT Mode
          </span>
          
          <div className="user-profile-info" style={{ borderLeft: '1px solid #334155', paddingLeft: '16px' }}>
            <div className="user-text-details">
              <span className="user-division" style={{ color: '#94a3b8' }}>ADMIN</span>
              <span className="user-name" style={{ color: '#ffffff' }}>{successUser}</span>
            </div>
            <div className="user-avatar-circle" style={{ backgroundColor: '#d97706', color: '#ffffff' }}>
              ⚙
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Layout Grid */}
      <div className="dashboard-main-layout">
        
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar" style={{ background: '#0f172a', borderRight: '1px solid #334155' }}>
          <nav className="sidebar-menu">
            <button 
              className={`menu-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              style={{ color: '#94a3b8', background: activeTab === 'overview' ? 'rgba(217,119,6,0.15)' : 'transparent' }}
            >
              📊 <span>Dashboard Overview</span>
            </button>

            <button 
              className={`menu-btn ${activeTab === 'officers' ? 'active' : ''}`}
              onClick={() => setActiveTab('officers')}
              style={{ color: '#94a3b8', background: activeTab === 'officers' ? 'rgba(217,119,6,0.15)' : 'transparent' }}
            >
              🏢 <span>GN Officer Accounts</span>
            </button>

            <button 
              className={`menu-btn ${activeTab === 'residents' ? 'active' : ''}`}
              onClick={() => setActiveTab('residents')}
              style={{ color: '#94a3b8', background: activeTab === 'residents' ? 'rgba(217,119,6,0.15)' : 'transparent' }}
            >
              👥 <span>Resident Profiles</span>
            </button>

            <button 
              className={`menu-btn ${activeTab === 'troubleshoot' ? 'active' : ''}`}
              onClick={() => setActiveTab('troubleshoot')}
              style={{ color: '#94a3b8', background: activeTab === 'troubleshoot' ? 'rgba(217,119,6,0.15)' : 'transparent' }}
            >
              🔧 <span>Troubleshoot Node</span>
            </button>

            <button 
              className="menu-btn" 
              onClick={() => navigate('/login')}
              style={{ color: '#f43f5e', marginTop: '32px' }}
            >
              ➔ <span>Log Out Admin</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel Content */}
        <main className="dashboard-content" style={{ padding: '32px' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-zoom-in">
              <h2 style={{ fontSize: '22px', fontWeight: '800', textAlign: 'left', marginBottom: '24px', color: '#ffffff' }}>System Overview</h2>
              
              {/* Stats Grid */}
              <div className="stats-row-grid" style={{ marginBottom: '32px' }}>
                <div className="stat-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>Total GN Officers</span>
                  <span className="stat-value" style={{ color: '#ffffff' }}>2 Active</span>
                  <span className="stat-subtext-note" style={{ color: '#10b981' }}>Colombo, Maharagama</span>
                </div>

                <div className="stat-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>Registered Residents</span>
                  <span className="stat-value" style={{ color: '#ffffff' }}>1,240</span>
                  <span className="stat-subtext-note" style={{ color: '#10b981' }}>+12 New submissions</span>
                </div>

                <div className="stat-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>RTGS Money Transfers</span>
                  <span className="stat-value" style={{ color: '#ffffff' }}>Rs. 17,500</span>
                  <span className="stat-subtext-note" style={{ color: '#10b981' }}>Cleared Gateway</span>
                </div>

                <div className="stat-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>System Server Node</span>
                  <span className="stat-value" style={{ color: '#10b981' }}>Healthy</span>
                  <span className="stat-subtext-note" style={{ color: '#94a3b8' }}>DB latency: 2ms</span>
                </div>
              </div>

              {/* System alerts logs panel */}
              <div className="dashboard-announcements-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', textAlign: 'left' }}>
                <h3 className="card-inner-title" style={{ color: '#ffffff', fontSize: '16px', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '16px' }}>
                  Recent System Auditing Logs
                </h3>
                <div style={{ fontFamily: 'monospace', fontSize: '12.5px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>[2026-06-01 12:44:02] ADMIN logged in successfully from secure clearing terminal node.</div>
                  <div>[2026-06-01 12:38:15] RTGS clearing gateway disburse request dished out reference ID TXN-902847120.</div>
                  <div>[2026-06-01 12:35:10] DRP API successfully authenticated resident Kamala Silva (789456123V) registry checks.</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GN OFFICERS */}
          {activeTab === 'officers' && (
            <div className="animate-zoom-in">
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#ffffff' }}>GN Officer Profile Registry</h2>
                <span style={{ fontSize: '13.5px', color: '#94a3b8' }}>Temporarily deactivate or suspend divisional officers if they cause policy troubles.</span>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      <th style={{ padding: '16px 24px' }}>Officer Name</th>
                      <th style={{ padding: '16px 24px' }}>Officer ID</th>
                      <th style={{ padding: '16px 24px' }}>Divisional Office</th>
                      <th style={{ padding: '16px 24px' }}>Registry Status</th>
                      <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1 */}
                    <tr style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '20px 24px', fontWeight: '750', color: '#ffffff' }}>Kamal Perera</td>
                      <td style={{ padding: '20px 24px', color: '#94a3b8' }}>200324511540</td>
                      <td style={{ padding: '20px 24px', color: '#f8fafc' }}>Colombo Division</td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: officerStatuses['200324511540'] === 'Active' ? '#064e3b' : '#991b1b', color: officerStatuses['200324511540'] === 'Active' ? '#34d399' : '#f87171', padding: '3px 8px', borderRadius: '50px', textTransform: 'uppercase' }}>
                          {officerStatuses['200324511540']}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <button
                          onClick={() => toggleOfficerStatus('200324511540', officerStatuses['200324511540'])}
                          style={{
                            background: 'transparent',
                            border: '1.5px solid',
                            borderColor: officerStatuses['200324511540'] === 'Active' ? '#f43f5e' : '#10b981',
                            color: officerStatuses['200324511540'] === 'Active' ? '#f43f5e' : '#10b981',
                            padding: '6px 16px',
                            borderRadius: '50px',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          {officerStatuses['200324511540'] === 'Active' ? 'Deactivate Suspended' : 'Activate Officer'}
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr style={{ borderBottom: 'none' }}>
                      <td style={{ padding: '20px 24px', fontWeight: '750', color: '#ffffff' }}>Sunil Silva</td>
                      <td style={{ padding: '20px 24px', color: '#94a3b8' }}>Sunil Silva ID</td>
                      <td style={{ padding: '20px 24px', color: '#f8fafc' }}>Kaduwela Division</td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: officerStatuses['Sunil Silva ID'] === 'Active' ? '#064e3b' : '#991b1b', color: officerStatuses['Sunil Silva ID'] === 'Active' ? '#34d399' : '#f87171', padding: '3px 8px', borderRadius: '50px', textTransform: 'uppercase' }}>
                          {officerStatuses['Sunil Silva ID'] || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <button
                          onClick={() => toggleOfficerStatus('Sunil Silva ID', officerStatuses['Sunil Silva ID'] || 'Active')}
                          style={{
                            background: 'transparent',
                            border: '1.5px solid',
                            borderColor: (officerStatuses['Sunil Silva ID'] || 'Active') === 'Active' ? '#f43f5e' : '#10b981',
                            color: (officerStatuses['Sunil Silva ID'] || 'Active') === 'Active' ? '#f43f5e' : '#10b981',
                            padding: '6px 16px',
                            borderRadius: '50px',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          {(officerStatuses['Sunil Silva ID'] || 'Active') === 'Active' ? 'Deactivate Suspended' : 'Activate Officer'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RESIDENTS */}
          {activeTab === 'residents' && (
            <div className="animate-zoom-in">
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#ffffff' }}>Resident Account Registry</h2>
                <span style={{ fontSize: '13.5px', color: '#94a3b8' }}>Block or suspend residential profiles if they make troubles in household applications.</span>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      <th style={{ padding: '16px 24px' }}>Resident Name</th>
                      <th style={{ padding: '16px 24px' }}>NIC Number</th>
                      <th style={{ padding: '16px 24px' }}>Household Division</th>
                      <th style={{ padding: '16px 24px' }}>Active Status</th>
                      <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1 */}
                    <tr style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '20px 24px', fontWeight: '750', color: '#ffffff' }}>Nimal Perera</td>
                      <td style={{ padding: '20px 24px', color: '#94a3b8' }}>200324511540</td>
                      <td style={{ padding: '20px 24px', color: '#f8fafc' }}>Colombo Office</td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: residentStatuses['200324511540'] === 'Active' ? '#064e3b' : '#991b1b', color: residentStatuses['200324511540'] === 'Active' ? '#34d399' : '#f87171', padding: '3px 8px', borderRadius: '50px', textTransform: 'uppercase' }}>
                          {residentStatuses['200324511540']}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <button
                          onClick={() => toggleResidentStatus('200324511540', residentStatuses['200324511540'])}
                          style={{
                            background: 'transparent',
                            border: '1.5px solid',
                            borderColor: residentStatuses['200324511540'] === 'Active' ? '#f43f5e' : '#10b981',
                            color: residentStatuses['200324511540'] === 'Active' ? '#f43f5e' : '#10b981',
                            padding: '6px 16px',
                            borderRadius: '50px',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          {residentStatuses['200324511540'] === 'Active' ? 'Suspend Profile' : 'Activate Profile'}
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr style={{ borderBottom: 'none' }}>
                      <td style={{ padding: '20px 24px', fontWeight: '750', color: '#ffffff' }}>Kamala Silva</td>
                      <td style={{ padding: '20px 24px', color: '#94a3b8' }}>789456123V</td>
                      <td style={{ padding: '20px 24px', color: '#f8fafc' }}>Maharagama Office</td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: residentStatuses['789456123V'] === 'Active' ? '#064e3b' : '#991b1b', color: residentStatuses['789456123V'] === 'Active' ? '#34d399' : '#f87171', padding: '3px 8px', borderRadius: '50px', textTransform: 'uppercase' }}>
                          {residentStatuses['789456123V'] || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <button
                          onClick={() => toggleResidentStatus('789456123V', residentStatuses['789456123V'] || 'Active')}
                          style={{
                            background: 'transparent',
                            border: '1.5px solid',
                            borderColor: (residentStatuses['789456123V'] || 'Active') === 'Active' ? '#f43f5e' : '#10b981',
                            color: (residentStatuses['789456123V'] || 'Active') === 'Active' ? '#f43f5e' : '#10b981',
                            padding: '6px 16px',
                            borderRadius: '50px',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          {(residentStatuses['789456123V'] || 'Active') === 'Active' ? 'Suspend Profile' : 'Activate Profile'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TROUBLESHOOT */}
          {activeTab === 'troubleshoot' && (
            <div className="animate-zoom-in">
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#ffffff' }}>Troubleshoot Local Server Node</h2>
                <span style={{ fontSize: '13.5px', color: '#94a3b8' }}>Flush operational caches, secure registries pipelines, and correct data inconsistencies.</span>
              </div>

              <div className="dashboard-announcements-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '32px', textAlign: 'left' }}>
                <h3 className="card-inner-title" style={{ color: '#ffffff', fontSize: '16px', marginBottom: '16px' }}>Diagnostic Diagnostics Center</h3>
                
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                  If residents experience latency or data mismatches during allowance applications or certificate requests, run the system optimization tool. This optimizes RTGS clearing queues and flushes temporary server assets.
                </p>

                {/* Progress Bar */}
                {runningDiagnostic && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#fedc9b', fontWeight: '800', marginBottom: '8px' }}>
                      <span>Running Security Diagnostics & Flush cache...</span>
                      <span>{diagnosticProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#334155', borderRadius: '50px', overflow: 'hidden' }}>
                      <div style={{ width: `${diagnosticProgress}%`, height: '100%', backgroundColor: '#d97706', transition: 'width 0.4s ease' }}></div>
                    </div>
                  </div>
                )}

                {/* Live Logs console */}
                {diagnosticLogs.length > 0 && (
                  <div style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', fontSize: '12.5px', color: '#38bdf8', height: '160px', overflowY: 'auto', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {diagnosticLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                )}

                <button
                  onClick={startTroubleshoot}
                  disabled={runningDiagnostic}
                  className="btn-form-submit"
                  style={{
                    background: '#d97706',
                    color: '#ffffff',
                    padding: '12px 32px',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '800',
                    border: 'none',
                    cursor: runningDiagnostic ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                  }}
                >
                  {runningDiagnostic ? 'Optimizing Local Nodes...' : '🔧 Run Diagnostics & Flush Cache'}
                </button>
              </div>
            </div>
          )}

          {/* Floating Help Trigger */}
          <button className="floating-dashboard-help" aria-label="Help Trigger" onClick={onOpenHelp}>
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <footer className="landing-footer" style={{ padding: '16px 64px', borderTop: 'none', background: '#1e293b', borderTop: '1px solid #334155' }}>
        <div className="footer-copyright">
          <p style={{ color: '#94a3b8', margin: 0 }}>© 2026 SmartGN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default AdminDashboard
