import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../utils/translate'

function RoleSelection() {
  const navigate = useNavigate()
  const { lang } = useLanguage()

  const roleTranslations = {
    EN: {
      back: "Back to Home",
      title: "How would you like to proceed?",
      resident: "Village Resident",
      officer: "GN Officer",
      admin: "System Admin",
      noAccount: "Don't have an account?",
      register: "Register here"
    },
    SI: {
      back: "ආපසු මුල් පිටුවට",
      title: "ඔබ ඉදිරියට යාමට කැමති කෙසේද?",
      resident: "ගම්වැසියා",
      officer: "ග්‍රාම නිලධාරී",
      admin: "පද්ධති පරිපාලක",
      noAccount: "ගිණුමක් නොමැතිද?",
      register: "මෙහි ලියාපදිංචි වන්න"
    },
    TA: {
      back: "முகப்பிற்குத் திரும்பு",
      title: "நீங்கள் எவ்வாறு தொடர விரும்புகிறீர்கள்?",
      resident: "கிராமவாசி",
      officer: "கிராம நிலதாரி அதிகாரி",
      admin: "கணினி நிர்வாகி",
      noAccount: "கணக்கு இல்லையா?",
      register: "இங்கே பதிவு செய்க"
    }
  }

  const tRole = roleTranslations[lang] || roleTranslations.EN

  return (
    <div className="screen-fade-active">
      <div className="form-header" style={{ marginBottom: '24px', justifyContent: 'flex-start' }}>
        <button className="btn-back" onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {tRole.back}
        </button>
      </div>

      <h2 className="portal-title">{tRole.title}</h2>
      
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
          <span className="role-label">{tRole.resident}</span>
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
          <span className="role-label">{tRole.officer}</span>
        </button>

        {/* System Administrator Selection Card */}
        <button 
          className="role-button"
          onClick={() => navigate('/login/admin')}
          aria-label="Proceed as System Admin"
        >
          <div className="role-icon-wrapper">
            <svg width="30" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <span className="role-label">{tRole.admin}</span>
        </button>
      </div>

      <div className="account-help">
        {tRole.noAccount}{' '}
        <span 
          className="link-orange" 
          onClick={() => navigate('/register')}
          style={{ cursor: 'pointer' }}
        >
          {tRole.register}
        </span>
      </div>
    </div>
  )
}

export default RoleSelection
