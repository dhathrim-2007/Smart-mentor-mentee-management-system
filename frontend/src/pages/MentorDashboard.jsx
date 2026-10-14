import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Briefcase,
  Users,
  Target,
  Calendar,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  Star,
  ChevronRight,
  Sparkles,
  ExternalLink,
  MessageSquare,
  X,
  Send,
  Eye,
  Check
} from 'lucide-react';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackStudent, setFeedbackStudent] = useState(null);

  // Feedback form
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    technicalSkillsRating: 5,
    communicationRating: 5,
    qualitativeNotes: '',
    actionableNextSteps: ''
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.mentor.getDashboard();
      if (res.success) {
        setDashboardData(res.data);
      } else {
        setError(res.error || 'Failed to load mentor dashboard.');
      }
    } catch (err) {
      setError(err.message || 'Error fetching mentor dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Update session status (Confirm, Reschedule, Complete)
  const handleUpdateSession = async (sessionId, status) => {
    try {
      const res = await api.mentor.updateSessionStatus(sessionId, { status });
      if (res.success) {
        setDashboardData((prev) => ({
          ...prev,
          sessions: prev.sessions.map((s) => (s.id === sessionId ? res.session : s))
        }));
        showToast(`Session marked as ${status}!`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update session');
    }
  };

  // Submit Feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackStudent) return;
    setSubmittingFeedback(true);
    try {
      const res = await api.mentor.submitFeedback({
        studentId: feedbackStudent.studentId,
        ...feedbackForm
      });
      if (res.success) {
        setFeedbackModalOpen(false);
        setFeedbackForm({
          rating: 5,
          technicalSkillsRating: 5,
          communicationRating: 5,
          qualitativeNotes: '',
          actionableNextSteps: ''
        });
        showToast('Official feedback submitted successfully!');
        fetchDashboard();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-lavender-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 text-sm font-medium">Loading your mentor control hub...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-red-200 text-center max-w-md shadow-xs">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Dashboard Unavailable</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { mentor, metrics, mentees, attentionRequiredMentees, sessions, feedbackGiven } = dashboardData;

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

        {/* 1. MENTOR HEADER BANNER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-lavender-500 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                  {mentor.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lavender-100 text-lavender-800 border border-lavender-200">
                  Verified Industry Mentor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {mentor.profile?.designation} • {mentor.profile?.organization}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500">Domain: <strong className="text-slate-800">{mentor.profile?.domain}</strong></span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Rating: <strong className="text-amber-500">★ {mentor.profile?.rating} / 5.0</strong></span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Mentee Capacity: <strong className="text-teal-700">{metrics.totalMentees} / {metrics.maxMentees}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-right w-full md:w-auto">
              <span className="text-[11px] text-slate-500 block">Assigned Mentees</span>
              <span className="text-xl font-bold text-slate-900 font-['Outfit']">{metrics.totalMentees} Students</span>
            </div>
          </div>
        </div>

        {/* 2. ATTENTION REQUIRED WARNING BAR (IF ANY MENTEES STALLED) */}
        {attentionRequiredMentees.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>Attention Required: {attentionRequiredMentees.length} Mentee(s) Need Proactive Guidance</span>
              </div>
              <span className="text-xs text-amber-700 font-medium hidden sm:inline">
                Early Intervention Intelligence
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {attentionRequiredMentees.map((item) => (
                <div key={item.studentId} className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-200/60 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-amber-700">{item.reason}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const fullMentee = mentees.find((m) => m.studentId === item.studentId);
                      setSelectedMentee(fullMentee);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Assigned Cohort</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit']">{metrics.totalMentees}</div>
            <div className="text-[11px] text-teal-600 font-medium mt-1">
              Max capacity: {metrics.maxMentees}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Active Goals Tracked</span>
              <Target className="w-4 h-4 text-lavender-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit']">{metrics.activeGoalsTracked}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Milestone checklists
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 font-['Outfit']">{metrics.pendingRequestsCount}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Awaiting confirmation
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Upcoming Confirmed</span>
              <Calendar className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit']">{metrics.upcomingSessionsCount}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Scheduled 1-on-1s
            </div>
          </div>
        </div>

        {/* 4. MENTEE ROSTER & GOALS OVERSIGHT */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <span>Assigned Mentees Roster</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor student project velocities, milestones achieved, and submit structured feedback.
              </p>
            </div>
          </div>

          {mentees.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              No students are currently assigned to your cohort. Check back once university administrators run the matching batch.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mentees.map((mentee) => (
                <div
                  key={mentee.studentId}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={mentee.avatar}
                          alt={mentee.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{mentee.name}</h3>
                          <p className="text-xs text-slate-500">
                            {mentee.major} • {mentee.academicYear}
                          </p>
                          <p className="text-[11px] text-slate-400">{mentee.university}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          mentee.progressAnalysis.metricSummary.momentumStatus === 'HIGH'
                            ? 'bg-teal-100 text-teal-800'
                            : mentee.progressAnalysis.metricSummary.momentumStatus === 'STEADY_PROGRESS'
                            ? 'bg-lavender-100 text-lavender-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {mentee.progressAnalysis.metricSummary.momentumStatus}
                      </span>
                    </div>

                    {/* Mentee Career Focus & Progress */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mb-3">
                      <div className="font-semibold text-slate-800 mb-0.5">Career Goal:</div>
                      <p className="line-clamp-2">{mentee.careerGoals}</p>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Overall Progress</span>
                        <span className="text-slate-900 font-bold">{mentee.progressAnalysis.metricSummary.averageProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${mentee.progressAnalysis.metricSummary.averageProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{mentee.goals.length} Goals Active</span>
                        <span>{mentee.progressAnalysis.metricSummary.completedGoals} Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedMentee(mentee)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Goals & Checklist</span>
                    </button>
                    <button
                      onClick={() => {
                        setFeedbackStudent(mentee);
                        setFeedbackModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Submit Feedback</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. SESSION MANAGEMENT SUITE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-lavender-600" />
                <span>Mentoring Session Requests & Schedule</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm student appointments, launch Google Meet links, or update meeting status.
              </p>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              No sessions scheduled currently.
            </div>
          ) : (
            <div className="space-y-3.5">
              {sessions.map((sess) => {
                const studentUser = mentees.find((m) => m.studentId === sess.student_id);
                return (
                  <div
                    key={sess.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            sess.status === 'CONFIRMED'
                              ? 'bg-teal-100 text-teal-800'
                              : sess.status === 'COMPLETED'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sess.status}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(sess.scheduled_time).toLocaleDateString()} at {new Date(sess.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({sess.duration_minutes} min)
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{sess.topic}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Mentee: <strong className="text-slate-800">{studentUser?.name || 'Assigned Student'}</strong>
                        {sess.notes && ` • Notes: "${sess.notes}"`}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      {sess.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateSession(sess.id, 'CONFIRMED')}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => handleUpdateSession(sess.id, 'CANCELLED')}
                            className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {sess.status === 'CONFIRMED' && (
                        <>
                          <a
                            href={sess.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5 text-teal-400" />
                            <span>Launch Google Meet</span>
                          </a>
                          <button
                            onClick={() => handleUpdateSession(sess.id, 'COMPLETED')}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                          >
                            Mark Complete
                          </button>
                        </>
                      )}

                      {sess.status === 'COMPLETED' && (
                        <span className="text-xs text-slate-400 font-medium">Session Concluded</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* MENTEE DETAILS MODAL */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedMentee(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedMentee.avatar}
                alt={selectedMentee.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">{selectedMentee.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedMentee.major} • {selectedMentee.academicYear} • GPA {selectedMentee.gpa}
                </p>
                <p className="text-xs text-teal-700 font-medium">{selectedMentee.university}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">Career Ambition:</span>
                <p className="text-slate-600">{selectedMentee.careerGoals}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Active Goals & Milestones ({selectedMentee.goals.length})
                </h4>
                <div className="space-y-3">
                  {selectedMentee.goals.map((g) => (
                    <div key={g.id} className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900">{g.title}</span>
                        <span className="font-bold text-teal-700">{g.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${g.progress}%` }}></div>
                      </div>
                      <div className="space-y-1">
                        {g.milestones?.map((m) => (
                          <div key={m.id} className="flex items-center gap-2 text-[11px] text-slate-600">
                            <span className={m.done ? 'text-teal-600' : 'text-slate-300'}>
                              {m.done ? '✓' : '○'}
                            </span>
                            <span className={m.done ? 'line-through text-slate-400' : ''}>{m.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  setFeedbackStudent(selectedMentee);
                  setSelectedMentee(null);
                  setFeedbackModalOpen(true);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Submit Feedback for this Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT FEEDBACK MODAL */}
      {feedbackModalOpen && feedbackStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setFeedbackModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-1">
              Submit Mentorship Evaluation
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Reviewing progress for: <strong className="text-slate-800">{feedbackStudent.name}</strong>
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Overall (1-5)
                  </label>
                  <select
                    value={feedbackForm.rating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Strong</option>
                    <option value="3">3 - Satisfactory</option>
                    <option value="2">2 - Needs Work</option>
                    <option value="1">1 - Unsatisfactory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Technical
                  </label>
                  <select
                    value={feedbackForm.technicalSkillsRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, technicalSkillsRating: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="5">5 - Exceptional</option>
                    <option value="4">4 - Competent</option>
                    <option value="3">3 - Developing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Communication
                  </label>
                  <select
                    value={feedbackForm.communicationRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, communicationRating: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="5">5 - Clear & Proactive</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Needs Clarity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Qualitative Assessment & Strengths <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={feedbackForm.qualitativeNotes}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, qualitativeNotes: e.target.value })}
                  placeholder="Specific observations on project implementation, code design, problem solving..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-lavender-500"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Actionable Next Steps for Student
                </label>
                <textarea
                  rows={2}
                  value={feedbackForm.actionableNextSteps}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, actionableNextSteps: e.target.value })}
                  placeholder="1. Refine README architecture diagrams. 2. Practice interview coding problems..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-lavender-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow transition"
                >
                  {submittingFeedback ? 'Saving...' : 'Submit Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
