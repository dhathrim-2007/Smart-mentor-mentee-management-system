import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { rankMentorsForStudent, generateGoalMilestones, generateProgressSummary } from '../services/aiEngine.js';

const router = express.Router();

// Enforce authentication & STUDENT role across all student routes
router.use(authenticateToken);
router.use(requireRole('STUDENT'));

/**
 * GET /api/student/dashboard
 * Complete consolidated dashboard state for student
 */
router.get('/dashboard', async (req, res) => {
  try {
    const studentId = req.user.id;
    const profile = await db.getStudentProfile(studentId);
    const goals = await db.getGoalsByStudentId(studentId);
    const sessions = await db.getSessionsByStudentId(studentId);
    const feedbackList = await db.getFeedbackByStudentId(studentId);
    const notifications = await db.getNotificationsByUserId(studentId);

    // Assigned mentor details
    let assignedMentor = null;
    if (profile && profile.assigned_mentor_id) {
      const mentorUser = await db.findUserById(profile.assigned_mentor_id);
      const mentorProfile = await db.getMentorProfile(profile.assigned_mentor_id);
      if (mentorUser && mentorProfile) {
        assignedMentor = {
          id: mentorUser.id,
          name: mentorUser.name,
          email: mentorUser.email,
          avatar: mentorUser.avatar,
          bio: mentorUser.bio,
          phone: mentorUser.phone,
          organization: mentorProfile.organization,
          designation: mentorProfile.designation,
          domain: mentorProfile.domain,
          rating: mentorProfile.rating,
          yearsExperience: mentorProfile.years_experience,
          expertiseSkills: mentorProfile.expertise_skills,
          linkedinUrl: mentorProfile.linkedin_url
        };
      }
    }

    // AI Progress Briefing
    const progressSummary = generateProgressSummary(req.user.name, goals, feedbackList);

    // AI Ranked Mentors
    const recommendedMentors = await rankMentorsForStudent(studentId);

    return res.json({
      success: true,
      data: {
        student: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          profile
        },
        assignedMentor,
        metrics: {
          totalGoals: goals.length,
          completedGoals: goals.filter((g) => g.status === 'COMPLETED' || g.progress === 100).length,
          inProgressGoals: goals.filter((g) => g.status === 'IN_PROGRESS').length,
          averageProgress: progressSummary.metricSummary.averageProgress,
          upcomingSessionsCount: sessions.filter((s) => s.status === 'CONFIRMED' || s.status === 'PENDING').length,
          feedbackCount: feedbackList.length
        },
        goals,
        sessions: sessions.sort((a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time)),
        feedback: feedbackList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        notifications,
        aiProgressSummary: progressSummary,
        recommendedMentors: recommendedMentors.slice(0, 3)
      }
    });
  } catch (err) {
    console.error('Error in student dashboard:', err);
    return res.status(500).json({ success: false, error: 'Failed to load student dashboard.' });
  }
});

/**
 * GET /api/student/goals
 */
router.get('/goals', async (req, res) => {
  try {
    const goals = await db.getGoalsByStudentId(req.user.id);
    return res.json({ success: true, goals });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve goals.' });
  }
});

/**
 * POST /api/student/goals
 * Create a new goal with optional auto-generated milestones
 */
router.post('/goals', async (req, res) => {
  try {
    const { title, description, category, targetDate, customMilestones, autoGenerateMilestones } = req.body;

    if (!title || !targetDate) {
      return res.status(400).json({
        success: false,
        error: 'Goal title and target date are required.'
      });
    }

    let milestones = [];
    if (autoGenerateMilestones) {
      const studentProfile = await db.getStudentProfile(req.user.id);
      milestones = generateGoalMilestones(title, category, studentProfile?.major || '');
    } else if (Array.isArray(customMilestones)) {
      milestones = customMilestones.map((m, idx) => ({
        id: `m-${uuidv4().slice(0, 6)}`,
        title: typeof m === 'string' ? m : m.title,
        done: Boolean(m.done)
      }));
    }

    const newGoal = {
      id: `goal-${uuidv4().slice(0, 8)}`,
      student_id: req.user.id,
      title: title.trim(),
      description: description || '',
      category: category || 'CAREER',
      progress: 0,
      status: 'IN_PROGRESS',
      target_date: targetDate,
      milestones,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.createGoal(newGoal);

    // Notify assigned mentor if exists
    const profile = await db.getStudentProfile(req.user.id);
    if (profile && profile.assigned_mentor_id) {
      await db.createNotification({
        id: `notif-${uuidv4().slice(0, 8)}`,
        user_id: profile.assigned_mentor_id,
        title: 'New Student Goal Created',
        message: `${req.user.name} created a new milestone goal: "${newGoal.title}".`,
        type: 'GOAL',
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    return res.status(201).json({ success: true, goal: newGoal });
  } catch (err) {
    console.error('Error creating goal:', err);
    return res.status(500).json({ success: false, error: 'Failed to create goal.' });
  }
});

/**
 * PUT /api/student/goals/:goalId
 * Update progress or toggle milestones
 */
router.put('/goals/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    const existingGoal = await db.getGoalById(goalId);

    if (!existingGoal || existingGoal.student_id !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Goal not found or unauthorized.' });
    }

    const { title, description, category, targetDate, milestones, progress, status } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (targetDate !== undefined) updates.target_date = targetDate;
    if (milestones !== undefined) {
      updates.milestones = milestones;
      // Auto-compute progress if milestones exist
      if (milestones.length > 0) {
        const completedCount = milestones.filter((m) => m.done).length;
        updates.progress = Math.round((completedCount / milestones.length) * 100);
        if (updates.progress === 100) {
          updates.status = 'COMPLETED';
        } else if (updates.progress > 0) {
          updates.status = 'IN_PROGRESS';
        }
      }
    }
    if (progress !== undefined && milestones === undefined) {
      updates.progress = parseInt(progress, 10);
      if (updates.progress >= 100) updates.status = 'COMPLETED';
    }
    if (status !== undefined) updates.status = status;

    const updatedGoal = await db.updateGoal(goalId, updates);
    return res.json({ success: true, goal: updatedGoal });
  } catch (err) {
    console.error('Error updating goal:', err);
    return res.status(500).json({ success: false, error: 'Failed to update goal.' });
  }
});

/**
 * DELETE /api/student/goals/:goalId
 */
router.delete('/goals/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    const existingGoal = await db.getGoalById(goalId);

    if (!existingGoal || existingGoal.student_id !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Goal not found or unauthorized.' });
    }

    await db.deleteGoal(goalId);
    return res.json({ success: true, message: 'Goal removed.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete goal.' });
  }
});

