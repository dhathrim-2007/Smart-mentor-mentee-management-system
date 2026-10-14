import express from 'express';
import { db } from '../services/db.js';

const router = express.Router();

/**
 * GET /api/cases
 * Filters: riskLevel, status, language, channel, search
 */
router.get('/', (req, res) => {
  try {
    let cases = db.getAllCases();
    const { riskLevel, status, language, channel, search } = req.query;

    if (riskLevel && riskLevel !== 'ALL') {
      cases = cases.filter(c => c.riskLevel.toUpperCase() === riskLevel.toUpperCase());
    }

    if (status && status !== 'ALL') {
      cases = cases.filter(c => c.status.toUpperCase() === status.toUpperCase());
    }

    if (language && language !== 'ALL') {
      cases = cases.filter(c => c.language.toLowerCase() === language.toLowerCase());
    }

    if (channel && channel !== 'ALL') {
      cases = cases.filter(c => c.channel.toLowerCase() === channel.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      cases = cases.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.narrative.toLowerCase().includes(q) ||
        c.keyIndicators.some(k => k.toLowerCase().includes(q)) ||
        (c.assignedOfficer && c.assignedOfficer.toLowerCase().includes(q)) ||
        (c.state && c.state.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/cases/:id
 * Retrieve specific case by ID
 */
router.get('/:id', (req, res) => {
  try {
    const singleCase = db.getCaseById(req.params.id);
    if (!singleCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    res.json({ success: true, data: singleCase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/cases
 * Create new case from assessment submission
 */
router.post('/', (req, res) => {
  try {
    const newCase = db.createCase(req.body);
    res.status(201).json({
      success: true,
      message: 'Support case created and assigned to triage pool',
      data: newCase
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/cases/:id
 * Officer update status, assignment, notes
 */
router.patch('/:id', (req, res) => {
  try {
    const actor = req.body.actor || 'Authorized Triage Officer';
    const updated = db.updateCase(req.params.id, req.body, actor);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    res.json({
      success: true,
      message: 'Case updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
