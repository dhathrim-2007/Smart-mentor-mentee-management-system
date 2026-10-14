import express from 'express';
import { analyzeInteraction } from '../services/aiEngine.js';

const router = express.Router();

/**
 * POST /api/assessment/analyze
 * Analyzes narrative text and simulated acoustic metrics
 */
router.post('/analyze', (req, res) => {
  try {
    const { text, language = 'en', voiceData, channel = 'web' } = req.body;

    if (!text && !voiceData) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either narrative text or speech input.'
      });
    }

    const assessmentResult = analyzeInteraction({
      text: text || '',
      language,
      voiceData,
      channel
    });

    return res.json({
      success: true,
      data: assessmentResult
    });
  } catch (err) {
    console.error('Error in assessment analysis:', err);
    return res.status(500).json({
      success: false,
      error: 'Assessment analysis error: ' + err.message
    });
  }
});

export default router;