/**
 * POST /api/student/sessions/request
 * Request a 1-on-1 mentoring session with assigned or specified mentor
 */
router.post('/sessions/request', async (req, res) => {
  try {
    const studentProfile = await db.getStudentProfile(req.user.id);
    const { mentorId, scheduledTime, durationMinutes, topic, notes } = req.body;

    const targetMentorId = mentorId || studentProfile?.assigned_mentor_id;

    if (!targetMentorId) {
      return res.status(400).json({
        success: false,
        error: 'No mentor specified and you currently do not have an assigned mentor.'
      });
    }

    if (!scheduledTime || !topic) {
      return res.status(400).json({
        success: false,
        error: 'Session scheduled date/time and topic are required.'
      });
    }

    const mentorUser = await db.findUserById(targetMentorId);
    if (!mentorUser || mentorUser.role !== 'MENTOR') {
      return res.status(404).json({ success: false, error: 'Specified mentor not found.' });
    }

    const newSession = {
      id: `sess-${uuidv4().slice(0, 8)}`,
      student_id: req.user.id,
      mentor_id: targetMentorId,
      scheduled_time: new Date(scheduledTime).toISOString(),
      duration_minutes: parseInt(durationMinutes || '45', 10),
      meeting_link: `https://meet.google.com/sih-${uuidv4().slice(0, 4)}-${uuidv4().slice(4, 8)}`,
      topic: topic.trim(),
      notes: notes || '',
      status: 'PENDING',
      requested_by: req.user.id,
      created_at: new Date().toISOString()
    };

    await db.createSession(newSession);

    // Notify Mentor
    await db.createNotification({
      id: `notif-${uuidv4().slice(0, 8)}`,
      user_id: targetMentorId,
      title: 'New Mentoring Session Request',
      message: `${req.user.name} requested a ${newSession.duration_minutes}-minute session on: "${newSession.topic}".`,
      type: 'SESSION',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Mentoring session requested successfully.',
      session: newSession
    });
  } catch (err) {
    console.error('Session request error:', err);
    return res.status(500).json({ success: false, error: 'Failed to request mentoring session.' });
  }
});

/**
 * PUT /api/student/profile
 * Update student academic profile
 */
router.put('/profile', async (req, res) => {
  try {
    const { university, major, academicYear, gpa, careerGoals, skillsSought, bio, phone } = req.body;

    if (bio !== undefined || phone !== undefined) {
      await db.updateUser(req.user.id, {
        ...(bio !== undefined ? { bio } : {}),
        ...(phone !== undefined ? { phone } : {})
      });
    }

    const updates = {};
    if (university !== undefined) updates.university = university;
    if (major !== undefined) updates.major = major;
    if (academicYear !== undefined) updates.academic_year = academicYear;
    if (gpa !== undefined) updates.gpa = parseFloat(gpa);
    if (careerGoals !== undefined) updates.career_goals = careerGoals;
    if (skillsSought !== undefined) {
      updates.skills_sought = Array.isArray(skillsSought)
        ? skillsSought
        : skillsSought.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updatedProfile = await db.updateStudentProfile(req.user.id, updates);
    return res.json({ success: true, profile: updatedProfile });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update student profile.' });
  }
});

/**
 * POST /api/student/notifications/:notifId/read
 */
router.post('/notifications/:notifId/read', async (req, res) => {
  try {
    await db.markNotificationRead(req.params.notifId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update notification.' });
  }
});

export default router;
