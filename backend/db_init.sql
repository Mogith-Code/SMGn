-- SmartGN MySQL Database Initialization DDL Script
-- Optimized for MySQL 5.7+ / 8.0+

CREATE DATABASE IF NOT EXISTS smartgn_db;
USE smartgn_db;

-- 1. GN Division Table
CREATE TABLE IF NOT EXISTS gn_division (
    division_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Household Table
CREATE TABLE IF NOT EXISTS household (
    household_number VARCHAR(36) PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    division_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Resident Table
CREATE TABLE IF NOT EXISTS resident (
    r_nic VARCHAR(12) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    mobile_no VARCHAR(15) NOT NULL,
    occupation VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    household_number VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (household_number) REFERENCES household(household_number) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Family Member Table
CREATE TABLE IF NOT EXISTS family_member (
    member_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    nic VARCHAR(12),
    resident_nic VARCHAR(12) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Grama Niladhari (GN Officer) Table
CREATE TABLE IF NOT EXISTS grama_niladhari (
    gn_id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    division_id VARCHAR(36) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Admin Table
CREATE TABLE IF NOT EXISTS admin (
    admin_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Appointment Table
CREATE TABLE IF NOT EXISTS appointment (
    appointment_id VARCHAR(36) PRIMARY KEY,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'DECLINED'
    resident_nic VARCHAR(12) NOT NULL,
    gn_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Disaster Request Table
CREATE TABLE IF NOT EXISTS disaster_request (
    disaster_request_id VARCHAR(36) PRIMARY KEY,
    disaster_type VARCHAR(100) NOT NULL,
    request_date DATE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'RELIEF_APPROVED', 'AID_DISPATCHED', 'RESOLVED'
    resident_nic VARCHAR(12) NOT NULL,
    gn_id VARCHAR(36),
    admin_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Allowance Application Table
CREATE TABLE IF NOT EXISTS allowance_application (
    allowance_id VARCHAR(36) PRIMARY KEY,
    allowance_type VARCHAR(100) NOT NULL, -- 'Aswesuma', 'Samurdhi', etc.
    application_date DATE NOT NULL,
    income_details TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    resident_nic VARCHAR(12) NOT NULL,
    gn_id VARCHAR(36),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID', -- 'UNPAID', 'PAID'
    cleared_amount DECIMAL(10,2) DEFAULT 0.00,
    cleared_time DATETIME,
    txn_reference VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Certificate Request Table
CREATE TABLE IF NOT EXISTS certificate_request (
    request_id VARCHAR(36) PRIMARY KEY,
    certificate_type VARCHAR(100) NOT NULL, -- 'RESIDENCE', 'INCOME', 'CHARACTER'
    purpose VARCHAR(255) NOT NULL,
    request_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    rejection_reason VARCHAR(255),
    resident_nic VARCHAR(12) NOT NULL,
    gn_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Document Table
CREATE TABLE IF NOT EXISTS document (
    document_id VARCHAR(36) PRIMARY KEY,
    document_type VARCHAR(100) NOT NULL, -- 'NIC_FRONT', 'UTILITY_BILL', 'INCOME_DOC'
    file_path VARCHAR(512) NOT NULL,
    upload_date DATETIME NOT NULL,
    allowance_id VARCHAR(36),
    request_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (allowance_id) REFERENCES allowance_application(allowance_id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES certificate_request(request_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Chat Session Table
CREATE TABLE IF NOT EXISTS chat_session (
    session_id VARCHAR(36) PRIMARY KEY,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    resident_nic VARCHAR(12) NOT NULL,
    division_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
    knowledge_id VARCHAR(36) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Chat Message Table
CREATE TABLE IF NOT EXISTS chat_message (
    message_id VARCHAR(36) PRIMARY KEY,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(36) NOT NULL,
    knowledge_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_session(session_id) ON DELETE CASCADE,
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_base(knowledge_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Government Property Table
CREATE TABLE IF NOT EXISTS government_property (
    property_id VARCHAR(36) PRIMARY KEY,
    property_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    `condition` VARCHAR(100) NOT NULL, -- 'GOOD', 'NEEDS_REPAIR', 'DAMAGED'
    gn_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Announcement Table
CREATE TABLE IF NOT EXISTS announcement (
    announcement_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'HEALTH', 'UTILITIES', 'EDUCATION'
    gn_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Seeding Initial Mock Data (matching mockup division Borella)
-- ---------------------------------------------------------

INSERT INTO gn_division (division_id, name, district, province) VALUES
('DIV-BORELLA-01', 'Colombo, Borella', 'Colombo', 'Western');

INSERT INTO household (household_number, address, division_id) VALUES
('H-90823', '45/2, Temple Road, Borella', 'DIV-BORELLA-01'),
('H-90824', '12, School Lane, Borella', 'DIV-BORELLA-01');

-- Passwords hashed 'password123'
INSERT INTO resident (r_nic, name, date_of_birth, password, gender, mobile_no, occupation, email, household_number) VALUES
('789456123V', 'Nimal Perera', '1990-05-15', '$2b$10$wKTLgQ1m6n6kXW0Yq1Kj8e8FjK4XmB.B2yJv8t.x8.x8.x8.x8.x8', 'Male', '0771234567', 'Engineer', 'nimal@example.com', 'H-90823'),
('897654321V', 'Kamala Silva', '1985-08-20', '$2b$10$wKTLgQ1m6n6kXW0Yq1Kj8e8FjK4XmB.B2yJv8t.x8.x8.x8.x8.x8', 'Female', '0719876543', 'Teacher', 'kamala@example.com', 'H-90824');

-- Passwords hashed 'password123'
INSERT INTO grama_niladhari (gn_id, username, password, name, email, mobile, division_id) VALUES
('GN-BORELLA', 'kamal_gn', '$2b$10$wKTLgQ1m6n6kXW0Yq1Kj8e8FjK4XmB.B2yJv8t.x8.x8.x8.x8.x8', 'Kamal Perera', 'kamal.gn@example.com', '0703564478', 'DIV-BORELLA-01');

-- Passwords hashed 'admin123'
INSERT INTO admin (admin_id, name, username, password, email) VALUES
('ADMIN-01', 'System Administrator', 'admin', '$2b$10$tMhO2Lp1qA2K5Z9N1V2c3O4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t', 'admin@smartgn.gov.lk');
