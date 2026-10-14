import express from 'express';
import { db } from '../services/db.js';

const router = express.Router();

/**
 * GET /api/alerts
 * Query filters: severity, status, district
 */
router.get('/', (req, res) => {
  try {
    let alerts = db.getAllAlerts();
    const { severity, status, district } = req.query;

    if (severity && severity !== 'ALL') {
      alerts = alerts.filter(a => (a.severity || '').toUpperCase() === severity.toUpperCase());
    }

    if (status && status !== 'ALL') {
      alerts = alerts.filter(a => (a.status || '').toUpperCase() === status.toUpperCase());
    }

    if (district && district !== 'ALL') {
      alerts = alerts.filter(a => (a.district || '').toLowerCase().includes(district.toLowerCase()));
    }

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
 * PATCH /api/alerts/:id/status
 * Update status of an alert: NEW -> ACKNOWLEDGED -> ASSIGNED -> IN_REVIEW -> RESOLVED
 */
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, actor } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const updatedAlert = db.updateAlertStatus(id, status, notes || '', actor || 'Triage Officer');
    if (!updatedAlert) {
      return res.status(404).json({ success: false, error: `Alert ${id} not found` });
    }

    res.json({
      success: true,
      message: `Alert ${id} status updated to ${status}`,
      data: updatedAlert
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
