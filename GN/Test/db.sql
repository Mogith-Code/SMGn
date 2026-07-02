-- ============================================================
-- SMARTGN - IMPROVED DATABASE SCHEMA
-- Version: 2.0 (Enhanced & Optimized)
-- ============================================================

-- Drop existing database if needed (use with caution)
-- DROP DATABASE IF EXISTS smartgn_db;
CREATE DATABASE IF NOT EXISTS smartgn_db;
USE smartgn_db;

-- ============================================================
-- 1. GN DIVISION TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS gn_division (
    division_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    division_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'e.g., GN-001A',
    name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    divisional_secretariat VARCHAR(255) NOT NULL COMMENT 'DS Division',
    population INT DEFAULT 0,
    household_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_division_code (division_code),
    INDEX idx_district (district),
    INDEX idx_province (province),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. HOUSEHOLD TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS household (
    household_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    household_number VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    division_id VARCHAR(36) NOT NULL,
    head_of_household_nic VARCHAR(12) COMMENT 'Resident NIC',
    total_members INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE CASCADE,
    INDEX idx_household_number (household_number),
    INDEX idx_division (division_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. RESIDENT TABLE (Enhanced with Security)
-- ============================================================
CREATE TABLE IF NOT EXISTS resident (
    r_nic VARCHAR(12) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    full_name VARCHAR(101) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) STORED,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    mobile_no VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt hashed',
    occupation VARCHAR(100),
    household_number VARCHAR(50) NOT NULL,
    
    -- Address fields
    permanent_address TEXT,
    current_address TEXT,
    
    -- Images
    profile_photo_path VARCHAR(255),
    nic_front_path VARCHAR(255),
    nic_back_path VARCHAR(255),
    profile_photo_filename VARCHAR(255),
    nic_front_filename VARCHAR(255),
    nic_back_filename VARCHAR(255),
    
    -- Verification status
    status ENUM('Active', 'Inactive', 'Suspended', 'Pending') DEFAULT 'Pending',
    email_verified BOOLEAN DEFAULT FALSE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    nic_verified BOOLEAN DEFAULT FALSE,
    
    -- Security
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 2FA
    two_factor_secret VARCHAR(255),
    is_2fa_enabled BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (household_number) REFERENCES household(household_number) ON DELETE RESTRICT,
    INDEX idx_nic (r_nic),
    INDEX idx_email (email),
    INDEX idx_mobile (mobile_no),
    INDEX idx_full_name (full_name),
    INDEX idx_household (household_number),
    INDEX idx_status (status),
    INDEX idx_nic_verified (nic_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. FAMILY MEMBER TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS family_member (
    member_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 150),
    relationship ENUM('Head', 'Spouse', 'Son', 'Daughter', 'Mother', 'Father', 'Sibling', 'Other') NOT NULL,
    nic VARCHAR(12) UNIQUE COMMENT 'NIC if available',
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE,
    occupation VARCHAR(100),
    resident_nic VARCHAR(12) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    INDEX idx_resident (resident_nic),
    INDEX idx_relationship (relationship),
    INDEX idx_nic (nic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. GRAMA NILADHARI (GN Officer) TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS grama_niladhari (
    gn_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    officer_id VARCHAR(20) UNIQUE NOT NULL COMMENT 'e.g., GN-001',
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    nic_number VARCHAR(12) UNIQUE,
    division_id VARCHAR(36) UNIQUE COMMENT 'Assigned division',
    appointment_date DATE,
    grade ENUM('Grade I', 'Grade II', 'Grade III') DEFAULT 'Grade III',
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    
    -- Security
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 2FA
    two_factor_secret VARCHAR(255),
    is_2fa_enabled BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_officer_id (officer_id),
    INDEX idx_division (division_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. ADMIN TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin (
    admin_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('SuperAdmin', 'Admin') DEFAULT 'Admin',
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. APPOINTMENT TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS appointment (
    appointment_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    appointment_number VARCHAR(20) UNIQUE NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'DECLINED', 'CANCELLED') DEFAULT 'PENDING',
    notes TEXT,
    resident_nic VARCHAR(12) NOT NULL,
    gn_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
    INDEX idx_appointment_number (appointment_number),
    INDEX idx_resident (resident_nic),
    INDEX idx_gn (gn_id),
    INDEX idx_date (date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. CERTIFICATE REQUEST TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS certificate_request (
    request_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    certificate_type ENUM('RESIDENCE', 'INCOME', 'CHARACTER') NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    request_date DATE NOT NULL,
    status ENUM('PENDING', 'REVIEWED', 'APPROVED', 'REJECTED', 'ISSUED') DEFAULT 'PENDING',
    rejection_reason TEXT,
    gn_remarks TEXT,
    action_date DATETIME,
    issued_date DATE,
    expiry_date DATE,
    resident_nic VARCHAR(12) NOT NULL,
    gn_id VARCHAR(36),
    certificate_pdf_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
    INDEX idx_certificate_number (certificate_number),
    INDEX idx_resident (resident_nic),
    INDEX idx_gn (gn_id),
    INDEX idx_type (certificate_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. DISASTER REQUEST TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS disaster_request (
    disaster_request_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    disaster_type ENUM('Flood', 'Fire', 'Earthquake', 'Landslide', 'Cyclone', 'Drought', 'Pandemic', 'Other') NOT NULL,
    request_date DATE NOT NULL,
    description TEXT NOT NULL,
    status ENUM('PENDING', 'RELIEF_APPROVED', 'AID_DISPATCHED', 'RESOLVED', 'REJECTED') DEFAULT 'PENDING',
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    location VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    aid_requested TEXT,
    relief_provided TEXT,
    officer_remarks TEXT,
    estimated_damage DECIMAL(15,2),
    resident_nic VARCHAR(12) NOT NULL,
    gn_id VARCHAR(36),
    admin_id VARCHAR(36),
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE SET NULL,
    INDEX idx_request_number (request_number),
    INDEX idx_resident (resident_nic),
    INDEX idx_gn (gn_id),
    INDEX idx_type (disaster_type),
    INDEX idx_status (status),
    INDEX idx_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. ALLOWANCE APPLICATION TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS allowance_application (
    allowance_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    allowance_number VARCHAR(50) UNIQUE NOT NULL,
    allowance_type ENUM('Aswesuma', 'Samurdhi', 'Disability', 'Elderly', 'Widow', 'Other') NOT NULL,
    application_date DATE NOT NULL,
    income_details TEXT NOT NULL,
    status ENUM('PENDING', 'REVIEWED', 'APPROVED', 'REJECTED', 'PAID') DEFAULT 'PENDING',
    rejection_reason TEXT,
    gn_remarks TEXT,
    resident_nic VARCHAR(12) NOT NULL,
    gn_id VARCHAR(36),
    payment_status ENUM('UNPAID', 'PAID', 'PROCESSING') DEFAULT 'UNPAID',
    cleared_amount DECIMAL(12,2) DEFAULT 0.00,
    cleared_time DATETIME,
    txn_reference VARCHAR(50),
    bank_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
    INDEX idx_allowance_number (allowance_number),
    INDEX idx_resident (resident_nic),
    INDEX idx_gn (gn_id),
    INDEX idx_type (allowance_type),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. DOCUMENT TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS document (
    document_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    document_type ENUM('NIC_FRONT', 'NIC_BACK', 'PROFILE_PHOTO', 'UTILITY_BILL', 'INCOME_DOC', 'CERTIFICATE', 'OTHER') NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    mime_type VARCHAR(50),
    upload_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resident_nic VARCHAR(12) NOT NULL,
    allowance_id VARCHAR(36),
    request_id VARCHAR(36),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(36),
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (allowance_id) REFERENCES allowance_application(allowance_id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES certificate_request(request_id) ON DELETE CASCADE,
    INDEX idx_resident (resident_nic),
    INDEX idx_type (document_type),
    INDEX idx_allowance (allowance_id),
    INDEX idx_request (request_id),
    INDEX idx_is_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. CHAT SESSION TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_session (
    session_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    resident_nic VARCHAR(12) NOT NULL,
    division_id VARCHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    total_messages INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
    FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE CASCADE,
    INDEX idx_resident (resident_nic),
    INDEX idx_division (division_id),
    INDEX idx_session_token (session_token),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. KNOWLEDGE BASE TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS knowledge_base (
    knowledge_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL COMMENT 'e.g., Certificates, Allowances, General',
    keywords TEXT COMMENT 'Comma-separated keywords for search',
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    FULLTEXT INDEX idx_fulltext (question, answer, keywords)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. CHAT MESSAGE TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_message (
    message_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    message_text TEXT NOT NULL,
    sender_type ENUM('RESIDENT', 'SYSTEM') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(36) NOT NULL,
    knowledge_id VARCHAR(36),
    is_response BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES chat_session(session_id) ON DELETE CASCADE,
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_base(knowledge_id) ON DELETE SET NULL,
    INDEX idx_session (session_id),
    INDEX idx_sender_type (sender_type),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. GOVERNMENT PROPERTY TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS government_property (
    property_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    property_code VARCHAR(50) UNIQUE NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    condition_status ENUM('GOOD', 'NEEDS_REPAIR', 'DAMAGED', 'UNDER_RENOVATION') NOT NULL,
    property_type ENUM('Building', 'Land', 'Vehicle', 'Equipment', 'Other') NOT NULL,
    value DECIMAL(15,2),
    acquisition_date DATE,
    gn_id VARCHAR(36) NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE CASCADE,
    INDEX idx_property_code (property_code),
    INDEX idx_gn (gn_id),
    INDEX idx_condition (condition_status),
    INDEX idx_type (property_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. ANNOUNCEMENT TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS announcement (
    announcement_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    announcement_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    type ENUM('HEALTH', 'UTILITIES', 'EDUCATION', 'TRANSPORT', 'ENVIRONMENT', 'SOCIAL_WELFARE', 'OTHER') NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    target_audience TEXT COMMENT 'JSON array of target groups',
    gn_id VARCHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE CASCADE,
    INDEX idx_announcement_number (announcement_number),
    INDEX idx_gn (gn_id),
    INDEX idx_type (type),
    INDEX idx_date (date),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. AUDIT LOG TABLE (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('RESIDENT', 'GN_OFFICER', 'ADMIN') NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id VARCHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_type, user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. NOTIFICATION TABLE (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS notification (
    notification_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    recipient_type ENUM('RESIDENT', 'GN_OFFICER', 'ADMIN') NOT NULL,
    recipient_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR') DEFAULT 'INFO',
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_recipient (recipient_type, recipient_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. LOGIN ATTEMPTS TABLE (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS login_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('RESIDENT', 'GN_OFFICER', 'ADMIN') NOT NULL,
    user_id VARCHAR(36),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    success BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_type, user_id),
    INDEX idx_ip (ip_address),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 20. SYSTEM SETTINGS TABLE (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEEDING INITIAL DATA (Enhanced)
-- ============================================================

-- Insert default divisions
INSERT INTO gn_division (division_id, division_code, name, district, province, divisional_secretariat) VALUES
(UUID(), 'GN-001A', 'Colombo Borella', 'Colombo', 'Western', 'Colombo Divisional Secretariat'),
(UUID(), 'GN-001B', 'Colombo Fort', 'Colombo', 'Western', 'Colombo Divisional Secretariat'),
(UUID(), 'GN-002A', 'Kandy Central', 'Kandy', 'Central', 'Kandy Divisional Secretariat');

-- Insert sample households
INSERT INTO household (household_number, address, division_id) 
SELECT 'H-90823', '45/2, Temple Road, Borella', division_id FROM gn_division WHERE division_code = 'GN-001A';

INSERT INTO household (household_number, address, division_id) 
SELECT 'H-90824', '12, School Lane, Borella', division_id FROM gn_division WHERE division_code = 'GN-001A';

-- Insert sample residents (Passwords: 'password123' hashed with bcrypt)
INSERT INTO resident (r_nic, first_name, last_name, date_of_birth, gender, mobile_no, email, password_hash, occupation, household_number, status, email_verified, mobile_verified) 
SELECT '789456123V', 'Nimal', 'Perera', '1990-05-15', 'Male', '0771234567', 'nimal@example.com', '$2b$10$mKpQ9qw9yqJh0BJU1CKOTeMMIpLW3mnGP6g0YaemBcn6W.uHNcbIS', 'Engineer', 'H-90823', 'Active', TRUE, TRUE;

INSERT INTO resident (r_nic, first_name, last_name, date_of_birth, gender, mobile_no, email, password_hash, occupation, household_number, status, email_verified, mobile_verified) 
SELECT '897654321V', 'Kamala', 'Silva', '1985-08-20', 'Female', '0719876543', 'kamala@example.com', '$2b$10$mKpQ9qw9yqJh0BJU1CKOTeMMIpLW3mnGP6g0YaemBcn6W.uHNcbIS', 'Teacher', 'H-90824', 'Active', TRUE, TRUE;

-- Insert sample GN Officer
INSERT INTO grama_niladhari (officer_id, username, password_hash, full_name, email, mobile, division_id, grade) 
SELECT 'GN-001', 'kamal_gn', '$2b$10$mKpQ9qw9yqJh0BJU1CKOTeMMIpLW3mnGP6g0YaemBcn6W.uHNcbIS', 'Kamal Perera', 'kamal.gn@example.com', '0703564478', division_id, 'Grade I' 
FROM gn_division WHERE division_code = 'GN-001A';

-- Insert sample Admin
INSERT INTO admin (full_name, username, password_hash, email, role) VALUES
('System Administrator', 'admin', '$2b$10$LWqQ3Eun7eJFjMsTieqoCOjqSaFryJx8mqDcNTLEZ60vX6feM7eR2', 'admin@smartgn.gov.lk', 'SuperAdmin');

-- Insert sample system settings
INSERT INTO system_settings (setting_key, setting_value, description, category) VALUES
('app_name', 'SmartGN', 'Application name', 'general'),
('app_version', '2.0.0', 'Application version', 'general'),
('max_login_attempts', '5', 'Maximum failed login attempts before lockout', 'security'),
('lockout_duration_minutes', '30', 'Account lockout duration in minutes', 'security'),
('session_timeout_minutes', '60', 'Session timeout in minutes', 'security'),
('certificate_validity_days', '365', 'Default certificate validity period', 'certificate');

-- Insert sample knowledge base entries
INSERT INTO knowledge_base (question, answer, category) VALUES
('How to apply for a character certificate?', 'To apply for a character certificate, visit your local GN office or apply online through the SmartGN portal. You will need to provide your NIC and fill out the application form.', 'Certificates'),
('What is the Aswesuma allowance?', 'Aswesuma is a social welfare benefit program that provides financial assistance to low-income families in Sri Lanka.', 'Allowances'),
('How to report a disaster?', 'You can report a disaster through the SmartGN portal by creating a disaster request. Provide details about the disaster type, location, and your contact information.', 'Disaster');

-- ============================================================
-- TRIGGERS (NEW)
-- ============================================================

-- Auto-update household member count
DELIMITER //
CREATE TRIGGER update_household_member_count_after_insert
AFTER INSERT ON family_member
FOR EACH ROW
BEGIN
    UPDATE household 
    SET total_members = (
        SELECT COUNT(*) FROM family_member 
        WHERE resident_nic = NEW.resident_nic
    )
    WHERE household_number = (SELECT household_number FROM resident WHERE r_nic = NEW.resident_nic);
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_household_member_count_after_delete
AFTER DELETE ON family_member
FOR EACH ROW
BEGIN
    UPDATE household 
    SET total_members = (
        SELECT COUNT(*) FROM family_member 
        WHERE resident_nic = OLD.resident_nic
    )
    WHERE household_number = (SELECT household_number FROM resident WHERE r_nic = OLD.resident_nic);
END//
DELIMITER ;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Show all tables
SHOW TABLES;

-- Check database structure
SELECT 
    table_name, 
    table_rows, 
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'smartgn_db'
ORDER BY table_name;

-- ============================================================
-- END OF SCRIPT
-- ============================================================