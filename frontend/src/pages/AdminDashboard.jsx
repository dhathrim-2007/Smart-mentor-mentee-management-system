import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  Users,
  Award,
  Link2,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Sparkles,
  Star,
  ExternalLink,
  Mail,
  UserCheck,
  UserX,
  MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab Data States
  const [usersList, setUsersList] = useState([]);
  const [pendingMentors, setPendingMentors] = useState([]);
  const [pairingsData, setPairingsData] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchStats = async () => {
    try {
      const res = await api.admin.getStats();
      if (res.success) setStats(res.stats);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const loadTabData = async (tab) => {
    try {
      if (tab === 'users') {
        const res = await api.admin.getUsers({ search: userSearch, role: userRoleFilter });
        if (res.success) setUsersList(res.users);
      } else if (tab === 'mentors') {
        const res = await api.admin.getPendingMentors();
        if (res.success) setPendingMentors(res.pendingMentors);
      } else if (tab === 'pairings') {
        const res = await api.admin.getPairings();
        if (res.success) setPairingsData(res.data);
      } else if (tab === 'sessions') {
        const [sessRes, fbRes] = await Promise.all([
          api.admin.getSessions(),
          api.admin.getFeedback()
        ]);
        if (sessRes.success) setAllSessions(sessRes.sessions);
        if (fbRes.success) setAllFeedback(fbRes.feedback);
      } else if (tab === 'inquiries') {
        const res = await api.admin.getInquiries();
        if (res.success) setInquiries(res.inquiries);
      }
    } catch (err) {
      console.error(`Error loading tab ${tab}:`, err);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await fetchStats();
      await loadTabData('users');
      setLoading(false);
    }
    init();
  }, []);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    await loadTabData(tab);
  };

  // Toggle user status
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await api.admin.updateUserStatus(userId, newStatus);
      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
        showToast(`User status updated to ${newStatus}.`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update user status.');
    }
  };

  // Approve / Reject Mentor
  const handleMentorApproval = async (mentorId, approvalStatus) => {
    try {
      const res = await api.admin.updateMentorApproval(mentorId, approvalStatus);
      if (res.success) {
        setPendingMentors((prev) => prev.filter((m) => m.mentorId !== mentorId));
        showToast(`Mentor application ${approvalStatus.toLowerCase()}.`);
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update mentor approval.');
    }
  };

  // Manual Assign Mentor
  const handleAssignMentor = async (studentId, mentorId) => {
    try {
      const res = await api.admin.assignMentor(studentId, mentorId);
      if (res.success) {
        showToast('Mentor paired successfully.');
        loadTabData('pairings');
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to assign mentor.');
    }
  };

  // Unassign Mentor
  const handleUnassignMentor = async (studentId) => {
    try {
      const res = await api.admin.unassignMentor(studentId);
      if (res.success) {
        showToast('Mentorship pairing unlinked.');
        loadTabData('pairings');
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to unassign mentor.');
    }
  };

  // Run AI Auto-Pairing Batch
  const handleRunAiBatch = async () => {
    try {
      const res = await api.admin.runAiAutoPair();
      if (res.success) {
        showToast(res.message);
        loadTabData('pairings');
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'AI Auto-pairing batch failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-navy-700 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 text-sm font-medium">Loading Administrator Control Center...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-150">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. ADMIN HEADER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl border-2 border-slate-800 shadow-xs">
              <ShieldCheck className="w-10 h-10 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                  Platform Administration Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-100 text-navy-800 border border-navy-200">
                  Dean / Admin Oversight
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                College-wide user management, mentor verification, algorithmic pairings, and quality audit logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAiBatch}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>Run AI Auto-Pairing Batch</span>
            </button>
          </div>
        </div>

        {/* 2. STATS OVERVIEW CARDS */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Total Users</span>
              <div className="text-2xl font-extrabold text-slate-900 font-['Outfit'] mt-1">{stats.totalUsers}</div>
              <span className="text-[11px] text-slate-400">{stats.studentsCount} Students • {stats.mentorsCount} Mentors</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Active Pairings</span>
              <div className="text-2xl font-extrabold text-teal-600 font-['Outfit'] mt-1">{stats.activePairingsCount}</div>
              <span className="text-[11px] text-amber-600 font-medium">{stats.unassignedStudentsCount} unassigned</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Pending Mentors</span>
              <div className="text-2xl font-extrabold text-lavender-700 font-['Outfit'] mt-1">{stats.pendingMentorsCount}</div>
              <span className="text-[11px] text-slate-400">Applications to review</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Total Sessions</span>
              <div className="text-2xl font-extrabold text-slate-900 font-['Outfit'] mt-1">{stats.totalSessions}</div>
              <span className="text-[11px] text-teal-600 font-medium">{stats.completedSessions} completed</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Satisfaction Index</span>
              <div className="text-2xl font-extrabold text-amber-500 font-['Outfit'] mt-1">★ {stats.averageSatisfactionRating}</div>
              <span className="text-[11px] text-slate-400">{stats.totalFeedback} reviews logged</span>
            </div>
          </div>
        )}

        {/* 3. TAB CONTROLS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'mentors', label: `Pending Mentor Approvals (${pendingMentors.length})`, icon: Award },
            { id: 'pairings', label: 'Mentor-Mentee Pairings', icon: Link2 },
            { id: 'sessions', label: 'Sessions & Feedback Oversight', icon: Calendar },
            { id: 'inquiries', label: 'Contact Inquiries', icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. TAB CONTENTS */}
        
        {/* TAB 1: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      api.admin.getUsers({ search: e.target.value, role: userRoleFilter }).then((res) => {
                        if (res.success) setUsersList(res.users);
                      });
                    }}
                    placeholder="Search by name or email..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    setUserRoleFilter(e.target.value);
                    api.admin.getUsers({ search: userSearch, role: e.target.value }).then((res) => {
                      if (res.success) setUsersList(res.users);
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="">All Roles</option>
                  <option value="STUDENT">Students</option>
                  <option value="MENTOR">Mentors</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Showing {usersList.length} users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Domain / Major</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'ADMIN'
                              ? 'bg-navy-100 text-navy-800'
                              : u.role === 'MENTOR'
                              ? 'bg-lavender-100 text-lavender-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {u.profileDetails?.major || u.profileDetails?.domain || 'Campus Administration'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                              u.status === 'ACTIVE'
                                ? 'text-red-700 bg-red-50 hover:bg-red-100'
                                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PENDING MENTOR APPROVALS */}
        {activeTab === 'mentors' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Pending Mentor Applications</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect applicant credentials and approve access to the active mentoring pool.
              </p>
            </div>

            {pendingMentors.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                All mentor applications have been reviewed. No pending verifications.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingMentors.map((m) => (
                  <div key={m.mentorId} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                        <p className="text-xs text-slate-500">{m.designation} • {m.organization}</p>
                        <p className="text-xs text-teal-700 font-medium">Domain: {m.domain} ({m.yearsExperience} yrs exp)</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {m.expertiseSkills?.map((s) => (
                            <span key={s} className="px-1.5 py-0.5 text-[10px] bg-white rounded border border-slate-200 text-slate-600">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMentorApproval(m.mentorId, 'APPROVED')}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                      >
                        Approve Application
                      </button>
                      <button
                        onClick={() => handleMentorApproval(m.mentorId, 'REJECTED')}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAIRINGS & AI ASSIGNMENTS */}
        {activeTab === 'pairings' && pairingsData && (
          <div className="space-y-6">
            
            {/* Unassigned Students with AI Match Recommendations */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    <span>Unassigned Students ({pairingsData.unassignedStudents.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Algorithm ranks optimal mentors; assign with 1-click or let the AI Auto-Pairing batch run.
                  </p>
                </div>
                <button
                  onClick={handleRunAiBatch}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow transition"
                >
                  Run AI Auto-Pair All
                </button>
              </div>

              {pairingsData.unassignedStudents.length === 0 ? (
                <div className="p-6 text-center bg-teal-50/50 rounded-2xl border border-teal-200 text-xs text-teal-800 font-medium">
                  ✓ All enrolled students currently have assigned mentors.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {pairingsData.unassignedStudents.map(({ student, topAiMatch }) => (
                    <div key={student.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{student.name}</h4>
                          <span className="text-xs text-slate-500">• {student.major}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Target: {student.careerGoals || 'Software Engineering'}
                        </p>
                        {topAiMatch && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                            <span>Top AI Recommendation: <strong>{topAiMatch.name}</strong> ({topAiMatch.matchScore}% Compatibility)</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        {topAiMatch && (
                          <button
                            onClick={() => handleAssignMentor(student.id, topAiMatch.mentorId)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                          >
                            Pair with {topAiMatch.name.split(' ')[0]}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Pairings Roster */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-4">
                Active Mentor–Mentee Pairings ({pairingsData.pairings.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Assigned Mentor</th>
                      <th className="py-3 px-4">Domain</th>
                      <th className="py-3 px-4">Paired Since</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pairingsData.pairings.map(({ student, mentor, pairingDate }) => (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-[11px] text-slate-400">{student.major}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{mentor.name}</div>
                          <div className="text-[11px] text-slate-400">{mentor.organization}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{mentor.domain}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {pairingDate ? new Date(pairingDate).toLocaleDateString() : 'Active'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleUnassignMentor(student.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            Unassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: SESSIONS & FEEDBACK OVERSIGHT */}
        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sessions Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>Mentorship Sessions ({allSessions.length})</span>
              </h3>

              <div className="space-y-3">
                {allSessions.map((s) => (
                  <div key={s.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{s.topic}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        {s.status}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      Student: <strong>{s.studentName}</strong> • Mentor: <strong>{s.mentorName}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {new Date(s.scheduled_time).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Rubrics */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Mentor Evaluations ({allFeedback.length})</span>
              </h3>

              <div className="space-y-3">
                {allFeedback.map((f) => (
                  <div key={f.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {f.mentorName} → {f.studentName}
                      </span>
                      <span className="text-amber-500 font-bold">★ {f.rating}.0</span>
                    </div>
                    <p className="text-slate-600 italic">"{f.qualitative_notes}"</p>
                    {f.actionable_next_steps && (
                      <div className="text-[11px] text-slate-500">
                        <strong>Advice: </strong> {f.actionable_next_steps}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-600" />
              <span>Campus Inquiries & Partnership Requests ({inquiries.length})</span>
            </h3>

            {inquiries.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{inq.subject}</h4>
                        <p className="text-xs text-slate-500">From: {inq.name} ({inq.email}) • Affiliation: {inq.role}</p>
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200">
                        {inq.reference_code || inq.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                      {inq.message}
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Logged on {new Date(inq.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
