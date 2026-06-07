# SmartGN - Divisional Service Management Portal

SmartGN is a secure, dynamic, database-driven web application designed to streamline public service management between residents and Grama Niladhari (GN) officers in Sri Lanka. The system automates certificates requests, secure allowance disbursements, appointment bookings, community announcements, and disaster relief reporting.

---

## 🛠️ Tech Stack Overview

- **Frontend**: React (Vite), CSS3, React Router
- **Backend**: Node.js, Express, JWT Authentication
- **Database**: MySQL 5.7+ / 8.0+

---

## 📋 Prerequisites

Before setting up the project locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/installer/)

---

## 🚀 Setup & Execution Guide

Follow these steps to activate the database, start the backend server, and launch the frontend client:

### 1. Database Setup (MySQL)

You need to initialize the database schema in your MySQL server.

1. **Start MySQL Service**:
   Ensure your local MySQL server is running (usually on port `3306`).
   - On Windows, you can start MySQL through the *Services* panel (`services.msc`) by looking for `MySQL` or `MySQL80` and clicking **Start**.
   - Alternatively, start it via PowerShell/Command Prompt (Run as Administrator):
     ```bash
     net start MySQL80
     ```

2. **Initialize Database Schema**:
   Open a terminal and run the provided SQL DDL script to create the database, tables, and seed initial values:
   ```bash
   mysql -u root -p < backend/db_init.sql
   ```
   *(Enter your MySQL root password when prompted. If you do not have a password configured, omit the `-p` flag.)*

This script sets up:
- The `smartgn_db` database.
- Key tables: `gn_division`, `household`, `resident`, `family_member`, `grama_niladhari`, `appointment`, `disaster_request`, `allowance_application`, `certificate_request`, and `announcement`.
- A seeded GN Officer (`username: kamal_gn`, `password: password123`), Resident (`nic: 789456123V`, `password: password123`), and Admin (`username: admin`, `password: admin123`).

---

### 2. Backend Server Configuration & Startup

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Install Backend Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create or edit the `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=smartgn_db
   DB_PORT=3306
   JWT_SECRET=super_secret_smartgn_government_token_123_abc_xyz
   ```
   *(Ensure `DB_PASSWORD` matches your local MySQL password.)*

4. **Launch the Server**:
   - **Development Mode** (with automatic nodemon reloads):
     ```bash
     npm run dev
     ```
   - **Production Mode**:
     ```bash
     npm start
     ```

The backend server will run on **`http://localhost:5000`**. You should see the message:
`SmartGN Secure Node.js Server Active on Port: 5000`

---

### 3. Frontend Client Startup

1. **Navigate to the Frontend Directory**:
   ```bash
   cd GN
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

The application will launch on **`http://localhost:5173`**.

---

## 🔗 How the Frontend & Backend Connect

- **Proxy Configuration**: The Vite dev server has a proxy configured in `GN/vite.config.js`. Any frontend network request directed to `/api/*` is automatically forwarded to the backend server running at `http://localhost:5000`.
- **Authentication**: When a Resident or GN Officer logs in, the backend returns a JSON Web Token (JWT). The frontend stores this token in `localStorage` (`smartgn_token`) and automatically includes it in the `Authorization: Bearer <token>` headers of all subsequent API requests.

---

## 👤 Initial Testing Credentials

Use the following pre-seeded credentials to explore the system:

- **Resident**:
  - **NIC**: `789456123V`
  - **Password**: `password123`
- **GN Officer**:
  - **Username**: `kamal_gn`
  - **Password**: `password123`

*Note: You can also register new Resident and GN Officer accounts dynamically using the **Register** button on the home screen. The backend automatically handles division/household auto-provisioning upon sign-up.*

---

## 👥 Module Assignment & Component Responsibilities

To ensure clear development ownership, the frontend pages, components, and backend route handlers are mapped below to the respective team members, aligning with the core modules from the project proposal.

### 📋 Overall Assignment Table

