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
