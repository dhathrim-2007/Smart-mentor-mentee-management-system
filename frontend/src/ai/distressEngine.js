/**
 * Frontend Dynamic Distress Engine (Prototype / Decision Support)
 * Ministry of Social Justice and Empowerment (MoSJE) - NHAA 14566
 *
 * NOTE: This is an AI-assisted risk and triage indicator — NOT a medical diagnosis.
 * Does NOT diagnose depression, PTSD, or psychiatric conditions.
 */

export function calculateClientDistressScore({
  answers = {},
  previousScores = [],
  text = '',
  voiceData = null
}) {
  const moodScore = (Number(answers.mood ?? 5) / 10) * 100;
  const safetyScore = (Number(answers.safety ?? answers.fear ?? 3) / 10) * 100;
  const sleepScore = (Number(answers.sleep ?? 4) / 10) * 100;
  const isolationScore = (Number(answers.isolation ?? 3) / 10) * 100;
  const functioningScore = (Number(answers.dailyFunctioning ?? 3) / 10) * 100;

  // Base weighted self-report
  let selfScore = (
    safetyScore * 0.30 +
    moodScore * 0.25 +
    sleepScore * 0.20 +
    isolationScore * 0.15 +
    functioningScore * 0.10
  );

  // Linguistic distress signals (heuristic NLP for demo)
  const lowerText = (text || '').toLowerCase();
  let textThreat = 0;
  let textDistress = 0;
  let textUrgency = 0;

  const threatWords = ['threat', 'kill', 'attack', 'weapon', 'danger', 'scared', 'dhamki', 'maar', 'bhayam', 'safe'];
  const distressWords = ['worried', 'crying', 'sleep', 'anxious', 'trauma', 'depressed', 'alone', 'helpless', 'pareshaan'];
  const urgencyWords = ['now', 'today', 'tonight', 'immediately', 'urgent', 'emergency', 'jaldi'];

  threatWords.forEach(w => { if (lowerText.includes(w)) textThreat += 25; });
  distressWords.forEach(w => { if (lowerText.includes(w)) textDistress += 20; });
  urgencyWords.forEach(w => { if (lowerText.includes(w)) textUrgency += 25; });

  textThreat = Math.min(100, textThreat);
  textDistress = Math.min(100, textDistress);
  textUrgency = Math.min(100, textUrgency);

  // Acoustic factors
  let acousticScore = 20;
  if (voiceData) {
    if (voiceData.pauseCount > 4 || voiceData.averagePauseDurationSec > 1.8) acousticScore += 30;
    if (voiceData.pitchVariabilityHz > 55) acousticScore += 30;
  }
  acousticScore = Math.min(100, acousticScore);

  let finalSvi = selfScore;
  if (text && text.trim().length > 0) {
    finalSvi = (selfScore * 0.65) + ((textThreat * 0.5 + textDistress * 0.5) * 0.25) + (acousticScore * 0.10);
  } else if (voiceData) {
    finalSvi = (selfScore * 0.85) + (acousticScore * 0.15);
  }

  // Delta adjustment
  if (previousScores && previousScores.length > 0) {
    const lastScore = previousScores[previousScores.length - 1];
    const delta = finalSvi - lastScore;
    if (delta > 15) finalSvi += 6;
  }

  finalSvi = Math.round(Math.min(98, Math.max(8, finalSvi)));

  let riskLevel = 'LOW';
  if (finalSvi >= 75) riskLevel = 'CRITICAL';
  else if (finalSvi >= 50) riskLevel = 'ELEVATED';
  else if (finalSvi >= 25) riskLevel = 'MODERATE';

  return {
    score: finalSvi,
    riskLevel,
    riskCategory: riskLevel,
    explainability: {
      safetyScore: Math.round(safetyScore),
      moodScore: Math.round(moodScore),
      sleepScore: Math.round(sleepScore),
      isolationScore: Math.round(isolationScore),
      functioningScore: Math.round(functioningScore),
      textThreat,
      textDistress,
      acousticScore
    },
    disclaimer: 'AI-assisted risk/triage indicator — not a medical diagnosis.'
  };
}
