/**
 * Benchmark Demonstration Cases for SIH Judges
 * Problem Statement ID: 26094
 * Provides deterministic, reproducible results for all 4 required evaluation scenarios.
 */

export const BENCHMARK_CASES = [
  {
    id: 'CASE-1039',
    benchmarkKey: 'CASE_A',
    title: 'Case A: Stable / Low',
    badge: 'LOW RISK',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    stage: 'Rehabilitation',
    currentSvi: 18,
    previousSvi: 19,
    trend: 'STABLE',
    prediction: 'STABLE',
    predictionReason: 'Distress scores have remained consistently low across 5 check-ins (22 → 20 → 24 → 19 → 18). No active intimidation.',
    priority: 'Priority 3 — Routine monitoring',
    priorityReason: 'Complainant reports low distress and asks for procedural documentation.',
    district: 'South Delhi',
    state: 'Delhi',
    language: 'English',
    assignedOfficer: 'Desk Officer R. Nair',
    narrative: 'I would like to inquire about the standard timeline for charge-sheet submission under the SC/ST Prevention of Atrocities Act and eligibility for legal aid representation.',
    answers: {
      mood: 2,
      safety: 1,
      fear: 1,
      sleep: 2,
      isolation: 2,
      dailyFunctioning: 1
    },
    checkinHistory: [
      { index: 1, label: 'Check-in 1', date: '08 Aug', daysAgo: '4 weeks ago', svi: 22, mood: 3, safety: 2, sleep: 3, isolation: 2, functioning: 2, event: 'Complaint Registered', missed: false },
      { index: 2, label: 'Check-in 2', date: '15 Aug', daysAgo: '3 weeks ago', svi: 20, mood: 2, safety: 2, sleep: 2, isolation: 2, functioning: 2, event: null, missed: false },
      { index: 3, label: 'Check-in 3', date: '22 Aug', daysAgo: '2 weeks ago', svi: 24, mood: 3, safety: 3, sleep: 3, isolation: 3, functioning: 2, event: 'Counsel Appointed', missed: false },
      { index: 4, label: 'Check-in 4', date: '29 Aug', daysAgo: '1 week ago', svi: 19, mood: 2, safety: 2, sleep: 2, isolation: 2, functioning: 1, event: null, missed: false },
      { index: 5, label: 'Current Check-in', date: '05 Sep', daysAgo: 'Today', svi: 18, mood: 2, safety: 1, sleep: 2, isolation: 2, functioning: 1, event: 'Procedural handbook shared', missed: false }
    ],
    recommendations: [
      { id: 'REC-A1', title: 'Procedural Handbook Dispatch', action: 'Provide digital booklet on PoA Act statutory timelines', reason: 'Routine procedural query.' },
      { id: 'REC-A2', title: 'Standard Digital Case Tracking', action: 'Send automated SMS status notifications', reason: 'Citizen seeking informational tracking.' }
    ],
    alerts: []
  },
  {
    id: 'CASE-1040',
    benchmarkKey: 'CASE_B',
    title: 'Case B: Moderate / Increasing',
    badge: 'MODERATE RISK',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    stage: 'Investigation',
    currentSvi: 45,
    previousSvi: 40,
    trend: 'WORSENING',
    prediction: 'WORSENING',
    predictionReason: 'Distress has increased across the last three check-ins (36 → 40 → 44 → 45) and reported sleep difficulty has elevated.',
    priority: 'Priority 2 — Follow-up soon',
    priorityReason: 'Distress trajectory shows upward velocity coupled with an unannounced missed check-in.',
    district: 'Nagpur',
    state: 'Maharashtra',
    language: 'Marathi / English',
    assignedOfficer: 'Dr. Anjali Deshmukh (Counsellor)',
    narrative: 'I am very worried about the case and I have been unable to sleep properly. I need someone to guide me through what comes next.',
    answers: {
      mood: 6,
      safety: 4,
      fear: 4,
      sleep: 8,
      isolation: 5,
      dailyFunctioning: 5
    },
    checkinHistory: [
      { index: 1, label: 'Check-in 1', date: '08 Aug', daysAgo: '4 weeks ago', svi: 32, mood: 4, safety: 3, sleep: 4, isolation: 3, functioning: 3, event: 'FIR Registered', missed: false },
      { index: 2, label: 'Check-in 2', date: '15 Aug', daysAgo: '3 weeks ago', svi: 36, mood: 4, safety: 4, sleep: 5, isolation: 4, functioning: 4, event: null, missed: false },
      { index: 3, label: 'Check-in 3', date: '22 Aug', daysAgo: '2 weeks ago', svi: 40, mood: 5, safety: 4, sleep: 6, isolation: 5, functioning: 4, event: 'Notice Issued to Accused', missed: false },
      { index: 4, label: 'Check-in 4', date: '29 Aug', daysAgo: '1 week ago', svi: 44, mood: 5, safety: 5, sleep: 7, isolation: 5, functioning: 5, event: null, missed: true, missedReason: 'Missed scheduled check-in' },
      { index: 5, label: 'Current Check-in', date: '05 Sep', daysAgo: 'Today', svi: 45, mood: 6, safety: 5, sleep: 8, isolation: 6, functioning: 5, event: 'Sleep anxiety reported', missed: false }
    ],
    recommendations: [
      { id: 'REC-B1', title: 'Supportive Tele-Counselling Outreach', action: 'Schedule 30-min coping counselling session within 48 hours', reason: 'Recommended because distress increased across 3 consecutive check-ins and sleep difficulty is high.' },
      { id: 'REC-B2', title: 'Case Progress Briefing', action: 'NHAA case manager briefing on investigation milestone status', reason: 'Procedural anxiety is the primary psychological stressor.' }
    ],
    alerts: [
      {
        id: 'ALT-1040-01',
        trigger: 'Sleep Anxiety & Upward Velocity',
        riskLevel: 'MODERATE',
        severity: 'MEDIUM',
        status: 'ACKNOWLEDGED',
        time: '08:50 AM',
        explanation: 'Distress score has risen +13 pts over 4 weeks with insomnia markers.',
        recommendedAction: 'Proactive counsellor call within 48h.'
      }
    ]
  },
  {
    id: 'CASE-1041',
    benchmarkKey: 'CASE_C',
    title: 'Case C: High / Worsening',
    badge: 'HIGH RISK',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    stage: 'Trial',
    currentSvi: 72,
    previousSvi: 68,
    trend: 'WORSENING',
    prediction: 'WORSENING',
    predictionReason: 'Distress escalated steadily from 48 to 72 (+24 pts) as court dates neared, accompanied by threats to family members.',
    priority: 'Priority 1 — Immediate human review',
    priorityReason: 'Retaliatory intimidation post-charge-sheet. Complainant fearful of returning home; requires safety triage.',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    language: 'Hindi',
    assignedOfficer: 'Adv. S. Sharma (Legal Aid)',
    narrative: 'I am afraid to return home. They have threatened me because I complained. I don\'t feel safe anywhere.',
    answers: {
      mood: 8,
      safety: 8,
      fear: 8,
      sleep: 8,
      isolation: 7,
      dailyFunctioning: 7
    },
    checkinHistory: [
      { index: 1, label: 'Check-in 1', date: '08 Aug', daysAgo: '4 weeks ago', svi: 48, mood: 5, safety: 4, sleep: 5, isolation: 5, functioning: 4, event: 'Investigation Commenced', missed: false },
      { index: 2, label: 'Check-in 2', date: '15 Aug', daysAgo: '3 weeks ago', svi: 55, mood: 6, safety: 6, sleep: 6, isolation: 6, functioning: 5, event: 'Charge-sheet Filed', missed: false },
      { index: 3, label: 'Check-in 3', date: '22 Aug', daysAgo: '2 weeks ago', svi: 62, mood: 7, safety: 7, sleep: 7, isolation: 7, functioning: 6, event: 'Bail Hearing Date', missed: false },
      { index: 4, label: 'Check-in 4', date: '29 Aug', daysAgo: '1 week ago', svi: 68, mood: 8, safety: 8, sleep: 8, isolation: 7, functioning: 7, event: 'Threats at Village Residence', missed: false },
      { index: 5, label: 'Current Check-in', date: '05 Sep', daysAgo: 'Today', svi: 72, mood: 8, safety: 9, sleep: 8, isolation: 8, functioning: 7, event: 'Safe shelter requested', missed: false }
    ],
    recommendations: [
      { id: 'REC-C1', title: 'Priority Trauma Counselling Within 24h', action: 'Urgent counselling session to address acute terror & displacement stress', reason: 'High distress score with displacement anxiety.' },
      { id: 'REC-C2', title: 'Special Court Protection Petition', action: 'Designate DLSA advocate for bail cancellation & protection order', reason: 'Intimidation of complainant and kin.' },
      { id: 'REC-C3', title: 'Local Police SHO Safety Verification', action: 'Formal alert to local police station for physical patrolling', reason: 'Active threats reported at primary residence.' }
    ],
    alerts: [
      {
        id: 'ALT-1041-01',
        trigger: 'Retaliatory Intimidation Flagged',
        riskLevel: 'ELEVATED',
        severity: 'HIGH',
        status: 'IN_REVIEW',
        time: '09:15 AM',
        explanation: 'Complainant reports intimidation and fear of returning to village.',
        recommendedAction: 'Legal counsel protection petition & SHO alert.'
      }
    ]
  },
  {
    id: 'CASE-1042',
    benchmarkKey: 'CASE_D',
    title: 'Case D: Critical / Escalation',
    badge: 'CRITICAL RISK',
    badgeColor: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
    stage: 'Investigation',
    currentSvi: 91,
    previousSvi: 85,
    trend: 'POTENTIAL ESCALATION',
    prediction: 'POTENTIAL ESCALATION',
    predictionReason: 'Distress has spiked exponentially (50 → 64 → 76 → 85 → 91, +41 pts). Direct physical threat with weapons to force FIR withdrawal. Complainant in hiding.',
    priority: 'Priority 1 — Immediate human review',
    priorityReason: 'Imminent threat to physical safety, acute vocal tremors, and expressions of helplessness.',
    district: 'Warangal',
    state: 'Telangana',
    language: 'Telugu / English',
    assignedOfficer: 'Officer K. Venkatesh (MoSJE Nodal)',
    narrative: 'They came to my house yesterday night with weapons and threatened to kill me if I do not withdraw the FIR. I have locked myself in a relative’s room and I am terrified to step outside.',
    answers: {
      mood: 10,
      safety: 10,
      fear: 10,
      sleep: 10,
      isolation: 9,
      dailyFunctioning: 9
    },
    checkinHistory: [
      { index: 1, label: 'Check-in 1', date: '08 Aug', daysAgo: '4 weeks ago', svi: 50, mood: 5, safety: 5, sleep: 5, isolation: 5, functioning: 5, event: 'FIR 154 CrPC filed', missed: false },
      { index: 2, label: 'Check-in 2', date: '15 Aug', daysAgo: '3 weeks ago', svi: 64, mood: 7, safety: 7, sleep: 7, isolation: 6, functioning: 6, event: 'Section 164 Statement', missed: false },
      { index: 3, label: 'Check-in 3', date: '22 Aug', daysAgo: '2 weeks ago', svi: 76, mood: 8, safety: 8, sleep: 8, isolation: 8, functioning: 7, event: 'Trial Summons Issued', missed: false },
      { index: 4, label: 'Check-in 4', date: '29 Aug', daysAgo: '1 week ago', svi: 85, mood: 9, safety: 9, sleep: 9, isolation: 9, functioning: 8, event: 'Direct Weapons Threat at Home', missed: false },
      { index: 5, label: 'Current Check-in', date: '05 Sep', daysAgo: 'Today', svi: 91, mood: 10, safety: 10, sleep: 10, isolation: 9, functioning: 9, event: 'Complainant in hiding; SOS triggered', missed: false }
    ],
    recommendations: [
      { id: 'REC-D1', title: 'EMERGENCY: Immediate Armed Escort', action: 'Police Quick Response Team dispatch and extraction to safe shelter', reason: 'Recommended because armed aggressors issued lethal threats.' },
      { id: 'REC-D2', title: 'Witness Protection Scheme, 2018 Appraisal', action: 'Emergency bench petition for witness identity shielding & safe relocation', reason: 'Direct coercive threat to force withdrawal of registered atrocity complaint.' },
      { id: 'REC-D3', title: 'Crisis Trauma Counselling Dispatch', action: '24x7 crisis intervention counselor assignment', reason: 'Acute vocal breakdown and trauma collapse.' }
    ],
    alerts: [
      {
        id: 'ALT-1042-01',
        trigger: 'Lethal Weapons Intimidation',
        riskLevel: 'CRITICAL',
        severity: 'CRITICAL',
        status: 'NEW',
        time: '10:42 AM',
        explanation: 'Complainant in hiding after armed aggressors surrounded residence.',
        recommendedAction: 'Immediate police patrol & witness protection review.'
      }
    ]
  }
];
