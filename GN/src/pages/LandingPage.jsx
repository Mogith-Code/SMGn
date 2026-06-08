import { useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import logoImage from '../assets/logo.png'
import homeIcon from '../assets/home_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import aboutIcon from '../assets/info_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import servicesIcon from '../assets/accessibility_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'

function LandingPage({ onOpenHelp }) {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const t = translations[lang]

  const navTranslations = {
    EN: {
      about: "About",
      services: "Services",
      login: "Login",
      register: "Register",
      aboutTitle: "About SmartGN",
      aboutDesc: "SmartGN is a modern digital initiative designed to transform the traditional Grama Niladhari service into a high-speed, transparent, and user-friendly experience. We aim to bridge the gap between village-level administration and citizens by leveraging the latest technology to ensure every resident can access essential services from the comfort of their home.",
      objectivesTitle: "Our Objectives",
      servicesTitle: "Services You Can Get",
      servicesList: [
        { title: "Request Certificates", desc: "Apply for character certificates, income certificates, permit requests and more with digital verification." },
        { title: "Book Appointments", desc: "Schedule meetings with your Grama Niladhari officer at convenient times." },
        { title: "Track Requests", desc: "Check the status of your applications (pending, approved, or require further information)." },
        { title: "Apply for Allowances", desc: "Register for Aswesuma, Samurdhi and other government allowance programs." },
        { title: "Disaster Relief", desc: "Report disaster damage and apply for government relief assistance." },
        { title: "Announcements", desc: "Stay informed with official notices and community announcements." }
      ],
      heroDesc: "Empowering you with effortless access to village administrative services. Connect with your Grama Niladhari officer and manage your official needs in just a few clicks."
    },
    SI: {
      about: "අපි ගැන",
      services: "සේවාවන්",
      login: "ඇතුල් වන්න",
      register: "ලියාපදිංචි වන්න",
      aboutTitle: "SmartGN පිළිබඳව",
      aboutDesc: "SmartGN යනු සාම්ප්‍රදායික ග්‍රාම නිලධාරී සේවාව වඩාත් වේගවත්, විනිවිදභාවයකින් යුත් සහ පරිශීලක-හිතකාමී අත්දැකීමක් බවට පත් කිරීම සඳහා නිර්මාණය කර ඇති නවීන ඩිජිටල් මුලපිරීමකි. සෑම පදිංචිකරුවෙකුටම තමාගේම නිවසේ සිට අත්‍යවශ්‍ය සේවාවන් ලබාගත හැකි වන පරිදි නවීන තාක්ෂණය උපයෝගී කර ගනිමින් ගම් මට්ටමේ පරිපාලනය සහ පුරවැසියන් අතර පරතරය පියවීම අපගේ අරමුණයි.",
      objectivesTitle: "අපගේ අරමුණු",
      servicesTitle: "ඔබට ලබාගත හැකි සේවාවන්",
      servicesList: [
        { title: "සහතික ඉල්ලීම්", desc: "ඩිජිටල් සත්‍යාපනය සමඟ චරිත සහතික, ආදායම් සහතික සහ වෙනත් සහතික සඳහා ඉල්ලුම් කරන්න." },
        { title: "හමුවීම් වෙන්කරවා ගැනීම", desc: "පහසු වේලාවන්හිදී ඔබේ ග්‍රාම නිලධාරීවරයා සමඟ සාකච්ඡා වෙන්කරවා ගන්න." },
        { title: "ඉල්ලීම් ලුහුබැඳීම", desc: "ඔබගේ ඉල්ලුම්පත්‍රවල වත්මන් තත්ත්වය (පූරණය වෙමින් පවතින, අනුමත හෝ වැඩිදුර තොරතුරු අවශ්‍ය) පරීක්ෂා කරන්න." },
        { title: "දීමනා සඳහා ඉල්ලුම් කිරීම", desc: "අස්වැසුම, සමෘද්ධි සහ අනෙකුත් රජයේ දීමනා වැඩසටහන් සඳහා ලියාපදිංචි වන්න." },
        { title: "ආපදා සහන", desc: "ආපදා හානි වාර්තා කර රජයේ සහන ආධාර සඳහා ඉල්ලුම් කරන්න." },
        { title: "නිවේදන", desc: "නිල නිවේදන සහ ප්‍රජා තොරතුරු පිළිබඳව යාවත්කාලීනව සිටින්න." }
      ],
      heroDesc: "ග්‍රාමීය පරිපාලන සේවාවන් වෙත පහසුවෙන් ප්‍රවේශ වීමට ඔබට බලය ලබා දෙයි. ඔබේ ග්‍රාම නිලධාරීවරයා සමඟ සම්බන්ධ වී ක්ලික් කිරීම් කිහිපයකින් ඔබේ නිල අවශ්‍යතා ඉටු කරගන්න."
    },
    TA: {
      about: "எங்களைப் பற்றி",
      services: "சேவைகள்",
      login: "உள்நுழைக",
      register: "பதிவு செய்க",
      aboutTitle: "SmartGN பற்றி",
      aboutDesc: "SmartGN என்பது பாரம்பரிய கிராம நிலதாரி சேவையை அதிவேகமான, வெளிப்படையான மற்றும் பயனர் நட்பு அனுபவமாக மாற்றுவதற்காக வடிவமைக்கப்பட்ட ஒரு நவீன டிஜிட்டல் முயற்சியாகும். ஒவ்வொரு குடிமகனும் தங்கள் வீட்டில் இருந்தபடியே அத்தியாவசிய சேவைகளைப் பெறுவதை உறுதி செய்வதற்காக கிராம அளவிலான நிர்வாகத்திற்கும் குடிமக்களுக்கும் இடையிலான இடைவெளியை நவீன தொழில்நுட்பத்தின் மூலம் குறைப்பதே எங்கள் நோக்கமாகும்.",
      objectivesTitle: "எங்கள் நோக்கங்கள்",
      servicesTitle: "நீங்கள் பெறக்கூடிய சேவைகள்",
      servicesList: [
        { title: "சான்றிதழ்களைக் கோருங்கள்", desc: "டிஜிட்டல் சரிபார்ப்புடன் நற்சான்றிதழ்கள், வருமானச் சான்றிதழ்கள் மற்றும் பிற சான்றிதழ்களுக்கு விண்ணப்பிக்கவும்." },
        { title: "சந்திப்புகளை முன்பதிவு செய்க", desc: "வசதியான நேரங்களில் உங்கள் கிராம நிலதாரி அதிகாரியுடன் சந்திப்புகளைத் திட்டமிடுங்கள்." },
        { title: "கோரிக்கைகளைக் கண்காணிக்கவும்", desc: "உங்கள் விண்ணப்பங்களின் நிலையைக் கண்டறியவும் (நிலுவையில் உள்ளதா, அங்கீகரிக்கப்பட்டதா அல்லது கூடுதல் தகவல் தேவையா)." },
        { title: "கொடுப்பனவுகளுக்கு விண்ணப்பிக்கவும்", desc: "அஸ்வெசும, சமூர்த்தி மற்றும் பிற அரசு கொடுப்பனவு திட்டங்களுக்கு பதிவு செய்யவும்." },
        { title: "பேரழிவு நிவாரணம்", desc: "பேரழிவு சேதங்களை அறிக்கை செய்து, அரசு நிவாரண உதவிகளுக்கு விண்ணப்பங்கள் அனுப்பவும்." },
        { title: "அறிவிப்புகள்", desc: "அதிகாரப்பூர்வ அறிவிப்புகள் மற்றும் சமூகச் செய்திகளுடன் உடனுக்குடன் இணைந்திருங்கள்." }
      ],
      heroDesc: "கிராம நிர்வாகச் சேவைகளுக்கான தடையற்ற அணுகலை உங்களுக்கு வழங்குகிறது. உங்கள் கிராம நிலதாரி அதிகாரியுடன் இணைந்து உங்கள் அதிகாரப்பூர்வ தேவைகளை சில கிளிக்குகளில் நிர்வகிக்கவும்."
    }
  }

  return (
    <div className="landing-container">
      
      {/* 1. Header/Navbar */}
      <header className="landing-navbar">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img 
            src={logoImage} 
            alt="SmartGN Logo" 
            className="landing-logo-img"
            />
        </div>

        <nav className="landing-nav-links">
          <a href="#home" className="landing-nav-link">
            <img src={homeIcon} alt="Home" className="w-auto h-5" />
            {t.home}
          </a>
          <a href="#about" className="landing-nav-link">
            <img src={aboutIcon} alt="About" className="w-auto h-5" />
            {navTranslations[lang].about}
          </a>
          <a href="#services" className="landing-nav-link">
            <img src={servicesIcon} alt="Services" className="w-auto h-5" />
            {navTranslations[lang].services}
          </a>
        </nav>

        <LanguageSelector />
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
          {navTranslations[lang].heroDesc}
        </p>

        {/* CTAs */}
        <div className="hero-ctas">
          <button className="btn-landing-login" onClick={() => navigate('/login')}>
            {navTranslations[lang].login}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cta-icon">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </button>
          
          <button className="btn-landing-register" onClick={() => navigate('/register')}>
            {navTranslations[lang].register}
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
          <h3 className="section-card-title">{navTranslations[lang].aboutTitle}</h3>
          <p className="section-card-desc">
            {navTranslations[lang].aboutDesc}
          </p>
          <div className="about-watermark">GN</div>
        </div>

        <div className="objectives-column">
          <h3 className="section-card-title">{navTranslations[lang].objectivesTitle}</h3>
          <ul className="objectives-list">
            {lang === 'EN' ? (
              <>
                <li><strong>Digital Transformation:</strong> Moving manual paperwork and physical registers into a secure, cloud-based management system.</li>
                <li><strong>Service Accessibility:</strong> Ensuring that residents in even the most remote villages can request official documents and aid with a smartphone.</li>
                <li><strong>Enhanced Transparency:</strong> Providing real-time tracking for applications so citizens know exactly when their requests are processed.</li>
                <li><strong>Disaster Readiness:</strong> Establishing a direct digital link for emergency alerts and rapid distribution of relief allowances.</li>
                <li><strong>Inclusivity:</strong> Offering a multilingual interface in Sinhala, Tamil, and English to serve every citizen in Sri Lanka equally.</li>
              </>
            ) : lang === 'SI' ? (
              <>
                <li><strong>ඩිජිටල් පරිවර්තනය:</strong> අතින් ලියන ලද ලිපිලේඛන සහ භෞතික ලේඛන ආරක්ෂිත, වලාකුළු මත පදනම් වූ කළමනාකරණ පද්ධතියක් වෙත ගෙනයාම.</li>
                <li><strong>සේවා ප්‍රවේශ්‍යතාවය:</strong> වඩාත්ම දුරස්ථ ගම්මානවල පදිංචිකරුවන්ට පවා ස්මාර්ට් ජංගම දුරකතනයකින් නිල ලේඛන සහ ආධාර ඉල්ලා සිටීමට හැකි බව සහතික කිරීම.</li>
                <li><strong>වැඩි දියුණු කළ විනිවිදභාවය:</strong> පුරවැසියන් තමන්ගේ ඉල්ලීම් සකසන්නේ කවදාදැයි හරියටම දැන ගැනීමට යෙදුම් සඳහා තත්‍ය කාලීන ලුහුබැඳීම ලබා දීම.</li>
                <li><strong>ආපදා සූදානම:</strong> හදිසි ඇඟවීම් සහ සහන දීමනා වේගයෙන් බෙදා හැරීම සඳහා සෘජු ඩිජිටල් සබැඳියක් ස්ථාපිත කිරීම.</li>
                <li><strong>ඇතුළත් කිරීම:</strong> ශ්‍රී ලංකාවේ සෑම පුරවැසියෙකුටම එක හා සමානව සේවය කිරීම සඳහා සිංහල, දෙමළ සහ ඉංග්‍රීසි භාෂාවලින් බහුභාෂා අතුරු මුහුණතක් පිරිනැමීම.</li>
              </>
            ) : (
              <>
                <li><strong>டிஜிட்டல் மாற்றம்:</strong> கையேடு ஆவணங்கள் மற்றும் பதிவேடுகளை பாதுகாப்பான, கிளவுட் அடிப்படையிலான மேலாண்மை முறைக்கு மாற்றுதல்.</li>
                <li><strong>சேவை அணுகல்:</strong> தொலைதூர கிராமங்களில் வசிக்கும் குடியிருப்பாளர்களும் ஸ்மார்ட்போன் மூலம் அதிகாரப்பூர்வ ஆவணங்களையும் உதவிகளையும் கோர முடியும் என்பதை உறுதி செய்தல்.</li>
                <li><strong>மேம்படுத்தப்பட்ட வெளிப்படைத்தன்மை:</strong> விண்ணப்பங்களை நிகழ்நேரத்தில் கண்காணிப்பதன் மூலம் குடிமக்கள் தங்கள் கோரிக்கைகள் எப்போது பரிசீலிக்கப்படுகின்றன என்பதை அறிதல்.</li>
                <li><strong>பேரழிவு ஆயத்தம்:</strong> அவசர எச்சரிக்கைகள் மற்றும் நிவாரணக் கொடுப்பනவுகளை விரைவாக விநியோகிக்க நேரடி டிஜிட்டல் இணைப்பை உருவாக்குதல்.</li>
                <li><strong>அனைவரையும் உள்ளடக்குதல்:</strong> இலங்கையில் உள்ள அனைத்து குடிமக்களுக்கும் சமமாக சேவை செய்வதற்காக சிங்களம், தமிழ் மற்றும் ஆங்கிலத்தில் பன்மொழி இடைமுகத்தை வழங்குதல்.</li>
              </>
            )}
          </ul>
        </div>
      </section>

      {/* 4. Services You Can Get Section */}
      <section className="landing-services" id="services">
        <h3 className="services-main-title">{navTranslations[lang].servicesTitle}</h3>
        
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
              <h4>{navTranslations[lang].servicesList[0].title}</h4>
              <p>{navTranslations[lang].servicesList[0].desc}</p>
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
              <h4>{navTranslations[lang].servicesList[1].title}</h4>
              <p>{navTranslations[lang].servicesList[1].desc}</p>
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
              <h4>{navTranslations[lang].servicesList[2].title}</h4>
              <p>{navTranslations[lang].servicesList[2].desc}</p>
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
              <h4>{navTranslations[lang].servicesList[3].title}</h4>
              <p>{navTranslations[lang].servicesList[3].desc}</p>
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
              <h4>{navTranslations[lang].servicesList[4].title}</h4>
              <p>{navTranslations[lang].servicesList[4].desc}</p>
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
              <h4>{navTranslations[lang].servicesList[5].title}</h4>
              <p>{navTranslations[lang].servicesList[5].desc}</p>
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
          <p><strong>{lang === 'EN' ? 'Admin Support:' : lang === 'SI' ? 'පරිපාලන සහාය:' : 'நிர்வாக ஆதரவு:'}</strong></p>
          <p>{lang === 'EN' ? 'Mobile : 0255731913' : lang === 'SI' ? 'ජංගම : 0255731913' : 'கைபேசி : 0255731913'}</p>
          <p>Email: Admin@gmail.com</p>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage
