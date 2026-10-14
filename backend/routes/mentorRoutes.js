import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { generateProgressSummary } from '../services/aiEngine.js';

const router = express.Router();

// Enforce authentication & MENTOR role across all mentor routes
router.use(authenticateToken);
router.use(requireRole('MENTOR'));

/**
 * GET /api/mentor/dashboard
 * Consolidated dashboard state for mentor
 */
router.get('/dashboard', async (req, res) => {
  try {
    const mentorId = req.user.id;
    const mentorProfile = await db.getMentorProfile(mentorId);
    const allStudentProfiles = await db.getAllStudentProfiles();
    const allUsers = await db.getAllUsers();
    const sessions = await db.getSessionsByMentorId(mentorId);
    const feedbackList = await db.getFeedbackByMentorId(mentorId);
    const notifications = await db.getNotificationsByUserId(mentorId);

    // Filter students assigned to this mentor
    const assignedStudentProfiles = allStudentProfiles.filter((sp) => sp.assigned_mentor_id === mentorId);

    const menteesDetailed = [];
    const attentionRequiredMentees = [];
    let totalActiveGoals = 0;

    for (const sp of assignedStudentProfiles) {
      const studentUser = allUsers.find((u) => u.id === sp.user_id);
      if (!studentUser) continue;

      const studentGoals = await db.getGoalsByStudentId(studentUser.id);
      totalActiveGoals += studentGoals.filter((g) => g.status === 'IN_PROGRESS').length;

      const progressAnalysis = generateProgressSummary(studentUser.name, studentGoals);

      const menteeData = {
        studentId: studentUser.id,
        name: studentUser.name,
        email: studentUser.email,
        avatar: studentUser.avatar,
        phone: studentUser.phone,
        university: sp.university,
        major: sp.major,
        academicYear: sp.academic_year,
        gpa: sp.gpa,
        careerGoals: sp.career_goals,
        skillsSought: sp.skills_sought,
        pairingDate: sp.pairing_date,
        goals: studentGoals,
        progressAnalysis
      };

      menteesDetailed.push(menteeData);

      // Check attention flag (momentum is NEEDS_ATTENTION or stalled goals present)
      if (progressAnalysis.metricSummary.momentumStatus === 'NEEDS_ATTENTION' || progressAnalysis.stalledGoalsCount > 0) {
        attentionRequiredMentees.push({
          studentId: studentUser.id,
          name: studentUser.name,
          avatar: studentUser.avatar,
          major: sp.major,
          stalledGoalsCount: progressAnalysis.stalledGoalsCount,
          reason: progressAnalysis.stalledGoalsCount > 0
            ? `${progressAnalysis.stalledGoalsCount} stalled milestone(s) detected`
            : 'Goal progress velocity below 40%'
        });
      }
    }

    // Pending session requests
    const pendingSessionRequests = sessions.filter((s) => s.status === 'PENDING');

    return res.json({
      success: true,
      data: {
        mentor: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          profile: mentorProfile
        },
        metrics: {
          totalMentees: menteesDetailed.length,
          maxMentees: mentorProfile?.max_mentees || 5,
          activeGoalsTracked: totalActiveGoals,
          upcomingSessionsCount: sessions.filter((s) => s.status === 'CONFIRMED').length,
          pendingRequestsCount: pendingSessionRequests.length,
          attentionRequiredCount: attentionRequiredMentees.length,
          averageRating: mentorProfile?.rating || 5.0
        },
        mentees: menteesDetailed,
        attentionRequiredMentees,
        sessions: sessions.sort((a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time)),
        feedbackGiven: feedbackList,
        notifications
      }
    });
  } catch (err) {
    console.error('Error in mentor dashboard:', err);
    return res.status(500).json({ success: false, error: 'Failed to load mentor dashboard.' });
  }
});

/**
 * GET /api/mentor/mentees/:studentId
 * Get detailed profile and progress for a specific mentee
 * Enforces security: mentor can only view their assigned mentees
 */
router.get('/mentees/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentProfile = await db.getStudentProfile(studentId);

    if (!studentProfile || studentProfile.assigned_mentor_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. This student is not assigned to you.'
      });
    }

    const studentUser = await db.findUserById(studentId);
    const goals = await db.getGoalsByStudentId(studentId);
    const sessions = (await db.getSessionsByStudentId(studentId)).filter((s) => s.mentor_id === req.user.id);
    const feedbackList = (await db.getFeedbackByStudentId(studentId)).filter((f) => f.mentor_id === req.user.id);
    const progressSummary = generateProgressSummary(studentUser?.name || 'Student', goals, feedbackList);

    return res.json({
      success: true,
      data: {
        student: {
          id: studentUser.id,
          name: studentUser.name,
          email: studentUser.email,
          avatar: studentUser.avatar,
          bio: studentUser.bio,
          phone: studentUser.phone,
          profile: studentProfile
        },
        goals,
        sessions,
        feedback: feedbackList,
        progressSummary
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve mentee profile.' });
  }
});

