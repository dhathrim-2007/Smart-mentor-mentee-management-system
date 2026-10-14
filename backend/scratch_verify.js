// Verification script for SIH 26094 system
const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- STARTING VERIFICATION TESTS ---');

  // Test 1: Health
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const health = await healthRes.json();
  console.log('1. Health Check:', health.status === 'HEALTHY' ? 'PASS' : 'FAIL');

  // Test 2: Benchmarks
  for (const b of ['CASE_A', 'CASE_B', 'CASE_C', 'CASE_D']) {
    const res = await fetch(`${BASE_URL}/api/benchmark/${b}`);
    const data = await res.json();
    console.log(`2. Benchmark ${b} (${data.data.benchmarkTitle}):`, data.success ? 'PASS' : 'FAIL', `SVI: ${data.data.svi}, Priority: ${data.data.priority}`);
  }

  // Test 3: Counsellor Prioritized Cases
  const prioRes = await fetch(`${BASE_URL}/api/counsellor/cases`);
  const prioData = await prioRes.json();
  console.log('3. Counsellor Priorities:', prioData.success ? 'PASS' : 'FAIL');
  console.log('   P1 count:', prioData.data.priority1.length);
  console.log('   P2 count:', prioData.data.priority2.length);
  console.log('   P3 count:', prioData.data.priority3.length);

  // Test 4: National Analytics
  const natRes = await fetch(`${BASE_URL}/api/analytics/national`);
  const natData = await natRes.json();
  console.log('4. National Analytics:', natData.success ? 'PASS' : 'FAIL');
  console.log('   Monitored Cases:', natData.data.nationalSummary.totalMonitoredCases);
  console.log('   Avg SVI:', natData.data.nationalSummary.avgDistressScore);
  console.log('   States Tracked:', natData.data.stateAnalytics.length);

  // Test 5: Submit Periodic Check-in for CASE-1040
  const checkinPayload = {
    caseId: 'CASE-1040',
    answers: { mood: 8, safety: 8, sleep: 7, isolation: 8, functioning: 6 },
    text: 'They came near our gate again last night. I could not sleep and I fear leaving the house.',
    language: 'en',
    event: 'Threat escalating after summons'
  };

  const checkinRes = await fetch(`${BASE_URL}/api/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(checkinPayload)
  });
  const checkinData = await checkinRes.json();
  console.log('5. Periodic Check-in Submission:', checkinData.success ? 'PASS' : 'FAIL');
  if (checkinData.success) {
    console.log('   Computed SVI:', checkinData.data.score);
    console.log('   Trajectory Prediction:', checkinData.data.prediction);
    console.log('   Explainability Mood:', checkinData.data.explainability?.moodScore);
    console.log('   Alerts Generated:', checkinData.data.alertsGenerated);
    console.log('   Recommendations:', checkinData.data.recommendations?.length);
  } else {
    console.log('   Error:', checkinData.error);
  }

  // Test 6: Verify Case Trends
  const trendRes = await fetch(`${BASE_URL}/api/trends/CASE-1040`);
  const trendData = await trendRes.json();
  console.log('6. Case Trends Fetched:', trendData.success ? 'PASS' : 'FAIL');
  console.log('   Trend data points count:', trendData.data?.length);

  // Test 7: Alerts listing and status update
  const alertRes = await fetch(`${BASE_URL}/api/alerts`);
  const alertData = await alertRes.json();
  console.log('7. Alerts listing:', alertData.success ? 'PASS' : 'FAIL', 'Alert count:', alertData.count);
  if (alertData.data && alertData.data.length > 0) {
    const firstAlert = alertData.data[0];
    const updateRes = await fetch(`${BASE_URL}/api/alerts/${firstAlert.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACKNOWLEDGED', officerNotes: 'Officer dispatched to check on complainant.' })
    });
    const updateData = await updateRes.json();
    console.log('   Alert status update to ACKNOWLEDGED:', updateData.success ? 'PASS' : 'FAIL');
  }

  console.log('--- ALL VERIFICATION TESTS FINISHED ---');
}

runTests().catch(err => console.error('Verification error:', err));
