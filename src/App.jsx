import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import RoleSelection from './pages/RoleSelection'
import ResidentLogin from './pages/ResidentLogin'
import OfficerLogin from './pages/OfficerLogin'
import Register from './pages/Register'
import Success from './pages/Success'
import ResidentDashboard from './pages/ResidentDashboard'
import OfficerDashboard from './pages/OfficerDashboard'
import OfficerDisasterReports from './pages/OfficerDisasterReports'
import ResidentCertificates from './pages/ResidentCertificates'
import ApplyCharacterCertificate from './pages/ApplyCharacterCertificate'
import ApplyIncomeCertificate from './pages/ApplyIncomeCertificate'
import ApprovedCertificates from './pages/ApprovedCertificates'
import PendingCertificates from './pages/PendingCertificates'
import RejectedCertificates from './pages/RejectedCertificates'
import ResidentDisasterReport from './pages/ResidentDisasterReport'
import ResidentAppointments from './pages/ResidentAppointments'
import ResidentHousehold from './pages/ResidentHousehold'
import ResidentProfile from './pages/ResidentProfile'
import ResidentAllowances from './pages/ResidentAllowances'
import OfficerAppointments from './pages/OfficerAppointments'
import OfficerAnnouncements from './pages/OfficerAnnouncements'
import OfficerProfile from './pages/OfficerProfile'
import OfficerHouseholdDetails from './pages/OfficerHouseholdDetails'
import Chatbot from './components/Chatbot'




function App() {
  // Global chatbot toggle state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const handleOpenChatbot = () => setIsChatbotOpen(true)
  const handleCloseChatbot = () => setIsChatbotOpen(false)

  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage onOpenHelp={handleOpenChatbot} />} />

        {/* Resident Dashboard Panel (Root-Level Layout) */}
        <Route path="/dashboard/resident" element={<ResidentDashboard onOpenHelp={handleOpenChatbot} />} />

        {/* Resident Certificates Panel (Root-Level Layout) */}
        <Route path="/dashboard/resident/certificates" element={<ResidentCertificates onOpenHelp={handleOpenChatbot} />} />

        {/* Character Certificate Application Form (Root-Level Layout) */}
        <Route path="/dashboard/resident/certificates/apply-character" element={<ApplyCharacterCertificate onOpenHelp={handleOpenChatbot} />} />

        {/* Income Certificate Application Form (Root-Level Layout) */}
        <Route path="/dashboard/resident/certificates/apply-income" element={<ApplyIncomeCertificate onOpenHelp={handleOpenChatbot} />} />

        {/* Approved Certificates History Portal (Root-Level Layout) */}
        <Route path="/dashboard/resident/certificates/approved" element={<ApprovedCertificates onOpenHelp={handleOpenChatbot} />} />

        {/* Pending Certificates History Portal (Root-Level Layout) */}
        <Route path="/dashboard/resident/certificates/pending" element={<PendingCertificates onOpenHelp={handleOpenChatbot} />} />

        {/* Rejected Certificates History Portal (Root-Level Layout) */}
        <Route path="/dashboard/resident/certificates/rejected" element={<RejectedCertificates onOpenHelp={handleOpenChatbot} />} />

        {/* Resident Disaster Damage & Relief Form (Root-Level Layout) */}
        <Route path="/dashboard/resident/disaster" element={<ResidentDisasterReport onOpenHelp={handleOpenChatbot} />} />

        {/* Resident Appointment Booking and Calendar Portal */}
        <Route path="/dashboard/resident/appointments" element={<ResidentAppointments onOpenHelp={handleOpenChatbot} />} />

        {/* Resident Family & Household Management Portal */}
        <Route path="/dashboard/resident/household" element={<ResidentHousehold onOpenHelp={handleOpenChatbot} />} />

        {/* Resident Profile Management Portal */}
        <Route path="/dashboard/resident/profile" element={<ResidentProfile onOpenHelp={handleOpenChatbot} />} />

        {/* Resident Allowance Programs Portal */}
        <Route path="/dashboard/resident/allowances" element={<ResidentAllowances onOpenHelp={handleOpenChatbot} />} />

        {/* GN Officer Dashboard Panel (Root-Level Layout) */}
        <Route path="/dashboard/officer" element={<OfficerDashboard onOpenHelp={handleOpenChatbot} />} />

        {/* GN Officer Appointment Portal */}
        <Route path="/dashboard/officer/appointments" element={<OfficerAppointments onOpenHelp={handleOpenChatbot} />} />

        {/* GN Officer Disaster Reports Portal (Root-Level Layout) */}
        <Route path="/dashboard/officer/disasters" element={<OfficerDisasterReports onOpenHelp={handleOpenChatbot} />} />

        {/* GN Officer Announcements Portal */}
        <Route path="/dashboard/officer/announcements" element={<OfficerAnnouncements onOpenHelp={handleOpenChatbot} />} />

        {/* GN Officer Profile Portal */}
        <Route path="/dashboard/officer/profile" element={<OfficerProfile onOpenHelp={handleOpenChatbot} />} />

        {/* GN Officer Family & Household Portal */}
        <Route path="/dashboard/officer/household" element={<OfficerHouseholdDetails onOpenHelp={handleOpenChatbot} />} />

        {/* Centered Auth Portal Layout for all sub-routes */}
        <Route
          path="/*"
          element={
            <>
              {/* Decorative animated background blobs */}
              <div className="bg-blobs" aria-hidden="true">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
              </div>

              <div className="portal-container">
                <div className="portal-card">
                  <Routes>
                    <Route path="/login" element={<RoleSelection />} />
                    <Route path="/login/resident" element={<ResidentLogin />} />
                    <Route path="/login/officer" element={<OfficerLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/success" element={<Success />} />
                    {/* Catch-all redirects back to public landing page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </div>
            </>
          }
        />
      </Routes>

      {/* Persistent global chatbot assistant */}
      <Chatbot isOpen={isChatbotOpen} onClose={handleCloseChatbot} />
    </Router>
  )
}

export default App