| Module ID | Module Name | Responsible Member | Student Index | Frontend Pages & Components | Backend Route Files |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **1** | **User Authentication & Identity** | C. Mosith | 22CSE0394 | - [RoleSelection.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/RoleSelection.jsx)<br>- [ResidentLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentLogin.jsx)<br>- [OfficerLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerLogin.jsx)<br>- [AdminLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/AdminLogin.jsx)<br>- [Register.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/Register.jsx)<br>- [Success.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/Success.jsx) | - [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) *(Auth/Registration)* |
| **2** | **Resident & Family Management** | H.S.A. Melan | 22CSE0361 | - [ResidentProfile.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentProfile.jsx)<br>- [OfficerProfile.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerProfile.jsx)<br>- [ResidentDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentDashboard.jsx) | - [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) *(Profile APIs)* |
| **3** | **Divisional & Household Management** | W.L.V.J.C. Warapitiya | 22CSE0371 | - [ResidentHousehold.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentHousehold.jsx)<br>- [OfficerHouseholdDetails.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerHouseholdDetails.jsx) | - [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) *(Household endpoints)* |
| **4** | **Digital Certificate Service** | C. Mosith | 22CSE0394 | - [ApplyCharacterCertificate.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ApplyCharacterCertificate.jsx)<br>- [ApplyIncomeCertificate.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ApplyIncomeCertificate.jsx)<br>- [ResidentCertificates.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentCertificates.jsx)<br>- [OfficerCertificates.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerCertificates.jsx)<br>- [OfficerCertificateDetails.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerCertificateDetails.jsx) | - [certificates.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/certificates.js) |
| **5** | **Government Allowance & Welfare** | H.S.A. Melan | 22CSE0361 | - [ResidentAllowances.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentAllowances.jsx)<br>- [OfficerAllowances.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerAllowances.jsx) | - [allowances.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/allowances.js) |
| **6** | **Appointment & Meeting Scheduler** | W.L.V.J.C. Warapitiya | 22CSE0371 | - [ResidentAppointments.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentAppointments.jsx)<br>- [OfficerAppointments.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerAppointments.jsx) | - [appointments.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/appointments.js) |
| **7** | **Disaster & Emergency Relief** | H.S.A. Melan | 22CSE0361 | - [ResidentDisasterReport.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentDisasterReport.jsx)<br>- [OfficerDisasterReports.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerDisasterReports.jsx) | - [disasters.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/disasters.js) |
| **8** | **AI Chatbot & Information** | C. Mosith | 22CSE0394 | - [LandingPage.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/LandingPage.jsx)<br>- [Chatbot.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/components/Chatbot.jsx)<br>- [LanguageSelector.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/components/LanguageSelector.jsx) | - *Integrations across routes* |
| **9** | **Village Asset & Admin** | W.L.V.J.C. Warapitiya | 22CSE0371 | - [AdminDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/AdminDashboard.jsx)<br>- [OfficerDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerDashboard.jsx) | - [announcements.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/announcements.js) |

### 🛠️ Detailed Component & Route Tasks Breakdowns

#### 1. User Authentication and Identity (C. Mosith - 22CSE0394)
* **Frontend Components:**
  * [RoleSelection.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/RoleSelection.jsx): Select user role entry-point before redirecting to individual log-in screens.
  * [ResidentLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentLogin.jsx) / [OfficerLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerLogin.jsx) / [AdminLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/AdminLogin.jsx): Input fields, authentication requests handling, error messages, storage of JWT session tokens in localStorage.
  * [Register.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/Register.jsx): Multi-step form for user creation including NIC front/back file attachment logic.
  * [Success.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/Success.jsx): Dynamic completion feedback state indicator.
* **Backend Routers:**
  * [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js): Login validation handlers, database queries, password hashing (`bcrypt`), JWT creation, OTP mailer integration helper.

#### 2. Resident and Family Management (H.S.A. Melan - 22CSE0361)
* **Frontend Components:**
  * [ResidentProfile.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentProfile.jsx): Allows residents to configure their credentials, upload avatar, review registered properties, and declare family member records.
  * [OfficerProfile.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerProfile.jsx): Grama Niladhari profile page with contact detail management tools.
  * [ResidentDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentDashboard.jsx): Displays summaries of requests, appointments, alerts, and navigation links.
