import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function OfficerLogin() {
  const navigate = useNavigate()
  const [officerId, setOfficerId] = useState('')
  const [division, setDivision] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const statuses = localStorage.getItem('smartgn_officers_profiles_status')
    if (!statuses) {
      const defaultStatuses = {
        '200324511540': 'Active', // Kamal Perera
        'Sunil Silva ID': 'Active', // Sunil Silva
        'Kamal Perera': 'Active',
        'Sunil Silva': 'Active'
      }
      localStorage.setItem('smartgn_officers_profiles_status', JSON.stringify(defaultStatuses))
    }
  }, [])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!officerId || !division || !password) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    try {
      const response = await fetch('/api/auth/login/officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: officerId, password })
      })

      const data = await response.json()
      if (!response.ok) {
        setErrorMessage(data.error || 'Invalid GN credentials or password.')
        return
      }

      // Store JWT token details in localStorage for dynamic headers integration
      localStorage.setItem('smartgn_token', data.token)
      localStorage.setItem('smartgn_user_role', 'OFFICER')
      localStorage.setItem('smartgn_user_id', data.user.id)

      navigate('/dashboard/officer', { 
        state: { 
          successUser: data.user.name, 
          officerId: data.user.id 
        } 
      })
    } catch (err) {
      setErrorMessage('Network connection error. Please make sure the MySQL backend server is active.')
    }
  }

  return (
    <div className="screen-fade-active">
      <div className="form-header">
        <button className="btn-back" onClick={() => navigate('/login')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
        <div className="form-title-group">
          <h3>GN Officer Portal</h3>
          <p>Manage and issue official requests</p>
        </div>
      </div>

      <form onSubmit={handleLoginSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="officerId">GN Officer ID</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input 
                type="text" 
                id="officerId" 
                className="form-control" 
                placeholder="Enter your GN Officer ID"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="division">Grama Niladhari Division</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              <input 
                type="text" 
                id="division" 
                className="form-control" 
                placeholder="e.g., Colombo 03"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="officerPassword">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input 
                type="password" 
                id="officerPassword" 
                className="form-control" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 16px 0', textAlign: 'left' }}>
            {errorMessage}
          </p>
        )}

        <button type="submit" className="btn-submit">
          Sign In
        </button>
      </form>
    </div>
  )
}

export default OfficerLogin
