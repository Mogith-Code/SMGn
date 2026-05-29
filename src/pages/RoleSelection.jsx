import { useNavigate } from 'react-router-dom'

function RoleSelection() {
  const navigate = useNavigate()

  return (
    <div className="screen-fade-active">
      <div className="form-header" style={{ marginBottom: '24px', justifyContent: 'flex-start' }}>
        <button className="btn-back" onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
      </div>

      <h2 className="portal-title">How would you like to proceed ?</h2>
      
      <div className="roles-row">
        {/* Resident Selection Card */}
        <button 
          className="role-button"
          onClick={() => navigate('/login/resident')}
          aria-label="Proceed as Village Resident"
        >
          <div className="role-icon-wrapper">
            <svg width="24" height="34" viewBox="0 0 24 34" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="6.5" r="5.5" />
              <path d="M4 16C4 14.3431 5.34315 13 7 13H17C18.6569 13 20 14.3431 20 16V26C20 26.5523 19.5523 27 19 27H16.5V32C16.5 32.5523 16.0523 33 15.5 33H13.5C12.9477 33 12.5 32.5523 12.5 32V27H11.5V32C11.5 32.5523 11.0523 33 10.5 33H8.5C7.94772 33 7.5 32.5523 7.5 32V27H5C4.44772 27 4 26.5523 4 26V16Z" />
            </svg>
          </div>
          <span className="role-label">Village Resident</span>
        </button>

        {/* GN Officer Selection Card */}
        <button 
          className="role-button"
          onClick={() => navigate('/login/officer')}
          aria-label="Proceed as GN Officer"
        >
          <div className="role-icon-wrapper">
            <svg width="30" height="34" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2.5" y="2.5" width="19" height="23" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <rect x="9.5" y="5.5" width="5" height="1.5" rx="0.75" fill="currentColor"/>
              <circle cx="12" cy="12.5" r="3.5" fill="currentColor"/>
              <path d="M6.5 21C6.5 18.7 8.7 17 12 17C15.3 17 17.5 18.7 17.5 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="role-label">GN Officer</span>
        </button>
      </div>

      <div className="account-help">
        Don't have an account ? 
        <span 
          className="link-orange" 
          onClick={() => navigate('/register')}
          style={{ cursor: 'pointer' }}
        >
          Register here
        </span>
      </div>
    </div>
  )
}

export default RoleSelection