* **Backend Routers:**
  * [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) / [server.js](file:///d:/SmartGn-Anti/SmartGN/backend/server.js): API endpoints for updating profile, appending/deleting family members under matching parent NIC.

#### 3. Divisional and Household Management (W.L.V.J.C. Warapitiya - 22CSE0371)
* **Frontend Components:**
  * [ResidentHousehold.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentHousehold.jsx): Section for household metadata registration, residential proof list, and head of household matching details.
  * [OfficerHouseholdDetails.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerHouseholdDetails.jsx): Administrative division filters allowing matching GNs to see all registered households, verify residents list under divisions, search by Household No.
* **Backend Routers:**
  * [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) (Shared): Database integration queries for listing/updating household and divisional relationships.

#### 4. Digital Certificate Service (C. Mosith - 22CSE0394)
* **Frontend Components:**
  * [ApplyCharacterCertificate.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ApplyCharacterCertificate.jsx) / [ApplyIncomeCertificate.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ApplyIncomeCertificate.jsx): Interactive online submission forms with conditional file attachments (employment/revenue proof, character declarations).
  * [ResidentCertificates.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentCertificates.jsx): Tabbed lists tracking status of submissions: *Pending*, *Approved*, and *Rejected*. Includes download action links.
  * [OfficerCertificates.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerCertificates.jsx): Division list of incoming applications sorted chronologically.
  * [OfficerCertificateDetails.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerCertificateDetails.jsx): Officer panel enabling PDF preview of credentials, approval toggle, reject comments panel, and automated digital certificate generation.
* **Backend Routers:**
  * [certificates.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/certificates.js): Route handlers to process new submissions, retrieve requests filterable by status/officer division, update review records, upload documents, and generate certificate documents.

#### 5. Government Allowance and Welfare (H.S.A. Melan - 22CSE0361)
* **Frontend Components:**
  * [ResidentAllowances.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentAllowances.jsx): Form to apply for Aswesuma/Samurdhi, file/income detail declarations, status history tracking list.
  * [OfficerAllowances.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerAllowances.jsx): Dashboard for managing welfare benefits. Allows GNs to check application details, verify income status, search applicants, toggle approval, and configure custom allowance programs.
* **Backend Routers:**
  * [allowances.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/allowances.js): CRUD API endpoints for managing allowance applications, registering new welfare program categories, querying beneficiary data.

#### 6. Appointment and Meeting Scheduler (W.L.V.J.C. Warapitiya - 22CSE0371)
* **Frontend Components:**
  * [ResidentAppointments.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentAppointments.jsx): Request appointment form (select date, time slot, write details) with active scheduler calendar displaying slots availability.
  * [OfficerAppointments.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerAppointments.jsx): Management calendar showing upcoming bookings, action buttons to confirm/cancel/reschedule with feedback dialog.
* **Backend Routers:**
  * [appointments.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/appointments.js): Calendar-check query helper endpoints, appointment requests validation routes, notification alerts trigger hook.

#### 7. Disaster and Emergency Relief (H.S.A. Melan - 22CSE0361)
* **Frontend Components:**
  * [ResidentDisasterReport.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentDisasterReport.jsx): Submit disaster alerts, specify affected resources (damage description, severity level), track aid request statuses.
  * [OfficerDisasterReports.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerDisasterReports.jsx): Relief dashboard listing incidents by category/location, update logistics and financial relief allocations.
* **Backend Routers:**
  * [disasters.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/disasters.js): Incident reporting logic, coordinates/relatives associations, relief distributions tracking APIs.

#### 8. AI Chatbot and Information (C. Mosith - 22CSE0394)
* **Frontend Components:**
  * [LandingPage.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/LandingPage.jsx): Entry dashboard featuring welcome headers, site overview sliders, quick navigation links.
  * [Chatbot.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/components/Chatbot.jsx): Floatable overlay chat widget allowing interactive text input, fetching responses from automated knowledge base APIs.
  * [LanguageSelector.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/components/LanguageSelector.jsx): Dropdown widget storing selected translation locale state (en/si/ta) dynamically mapping visual components string keys.
* **Backend Routers:**
  * Chatbot response query processors, session tracking endpoints, Knowledge base retrieval system.

#### 9. Village Asset and Admin (W.L.V.J.C. Warapitiya - 22CSE0371)
* **Frontend Components:**
  * [AdminDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/AdminDashboard.jsx): Statistics counters (active registrations, approved certificates), audit history table, officer profiles management dashboard.
  * [OfficerDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerDashboard.jsx): GN management workspace with divisional resources status charts, activity logs, summary stats.
* **Backend Routers:**
  * [announcements.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/announcements.js): Route handlers to fetch regional announcements, publish new entries with severity rating, modify/retire outdated notices.

