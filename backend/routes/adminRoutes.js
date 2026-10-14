import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { rankMentorsForStudent, AI_ENGINE_METADATA } from '../services/aiEngine.js';

const router = express.Router();

// Enforce authentication & ADMIN role across all admin routes
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

/**
 * GET /api/admin/stats
 * Global platform overview statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    const studentProfiles = await db.getAllStudentProfiles();
    const mentorProfiles = await db.getAllMentorProfiles();
    const allSessions = await db.getAllSessions();
    const allFeedback = await db.getAllFeedback();
    const inquiries = await db.getAllContactInquiries();

    const studentsCount = users.filter((u) => u.role === 'STUDENT').length;
    const mentorsCount = users.filter((u) => u.role === 'MENTOR').length;
    const pendingMentorsCount = mentorProfiles.filter((m) => m.approval_status === 'PENDING').length;
    const activePairingsCount = studentProfiles.filter((s) => Boolean(s.assigned_mentor_id)).length;
    const unassignedStudentsCount = studentProfiles.filter((s) => !s.assigned_mentor_id).length;

    // Average system feedback rating
    const avgRating = allFeedback.length > 0
      ? (allFeedback.reduce((acc, f) => acc + (f.rating || 5), 0) / allFeedback.length).toFixed(1)
      : '4.9';

    return res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        studentsCount,
        mentorsCount,
        adminsCount: users.filter((u) => u.role === 'ADMIN').length,
        pendingMentorsCount,
        activePairingsCount,
        unassignedStudentsCount,
        totalSessions: allSessions.length,
        completedSessions: allSessions.filter((s) => s.status === 'COMPLETED').length,
        totalFeedback: allFeedback.length,
        averageSatisfactionRating: parseFloat(avgRating),
        newInquiriesCount: inquiries.filter((i) => i.status === 'NEW').length,
        aiEngine: AI_ENGINE_METADATA
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to compute admin statistics.' });
  }
});

/**
 * GET /api/admin/users
 * Search and filter all users
 */
router.get('/users', async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let users = await db.getAllUsers();
    const studentProfiles = await db.getAllStudentProfiles();
    const mentorProfiles = await db.getAllMentorProfiles();

    if (role) {
      users = users.filter((u) => u.role === role.toUpperCase());
    }
    if (status) {
      users = users.filter((u) => u.status === status.toUpperCase());
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    const enrichedUsers = users.map((u) => {
      let details = null;
      if (u.role === 'STUDENT') {
        details = studentProfiles.find((sp) => sp.user_id === u.id);
      } else if (u.role === 'MENTOR') {
        details = mentorProfiles.find((mp) => mp.user_id === u.id);
      }
      return { ...u, profileDetails: details };
    });

    return res.json({ success: true, users: enrichedUsers });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch users list.' });
  }
});

/**
 * PUT /api/admin/users/:userId/status
 * Toggle user active or suspended
 */
router.put('/users/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid user status.' });
    }

    const updated = await db.updateUser(userId, { status });
    return res.json({ success: true, user: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update user status.' });
  }
});

/**
 * GET /api/admin/mentors/pending
 * List mentors awaiting approval
 */
router.get('/mentors/pending', async (req, res) => {
  try {
    const mentorProfiles = await db.getAllMentorProfiles();
    const pendingProfiles = mentorProfiles.filter((m) => m.approval_status === 'PENDING');
    const allUsers = await db.getAllUsers();

    const pendingMentors = pendingProfiles.map((mp) => {
      const u = allUsers.find((user) => user.id === mp.user_id);
      return {
        mentorId: mp.user_id,
        name: u?.name || 'Unknown',
        email: u?.email || '',
        avatar: u?.avatar,
        organization: mp.organization,
        designation: mp.designation,
        domain: mp.domain,
        yearsExperience: mp.years_experience,
        expertiseSkills: mp.expertise_skills,
        linkedinUrl: mp.linkedin_url,
        appliedAt: mp.created_at
      };
    });

    return res.json({ success: true, pendingMentors });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch pending mentors.' });
  }
});

