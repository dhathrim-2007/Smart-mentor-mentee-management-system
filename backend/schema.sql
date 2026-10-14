-- ====================================================================
-- Smart AI Mentor–Mentee Management System
-- Database Schema for MySQL 8.0+
-- ====================================================================

CREATE DATABASE IF NOT EXISTS mentor_system_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mentor_system_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'MENTOR', 'ADMIN') NOT NULL,
    status ENUM('ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED') DEFAULT 'ACTIVE',
    avatar VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
);

-- 2. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS student_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    university VARCHAR(150) NOT NULL,
    major VARCHAR(100) NOT NULL,
    academic_year VARCHAR(30) NOT NULL,
    gpa DECIMAL(3, 2) DEFAULT NULL,
    career_goals TEXT DEFAULT NULL,
    skills_sought JSON DEFAULT NULL,
    assigned_mentor_id VARCHAR(36) DEFAULT NULL,
    pairing_date TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_mentor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_student_mentor (assigned_mentor_id)
);

-- 3. MENTOR PROFILES TABLE
CREATE TABLE IF NOT EXISTS mentor_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    organization VARCHAR(150) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    expertise_skills JSON NOT NULL,
    years_experience INT NOT NULL DEFAULT 1,
    max_mentees INT DEFAULT 5,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    approval_status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'PENDING',
    linkedin_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_mentor_domain (domain)
);

-- 4. GOALS TABLE
CREATE TABLE IF NOT EXISTS goals (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('ACADEMIC', 'CAREER', 'TECHNICAL_SKILL', 'PROJECT', 'RESEARCH') DEFAULT 'CAREER',
    progress INT DEFAULT 0,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD') DEFAULT 'NOT_STARTED',
    target_date DATE NOT NULL,
    milestones JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_goal_student (student_id)
);

-- 5. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    mentor_id VARCHAR(36) NOT NULL,
    scheduled_time DATETIME NOT NULL,
    duration_minutes INT DEFAULT 45,
    meeting_link VARCHAR(255) DEFAULT NULL,
    topic VARCHAR(200) NOT NULL,
    notes TEXT DEFAULT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED') DEFAULT 'PENDING',
    requested_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_student (student_id),
    INDEX idx_session_mentor (mentor_id)
);

-- 6. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS feedback (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) DEFAULT NULL,
    student_id VARCHAR(36) NOT NULL,
    mentor_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    technical_skills_rating INT DEFAULT 5,
    communication_rating INT DEFAULT 5,
    qualitative_notes TEXT NOT NULL,
    actionable_next_steps TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_feedback_student (student_id),
    INDEX idx_feedback_mentor (mentor_id)
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('SESSION', 'GOAL', 'FEEDBACK', 'MATCH', 'SYSTEM') DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id, is_read)
);

-- 8. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'Student',
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('NEW', 'IN_REVIEW', 'RESOLVED') DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
