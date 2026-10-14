import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new Student or Mentor account
 */
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      bio,
      // Student-specific fields
      university,
      major,
      academicYear,
      careerGoals,
      skillsSought,
      // Mentor-specific fields
      organization,
      designation,
      domain,
      expertiseSkills,
      yearsExperience,
      linkedinUrl
    } = req.body;

    // 1. Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, password, and role are required fields.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    if (!['STUDENT', 'MENTOR'].includes(role.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Role must be either STUDENT or MENTOR.'
      });
    }

    // 2. Check existing user
    const existingUser = await db.findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = `usr-${uuidv4().slice(0, 8)}`;
    const userRole = role.toUpperCase();

    // Default status: Students active immediately; Mentors active (ready to mentor)
    const userStatus = 'ACTIVE';

    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      role: userRole,
      status: userStatus,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0f172a,1e293b,0d9488`,
      phone: phone || '',
      bio: bio || '',
      created_at: new Date().toISOString()
    };

    await db.createUser(newUser);

    // 4. Create role-specific profile
    if (userRole === 'STUDENT') {
      const studentProfile = {
        id: `sp-${uuidv4().slice(0, 8)}`,
        user_id: userId,
        university: university || 'Metropolitan University',
        major: major || 'Computer Science',
        academic_year: academicYear || '2nd Year',
        gpa: 3.5,
        career_goals: careerGoals || 'Software Engineering & Technology Innovation',
        skills_sought: Array.isArray(skillsSought)
          ? skillsSought
          : (skillsSought || 'Web Development, Algorithms, Cloud Architecture').split(',').map((s) => s.trim()).filter(Boolean),
        assigned_mentor_id: null,
        pairing_date: null
      };
      await db.createStudentProfile(studentProfile);
    } else if (userRole === 'MENTOR') {
      const mentorProfile = {
        id: `mp-${uuidv4().slice(0, 8)}`,
        user_id: userId,
        organization: organization || 'Independent Consultant',
        designation: designation || 'Senior Engineer / Consultant',
        domain: domain || 'Software Engineering & Systems',
        expertise_skills: Array.isArray(expertiseSkills)
          ? expertiseSkills
          : (expertiseSkills || 'Architecture, Cloud, Problem Solving').split(',').map((s) => s.trim()).filter(Boolean),
        years_experience: parseInt(yearsExperience || '5', 10),
        max_mentees: 4,
        rating: 5.0,
        approval_status: 'APPROVED',
        linkedin_url: linkedinUrl || ''
      };
      await db.createMentorProfile(mentorProfile);
    }

    // 5. Create Welcome Notification
    await db.createNotification({
      id: `notif-${uuidv4().slice(0, 8)}`,
      user_id: userId,
      title: 'Welcome to Smart AI Mentor Platform! 🚀',
      message: userRole === 'STUDENT'
        ? 'Your student profile has been created. Check out AI-recommended mentors and set your first goal!'
        : 'Your mentor profile has been successfully registered. You are ready to inspire the next generation!',
      type: 'SYSTEM',
      is_read: false,
      created_at: new Date().toISOString()
    });

    // 6. Generate Token
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        status: newUser.status
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred during registration.'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate existing user with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.'
      });
    }

    const user = await db.findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        error: 'Your account has been suspended. Please contact administrator.'
      });
    }

    const token = generateToken(user);

    // Fetch role profile
    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await db.getStudentProfile(user.id);
    } else if (user.role === 'MENTOR') {
      profile = await db.getMentorProfile(user.id);
    }

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
        phone: user.phone,
        bio: user.bio,
        profile
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred during login.'
    });
  }
});

/**
 * POST /api/auth/demo-login
 * Fast one-click demonstration login for evaluators
 */
router.post('/demo-login', async (req, res) => {
  try {
    const { role } = req.body; // 'STUDENT' | 'MENTOR' | 'ADMIN'
    const targetRole = (role || 'STUDENT').toUpperCase();

    let email = 'student@smartmentor.ai';
    if (targetRole === 'MENTOR') {
      email = 'mentor@smartmentor.ai';
    } else if (targetRole === 'ADMIN') {
      email = 'admin@smartmentor.ai';
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Demo user account not found.' });
    }

    const token = generateToken(user);
    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await db.getStudentProfile(user.id);
    } else if (user.role === 'MENTOR') {
      profile = await db.getMentorProfile(user.id);
    }

    return res.json({
      success: true,
      message: `Logged in as Demo ${targetRole}.`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
        phone: user.phone,
        bio: user.bio,
        profile
      }
    });
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({ success: false, error: 'Demo login failed.' });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user details
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await db.getStudentProfile(user.id);
    } else if (user.role === 'MENTOR') {
      profile = await db.getMentorProfile(user.id);
    }

    const notifications = await db.getNotificationsByUserId(user.id);
    const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        status: user.status,
        created_at: user.created_at,
        profile,
        unreadNotificationsCount
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve profile.' });
  }
});

export default router;
