/**
 * Frontend Explainable Intervention Recommendation Engine
 * Generates transparent support recommendations with explicit justification ("Why recommended").
 * Never prescribes medication. Never makes autonomous irreversible decisions.
 */

export function generateSupportRecommendations({
  riskLevel = 'MODERATE',
  prediction = 'STABLE',
  safetyScore = 30,
  sleepScore = 40,
  caseStage = 'Investigation'
}) {
  const recommendations = [];

  // Psychological Support
  if (riskLevel === 'CRITICAL' || prediction === 'POTENTIAL ESCALATION') {
    recommendations.push({
      id: 'REC-01',
      title: 'Immediate 24-hour Trauma Counselling',
      category: 'Psychological Care',
      action: 'Priority referral to specialized trauma therapist through Tele-MANAS',
      reason: 'Recommended because distress is critical and shows rapid upward escalation.'
    });
  } else if (riskLevel === 'ELEVATED' || riskLevel === 'HIGH' || prediction === 'WORSENING') {
    recommendations.push({
      id: 'REC-02',
      title: 'Dedicated Tele-Counselling Follow-up',
      category: 'Psychological Care',
      action: 'Assign designated NHAA counsellor for structured check-in within 48 hours',
      reason: 'Recommended because distress is trending upward and sleep disruption is elevated.'
    });
  } else {
    recommendations.push({
      id: 'REC-03',
      title: 'Routine Well-being Monitoring',
      category: 'Psychological Care',
      action: 'Continue weekly periodic digital check-in with psycho-education resources',
      reason: 'Distress parameters remain within manageable thresholds.'
    });
  }

  // Legal Aid & Rights
  if (safetyScore >= 50 || riskLevel === 'CRITICAL' || riskLevel === 'HIGH' || riskLevel === 'ELEVATED') {
    recommendations.push({
      id: 'REC-04',
      title: 'Legal Aid Counsel Representation (PoA Act)',
      category: 'Legal Aid',
      action: 'Depute DLSA advocate to review court calendar and oppose hostile bail applications',
      reason: 'Complainant reports intimidation and procedural stress regarding pending trial.'
    });
  }

  // Witness Protection & Physical Security
  if (safetyScore >= 65 || riskLevel === 'CRITICAL') {
    recommendations.push({
      id: 'REC-05',
      title: 'Witness Protection Scheme, 2018 Protocol',
      category: 'Protection & Safety',
      action: 'Initiate threat perception appraisal with Competent Authority and local Police SHO',
      reason: 'Active intimidation and physical displacement fear detected post-complaint.'
    });
  }

  // Rehabilitation & Relief
  if (caseStage === 'Rehabilitation' || caseStage === 'Compensation') {
    recommendations.push({
      id: 'REC-06',
      title: 'Statutory Relief & Rehabilitation Follow-up',
      category: 'Social Welfare',
      action: 'Expedite direct benefit transfer (DBT) of relief under PoA Annexure I rules',
      reason: 'Complainant is traversing post-trial rehabilitation and economic recovery.'
    });
  }

  return recommendations;
}
