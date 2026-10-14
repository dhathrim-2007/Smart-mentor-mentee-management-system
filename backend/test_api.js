import http from 'http';
import { initializeDatabase } from './services/db.js';
import serverApp from './server.js'; // server starts on import

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let resBody = '';
      res.on('data', (chunk) => { resBody += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(resBody);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: resBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Verification Suite...');
  let passCount = 0;
  let failCount = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failCount++;
    }
  }

  try {
    // 1. Health Check
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'HEALTHY', 'Health check returns 200 HEALTHY');

    // 2. Demo Login - Student
    const studentLogin = await request('POST', '/api/auth/demo-login', { role: 'STUDENT' });
    assert(studentLogin.status === 200 && studentLogin.body.token, 'Student Demo Login successful');
    const studentToken = studentLogin.body.token;

    // 3. Demo Login - Mentor
    const mentorLogin = await request('POST', '/api/auth/demo-login', { role: 'MENTOR' });
    assert(mentorLogin.status === 200 && mentorLogin.body.token, 'Mentor Demo Login successful');
    const mentorToken = mentorLogin.body.token;

    // 4. Demo Login - Admin
    const adminLogin = await request('POST', '/api/auth/demo-login', { role: 'ADMIN' });
    assert(adminLogin.status === 200 && adminLogin.body.token, 'Admin Demo Login successful');
    const adminToken = adminLogin.body.token;

    // 5. Student Dashboard
    const studentDash = await request('GET', '/api/student/dashboard', null, studentToken);
    assert(studentDash.status === 200 && studentDash.body.data.goals.length > 0, 'Student Dashboard loaded with goals');

    // 6. Create Goal with Milestones
    const newGoalRes = await request('POST', '/api/student/goals', {
      title: 'Master Kubernetes and Cloud Native Microservices',
      category: 'TECHNICAL_SKILL',
      targetDate: '2026-12-31',
      autoGenerateMilestones: true
    }, studentToken);
    assert(newGoalRes.status === 201 && newGoalRes.body.goal.milestones.length > 0, 'Goal creation with auto-milestones successful');
    const createdGoalId = newGoalRes.body.goal.id;

    // 7. Update Goal Progress
    const updateGoalRes = await request('PUT', `/api/student/goals/${createdGoalId}`, {
      progress: 40
    }, studentToken);
    assert(updateGoalRes.status === 200 && updateGoalRes.body.goal.progress === 40, 'Goal progress update successful');

    // 8. Request Mentoring Session
    const sessionReq = await request('POST', '/api/student/sessions/request', {
      scheduledTime: new Date(Date.now() + 3 * 86400000).toISOString(),
      durationMinutes: 45,
      topic: 'Kubernetes Pod Networking and Ingress Controllers',
      notes: 'Need guidance on setting up ingress-nginx in Minikube'
    }, studentToken);
    assert(sessionReq.status === 201 && sessionReq.body.session.id, 'Session request creation successful');
    const createdSessionId = sessionReq.body.session.id;

    // 9. Mentor Dashboard
    const mentorDash = await request('GET', '/api/mentor/dashboard', null, mentorToken);
    assert(mentorDash.status === 200 && mentorDash.body.data.mentees.length > 0, 'Mentor Dashboard loaded with mentees');

    // 10. Mentor Updates Session
    const updateSessionRes = await request('PUT', `/api/mentor/sessions/${createdSessionId}/status`, {
      status: 'CONFIRMED',
      meetingLink: 'https://meet.google.com/test-mentor-sync'
    }, mentorToken);
    assert(updateSessionRes.status === 200 && updateSessionRes.body.session.status === 'CONFIRMED', 'Mentor session confirmation successful');

    // 11. Mentor Submits Feedback
    const menteeId = studentDash.body.data.student.id;
    const feedbackRes = await request('POST', '/api/mentor/feedback', {
      sessionId: createdSessionId,
      studentId: menteeId,
      rating: 5,
      technicalSkillsRating: 5,
      communicationRating: 4,
      qualitativeNotes: 'Student showed remarkable clarity on container namespaces and cgroups.',
      actionableNextSteps: 'Review Kubernetes Service discovery and CoreDNS.'
    }, mentorToken);
    assert(feedbackRes.status === 201 && feedbackRes.body.feedback.id, 'Feedback submission successful');

    // 12. Admin Stats
    const adminStats = await request('GET', '/api/admin/stats', null, adminToken);
    assert(adminStats.status === 200 && adminStats.body.stats.totalUsers > 0, 'Admin Statistics computed successfully');

    // 13. Admin Pairings & AI Auto-Pairing
    const pairings = await request('GET', '/api/admin/pairings', null, adminToken);
    assert(pairings.status === 200 && Array.isArray(pairings.body.data.pairings), 'Admin Pairings list loaded');

    // 14. AI Match API
    const aiMatch = await request('POST', '/api/ai/match-mentors', {
      major: 'Computer Science & AI',
      careerGoals: 'Machine Learning Engineer',
      skillsSought: ['PyTorch', 'LLMs', 'Computer Vision']
    });
    assert(aiMatch.status === 200 && aiMatch.body.matches.length > 0, 'AI Mentor Matching returns scored matches');

    // 15. Contact Inquiry
    const contactRes = await request('POST', '/api/contact', {
      name: 'Dr. Jane Holloway',
      email: 'jholloway@university.edu',
      role: 'College Dean',
      subject: 'Institutional Partnership Inquiry',
      message: 'We want to onboard 500 students to Smart AI Mentor system.'
    });
    assert(contactRes.status === 201 && contactRes.body.referenceCode, 'Contact inquiry logged with reference code');

    console.log(`\n📊 Test Results: ${passCount} Passed, ${failCount} Failed.`);
    process.exit(failCount === 0 ? 0 : 1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

// Allow server 1 second to bind
setTimeout(runTests, 1200);
