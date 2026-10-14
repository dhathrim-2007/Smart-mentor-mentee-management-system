const API_BASE_URL = '/api';

function getStoredToken() {
  return localStorage.getItem('smart_mentor_jwt_token');
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('smart_mentor_jwt_token', token);
  } else {
    localStorage.removeItem('smart_mentor_jwt_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    demoLogin: (role) => request('/auth/demo-login', { method: 'POST', body: { role } }),
    register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
    getMe: () => request('/auth/me', { method: 'GET' })
  },

  // Student Endpoints
  student: {
    getDashboard: () => request('/student/dashboard'),
    getGoals: () => request('/student/goals'),
    createGoal: (goalData) => request('/student/goals', { method: 'POST', body: goalData }),
    updateGoal: (goalId, updates) => request(`/student/goals/${goalId}`, { method: 'PUT', body: updates }),
    deleteGoal: (goalId) => request(`/student/goals/${goalId}`, { method: 'DELETE' }),
    requestSession: (sessionData) => request('/student/sessions/request', { method: 'POST', body: sessionData }),
    updateProfile: (profileData) => request('/student/profile', { method: 'PUT', body: profileData }),
    markNotificationRead: (notifId) => request(`/student/notifications/${notifId}/read`, { method: 'POST' })
  },

  // Mentor Endpoints
  mentor: {
    getDashboard: () => request('/mentor/dashboard'),
    getMenteeDetails: (studentId) => request(`/mentor/mentees/${studentId}`),
    updateSessionStatus: (sessionId, updates) => request(`/mentor/sessions/${sessionId}/status`, { method: 'PUT', body: updates }),
    submitFeedback: (feedbackData) => request('/mentor/feedback', { method: 'POST', body: feedbackData }),
    updateProfile: (profileData) => request('/mentor/profile', { method: 'PUT', body: profileData })
  },

  // Admin Endpoints
  admin: {
    getStats: () => request('/admin/stats'),
    getUsers: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/admin/users${qs ? `?${qs}` : ''}`);
    },
    updateUserStatus: (userId, status) => request(`/admin/users/${userId}/status`, { method: 'PUT', body: { status } }),
    getPendingMentors: () => request('/admin/mentors/pending'),
    updateMentorApproval: (mentorId, approvalStatus) => request(`/admin/mentors/${mentorId}/approval`, { method: 'PUT', body: { approvalStatus } }),
    getPairings: () => request('/admin/pairings'),
    assignMentor: (studentId, mentorId) => request('/admin/pairings/assign', { method: 'POST', body: { studentId, mentorId } }),
    unassignMentor: (studentId) => request('/admin/pairings/unassign', { method: 'POST', body: { studentId } }),
    runAiAutoPair: () => request('/admin/pairings/ai-auto-pair', { method: 'POST' }),
    getSessions: () => request('/admin/sessions'),
    getFeedback: () => request('/admin/feedback'),
    getInquiries: () => request('/admin/inquiries')
  },

  // AI Service Endpoints
  ai: {
    getInfo: () => request('/ai/info'),
    matchMentors: (criteria) => request('/ai/match-mentors', { method: 'POST', body: criteria }),
    suggestMilestones: (criteria) => request('/ai/suggest-milestones', { method: 'POST', body: criteria }),
    analyzeProgress: (criteria) => request('/ai/analyze-progress', { method: 'POST', body: criteria })
  },

  // Public Contact Endpoint
  contact: {
    submitInquiry: (inquiryData) => request('/contact', { method: 'POST', body: inquiryData })
  }
};