/**
 * PUT /api/admin/mentors/:mentorId/approval
 * Approve or reject a mentor application
 */
router.put('/mentors/:mentorId/approval', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { approvalStatus } = req.body; // 'APPROVED' | 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(approvalStatus)) {
      return res.status(400).json({ success: false, error: 'Approval status must be APPROVED or REJECTED.' });
    }

    const updatedProfile = await db.updateMentorProfile(mentorId, {
      approval_status: approvalStatus
    });

    if (!updatedProfile) {
      return res.status(404).json({ success: false, error: 'Mentor profile not found.' });
    }

    // Send notification to the mentor
    await db.createNotification({
      id: `notif-${uuidv4().slice(0, 8)}`,
      user_id: mentorId,
      title: approvalStatus === 'APPROVED' ? 'Mentor Application Approved! 🎉' : 'Mentor Application Update',
      message: approvalStatus === 'APPROVED'
        ? 'Your mentor credentials have been verified by the administrator. You are now active in the matching pool!'
        : 'Your mentor application could not be verified at this time.',
      type: 'SYSTEM',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, profile: updatedProfile });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update approval status.' });
  }
});

/**
 * GET /api/admin/pairings
 * List all students with their assigned mentor and unassigned list
 */
router.get('/pairings', async (req, res) => {
  try {
    const studentProfiles = await db.getAllStudentProfiles();
    const mentorProfiles = await db.getAllMentorProfiles();
    const allUsers = await db.getAllUsers();

    const pairings = [];
    const unassignedStudents = [];

    for (const sp of studentProfiles) {
      const studentUser = allUsers.find((u) => u.id === sp.user_id);
      if (!studentUser) continue;

      if (sp.assigned_mentor_id) {
        const mentorUser = allUsers.find((u) => u.id === sp.assigned_mentor_id);
        const mentorProf = mentorProfiles.find((mp) => mp.user_id === sp.assigned_mentor_id);
        pairings.push({
          student: {
            id: studentUser.id,
            name: studentUser.name,
            email: studentUser.email,
            major: sp.major,
            year: sp.academic_year
          },
          mentor: {
            id: mentorUser?.id || '',
            name: mentorUser?.name || 'Unassigned',
            email: mentorUser?.email || '',
            organization: mentorProf?.organization || '',
            domain: mentorProf?.domain || ''
          },
          pairingDate: sp.pairing_date
        });
      } else {
        // Run AI match suggestions for unassigned student
        const aiSuggestions = await rankMentorsForStudent(studentUser.id);
        unassignedStudents.push({
          student: {
            id: studentUser.id,
            name: studentUser.name,
            email: studentUser.email,
            major: sp.major,
            year: sp.academic_year,
            careerGoals: sp.career_goals,
            skillsSought: sp.skills_sought
          },
          topAiMatch: aiSuggestions[0] || null
        });
      }
    }

    const approvedMentors = mentorProfiles
      .filter((m) => m.approval_status === 'APPROVED')
      .map((mp) => {
        const u = allUsers.find((user) => user.id === mp.user_id);
        const activeMenteesCount = studentProfiles.filter((s) => s.assigned_mentor_id === mp.user_id).length;
        return {
          mentorId: mp.user_id,
          name: u?.name || '',
          organization: mp.organization,
          domain: mp.domain,
          maxMentees: mp.max_mentees,
          activeMenteesCount,
          isFull: activeMenteesCount >= mp.max_mentees
        };
      });

    return res.json({
      success: true,
      data: {
        pairings,
        unassignedStudents,
        approvedMentors
      }
    });
  } catch (err) {
    console.error('Pairings error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve pairings.' });
  }
});

/**
 * POST /api/admin/pairings/assign
 * Manually assign a mentor to a student
 */
