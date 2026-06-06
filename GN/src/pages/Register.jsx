import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  
  // Registration Form States
  const [role, setRole] = useState('RESIDENT') // 'RESIDENT' | 'OFFICER'
  const [nic, setNic] = useState('') // NIC for resident, username/ID for officer
  const [household, setHousehold] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [mobile, setMobile] = useState('')
  const [division, setDivision] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    
    // Check if fields are empty based on role
    if (role === 'RESIDENT') {
      if (!nic || !household || !firstName || !lastName || !email || !dob || !gender || !mobile || !division || !password || !confirmPassword) {
        setErrorMessage('Please fill in all fields.')
        return
      }
    } else {
      if (!nic || !firstName || !lastName || !email || !mobile || !division || !password || !confirmPassword) {
        setErrorMessage('Please fill in all required fields.')
        return
      }
    }
    
    // Password match check
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    try {
      const endpoint = role === 'RESIDENT' ? '/api/auth/register' : '/api/auth/register/officer'
      const bodyPayload = role === 'RESIDENT' ? {
        nic,
        name: `${firstName} ${lastName}`,
        dob,
        password,
        gender,
        mobile,
        email,
        householdNumber: household,
        division
      } : {
        username: nic,
        name: `${firstName} ${lastName}`,
        email,
        mobile,
        division,
        password
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      })

      const data = await response.json()
      if (!response.ok) {
        setErrorMessage(data.error || 'Registration failed. Please verify your details.')
        return
      }

      setErrorMessage('')
      // Transition to success screen
      navigate('/success', { 
        state: { 
          successUser: `${firstName} ${lastName} (${role === 'RESIDENT' ? 'NIC' : 'Officer Username'}: ${nic})`,
          isRegister: true
        } 
      })
    } catch (err) {
      setErrorMessage('Network connection error. Please make sure the MySQL backend server is active.')
    }
  }

  return (
    <div className="screen-fade-active register-page">
      <h2 className="register-title" style={{ marginBottom: '16px' }}>Create your account</h2>
      
      {/* Role Selection Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
        <button 
          type="button"
          onClick={() => { setRole('RESIDENT'); setErrorMessage(''); }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            backgroundColor: role === 'RESIDENT' ? '#d97706' : '#f1f5f9',
            color: role === 'RESIDENT' ? '#ffffff' : '#475569',
            transition: 'all 0.2s',
            boxShadow: role === 'RESIDENT' ? '0 4px 6px -1px rgba(217, 119, 6, 0.2)' : 'none'
          }}
        >
          Resident Sign Up
        </button>
        <button 
          type="button"
          onClick={() => { setRole('OFFICER'); setErrorMessage(''); }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            backgroundColor: role === 'OFFICER' ? '#d97706' : '#f1f5f9',
            color: role === 'OFFICER' ? '#ffffff' : '#475569',
            transition: 'all 0.2s',
            boxShadow: role === 'OFFICER' ? '0 4px 6px -1px rgba(217, 119, 6, 0.2)' : 'none'
          }}
        >
          GN Officer Sign Up
        </button>
      </div>

      <form onSubmit={handleRegisterSubmit}>
        <div className="register-grid">
          
          {/* Row 1 */}
          <div className="form-group">
            <label htmlFor="nic">{role === 'RESIDENT' ? 'NIC Number' : 'Officer Username / ID'}</label>
            <input 
              type="text" 
              id="nic" 
              className="register-control" 
              placeholder={role === 'RESIDENT' ? "Enter NIC Number" : "Enter Username"}
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              required
            />
          </div>

          {role === 'RESIDENT' ? (
            <div className="form-group">
              <label htmlFor="household">Household Number</label>
              <input 
                type="text" 
                id="household" 
                className="register-control" 
                placeholder="Enter Household Number"
                value={household}
                onChange={(e) => setHousehold(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="division">Grama Niladhari Division</label>
              <div className="select-wrapper">
                <select 
                  id="division" 
                  className="register-control register-select" 
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>Select division</option>
                  <option value="Colombo 03">Colombo 03</option>
                  <option value="Colombo 07">Colombo 07</option>
                  <option value="Kandy Town">Kandy Town</option>
                  <option value="Galle Fort">Galle Fort</option>
                  <option value="Negombo South">Negombo South</option>
                  <option value="Colombo, Borella">Colombo, Borella</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>
          )}

          {/* Row 2 */}
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              className="register-control" 
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              className="register-control" 
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Row 3 - Full Width */}
          <div className="form-group col-span-2">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="register-control" 
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Row 4 (Only for Resident) */}
          {role === 'RESIDENT' && (
            <>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input 
                  type="date" 
                  id="dob" 
                  className="register-control" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <div className="select-wrapper">
                  <select 
                    id="gender" 
                    className="register-control register-select" 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="" disabled hidden></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>
            </>
          )}

          {/* Row 5 */}
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input 
              type="tel" 
              id="mobile" 
              className="register-control" 
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          {role === 'RESIDENT' ? (
            <div className="form-group">
              <label htmlFor="division">Select GN Division</label>
              <div className="select-wrapper">
                <select 
                  id="division" 
                  className="register-control register-select" 
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>Select division</option>
                  <option value="Colombo 03">Colombo 03</option>
                  <option value="Colombo 07">Colombo 07</option>
                  <option value="Kandy Town">Kandy Town</option>
                  <option value="Galle Fort">Galle Fort</option>
                  <option value="Negombo South">Negombo South</option>
                  <option value="Colombo, Borella">Colombo, Borella</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>
          ) : (
            <div className="form-group" style={{ display: 'none' }}></div>
          )}

          {/* Row 6 */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="register-control" 
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="register-control" 
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

        </div>

        {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0 0 0', textAlign: 'left' }}>
            {errorMessage}
          </p>
        )}

        <button type="submit" className="btn-register-submit">
          Create Account
        </button>
      </form>

      <div className="register-help">
        Already have an account ?{' '}
        <span 
          className="link-orange" 
          onClick={() => navigate('/login')}
          style={{ cursor: 'pointer' }}
        >
          Login here
        </span>
      </div>
    </div>
  )
}

export default Register
