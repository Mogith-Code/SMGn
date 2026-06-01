import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    try {
      const response = await fetch('/api/auth/login/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()
      if (!response.ok) {
        setErrorMessage(data.error || 'Invalid administrator credentials.')
        return
      }

      // Store JWT token details in localStorage for dynamic headers integration
      localStorage.setItem('smartgn_token', data.token)
      localStorage.setItem('smartgn_user_role', 'ADMIN')
      localStorage.setItem('smartgn_user_id', data.user.id)

      navigate('/dashboard/admin', { 
        state: { 
          successUser: data.user.name 
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
          <h3>System Admin Portal</h3>
          <p>Configure services and profiles status</p>
        </div>
      </div>

      <form onSubmit={handleLoginSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="adminUsername">Admin Username</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input 
                type="text" 
                id="adminUsername" 
                className="form-control" 
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input 
                type="password" 
                id="adminPassword" 
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
          Admin Sign In
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
