import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ResidentLogin() {
  const navigate = useNavigate()
  const [nic, setNic] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const statuses = localStorage.getItem('smartgn_residents_profiles_status')
    if (!statuses) {
      const defaultStatuses = {
        '200324511540': 'Active', // Nimal Perera
        '789456123V': 'Active',   // Kamala Silva
        'Nimal Perera': 'Active',
        'Kamala Silva': 'Active'
      }
      localStorage.setItem('smartgn_residents_profiles_status', JSON.stringify(defaultStatuses))
    }
  }, [])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!nic || !password) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    try {
      const response = await fetch('/api/auth/login/resident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nic, password })
      })

      const data = await response.json()
      if (!response.ok) {
        setErrorMessage(data.error || 'Invalid NIC number or password.')
        return
      }

      // Store JWT token details in localStorage for dynamic headers integration
      localStorage.setItem('smartgn_token', data.token)
      localStorage.setItem('smartgn_user_role', 'RESIDENT')
      localStorage.setItem('smartgn_user_id', data.user.nic)
      localStorage.setItem('smartgn_user_division', data.user.division || 'Colombo, Borella')
      localStorage.setItem('smartgn_user_name', data.user.name)

      navigate('/dashboard/resident', { 
        state: { 
          successUser: data.user.name, 
          division: data.user.division || 'Colombo, Borella',
          nic: data.user.nic 
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
          <h3>Village Resident</h3>
          <p>Access your Grama Niladhari services</p>
        </div>
      </div>

      <form onSubmit={handleLoginSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nic">NIC (National Identity Card) Number</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                  <circle cx="9" cy="12" r="3"></circle>
                  <line x1="17" y1="9" x2="17" y2="9"></line>
                  <line x1="15" y1="15" x2="19" y2="15"></line>
                </svg>
              </span>
              <input 
                type="text" 
                id="nic" 
                className="form-control" 
                placeholder="e.g., 199912345678 or 991234567V" 
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input 
                type="password" 
                id="password" 
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

export default ResidentLogin
