import express from 'express';
import { db } from '../services/db.js';
import {
  calculateMentorMatch,
  rankMentorsForStudent,
  generateGoalMilestones,
  generateProgressSummary,
  AI_ENGINE_METADATA
} from '../services/aiEngine.js';

const router = express.Router();

/**
 * GET /api/ai/info
 * Exposes AI engine status, version, and algorithmic transparency
 */
router.get('/info', (req, res) => {
  return res.json({
    success: true,
    engine: AI_ENGINE_METADATA
  });
});

/**
 * POST /api/ai/match-mentors
 * Interactive demo or real matching for given student attributes
 */
router.post('/match-mentors', async (req, res) => {
  try {
    const { major, careerGoals, skillsSought } = req.body;

    const dummyStudentProfile = {
      major: major || 'Computer Science & AI',
      career_goals: careerGoals || 'Software Engineering & Artificial Intelligence',
      skills_sought: Array.isArray(skillsSought)
        ? skillsSought
        : (skillsSought || 'Machine Learning, PyTorch, System Design').split(',').map((s) => s.trim())
    };

    const allMentors = await db.getAllMentorProfiles();
    const allUsers = await db.getAllUsers();

    const matches = [];

    for (const mp of allMentors) {
      if (mp.approval_status !== 'APPROVED') continue;
      const mentorUser = allUsers.find((u) => u.id === mp.user_id);
      if (!mentorUser || mentorUser.status !== 'ACTIVE') continue;

      const match = calculateMentorMatch(dummyStudentProfile, mp, {}, mentorUser);
      matches.push({
        mentorId: mentorUser.id,
        name: mentorUser.name,
        avatar: mentorUser.avatar,
        organization: mp.organization,
        designation: mp.designation,
        domain: mp.domain,
        rating: mp.rating,
        yearsExperience: mp.years_experience,
        expertiseSkills: mp.expertise_skills,
        matchScore: match.matchScore,
        breakdown: match.breakdown,
        sharedSkills: match.sharedSkills,
        sharedKeywords: match.sharedKeywords,
        rationale: match.rationale
      });
    }

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      engine: AI_ENGINE_METADATA,
      studentAttributes: dummyStudentProfile,
      matches
    });
  } catch (err) {
    console.error('AI Matching error:', err);
    return res.status(500).json({ success: false, error: 'AI matching calculation failed.' });
  }
});

/**
 * POST /api/ai/suggest-milestones
 * Suggests concrete milestones based on a goal title
 */
router.post('/suggest-milestones', (req, res) => {
  try {
    const { goalTitle, category, major } = req.body;
    if (!goalTitle) {
      return res.status(400).json({ success: false, error: 'Goal title is required.' });
    }

    const milestones = generateGoalMilestones(goalTitle, category, major);

    return res.json({
      success: true,
      engine: AI_ENGINE_METADATA,
      goalTitle,
      milestones
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to generate milestones.' });
  }
});

/**
 * POST /api/ai/analyze-progress
 * Synthesizes progress analytics and recommendations
 */
router.post('/analyze-progress', (req, res) => {
  try {
    const { studentName, goals, feedback } = req.body;
    const summary = generateProgressSummary(studentName || 'Student', goals || [], feedback || []);
    return res.json({
      success: true,
      summary
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Progress analysis failed.' });
  }
});

export default router;