/**
 * PUT /api/mentor/sessions/:sessionId/status
 * Accept, reschedule, or complete a session
 */
router.put('/sessions/:sessionId/status', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, scheduledTime, meetingLink, notes } = req.body;

    const session = (await db.getAllSessions()).find((s) => s.id === sessionId);
    if (!session || session.mentor_id !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Session not found or unauthorized.' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (scheduledTime) updates.scheduled_time = new Date(scheduledTime).toISOString();
    if (meetingLink) updates.meeting_link = meetingLink;
    if (notes) updates.notes = notes;

    const updatedSession = await db.updateSession(sessionId, updates);

    // Notify Student
    await db.createNotification({
      id: `notif-${uuidv4().slice(0, 8)}`,
      user_id: session.student_id,
      title: `Mentoring Session ${status || 'Updated'}`,
      message: `${req.user.name} updated your session "${session.topic}" status to ${status || 'Updated'}.`,
      type: 'SESSION',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, session: updatedSession });
  } catch (err) {
    console.error('Session update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update session.' });
  }
});

/**
 * POST /api/mentor/feedback
 * Submit formal feedback and guidance scores for a mentee
 */
router.post('/feedback', async (req, res) => {
  try {
    const {
      sessionId,
      studentId,
      rating,
      technicalSkillsRating,
      communicationRating,
      qualitativeNotes,
      actionableNextSteps
    } = req.body;

    if (!studentId || !rating || !qualitativeNotes) {
      return res.status(400).json({
        success: false,
        error: 'Student ID, overall rating (1-5), and qualitative feedback are required.'
      });
    }

    // Verify student is assigned to this mentor
    const studentProfile = await db.getStudentProfile(studentId);
    if (!studentProfile || studentProfile.assigned_mentor_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. You can only submit feedback for students assigned to you.'
      });
    }

    const newFeedback = {
      id: `fb-${uuidv4().slice(0, 8)}`,
      session_id: sessionId || null,
      student_id: studentId,
      mentor_id: req.user.id,
      rating: parseInt(rating, 10),
      technical_skills_rating: parseInt(technicalSkillsRating || '5', 10),
      communication_rating: parseInt(communicationRating || '5', 10),
      qualitative_notes: qualitativeNotes.trim(),
      actionable_next_steps: actionableNextSteps || '',
      created_at: new Date().toISOString()
    };

    await db.createFeedback(newFeedback);

    // If session ID was provided, mark session as COMPLETED
    if (sessionId) {
      await db.updateSession(sessionId, { status: 'COMPLETED' });
    }

    // Notify Student
    await db.createNotification({
      id: `notif-${uuidv4().slice(0, 8)}`,
      user_id: studentId,
      title: 'New Mentor Feedback Received ⭐',
      message: `${req.user.name} submitted official feedback and next-step recommendations for your progress.`,
      type: 'FEEDBACK',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully.',
      feedback: newFeedback
    });
  } catch (err) {
    console.error('Feedback creation error:', err);
    return res.status(500).json({ success: false, error: 'Failed to submit feedback.' });
  }
});

/**
 * PUT /api/mentor/profile
 * Update mentor domain, skills, and availability settings
 */
router.put('/profile', async (req, res) => {
  try {
    const { organization, designation, domain, expertiseSkills, yearsExperience, maxMentees, linkedinUrl, bio, phone } = req.body;

    if (bio !== undefined || phone !== undefined) {
      await db.updateUser(req.user.id, {
        ...(bio !== undefined ? { bio } : {}),
        ...(phone !== undefined ? { phone } : {})
      });
    }

    const updates = {};
    if (organization !== undefined) updates.organization = organization;
    if (designation !== undefined) updates.designation = designation;
    if (domain !== undefined) updates.domain = domain;
    if (yearsExperience !== undefined) updates.years_experience = parseInt(yearsExperience, 10);
    if (maxMentees !== undefined) updates.max_mentees = parseInt(maxMentees, 10);
    if (linkedinUrl !== undefined) updates.linkedin_url = linkedinUrl;
    if (expertiseSkills !== undefined) {
      updates.expertise_skills = Array.isArray(expertiseSkills)
        ? expertiseSkills
        : expertiseSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updatedProfile = await db.updateMentorProfile(req.user.id, updates);
    return res.json({ success: true, profile: updatedProfile });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update mentor profile.' });
  }
});

export default router;
