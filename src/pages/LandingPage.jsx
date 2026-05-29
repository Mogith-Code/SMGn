import { useNavigate } from 'react-router-dom'

function LandingPage({ onOpenHelp }) {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      
      {/* 1. Header/Navbar */}
      <header className="landing-navbar">
        <div className="landing-logo">
          <span className="logo-smart">Smart</span>
          <span className="logo-gn">GN</span>
          <p className="logo-subtext">Digital Grama Niladhari Service Management System</p>
        </div>

        <nav className="landing-nav-links">
          <a href="#home" className="nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </a>
          <a href="#about" className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            About
          </a>
          <a href="#services" className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Services
          </a>
        </nav>

        <div className="landing-lang-selector">
          <div className="lang-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lang-globe-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>English</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" className="lang-chevron">
              <path d="M1 1.5L6 6.5L11 1.5"></path>
            </svg>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="landing-hero" id="home">
        
        {/* State Banner */}
        <div className="state-banner">
          {/* Faux Sri Lankan State Emblem SVG */}
          <div className="emblem-container">
            <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="emblem-svg">
              <circle cx="32" cy="32" r="28" stroke="#d4af37" strokeWidth="2" fill="none" />
              <circle cx="32" cy="32" r="24" stroke="#d4af37" strokeWidth="1" fill="none" />
              {/* Gold decorative lines & circles representing Sri Lankan emblem shape */}
              <circle cx="32" cy="32" r="14" fill="#d4af37" opacity="0.2" />
              <path d="M32 6V58" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3 3"/>
              <path d="M6 32H58" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3 3"/>
              <polygon points="32,18 36,28 46,28 38,34 41,44 32,38 23,44 26,34 18,28 28,28" fill="#d4af37" />
            </svg>
          </div>

          <div className="trilingual-titles">
            <h2 className="title-tamil">கிராம உத்தியோகத்தர்</h2>
            <h2 className="title-sinhala">ග්‍රාම නිලධාරී</h2>
            <h1 className="title-english">Grama Niladhari</h1>
          </div>
        </div>

        {/* Hero Headline & Intro */}
        <p className="hero-subtext-para">
          Empowering you with effortless access to village administrative services. Connect with your Grama Niladhari officer and manage your official needs in just a few clicks.
        </p>

        {/* CTAs */}
        <div className="hero-ctas">
          <button className="btn-landing-login" onClick={() => navigate('/login')}>
            Login
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cta-icon">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </button>
          
          <button className="btn-landing-register" onClick={() => navigate('/register')}>
            Register
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cta-icon">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </button>

          <button className="btn-landing-help" aria-label="Help Center" onClick={onOpenHelp}>
            ?
          </button>
        </div>
      </section>

      {/* 3. About & Objectives Section */}
      <section className="landing-about-objectives" id="about">
        <div className="about-column">
          <h3 className="section-card-title">About SmartGN</h3>
          <p className="section-card-desc">
            SmartGN is a modern digital initiative designed to transform the traditional Grama Niladhari service into a high-speed, transparent, and user-friendly experience. We aim to bridge the gap between village-level administration and citizens by leveraging the latest technology to ensure every resident can access essential services from the comfort of their home.
          </p>
          <div className="about-watermark">GN</div>
        </div>

        <div className="objectives-column">
          <h3 className="section-card-title">Our Objectives</h3>
          <ul className="objectives-list">
            <li>
              <strong>Digital Transformation:</strong> Moving manual paperwork and physical registers into a secure, cloud-based management system.
            </li>
            <li>
              <strong>Service Accessibility:</strong> Ensuring that residents in even the most remote villages can request official documents and aid with a smartphone.
            </li>
            <li>
              <strong>Enhanced Transparency:</strong> Providing real-time tracking for applications so citizens know exactly when their requests are processed.
            </li>
            <li>
              <strong>Disaster Readiness:</strong> Establishing a direct digital link for emergency alerts and rapid distribution of relief allowances.
            </li>
            <li>
              <strong>Inclusivity:</strong> Offering a multilingual interface in Sinhala, Tamil, and English to serve every citizen in Sri Lanka equally.
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Services You Can Get Section */}
      <section className="landing-services" id="services">
        <h3 className="services-main-title">Services You Can Get</h3>
        
        <div className="services-grid">
          {/* Card 1 */}
          <div className="service-card" onClick={() => navigate('/login')}>
            <div className="service-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
                <path d="M12 14v4"></path>
              </svg>
            </div>
            <div className="service-info">
              <h4>Request Certificates</h4>
              <p>Apply for character certificates, income certificates, permit requests and more with digital verification.</p>
            </div>
            <span className="service-arrow">➔</span>
          </div>

          {/* Card 2 */}
          <div className="service-card" onClick={() => navigate('/login')}>
            <div className="service-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="service-info">
              <h4>Book Appointments</h4>
              <p>Schedule meetings with your Grama Niladhari officer at convenient times.</p>
            </div>
            <span className="service-arrow">➔</span>
          </div>

          {/* Card 3 */}
          <div className="service-card" onClick={() => navigate('/login')}>
            <div className="service-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="service-info">
              <h4>Track Requests</h4>
              <p>Check the status of your applications (pending, approved, or require further information).</p>
            </div>
            <span className="service-arrow">➔</span>
          </div>

          {/* Card 4 */}
          <div className="service-card" onClick={() => navigate('/login')}>
            <div className="service-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
            </div>
            <div className="service-info">
              <h4>Apply for Allowances</h4>
              <p>Register for Aswesuma, Samurdhi and other government allowance programs.</p>
            </div>
            <span className="service-arrow">➔</span>
          </div>

          {/* Card 5 */}
          <div className="service-card" onClick={() => navigate('/login')}>
            <div className="service-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 22h20L12 2z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="service-info">
              <h4>Disaster Relief</h4>
              <p>Report disaster damage and apply for government relief assistance.</p>
            </div>
            <span className="service-arrow">➔</span>
          </div>

          {/* Card 6 */}
          <div className="service-card" onClick={() => navigate('/login')}>
            <div className="service-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <div className="service-info">
              <h4>Announcements</h4>
              <p>Stay informed with official notices and community announcements.</p>
            </div>
            <span className="service-arrow">➔</span>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="landing-footer">
        <div className="footer-copyright">
          <p>© 2026 SmartGN. All rights reserved.</p>
        </div>
        <div className="footer-support">
          <p><strong>Admin Support:</strong></p>
          <p>Mobile : 0255731913</p>
          <p>Email: Admin@gmail.com</p>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage
