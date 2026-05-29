import { useLocation, useNavigate } from 'react-router-dom'

function Success() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const successUser = location.state?.successUser || 'Authorized User'

  return (
    <div className="screen-fade-active success-screen">
      <div className="success-icon-wrapper">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h3 style={{ fontSize: '22px', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
        Access Authorized
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        You have successfully logged in/registered as: <br />
        <strong style={{ color: 'var(--accent-color)', display: 'block', marginTop: '6px', fontSize: '15px' }}>
          {successUser}
        </strong>
      </p>
      <button onClick={() => navigate('/')} className="btn-submit" style={{ maxWidth: '200px', margin: '0 auto' }}>
        Return to Portal
      </button>
    </div>
  )
}

export default Success
