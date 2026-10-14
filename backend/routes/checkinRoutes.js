import express from 'express';
import { db } from '../services/db.js';
import {
  calculateDynamicDistressScore,
  predictDistressEscalation,
  generateExplainableAlerts,
  recommendInterventions
} from '../services/aiEngine.js';

const router = express.Router();

/**
 * POST /api/checkin
 * Submit a periodic check-in for a case
 * Body: { caseId, answers, text, voiceData, language, event }
 */
router.post('/', (req, res) => {
  try {
    const {
      caseId = 'CASE-1040',
      answers = {},
      text = '',
      voiceData = null,
      language = 'en',
      event = 'Periodic well-being check-in'
    } = req.body;

    const existingCase = db.getCaseById(caseId);
    if (!existingCase) {
      return res.status(404).json({ success: false, error: `Case ${caseId} not found.` });
    }

    const previousScores = (existingCase.checkinHistory || []).map(h => h.svi);

    // 1. Calculate dynamic distress score
    const dynamicResult = calculateDynamicDistressScore({
      answers,
      previousScores,
      text,
      voiceData,
      language
    });

    // 2. Predict escalation
    const predictionResult = predictDistressEscalation(existingCase.checkinHistory || [], dynamicResult.score);

    // 3. Generate alerts if needed
    const alerts = generateExplainableAlerts({
      caseId: existingCase.id,
      currentScore: dynamicResult.score,
      predictionResult,
      safetyScore: dynamicResult.explainability?.safetyScore || 0,
      sleepScore: dynamicResult.explainability?.sleepScore || 0,
      assignedOfficer: existingCase.assignedOfficer
    });

    // 4. Recommend interventions
    const recommendations = recommendInterventions({
      riskLevel: dynamicResult.riskLevel,
      score: dynamicResult.score,
      prediction: predictionResult.prediction,
      caseStage: existingCase.stage || 'Investigation',
      answers
    });

    // 5. Persist check-in to database
    const updatedCase = db.addCheckin(caseId, {
      score: dynamicResult.score,
      answers,
      text,
      acousticMetrics: dynamicResult.acousticMetrics,
      event
    });

    res.status(201).json({
      success: true,
      message: 'Periodic check-in processed and longitudinal record updated.',
      data: {
        score: dynamicResult.score,
        previousScore: dynamicResult.previousScore,
        change: dynamicResult.change,
        riskLevel: dynamicResult.riskLevel,
        riskCategory: dynamicResult.riskCategory,
        indicators: dynamicResult.indicators,
        explainability: dynamicResult.explainability,
        textAnalysis: dynamicResult.textAnalysis,
        acousticMetrics: dynamicResult.acousticMetrics,
        prediction: predictionResult.prediction,
        predictionReason: predictionResult.reasoning,
        projectedNextSvi: predictionResult.projectedNextSvi,
        recommendations,
        alertsGenerated: alerts.length,
        case: updatedCase
      }
    });
  } catch (err) {
    console.error('Error processing check-in:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/checkin/:caseId
 * Get sequential check-ins for a case
 */
router.get('/:caseId', (req, res) => {
  try {
    const { caseId } = req.params;
    const checkins = db.getCheckins(caseId);
    res.json({
      success: true,
      caseId,
      count: checkins.length,
      data: checkins
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/trends/:caseId
 * Get longitudinal trend points for charting
 */
router.get('/trends/:caseId', (req, res) => {
  try {
    const { caseId } = req.params;
    const trends = db.getTrends(caseId);
    if (!trends) {
      return res.status(404).json({ success: false, error: 'Case trends not found' });
    }
    res.json({
      success: true,
      data: trends
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/benchmark/:key
 * Retrieve one of the 4 calibrated benchmark cases: CASE_A, CASE_B, CASE_C, CASE_D
 */
router.get('/benchmark/:key', (req, res) => {
  try {
    const { key } = req.params;
    const benchCase = db.getBenchmarkCase(key);
    if (!benchCase) {
      return res.status(404).json({ success: false, error: `Benchmark case ${key} not found. Valid: CASE_A, CASE_B, CASE_C, CASE_D` });
    }
    res.json({
      success: true,
      data: benchCase
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
