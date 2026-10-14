import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  GraduationCap,
  Sparkles,
  Target,
  Calendar,
  MessageSquare,
  Award,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Video,
  BookOpen,
  Star,
  Check,
  X
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [addGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  // New Goal Form
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL_SKILL',
    targetDate: '',
    autoGenerateMilestones: true
  });
  const [creatingGoal, setCreatingGoal] = useState(false);

  // New Session Form
  const [newSession, setNewSession] = useState({
    topic: '',
    scheduledTime: '',
    durationMinutes: 45,
    notes: ''
  });
  const [requestingSession, setRequestingSession] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.student.getDashboard();
      if (res.success) {
        setDashboardData(res.data);
      } else {
        setError(res.error || 'Failed to load dashboard.');
      }
    } catch (err) {
      setError(err.message || 'Error fetching student dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Toggle milestone completion
  const handleToggleMilestone = async (goal, milestoneId) => {
    try {
      const updatedMilestones = goal.milestones.map((m) =>
        m.id === milestoneId ? { ...m, done: !m.done } : m
      );
      const res = await api.student.updateGoal(goal.id, {
        milestones: updatedMilestones
      });
      if (res.success) {
        setDashboardData((prev) => ({
          ...prev,
          goals: prev.goals.map((g) => (g.id === goal.id ? res.goal : g))
        }));
        showToast('Milestone updated!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update milestone', 'error');
    }
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to remove this goal?')) return;
    try {
      await api.student.deleteGoal(goalId);
      setDashboardData((prev) => ({
        ...prev,
        goals: prev.goals.filter((g) => g.id !== goalId)
      }));
      showToast('Goal removed.');
    } catch (err) {
      showToast(err.message || 'Failed to delete goal', 'error');
    }
  };

  // Create Goal
  const handleCreateGoalSubmit = async (e) => {
    e.preventDefault();
    setCreatingGoal(true);
    try {
      const res = await api.student.createGoal(newGoal);
      if (res.success) {
        setDashboardData((prev) => ({
          ...prev,
          goals: [res.goal, ...prev.goals]
        }));
        setAddGoalModalOpen(false);
        setNewGoal({
          title: '',
          description: '',
          category: 'TECHNICAL_SKILL',
          targetDate: '',
          autoGenerateMilestones: true
        });
        showToast('Goal created with milestones!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create goal', 'error');
    } finally {
      setCreatingGoal(false);
    }
  };

  // Request Session
  const handleRequestSessionSubmit = async (e) => {
    e.preventDefault();
    setRequestingSession(true);
    try {
      const res = await api.student.requestSession(newSession);
      if (res.success) {
        setDashboardData((prev) => ({
          ...prev,
          sessions: [res.session, ...prev.sessions]
        }));
        setSessionModalOpen(false);
        setNewSession({
          topic: '',
          scheduledTime: '',
          durationMinutes: 45,
          notes: ''
        });
        showToast('Mentoring session requested successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to request session', 'error');
    } finally {
      setRequestingSession(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 text-sm font-medium">Loading your student dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-red-200 text-center max-w-md shadow-xs">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
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

  const { student, assignedMentor, metrics, goals, sessions, feedback, aiProgressSummary, recommendedMentors } = dashboardData;

  const filteredGoals = goals.filter((g) => {
    if (activeCategoryFilter === 'ALL') return true;
    return g.category === activeCategoryFilter;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Alert */}
        {feedbackToast && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-150">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{feedbackToast.message}</span>
          </div>
        )}

        {/* 1. WELCOME BANNER & PROFILE SUMMARY */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                  Welcome, {student.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  Student Mentee
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {student.profile?.major} • {student.profile?.academic_year} • {student.profile?.university}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-600">Career Focus:</span>
                <span className="px-2.5 py-0.5 bg-slate-100 rounded-md text-slate-700 font-medium">
                  {student.profile?.career_goals || 'Software Engineering & AI'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-medium">GPA: {student.profile?.gpa || '3.8'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setAddGoalModalOpen(true)}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Add Goal</span>
            </button>
            {assignedMentor && (
              <button
                onClick={() => setSessionModalOpen(true)}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Book Session</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. KEY METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Total Goals</span>
              <Target className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit']">{metrics.totalGoals}</div>
            <div className="text-[11px] text-teal-600 font-medium mt-1">
              {metrics.completedGoals} completed
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Goal Completion Rate</span>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-teal-600 font-['Outfit']">{metrics.averageProgress}%</div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${metrics.averageProgress}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Upcoming Sessions</span>
              <Calendar className="w-4 h-4 text-lavender-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit']">{metrics.upcomingSessionsCount}</div>
            <div className="text-[11px] text-lavender-700 font-medium mt-1">
              Active mentoring syncs
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Mentor Feedback</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit']">{metrics.feedbackCount}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Evaluations logged
            </div>
          </div>
        </div>

        {/* 3. ASSIGNED MENTOR SPOTLIGHT CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">Your Assigned Mentor</h2>
            </div>
            {assignedMentor && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Active 1-on-1 Guidance</span>
              </span>
            )}
          </div>

          {assignedMentor ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-5 bg-gradient-to-r from-slate-50 via-teal-50/20 to-white rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4">
                <img
                  src={assignedMentor.avatar}
                  alt={assignedMentor.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{assignedMentor.name}</h3>
                  <p className="text-xs text-slate-600">
                    {assignedMentor.designation} • {assignedMentor.organization}
                  </p>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">
                    Domain: {assignedMentor.domain} ({assignedMentor.yearsExperience} yrs experience)
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {assignedMentor.expertiseSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-white text-slate-700 rounded border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setSessionModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Request Session</span>
                </button>
                {assignedMentor.linkedinUrl && (
                  <a
                    href={assignedMentor.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition flex items-center justify-center gap-1.5"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-lavender-50/50 rounded-2xl border border-lavender-200 text-center">
              <Sparkles className="w-8 h-8 text-lavender-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">No Mentor Assigned Yet</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 mb-4">
                Our AI matching algorithm has evaluated top candidates based on your major and desired skills. An administrator can assign you, or you can review recommended mentors below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
                {recommendedMentors.map((rec) => (
                  <div key={rec.mentorId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2.5 mb-2">
                      <img src={rec.avatar} alt={rec.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{rec.name}</h4>
                        <span className="text-[10px] text-teal-700 font-semibold">{rec.matchScore}% Match</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{rec.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. GOALS & MILESTONES HUB */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-600" />
                <span>Academic & Career Goals</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Break objectives into checklists; ticking milestones updates your progress velocity in real-time.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'TECHNICAL_SKILL', 'ACADEMIC', 'PROJECT', 'RESEARCH'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeCategoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {filteredGoals.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Target className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No goals found for this category</p>
              <button
                onClick={() => setAddGoalModalOpen(true)}
                className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lavender-100 text-lavender-800 uppercase tracking-wide">
                          {goal.category.replace('_', ' ')}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base">{goal.title}</h3>
                        {goal.status === 'COMPLETED' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                        {goal.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-extrabold text-slate-900 font-['Outfit']">
                          {goal.progress}%
                        </span>
                        <span className="block text-[10px] text-slate-400">Target: {goal.target_date}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full my-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        goal.progress === 100 ? 'bg-teal-500' : 'bg-slate-900'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>

                  {/* Milestones Checklist */}
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Milestone Steps ({goal.milestones.filter((m) => m.done).length}/{goal.milestones.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {goal.milestones.map((m) => (
                          <label
                            key={m.id}
                            className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition select-none ${
                              m.done
                                ? 'bg-teal-50/50 border-teal-200 text-slate-500'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={m.done}
                              onChange={() => handleToggleMilestone(goal, m.id)}
                              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 mt-0.5 cursor-pointer"
                            />
                            <span className={m.done ? 'line-through' : 'font-medium'}>
                              {m.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. SESSIONS & AI BRIEFING 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Mentoring Sessions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-lavender-600" />
                <span>Mentoring Sessions</span>
              </h2>
              {assignedMentor && (
                <button
                  onClick={() => setSessionModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition"
                >
                  + Request Sync
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                No sessions booked yet. Request a 1-on-1 session with your mentor above.
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition"
                  >
                    <div className="flex items-center justify-between mb-1.5">
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
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(sess.scheduled_time).toLocaleDateString()} at {new Date(sess.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-800">{sess.topic}</h4>
                    {sess.notes && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{sess.notes}</p>
                    )}

                    {sess.meeting_link && sess.status === 'CONFIRMED' && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-xs text-teal-700 font-semibold truncate max-w-[200px]">
                          {sess.meeting_link}
                        </span>
                        <a
                          href={sess.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Google Meet</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Progress Summary & Guidance */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-600" />
                <span>AI Progress Briefing</span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lavender-100 text-lavender-800 uppercase">
                {aiProgressSummary?.metricSummary?.momentumStatus}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
              <p className="text-xs text-slate-700 leading-relaxed">
                {aiProgressSummary?.executiveBriefing}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Actionable AI Guidance Tips
              </div>
              {aiProgressSummary?.actionableRecommendations?.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-teal-50/40 rounded-xl border border-teal-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 6. MENTOR FEEDBACK TIMELINE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Mentor Feedback & Evaluations</span>
          </h2>

          {feedback.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              No formal mentor evaluations logged yet. Complete a session to receive rubric ratings.
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.map((fb) => (
                <div key={fb.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Dr. Elena Vance</span>
                      <span className="text-[10px] text-slate-400">• {new Date(fb.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      {[...Array(fb.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                      <span className="ml-1 text-slate-700">({fb.rating}.0)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed mb-3">
                    "{fb.qualitative_notes}"
                  </p>

                  {fb.actionable_next_steps && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <strong className="text-slate-900 block mb-1">Mentor Action Items:</strong>
                      <span className="text-slate-600">{fb.actionable_next_steps}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* CREATE GOAL MODAL */}
      {addGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setAddGoalModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-1">
              Add Academic or Career Goal
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Set clear objectives and let our AI milestone generator decompose the task.
            </p>

            <form onSubmit={handleCreateGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Goal Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g. Master PyTorch & Deep Learning Foundations"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="TECHNICAL_SKILL">Technical Skill</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="PROJECT">Capstone Project</option>
                    <option value="RESEARCH">Research Paper</option>
                    <option value="CAREER">Interview & Career</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Specific scope, requirements, or target outcomes..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl">
                <input
                  type="checkbox"
                  id="autoMilestones"
                  checked={newGoal.autoGenerateMilestones}
                  onChange={(e) => setNewGoal({ ...newGoal, autoGenerateMilestones: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
                <label htmlFor="autoMilestones" className="text-xs text-teal-900 font-medium cursor-pointer">
                  Auto-generate 5 structured AI milestone steps based on goal topic
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddGoalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingGoal}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow transition"
                >
                  {creatingGoal ? 'Saving...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST SESSION MODAL */}
      {sessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSessionModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-1">
              Request 1-on-1 Mentoring Session
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Submit an agenda topic to schedule a dedicated video sync with your mentor.
            </p>

            <form onSubmit={handleRequestSessionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Session Topic / Agenda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSession.topic}
                  onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                  placeholder="e.g. Code Review on Transformer Attention Module"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Preferred Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newSession.scheduledTime}
                    onChange={(e) => setNewSession({ ...newSession, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={newSession.durationMinutes}
                    onChange={(e) => setNewSession({ ...newSession, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Preparation Notes / Specific Questions
                </label>
                <textarea
                  rows={2}
                  value={newSession.notes}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  placeholder="Questions you want addressed during the session..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSessionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestingSession}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow transition"
                >
                  {requestingSession ? 'Sending Request...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
