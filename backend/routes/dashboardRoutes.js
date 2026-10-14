import express from 'express';
import { db } from '../services/db.js';

const router = express.Router();

/**
 * GET /api/dashboard/stats & /api/stats
 */
const getStatsHandler = (req, res) => {
  try {
    const stats = db.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

router.get('/dashboard/stats', getStatsHandler);
router.get('/stats', getStatsHandler);

/**
 * GET /api/alerts
 * Active Critical & High risk alerts
 */
router.get('/alerts', (req, res) => {
  try {
    const alerts = db.getCriticalAlerts();
    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/support/assign
 * Officer assigns a specific support service to a case
 */
router.post('/support/assign', (req, res) => {
  try {
    const { caseId, serviceType, assignedTo, notes, actor } = req.body;
    if (!caseId || !serviceType) {
      return res.status(400).json({ success: false, error: 'caseId and serviceType are required' });
    }

    const updated = db.updateCase(caseId, {
      assignedService: serviceType,
      assignedOfficer: assignedTo || 'Specialized Support Team',
      officerNotes: notes || `Service [${serviceType}] assigned for prioritized execution.`,
      status: 'IN_REVIEW'
    }, actor || 'Triage Officer');

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    res.json({
      success: true,
      message: `Support service ${serviceType} assigned successfully`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/audit/:caseId
 * Complete immutable audit trail for a case
 */
router.get('/audit/:caseId', (req, res) => {
  try {
    const singleCase = db.getCaseById(req.params.caseId);
    if (!singleCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    res.json({
      success: true,
      caseId: singleCase.id,
      data: singleCase.auditLog || []
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/counsellor/cases
 * Returns cases sorted into Priority 1, Priority 2, Priority 3 with explicit reasoning
 */
router.get('/counsellor/cases', (req, res) => {
  try {
    const prioritized = db.getCounsellorPrioritizedCases();
    res.json({
      success: true,
      data: prioritized
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/analytics/national
 * Returns strictly de-identified state/national aggregated analytics
 */
router.get('/analytics/national', (req, res) => {
  try {
    const nationalData = db.getNationalAnalytics();
    res.json({
      success: true,
      data: nationalData
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

