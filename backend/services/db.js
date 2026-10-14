import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const JSON_DB_PATH = path.join(DATA_DIR, 'mentor_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let mysqlPool = null;
let useMySQL = false;

// Attempt MySQL connection if environment variables provided
export async function initializeDatabase() {
  if (process.env.DB_HOST && process.env.DB_USER) {
    try {
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mentor_system_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      // Test ping
      await mysqlPool.query('SELECT 1');
      useMySQL = true;
      console.log('✅ Connected to MySQL database successfully.');
    } catch (err) {
      console.warn('⚠️  MySQL connection not established. Falling back to persistent File-Backed Database store.');
      console.warn(`    Reason: ${err.message}`);
      useMySQL = false;
    }
  } else {
    console.log('ℹ️  No MySQL environment credentials provided. Using zero-config persistent JSON Database engine.');
    useMySQL = false;
  }

  // Initialize or seed JSON database
  ensureSeedData();
}

// Generate hashed password for seed accounts
const DEFAULT_SALT = bcrypt.genSaltSync(10);
const HASHED_ADMIN_PW = bcrypt.hashSync('Admin@123', DEFAULT_SALT);
const HASHED_MENTOR_PW = bcrypt.hashSync('Mentor@123', DEFAULT_SALT);
const HASHED_STUDENT_PW = bcrypt.hashSync('Student@123', DEFAULT_SALT);

function getInitialSeedData() {
  const users = [
    {
      id: 'usr-admin-1',
      name: 'Dr. Arthur Pendelton',
      email: 'admin@smartmentor.ai',
      password_hash: HASHED_ADMIN_PW,
      role: 'ADMIN',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      phone: '+1 (555) 901-2244',
      bio: 'Dean of Student Mentorship & Academic Excellence initiatives.',
      created_at: new Date('2026-01-10T09:00:00Z').toISOString()
    },
    {
      id: 'usr-mentor-1',
      name: 'Dr. Elena Vance',
      email: 'mentor@smartmentor.ai',
      password_hash: HASHED_MENTOR_PW,
      role: 'MENTOR',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      phone: '+1 (555) 432-8877',
      bio: 'Senior Principal AI Researcher at DeepTech Labs. Former MIT post-doc with 12+ years experience in deep learning, LLMs, and academic mentorship.',
      created_at: new Date('2026-01-15T10:00:00Z').toISOString()
    },
    {
      id: 'usr-mentor-2',
      name: 'Marcus Sterling',
      email: 'marcus@smartmentor.ai',
      password_hash: HASHED_MENTOR_PW,
      role: 'MENTOR',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: '+1 (555) 321-9988',
      bio: 'Staff Cloud Architect at Nexus Systems. Expert in Kubernetes, AWS distributed architectures, and microservices scalability.',
      created_at: new Date('2026-01-18T11:00:00Z').toISOString()
    },
    {
      id: 'usr-mentor-3',
      name: 'Priya Sharma',
      email: 'priya@smartmentor.ai',
      password_hash: HASHED_MENTOR_PW,
      role: 'MENTOR',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      phone: '+1 (555) 678-2233',
      bio: 'Lead Data Engineer & Analytics Manager at FinCorp. Passionate about helping students break into big data pipelines and machine learning engineering.',
      created_at: new Date('2026-02-01T12:00:00Z').toISOString()
    },
    {
      id: 'usr-mentor-4',
      name: 'David Chen',
      email: 'david@smartmentor.ai',
      password_hash: HASHED_MENTOR_PW,
      role: 'MENTOR',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      phone: '+1 (555) 890-4455',
      bio: 'Director of Cybersecurity & Information Assurance. Specializing in ethical hacking, zero-trust architectures, and security certifications.',
      created_at: new Date('2026-02-10T14:00:00Z').toISOString()
    },
    {
      id: 'usr-mentor-5',
      name: 'Sophia Patel',
      email: 'sophia@smartmentor.ai',
      password_hash: HASHED_MENTOR_PW,
      role: 'MENTOR',
      status: 'PENDING_APPROVAL',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: '+1 (555) 765-1122',
      bio: 'DevOps & Site Reliability Engineer at CloudScale. Applicant awaiting administrator credentials review.',
      created_at: new Date('2026-03-01T08:30:00Z').toISOString()
    },
    {
      id: 'usr-student-1',
      name: 'Alex Johnson',
      email: 'student@smartmentor.ai',
      password_hash: HASHED_STUDENT_PW,
      role: 'STUDENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      phone: '+1 (555) 234-5678',
      bio: 'Junior B.Tech Computer Science student specializing in Artificial Intelligence and Natural Language Processing. Aiming for Top Tier AI Engineering roles.',
      created_at: new Date('2026-01-20T10:00:00Z').toISOString()
    },
    {
      id: 'usr-student-2',
      name: 'Maya Lin',
      email: 'maya@smartmentor.ai',
      password_hash: HASHED_STUDENT_PW,
      role: 'STUDENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      phone: '+1 (555) 345-6789',
      bio: 'Sophomore Data Science & Mathematics student eager to master predictive analytics, SQL pipelines, and financial modeling.',
      created_at: new Date('2026-01-22T11:00:00Z').toISOString()
    },
    {
      id: 'usr-student-3',
      name: 'Carlos Rivera',
      email: 'carlos@smartmentor.ai',
      password_hash: HASHED_STUDENT_PW,
      role: 'STUDENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      phone: '+1 (555) 456-7890',
      bio: 'Senior Systems Engineering student preparing for distributed systems development and cloud architecture interviews.',
      created_at: new Date('2026-02-05T09:30:00Z').toISOString()
    },
    {
      id: 'usr-student-4',
      name: 'Zara Ahmed',
      email: 'zara@smartmentor.ai',
      password_hash: HASHED_STUDENT_PW,
      role: 'STUDENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      phone: '+1 (555) 567-8901',
      bio: '3rd Year Cybersecurity & Network Systems student exploring penetration testing, cryptography, and defense protocols.',
      created_at: new Date('2026-02-12T14:15:00Z').toISOString()
    }
  ];

  const studentProfiles = [
    {
      id: 'sp-1',
      user_id: 'usr-student-1',
      university: 'Tech University Institute of Technology',
      major: 'Computer Science & AI',
      academic_year: '3rd Year (Junior)',
      gpa: 3.88,
      career_goals: 'Become a Machine Learning Engineer working on foundational language models and production AI pipelines.',
      skills_sought: ['Machine Learning', 'PyTorch', 'System Design', 'LLM Fine-tuning', 'Algorithms'],
      assigned_mentor_id: 'usr-mentor-1',
      pairing_date: new Date('2026-01-25T14:00:00Z').toISOString()
    },
    {
      id: 'sp-2',
      user_id: 'usr-student-2',
      university: 'State University of Science',
      major: 'Data Science & Applied Statistics',
      academic_year: '2nd Year (Sophomore)',
      gpa: 3.75,
      career_goals: 'Data Engineer / Analytics Specialist in fintech or high-scale consumer tech.',
      skills_sought: ['SQL', 'Python Data Engineering', 'Spark', 'Cloud Warehousing', 'Data Modeling'],
      assigned_mentor_id: 'usr-mentor-3',
      pairing_date: new Date('2026-02-05T10:00:00Z').toISOString()
    },
    {
      id: 'sp-3',
      user_id: 'usr-student-3',
      university: 'Metropolitan Engineering College',
      major: 'Computer Engineering & Systems',
      academic_year: '4th Year (Senior)',
      gpa: 3.65,
      career_goals: 'Cloud Infrastructure / Distributed Systems Software Engineer.',
      skills_sought: ['Cloud Architecture', 'Kubernetes', 'Go / Rust', 'Distributed Systems', 'DevOps'],
      assigned_mentor_id: null, // Unassigned for demonstration!
      pairing_date: null
    },
    {
      id: 'sp-4',
      user_id: 'usr-student-4',
      university: 'National College of Information Sciences',
      major: 'Cybersecurity & Defense Systems',
      academic_year: '3rd Year (Junior)',
      gpa: 3.91,
      career_goals: 'Security Operations & Penetration Testing Analyst.',
      skills_sought: ['Network Security', 'Penetration Testing', 'Cryptography', 'SIEM Tools', 'Zero Trust'],
      assigned_mentor_id: null, // Unassigned for demonstration!
      pairing_date: null
    }
  ];

  const mentorProfiles = [
    {
      id: 'mp-1',
      user_id: 'usr-mentor-1',
      organization: 'DeepTech Labs',
      designation: 'Principal AI Scientist',
      domain: 'Artificial Intelligence & Machine Learning',
      expertise_skills: ['Deep Learning', 'PyTorch', 'LLMs', 'Research Papers', 'Computer Vision', 'Algorithms'],
      years_experience: 12,
      max_mentees: 4,
      rating: 4.9,
      approval_status: 'APPROVED',
      linkedin_url: 'https://linkedin.com/in/elena-vance-ai'
    },
    {
      id: 'mp-2',
      user_id: 'usr-mentor-2',
      organization: 'Nexus Systems',
      designation: 'Staff Cloud Architect',
      domain: 'Cloud Architecture & Distributed Systems',
      expertise_skills: ['Cloud Architecture', 'AWS', 'Kubernetes', 'Microservices', 'Distributed Systems', 'System Design'],
      years_experience: 10,
      max_mentees: 5,
      rating: 4.8,
      approval_status: 'APPROVED',
      linkedin_url: 'https://linkedin.com/in/marcus-sterling-cloud'
    },
    {
      id: 'mp-3',
      user_id: 'usr-mentor-3',
      organization: 'FinCorp Global',
      designation: 'Lead Data Engineer',
      domain: 'Data Engineering & Analytics',
      expertise_skills: ['SQL', 'Python Data Engineering', 'Spark', 'Airflow', 'Cloud Warehousing', 'Data Modeling'],
      years_experience: 8,
      max_mentees: 3,
      rating: 5.0,
      approval_status: 'APPROVED',
      linkedin_url: 'https://linkedin.com/in/priya-sharma-data'
    },
    {
      id: 'mp-4',
      user_id: 'usr-mentor-4',
      organization: 'SecureNet International',
      designation: 'Director of Cybersecurity',
      domain: 'Cybersecurity & Threat Defense',
      expertise_skills: ['Network Security', 'Penetration Testing', 'Cryptography', 'SIEM Tools', 'Incident Response'],
      years_experience: 14,
      max_mentees: 5,
      rating: 4.9,
      approval_status: 'APPROVED',
      linkedin_url: 'https://linkedin.com/in/david-chen-cyber'
    },
    {
      id: 'mp-5',
      user_id: 'usr-mentor-5',
      organization: 'CloudScale Technologies',
      designation: 'Senior DevOps / SRE Lead',
      domain: 'DevOps & Site Reliability',
      expertise_skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Prometheus'],
      years_experience: 6,
      max_mentees: 3,
      rating: 4.7,
      approval_status: 'PENDING',
      linkedin_url: 'https://linkedin.com/in/sophia-patel-devops'
    }
  ];

  const goals = [
    {
      id: 'goal-1',
      student_id: 'usr-student-1',
      title: 'Complete Transformer & LLM Fine-Tuning Project',
      description: 'Implement a specialized domain fine-tuning pipeline on Llama-3 using LoRA and evaluate perplexity on legal tech documents.',
      category: 'TECHNICAL_SKILL',
      progress: 75,
      status: 'IN_PROGRESS',
      target_date: '2026-11-30',
      milestones: [
        { id: 'm1', title: 'Data gathering and tokenization preprocessing', done: true },
        { id: 'm2', title: 'HuggingFace PEFT and QLoRA training script setup', done: true },
        { id: 'm3', title: 'Benchmark model evaluations and ROUGE scoring', done: true },
        { id: 'm4', title: 'Deploy FastAPI demo endpoint with GPU acceleration', done: false }
      ],
      created_at: new Date('2026-02-01T10:00:00Z').toISOString(),
      updated_at: new Date('2026-10-01T15:00:00Z').toISOString()
    },
    {
      id: 'goal-2',
      student_id: 'usr-student-1',
      title: 'Master Advanced Data Structures & Dynamic Programming',
      description: 'Solve 100 NeetCode/LeetCode questions with emphasis on Graphs, Trie, and DP to prepare for upcoming Summer 2027 internship interviews.',
      category: 'ACADEMIC',
      progress: 60,
      status: 'IN_PROGRESS',
      target_date: '2026-12-15',
      milestones: [
        { id: 'm21', title: 'Complete Arrays, Two-Pointers, and Sliding Window (25 problems)', done: true },
        { id: 'm22', title: 'Complete Trees and Graph Traversal BFS/DFS (25 problems)', done: true },
        { id: 'm23', title: 'Complete Dynamic Programming 1D and 2D patterns (30 problems)', done: false },
        { id: 'm24', title: 'Take 3 timed mock interview assessments with Mentor', done: false }
      ],
      created_at: new Date('2026-02-10T11:00:00Z').toISOString(),
      updated_at: new Date('2026-09-28T18:00:00Z').toISOString()
    },
    {
      id: 'goal-3',
      student_id: 'usr-student-1',
      title: 'Submit Paper to College AI Symposium',
      description: 'Author and submit an empirical paper on efficient inference optimization techniques on consumer hardware.',
      category: 'RESEARCH',
      progress: 30,
      status: 'IN_PROGRESS',
      target_date: '2027-01-20',
      milestones: [
        { id: 'm31', title: 'Literature survey of quantization & KV-caching methods', done: true },
        { id: 'm32', title: 'Empirical benchmark experiments setup', done: false },
        { id: 'm33', title: 'Draft methodology and results sections', done: false },
        { id: 'm34', title: 'Mentor review and camera-ready submission', done: false }
      ],
      created_at: new Date('2026-03-01T09:00:00Z').toISOString(),
      updated_at: new Date('2026-09-15T12:00:00Z').toISOString()
    },
    {
      id: 'goal-4',
      student_id: 'usr-student-2',
      title: 'Build End-to-End Real-Time ETL Pipeline',
      description: 'Ingest cryptocurrency trade streams using Kafka, transform via PySpark, and store in Snowflake with dbt models.',
      category: 'PROJECT',
      progress: 50,
      status: 'IN_PROGRESS',
      target_date: '2026-11-20',
      milestones: [
        { id: 'm41', title: 'Setup Apache Kafka producer for Binance WebSocket API', done: true },
        { id: 'm42', title: 'PySpark structured streaming windowed aggregations', done: true },
        { id: 'm43', title: 'dbt transformation layer for analytical mart', done: false },
        { id: 'm44', title: 'Build interactive Streamlit monitoring dashboard', done: false }
      ],
      created_at: new Date('2026-02-15T14:00:00Z').toISOString(),
      updated_at: new Date('2026-10-05T16:00:00Z').toISOString()
    }
  ];

  const sessions = [
    {
      id: 'sess-1',
      student_id: 'usr-student-1',
      mentor_id: 'usr-mentor-1',
      scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days in future
      duration_minutes: 45,
      meeting_link: 'https://meet.google.com/sih-ment-conf',
      topic: 'LLM Fine-Tuning Hyperparameters & GPU Optimization Review',
      notes: 'Reviewing Alex’s training loss curves, learning rate scheduler selection, and quantization tradeoffs.',
      status: 'CONFIRMED',
      requested_by: 'usr-student-1',
      created_at: new Date('2026-10-10T10:00:00Z').toISOString()
    },
    {
      id: 'sess-2',
      student_id: 'usr-student-1',
      mentor_id: 'usr-mentor-1',
      scheduled_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      duration_minutes: 60,
      meeting_link: 'https://meet.google.com/sih-ment-past',
      topic: 'Technical Resume & System Design Fundamentals',
      notes: 'Critiqued Alex’s resume projects; discussed how to frame open-source contributions.',
      status: 'COMPLETED',
      requested_by: 'usr-student-1',
      created_at: new Date('2026-10-01T11:00:00Z').toISOString()
    },
    {
      id: 'sess-3',
      student_id: 'usr-student-2',
      mentor_id: 'usr-mentor-3',
      scheduled_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 45,
      meeting_link: 'https://meet.google.com/data-pipeline-sync',
      topic: 'PySpark Windowing Functions & Schema Evolution',
      notes: 'Deep-dive session into stateful streaming and watermarking.',
      status: 'CONFIRMED',
      requested_by: 'usr-student-2',
      created_at: new Date('2026-10-11T12:00:00Z').toISOString()
    }
  ];

  const feedback = [
    {
      id: 'fb-1',
      session_id: 'sess-2',
      student_id: 'usr-student-1',
      mentor_id: 'usr-mentor-1',
      rating: 5,
      technical_skills_rating: 5,
      communication_rating: 4,
      qualitative_notes: 'Alex showed exceptional initiative in setting up the LoRA scripts. Demonstrates solid grasp of attention mechanisms and gradient checkpointing.',
      actionable_next_steps: '1. Refine README documentation with architecture diagrams. 2. Practice explaining tradeoffs between full fine-tuning vs parameter-efficient tuning in mock interviews.',
      created_at: new Date('2026-10-07T12:00:00Z').toISOString()
    }
  ];

  const notifications = [
    {
      id: 'notif-1',
      user_id: 'usr-student-1',
      title: 'Mentoring Session Confirmed',
      message: 'Dr. Elena Vance confirmed your session for "LLM Fine-Tuning Hyperparameters" in 2 days.',
      type: 'SESSION',
      is_read: false,
      created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    },
    {
      id: 'notif-2',
      user_id: 'usr-student-1',
      title: 'Mentor Feedback Received',
      message: 'Dr. Elena Vance submitted formal feedback and next-step recommendations for your past session.',
      type: 'FEEDBACK',
      is_read: true,
      created_at: new Date('2026-10-07T13:00:00Z').toISOString()
    },
    {
      id: 'notif-3',
      user_id: 'usr-mentor-1',
      title: 'Goal Progress Milestone Completed',
      message: 'Alex Johnson marked "Benchmark model evaluations and ROUGE scoring" as completed.',
      type: 'GOAL',
      is_read: false,
      created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
    },
    {
      id: 'notif-4',
      user_id: 'usr-admin-1',
      title: 'Pending Mentor Verification',
      message: 'Sophia Patel applied for Mentor status in DevOps & Site Reliability. Verification required.',
      type: 'SYSTEM',
      is_read: false,
      created_at: new Date('2026-10-12T08:00:00Z').toISOString()
    }
  ];

  const contactInquiries = [
    {
      id: 'inq-1',
      name: 'Professor Robert Martinez',
      email: 'rmartinez@stateuniv.edu',
      role: 'College Department Chair',
      subject: 'Departmental Mentorship Onboarding for 300 Computer Science Students',
      message: 'We are very interested in adopting Smart AI Mentor platform across our undergraduate engineering cohort this semester. Could we schedule a demo call with your team?',
      status: 'IN_REVIEW',
      created_at: new Date('2026-10-12T11:00:00Z').toISOString()
    }
  ];

  return {
    users,
    studentProfiles,
    mentorProfiles,
    goals,
    sessions,
    feedback,
    notifications,
    contactInquiries
  };
}

function ensureSeedData() {
  if (!fs.existsSync(JSON_DB_PATH)) {
    const seed = getInitialSeedData();
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    console.log('✅ Initialized seed database with demonstration users, mentors, and goals.');
  }
}

// Low-level atomic read and write operations
export function readDB() {
  ensureSeedData();
  try {
    const raw = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON DB, restoring seed data:', err);
    const seed = getInitialSeedData();
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

export function writeDB(data) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to JSON DB:', err);
    throw err;
  }
}

// High-level query abstractions
export const db = {
  // Users
  findUserByEmail: async (email) => {
    const data = readDB();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById: async (id) => {
    const data = readDB();
    return data.users.find((u) => u.id === id) || null;
  },

  getAllUsers: async () => {
    const data = readDB();
    return data.users.map(({ password_hash, ...safeUser }) => safeUser);
  },

  createUser: async (user) => {
    const data = readDB();
    data.users.push(user);
    writeDB(data);
    const { password_hash, ...safeUser } = user;
    return safeUser;
  },

  updateUser: async (id, updates) => {
    const data = readDB();
    const index = data.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    data.users[index] = { ...data.users[index], ...updates, updated_at: new Date().toISOString() };
    writeDB(data);
    const { password_hash, ...safeUser } = data.users[index];
    return safeUser;
  },

  // Student Profiles
  getStudentProfile: async (userId) => {
    const data = readDB();
    return data.studentProfiles.find((sp) => sp.user_id === userId) || null;
  },

  getAllStudentProfiles: async () => {
    const data = readDB();
    return data.studentProfiles;
  },

  createStudentProfile: async (profile) => {
    const data = readDB();
    data.studentProfiles.push(profile);
    writeDB(data);
    return profile;
  },

  updateStudentProfile: async (userId, updates) => {
    const data = readDB();
    const index = data.studentProfiles.findIndex((sp) => sp.user_id === userId);
    if (index === -1) return null;
    data.studentProfiles[index] = { ...data.studentProfiles[index], ...updates };
    writeDB(data);
    return data.studentProfiles[index];
  },

  // Mentor Profiles
  getMentorProfile: async (userId) => {
    const data = readDB();
    return data.mentorProfiles.find((mp) => mp.user_id === userId) || null;
  },

  getAllMentorProfiles: async () => {
    const data = readDB();
    return data.mentorProfiles;
  },

  createMentorProfile: async (profile) => {
    const data = readDB();
    data.mentorProfiles.push(profile);
    writeDB(data);
    return profile;
  },

  updateMentorProfile: async (userId, updates) => {
    const data = readDB();
    const index = data.mentorProfiles.findIndex((mp) => mp.user_id === userId);
    if (index === -1) return null;
    data.mentorProfiles[index] = { ...data.mentorProfiles[index], ...updates };
    writeDB(data);
    return data.mentorProfiles[index];
  },

  // Goals
  getGoalsByStudentId: async (studentId) => {
    const data = readDB();
    return data.goals.filter((g) => g.student_id === studentId);
  },

  getGoalById: async (goalId) => {
    const data = readDB();
    return data.goals.find((g) => g.id === goalId) || null;
  },

  createGoal: async (goal) => {
    const data = readDB();
    data.goals.push(goal);
    writeDB(data);
    return goal;
  },

  updateGoal: async (goalId, updates) => {
    const data = readDB();
    const index = data.goals.findIndex((g) => g.id === goalId);
    if (index === -1) return null;
    data.goals[index] = { ...data.goals[index], ...updates, updated_at: new Date().toISOString() };
    writeDB(data);
    return data.goals[index];
  },

  deleteGoal: async (goalId) => {
    const data = readDB();
    data.goals = data.goals.filter((g) => g.id !== goalId);
    writeDB(data);
    return true;
  },

  // Sessions
  getSessionsByStudentId: async (studentId) => {
    const data = readDB();
    return data.sessions.filter((s) => s.student_id === studentId);
  },

  getSessionsByMentorId: async (mentorId) => {
    const data = readDB();
    return data.sessions.filter((s) => s.mentor_id === mentorId);
  },

  getAllSessions: async () => {
    const data = readDB();
    return data.sessions;
  },

  createSession: async (session) => {
    const data = readDB();
    data.sessions.push(session);
    writeDB(data);
    return session;
  },

  updateSession: async (sessionId, updates) => {
    const data = readDB();
    const index = data.sessions.findIndex((s) => s.id === sessionId);
    if (index === -1) return null;
    data.sessions[index] = { ...data.sessions[index], ...updates, updated_at: new Date().toISOString() };
    writeDB(data);
    return data.sessions[index];
  },

  // Feedback
  getFeedbackByStudentId: async (studentId) => {
    const data = readDB();
    return data.feedback.filter((f) => f.student_id === studentId);
  },

  getFeedbackByMentorId: async (mentorId) => {
    const data = readDB();
    return data.feedback.filter((f) => f.mentor_id === mentorId);
  },

  getAllFeedback: async () => {
    const data = readDB();
    return data.feedback;
  },

  createFeedback: async (feedbackItem) => {
    const data = readDB();
    data.feedback.push(feedbackItem);
    writeDB(data);
    return feedbackItem;
  },

  // Notifications
  getNotificationsByUserId: async (userId) => {
    const data = readDB();
    return data.notifications
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  createNotification: async (notif) => {
    const data = readDB();
    data.notifications.unshift(notif);
    writeDB(data);
    return notif;
  },

  markNotificationRead: async (notifId) => {
    const data = readDB();
    const index = data.notifications.findIndex((n) => n.id === notifId);
    if (index !== -1) {
      data.notifications[index].is_read = true;
      writeDB(data);
    }
    return true;
  },

  // Contact Inquiries
  createContactInquiry: async (inquiry) => {
    const data = readDB();
    data.contactInquiries.unshift(inquiry);
    writeDB(data);
    return inquiry;
  },

  getAllContactInquiries: async () => {
    const data = readDB();
    return data.contactInquiries;
  }
};