router.post('/pairings/assign', async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    if (!studentId || !mentorId) {
      return res.status(400).json({ success: false, error: 'Both studentId and mentorId are required.' });
    }

    const studentUser = await db.findUserById(studentId);
    const mentorUser = await db.findUserById(mentorId);

    if (!studentUser || !mentorUser) {
      return res.status(404).json({ success: false, error: 'Student or Mentor user not found.' });
    }

    await db.updateStudentProfile(studentId, {
      assigned_mentor_id: mentorId,
      pairing_date: new Date().toISOString()
    });

    // Notify Student
    await db.createNotification({
      id: `notif-${uuidv4().slice(0, 8)}`,
      user_id: studentId,
      title: 'Mentor Assigned! 🤝',
      message: `You have been paired with ${mentorUser.name}. Visit your dashboard to explore their profile and schedule your first session!`,
      type: 'MATCH',
      is_read: false,
      created_at: new Date().toISOString()
    });

    // Notify Mentor
    await db.createNotification({
      id: `notif-${uuidv4().slice(0, 8)}`,
      user_id: mentorId,
      title: 'New Mentee Assigned 👥',
      message: `${studentUser.name} has been assigned to your mentorship cohort.`,
      type: 'MATCH',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Mentor paired successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to assign mentor.' });
  }
});

/**
 * POST /api/admin/pairings/unassign
 * Remove assignment
 */
router.post('/pairings/unassign', async (req, res) => {
  try {
    const { studentId } = req.body;
    await db.updateStudentProfile(studentId, {
      assigned_mentor_id: null,
      pairing_date: null
    });
    return res.json({ success: true, message: 'Mentorship assignment unlinked.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to unassign mentor.' });
  }
});

/**
 * POST /api/admin/pairings/ai-auto-pair
 * Run AI batch matching algorithm on all unassigned students
 */
router.post('/pairings/ai-auto-pair', async (req, res) => {
  try {
    const studentProfiles = await db.getAllStudentProfiles();
    const unassigned = studentProfiles.filter((s) => !s.assigned_mentor_id);
    const assignedResults = [];

    for (const sp of unassigned) {
      const topMatches = await rankMentorsForStudent(sp.user_id);
      if (topMatches.length > 0) {
        const bestMatch = topMatches[0];
        await db.updateStudentProfile(sp.user_id, {
          assigned_mentor_id: bestMatch.mentorId,
          pairing_date: new Date().toISOString()
        });

        const studentUser = await db.findUserById(sp.user_id);

        assignedResults.push({
          studentName: studentUser?.name || 'Student',
          mentorName: bestMatch.name,
          matchScore: bestMatch.matchScore,
          domain: bestMatch.domain
        });
      }
    }

    return res.json({
      success: true,
      message: `AI Auto-Pairing completed. Assigned ${assignedResults.length} student(s).`,
      results: assignedResults
    });
  } catch (err) {
    console.error('AI Auto-pair error:', err);
    return res.status(500).json({ success: false, error: 'AI Auto-pairing batch failed.' });
  }
});

/**
 * GET /api/admin/sessions
 * All sessions log
 */
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await db.getAllSessions();
    const allUsers = await db.getAllUsers();

    const enriched = sessions.map((s) => {
      const student = allUsers.find((u) => u.id === s.student_id);
      const mentor = allUsers.find((u) => u.id === s.mentor_id);
      return {
        ...s,
        studentName: student?.name || 'Unknown',
        mentorName: mentor?.name || 'Unknown'
      };
    });

    return res.json({ success: true, sessions: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load sessions.' });
  }
});

/**
 * GET /api/admin/feedback
 * All feedback log
 */
router.get('/feedback', async (req, res) => {
  try {
    const feedbackList = await db.getAllFeedback();
    const allUsers = await db.getAllUsers();

    const enriched = feedbackList.map((f) => {
      const student = allUsers.find((u) => u.id === f.student_id);
      const mentor = allUsers.find((u) => u.id === f.mentor_id);
      return {
        ...f,
        studentName: student?.name || 'Unknown',
        mentorName: mentor?.name || 'Unknown'
      };
    });

    return res.json({ success: true, feedback: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load feedback.' });
  }
});

/**
 * GET /api/admin/inquiries
 * View contact inquiries
 */
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await db.getAllContactInquiries();
    return res.json({ success: true, inquiries });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load inquiries.' });
  }
});

export default router;
