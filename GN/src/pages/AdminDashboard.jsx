import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'

function AdminDashboard({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session user details
  const successUser = location.state?.successUser || 'System Admin'

  const adminDict = {
    EN: {
      consoleTitle: "Divisional System Admin Console",
      overview: "Dashboard Overview",
      officers: "GN Officer Accounts",
      residents: "Resident Profiles",
      troubleshoot: "Troubleshoot Node",
      logout: "Log Out Admin",
      systemOverview: "System Overview",
      totalGN: "Total GN Officers",
      regResidents: "Registered Residents",
      rtgsTransfers: "RTGS Money Transfers",
      serverNode: "System Server Node",
      healthy: "Healthy",
      cleared: "Cleared Gateway",
      recentLogs: "Recent System Auditing Logs",
      officerRegistry: "GN Officer Profile Registry",
      officerSub: "Temporarily deactivate or suspend divisional officers if they cause policy troubles.",
      residentRegistry: "Resident Account Registry",
      residentSub: "Block or suspend residential profiles if they make troubles in household applications.",
      thName: "Officer Name",
      thID: "Officer ID",
      thOffice: "Divisional Office",
      thStatus: "Registry Status",
      thAction: "Actions Control",
      thResName: "Resident Name",
      thNIC: "NIC Number",
      thResOffice: "Household Division",
      thResStatus: "Active Status",
      troubleshootSub: "Flush operational caches, secure registries pipelines, and correct data inconsistencies.",
      diagnosticCenter: "Diagnostic Diagnostics Center",
      diagnosticDesc: "If residents experience latency or data mismatches during allowance applications or certificate requests, run the system optimization tool. This optimizes RTGS clearing queues and flushes temporary server assets.",
      runDiagnostic: "Run Diagnostics & Flush Cache",
      optimizing: "Optimizing Local Nodes...",
      diagnosticsSuccessAlert: "Diagnostics Sweep & Cache optimization completed successfully!"
    },
    SI: {
      consoleTitle: "කොට්ඨාස පද්ධති පරිපාලන කොන්සෝලය",
      overview: "පාලන පුවරුව",
      officers: "ග්‍රාම නිලධාරී ගිණුම්",
      residents: "ගම්වැසි ගිණුම්",
      troubleshoot: "නෝඩය දෝෂාවේක්ෂණය",
      logout: "පරිපාලක පිටවීම",
      systemOverview: "පද්ධති දළ විශ්ලේෂණය",
      totalGN: "මුළු ග්‍රාම නිලධාරීන්",
      regResidents: "ලියාපදිංචි ගම්වැසියන්",
      rtgsTransfers: "RTGS මුදල් බැර කිරීම්",
      serverNode: "පද්ධති සේවා නෝඩය",
      healthy: "නිරෝගී",
      cleared: "සම්පූර්ණයි",
      recentLogs: "මෑත කාලීන පද්ධති විගණන ලඝු-සටහන්",
      officerRegistry: "ග්‍රාම නිලධාරී පැතිකඩ ලේඛනය",
      officerSub: "ප්‍රතිපත්තිමය ගැටළු ඇති කරන්නේ නම් කොට්ඨාස නිලධාරීන් තාවකාලිකව අත්හිටුවන්න.",
      residentRegistry: "ගම්වැසි ගිණුම් ලේඛනය",
      residentSub: "නිවාස අයදුම්පත් වලදී ගැටළු ඇති කරන්නේ නම් ගම්වැසියන් තාවකාලිකව අත්හිටුවන්න.",
      thName: "නිලධාරී නම",
      thID: "නිලධාරී හැඳුනුම්පත",
      thOffice: "කොට්ඨාස කාර්යාලය",
      thStatus: "ලේඛන තත්ත්වය",
      thAction: "ක්‍රියාමාර්ග පාලනය",
      thResName: "ගම්වැසියාගේ නම",
      thNIC: "ජාතික හැඳුනුම්පත් අංකය",
      thResOffice: "නිවාස කොට්ඨාසය",
      thResStatus: "ක්‍රියාකාරී තත්ත්වය",
      troubleshootSub: "සේවා හැඹිලි මකා දමා, ලේඛන නල මාර්ග සුරක්ෂිත කර දත්ත දෝෂ නිවැරදි කරන්න.",
      diagnosticCenter: "රෝග විනිශ්චය මධ්‍යස්ථානය",
      diagnosticDesc: "දීමනා අයදුම්පත් හෝ සහතික ඉල්ලීම් වලදී ගම්වැසියන්ට ප්‍රමාදයක් හෝ දත්ත නොගැලපීමක් සිදුවුවහොත්, පද්ධති ප්‍රශස්තකරණ මෙවලම ක්‍රියාත්මක කරන්න.",
      runDiagnostic: "රෝග විනිශ්චය ධාවනය කර හැඹිලිය මකන්න",
      optimizing: "දේශීය නෝඩ් ප්‍රශස්තකරණය...",
      diagnosticsSuccessAlert: "දේශීය නෝඩ් ප්‍රශස්තකරණය සහ හැඹිලිය සාර්ථකව මකා දමන ලදී!"
    },
    TA: {
      consoleTitle: "பிரிவு கணினி நிர்வாக கன்சோல்",
      overview: "டாஷ்போர்டு மேலோட்டம்",
      officers: "கிராம நிலதாரி கணக்குகள்",
      residents: "குடியிருப்பாளர் சுயவிவரங்கள்",
      troubleshoot: "முனையைச் சரிசெய்யவும்",
      logout: "நிர்வாகி வெளியேறு",
      systemOverview: "கணினி மேலோட்டம்",
      totalGN: "மொத்த கிராம நிலதாரிகள்",
      regResidents: "பதிவு செய்யப்பட்ட குடியிருப்பாளர்கள்",
      rtgsTransfers: "RTGS பண பரிமாற்றங்கள்",
      serverNode: "கணினி சேவையக முனை",
      healthy: "ஆரோக்கியமானது",
      cleared: "பரிமாற்றம் முடிந்தது",
      recentLogs: "சமீபத்திய கணினி தணிக்கை பதிவுகள்",
      officerRegistry: "கிராம நிலதாரி சுயவிவர பதிவேடு",
      officerSub: "கொள்கை சிக்கல்களை ஏற்படுத்தினால் தற்காலிகமாக அதிகாரிகளை இடைநிறுத்துங்கள்.",
      residentRegistry: "குடியிருப்பாளர் கணக்கு பதிவேடு",
      residentSub: "வீட்டு விண்ணப்பங்களில் சிக்கல்களை ஏற்படுத்தினால் குடியிருப்பாளர்களை இடைநிறுத்துங்கள்.",
      thName: "அதிகாரி பெயர்",
      thID: "அதிகாரி ஐடி",
      thOffice: "பிரிவு அலுவலகம்",
      thStatus: "பதிவேடு நிலை",
      thAction: "நடவடிக்கை கட்டுப்பாடு",
      thResName: "குடியிருப்பாளர் பெயர்",
      thNIC: "NIC எண்",
      thResOffice: "வீட்டுப் பிரிவு",
      thResStatus: "செயலில் உள்ள நிலை",
      troubleshootSub: "இயக்க தற்காலிக சேமிப்புகளை அழித்து, தரவு முரண்பாடுகளை சரிசெய்யவும்.",
      diagnosticCenter: "நோயறிதல் மையம்",
      diagnosticDesc: "குடியிருப்பாளர்கள் கொடுப்பனவு அல்லது சான்றிதழ் விண்ணப்பங்களின் போது தாமதத்தை எதிர்கொண்டால், கணினி மேம்படுத்தல் கருவியை இயக்கவும்.",
      runDiagnostic: "நோயறிதலை இயக்கி தற்காலிக சேமிப்பை அழிக்கவும்",
      optimizing: "உள்ளூர் முனைகளை மேம்படுத்துகிறது...",
      diagnosticsSuccessAlert: "நோயறிதல் மற்றும் தற்காலிக சேமிப்பு வெற்றிகரமாக அழிக்கப்பட்டது!"
    }
  }

  const dA = adminDict[lang] || adminDict.EN

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
    <div className="dashboard-container admin-theme" style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 1. Header */}
      <header className="dashboard-header" style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
        <div className="landing-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-smart" style={{ color: '#d97706' }}>Smart</span>
          <span className="logo-gn" style={{ color: '#ffffff' }}>GN</span>
          <p className="logo-subtext" style={{ color: '#94a3b8' }}>{dA.consoleTitle}</p>
        </div>

        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', background: '#334155', color: '#fedc9b', padding: '4px 12px', borderRadius: '50px', fontWeight: '800' }}>
            System ROOT Mode
          </span>
          <LanguageSelector />
          
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
              📊 <span>{dA.overview}</span>
            </button>

            <button 
              className={`menu-btn ${activeTab === 'officers' ? 'active' : ''}`}
              onClick={() => setActiveTab('officers')}
              style={{ color: '#94a3b8', background: activeTab === 'officers' ? 'rgba(217,119,6,0.15)' : 'transparent' }}
            >
              🏢 <span>{dA.officers}</span>
            </button>

            <button 
              className={`menu-btn ${activeTab === 'residents' ? 'active' : ''}`}
              onClick={() => setActiveTab('residents')}
              style={{ color: '#94a3b8', background: activeTab === 'residents' ? 'rgba(217,119,6,0.15)' : 'transparent' }}
            >
              👥 <span>{dA.residents}</span>
            </button>

            <button 
              className={`menu-btn ${activeTab === 'troubleshoot' ? 'active' : ''}`}
              onClick={() => setActiveTab('troubleshoot')}
              style={{ color: '#94a3b8', background: activeTab === 'troubleshoot' ? 'rgba(217,119,6,0.15)' : 'transparent' }}
            >
              🔧 <span>{dA.troubleshoot}</span>
            </button>

            <button 
              className="menu-btn" 
              onClick={() => navigate('/login')}
              style={{ color: '#f43f5e', marginTop: '32px' }}
            >
              ➔ <span>{dA.logout}</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel Content */}
        <main className="dashboard-content" style={{ padding: '32px' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-zoom-in">
              <h2 style={{ fontSize: '22px', fontWeight: '800', textAlign: 'left', marginBottom: '24px', color: '#ffffff' }}>{dA.systemOverview}</h2>
              
              {/* Stats Grid */}
              <div className="stats-row-grid" style={{ marginBottom: '32px' }}>
                <div className="stat-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>{dA.totalGN}</span>
                  <span className="stat-value" style={{ color: '#ffffff' }}>2 Active</span>
                  <span className="stat-subtext-note" style={{ color: '#10b981' }}>Colombo, Maharagama</span>
                </div>

                <div className="stat-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>{dA.regResidents}</span>
                  <span className="stat-value" style={{ color: '#ffffff' }}>1,240</span>
                  <span className="stat-subtext-note" style={{ color: '#10b981' }}>+12 New submissions</span>
                </div>

                <div className="stat-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>{dA.rtgsTransfers}</span>
                  <span className="stat-value" style={{ color: '#ffffff' }}>Rs. 17,500</span>
                  <span className="stat-subtext-note" style={{ color: '#10b981' }}>{dA.cleared}</span>
                </div>

                <div className="stat-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>{dA.serverNode}</span>
                  <span className="stat-value" style={{ color: '#10b981' }}>{dA.healthy}</span>
                  <span className="stat-subtext-note" style={{ color: '#94a3b8' }}>DB latency: 2ms</span>
                </div>
              </div>

              {/* System alerts logs panel */}
              <div className="dashboard-announcements-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', textAlign: 'left' }}>
                <h3 className="card-inner-title" style={{ color: '#ffffff', fontSize: '16px', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '16px' }}>
                  {dA.recentLogs}
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
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#ffffff' }}>{dA.officerRegistry}</h2>
                <span style={{ fontSize: '13.5px', color: '#94a3b8' }}>{dA.officerSub}</span>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      <th style={{ padding: '16px 24px' }}>{dA.thName}</th>
                      <th style={{ padding: '16px 24px' }}>{dA.thID}</th>
                      <th style={{ padding: '16px 24px' }}>{dA.thOffice}</th>
                      <th style={{ padding: '16px 24px' }}>{dA.thStatus}</th>
                      <th style={{ padding: '16px 24px', textAlign: 'right' }}>{dA.thAction}</th>
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
                          {officerStatuses['200324511540'] === 'Active' ? (lang === 'EN' ? 'Active' : lang === 'SI' ? 'ක්‍රියාකාරී' : 'செயலில் உள்ளது') : (lang === 'EN' ? 'Suspended' : lang === 'SI' ? 'අත්හිටුවා ඇත' : 'இடைநிறுத்தப்பட்டுள்ளது')}
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
                          {officerStatuses['200324511540'] === 'Active' ? (lang === 'EN' ? 'Deactivate Suspended' : lang === 'SI' ? 'අත්හිටුවන්න' : 'இடைநிறுத்துக') : (lang === 'EN' ? 'Activate Officer' : lang === 'SI' ? 'සක්‍රීය කරන්න' : 'செயல்படுத்துக')}
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
                          {(officerStatuses['Sunil Silva ID'] || 'Active') === 'Active' ? (lang === 'EN' ? 'Active' : lang === 'SI' ? 'ක්‍රියාකාරී' : 'செயலில் உள்ளது') : (lang === 'EN' ? 'Suspended' : lang === 'SI' ? 'අත්හිටුවා ඇත' : 'இடைநிறுத்தப்பட்டுள்ளது')}
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
                          {(officerStatuses['Sunil Silva ID'] || 'Active') === 'Active' ? (lang === 'EN' ? 'Deactivate Suspended' : lang === 'SI' ? 'අත්හිටුවන්න' : 'இடைநிறுத்துக') : (lang === 'EN' ? 'Activate Officer' : lang === 'SI' ? 'සක්‍රීය කරන්න' : 'செயல்படுத்துக')}
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
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#ffffff' }}>{dA.residentRegistry}</h2>
                <span style={{ fontSize: '13.5px', color: '#94a3b8' }}>{dA.residentSub}</span>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      <th style={{ padding: '16px 24px' }}>{dA.thResName}</th>
                      <th style={{ padding: '16px 24px' }}>{dA.thNIC}</th>
                      <th style={{ padding: '16px 24px' }}>{dA.thResOffice}</th>
                      <th style={{ padding: '16px 24px' }}>{dA.thResStatus}</th>
                      <th style={{ padding: '16px 24px', textAlign: 'right' }}>{dA.thAction}</th>
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
                          {residentStatuses['200324511540'] === 'Active' ? (lang === 'EN' ? 'Active' : lang === 'SI' ? 'ක්‍රියාකාරී' : 'செயலில் உள்ளது') : (lang === 'EN' ? 'Suspended' : lang === 'SI' ? 'අත්හිටුවා ඇත' : 'இடைநிறுத்தப்பட்டுள்ளது')}
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
                          {residentStatuses['200324511540'] === 'Active' ? (lang === 'EN' ? 'Suspend Profile' : lang === 'SI' ? 'අත්හිටුවන්න' : 'இடைநிறுத்துக') : (lang === 'EN' ? 'Activate Profile' : lang === 'SI' ? 'සක්‍රීය කරන්න' : 'செயல்படுத்துக')}
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
                          {(residentStatuses['789456123V'] || 'Active') === 'Active' ? (lang === 'EN' ? 'Active' : lang === 'SI' ? 'ක්‍රියාකාරී' : 'செயலில் உள்ளது') : (lang === 'EN' ? 'Suspended' : lang === 'SI' ? 'අත්හිටුවා ඇත' : 'இடைநிறுத்தப்பட்டுள்ளது')}
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
                          {(residentStatuses['789456123V'] || 'Active') === 'Active' ? (lang === 'EN' ? 'Suspend Profile' : lang === 'SI' ? 'අත්හිටුවන්න' : 'இடைநிறுத்துக') : (lang === 'EN' ? 'Activate Profile' : lang === 'SI' ? 'සක්‍රීය කරන්න' : 'செயல்படுத்துக')}
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
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#ffffff' }}>{dA.troubleshoot}</h2>
                <span style={{ fontSize: '13.5px', color: '#94a3b8' }}>{dA.troubleshootSub}</span>
              </div>

              <div className="dashboard-announcements-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '32px', textAlign: 'left' }}>
                <h3 className="card-inner-title" style={{ color: '#ffffff', fontSize: '16px', marginBottom: '16px' }}>{dA.diagnosticCenter}</h3>
                
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                  {dA.diagnosticDesc}
                </p>

                {/* Progress Bar */}
                {runningDiagnostic && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#fedc9b', fontWeight: '800', marginBottom: '8px' }}>
                      <span>{lang === 'EN' ? 'Running Security Diagnostics & Flush cache...' : lang === 'SI' ? 'ආරක්ෂක රෝග විනිශ්චය ධාවනය වේ...' : 'பாதுகாப்பு நோயறிதல் இயங்குகிறது...'}</span>
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
                  {runningDiagnostic ? dA.optimizing : `🔧 ${dA.runDiagnostic}`}
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
