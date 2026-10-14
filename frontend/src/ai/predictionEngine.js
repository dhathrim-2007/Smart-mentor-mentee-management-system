/**
 * Frontend Escalation Prediction Engine (Decision Support)
 * Outputs: STABLE | IMPROVING | WORSENING | POTENTIAL ESCALATION
 */

export function predictTrend(history = [], currentScore = 50) {
  if (!history || history.length === 0) {
    return {
      prediction: 'STABLE',
      reasoning: 'First recorded check-in establishes baseline monitoring.',
      projectedNextSvi: currentScore
    };
  }

  const scores = history.map(h => typeof h === 'object' ? (h.svi || h.score || 50) : h);
  scores.push(currentScore);

  const n = scores.length;
  const recent3 = scores.slice(Math.max(0, n - 3));
  const deltas = [];
  for (let i = 1; i < recent3.length; i++) {
    deltas.push(recent3[i] - recent3[i - 1]);
  }

  const avgDelta = deltas.length > 0 ? (deltas.reduce((a, b) => a + b, 0) / deltas.length) : 0;
  const totalChange = scores[scores.length - 1] - scores[0];

  if (currentScore >= 75 || avgDelta >= 10 || (deltas.length >= 2 && deltas.every(d => d > 5))) {
    return {
      prediction: 'POTENTIAL ESCALATION',
      reasoning: `Distress has consistently escalated (+${Math.round(totalChange)} pts) across consecutive check-ins with acute safety/sleep triggers. Human review advised.`,
      projectedNextSvi: Math.min(98, Math.round(currentScore + avgDelta))
    };
  }

  if (avgDelta > 3 || (deltas.length > 0 && deltas[deltas.length - 1] > 6)) {
    return {
      prediction: 'WORSENING',
      reasoning: `Distress score is trending upward (+${Math.round(deltas[deltas.length - 1] || 0)} pts in latest check-in). Proactive follow-up recommended.`,
      projectedNextSvi: Math.min(98, Math.round(currentScore + avgDelta))
    };
  }

  if (avgDelta < -3) {
    return {
      prediction: 'IMPROVING',
      reasoning: `Distress has decreased over recent check-ins (-${Math.abs(Math.round(totalChange))} pts from initial). Current support plan is having a positive effect.`,
      projectedNextSvi: Math.max(10, Math.round(currentScore + avgDelta))
    };
  }

  return {
    prediction: 'STABLE',
    reasoning: 'Distress metrics remain stable within normal variation. Routine monitoring continued.',
    projectedNextSvi: currentScore
  };
}
