import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  Calendar,
  Users,
  Target,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Brain,
  Star,
  BookOpen,
  Award,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Search,
  Check
} from 'lucide-react';

export default function Home() {
  const { demoLogin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Interactive AI Matcher Demo State
  const [demoMajor, setDemoMajor] = useState('Computer Science & AI');
  const [demoCareerGoal, setDemoCareerGoal] = useState('Machine Learning Engineer');
  const [demoSkills, setDemoSkills] = useState('PyTorch, LLMs, Computer Vision');
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matches, setMatches] = useState(null);

  const handleRunDemoMatch = async (e) => {
    e.preventDefault();
    setMatchingLoading(true);
    try {
      const res = await api.ai.matchMentors({
        major: demoMajor,
        careerGoals: demoCareerGoal,
        skillsSought: demoSkills.split(',').map((s) => s.trim())
      });
      if (res.success) {
        setMatches(res.matches);
      }
    } catch (err) {
      console.error('Demo match error:', err);
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    try {
      await demoLogin(role);
      if (role === 'STUDENT') navigate('/student/dashboard');
      else if (role === 'MENTOR') navigate('/mentor/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
    } catch (err) {
      console.error('Demo error:', err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-lavender-50/40 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-lavender-100 text-lavender-800 border border-lavender-200 mb-6 shadow-2xs">
              <Sparkles className="w-4 h-4 text-lavender-600 animate-pulse" />
              <span>Next-Gen College Mentorship Ecosystem • AI-Powered Matching</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] leading-[1.15]">
              Empower Students with <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-teal-700 to-teal-500">
                Precision Mentorship
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Connect college students with the right industry & academic mentors, set structured milestone goals, track velocity, and conduct 1-on-1 guidance sessions.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                href="#live-ai-matcher"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Try Live AI Matcher</span>
                <Sparkles className="w-4 h-4 text-teal-400" />
              </a>
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs hover:shadow transition flex items-center justify-center gap-2"
              >
                <span>Sign Up as Mentee or Mentor</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>
            </div>

            {/* 1-Click Demo Launcher Bar */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 max-w-xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                ⚡ Evaluator Instant Test Access (No sign up required)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => handleQuickDemo('STUDENT')}
                  className="px-3 py-1.5 text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-lg transition flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span>Student Demo</span>
                </button>
                <button
                  onClick={() => handleQuickDemo('MENTOR')}
                  className="px-3 py-1.5 text-xs font-semibold bg-lavender-100 hover:bg-lavender-200 text-lavender-800 border border-lavender-300 rounded-lg transition flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-lavender-600" />
                  <span>Mentor Demo</span>
                </button>
                <button
                  onClick={() => handleQuickDemo('ADMIN')}
                  className="px-3 py-1.5 text-xs font-semibold bg-navy-100 hover:bg-navy-200 text-navy-800 border border-navy-300 rounded-lg transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-navy-600" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>

          </div>

          {/* Value Proposition Metrics Banner */}
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="text-center p-3 border-r border-slate-100 last:border-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">450+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Verified Pairings</div>
            </div>
            <div className="text-center p-3 sm:border-r border-slate-100 last:border-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 font-['Outfit']">94.8%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">AI Match Precision</div>
            </div>
            <div className="text-center p-3 border-r border-slate-100 last:border-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-lavender-600 font-['Outfit']">1,280+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Goals Achieved</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-['Outfit']">4.9 / 5.0</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Feedback Rating</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE INTERACTIVE AI MATCHER SANDBOX */}
      <section id="live-ai-matcher" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-3">
              <Brain className="w-3.5 h-3.5 text-teal-600" />
              <span>Interactive Algorithm Demonstration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-['Outfit']">
              Test the AI Mentor Matching Engine
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Select your academic discipline, career aspiration, and key skills to evaluate how our multi-factor scoring model identifies suitable mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Form Column */}
            <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-600" />
                <span>Simulate Student Profile</span>
              </h3>

              <form onSubmit={handleRunDemoMatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    College Major / Department
                  </label>
                  <select
                    value={demoMajor}
                    onChange={(e) => setDemoMajor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Data Science & Applied Statistics">Data Science & Applied Statistics</option>
                    <option value="Cloud Architecture & Distributed Systems">Cloud Architecture & Distributed Systems</option>
                    <option value="Cybersecurity & Defense Systems">Cybersecurity & Defense Systems</option>
                    <option value="Computer Engineering & Systems">Computer Engineering & Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Target Career Goal
                  </label>
                  <input
                    type="text"
                    value={demoCareerGoal}
                    onChange={(e) => setDemoCareerGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g. Machine Learning Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Skills You Want to Master (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={demoSkills}
                    onChange={(e) => setDemoSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g. PyTorch, System Design, Algorithms"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={matchingLoading}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow transition flex items-center justify-center gap-2"
                  >
                    {matchingLoading ? (
                      <span>Running Multi-Factor Match...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-teal-200" />
                        <span>Calculate Top Mentor Matches</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-lavender-50/70 border border-lavender-200 rounded-xl text-xs text-lavender-900 leading-relaxed">
                  <div className="font-semibold text-lavender-950 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-lavender-600" />
                    <span>Algorithmic Model Composition</span>
                  </div>
                  Matches combine Academic Taxonomy (35%), Jaccard Skill Overlap (30%), Career Semantic Fit (20%), and Mentor Experience & Availability (15%).
                </div>
              </form>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-lavender-600" />
                  <span>Real-Time Scored Recommendations</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {matches ? `${matches.length} Approved Mentors Evaluated` : 'Click Calculate to evaluate'}
                </span>
              </div>

              {!matches ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                  <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-700 font-semibold text-sm">Ready to Match</p>
                  <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                    Click "Calculate Top Mentor Matches" to run our modular compatibility algorithm against the live pool of mentors.
                  </p>
                  <button
                    onClick={handleRunDemoMatch}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition"
                  >
                    Run Demo Matching Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {matches.slice(0, 3).map((mentor, idx) => (
                    <div
                      key={mentor.mentorId}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={mentor.avatar}
                            alt={mentor.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-base">{mentor.name}</h4>
                              {idx === 0 && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                                  Top Match
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              {mentor.designation} • {mentor.organization}
                            </p>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-800 font-extrabold text-sm">
                            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                            <span>{mentor.matchScore}% Match</span>
                          </div>
                        </div>
                      </div>

                      {/* Rationale */}
                      <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                        <strong className="text-slate-800">AI Rationale: </strong>
                        {mentor.rationale}
                      </p>

                      {/* Skills Tags */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-500 mr-1">Expertise:</span>
                        {mentor.expertiseSkills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 3. FOUR CORE SYSTEM CAPABILITIES */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 font-['Outfit']">
              Complete Mentorship Lifecycle Architecture
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Built for universities, departments, and ambitious students who need structured accountability beyond casual chat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-105 transition">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">AI-Assisted Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Multi-attribute compatibility scoring analyzes academic majors, career ambitions, technical skill sets, and mentor availability.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-teal-700 flex items-center gap-1">
                <span>Objective compatibility</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-lavender-100 text-lavender-700 flex items-center justify-center mb-5 group-hover:scale-105 transition">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">Goal & Milestone Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Break large academic and career ambitions into clear, measurable milestone checklists with AI suggestions and deadline tracking.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-lavender-700 flex items-center gap-1">
                <span>Milestone breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-navy-100 text-navy-800 flex items-center justify-center mb-5 group-hover:scale-105 transition">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">1-on-1 Session Suite</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Request, confirm, and manage mentoring sessions with agenda topics, integrated Google Meet video links, and meeting notes.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-navy-800 flex items-center gap-1">
                <span>Orchestrated bookings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-105 transition">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">Progress Intelligence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automated detection flags stalled goals and highlights students needing attention before semester deadlines pass.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-amber-700 flex items-center gap-1">
                <span>Early intervention</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS (STUDENT & MENTOR JOURNEYS) */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-lavender-700">Clear Step-by-Step Flow</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 font-['Outfit']">
              How the System Operates
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A structured roadmap ensuring transparency and mutual accountability between students and mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Student Journey Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-50/50 via-white to-slate-50 border border-teal-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Student Mentee Journey</h3>
                  <p className="text-xs text-slate-500">From enrollment to career placement</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Profile & Skill Intake</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Define your major, GPA, career aspirations, and prioritized competencies.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">AI Compatibility Pairing</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Discover top-ranked mentors evaluated across technical and career domain overlap.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Actionable Milestone Tracking</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Create semester goals with auto-generated or custom step-by-step checklists.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">1-on-1 Guidance & Feedback</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Book sessions, review mentor rubrics, and implement concrete recommendations.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor Journey Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-lavender-50/50 via-white to-slate-50 border border-lavender-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-lavender-700 text-white flex items-center justify-center font-bold">
                  M
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Industry Mentor Journey</h3>
                  <p className="text-xs text-slate-500">Structured guidance without scheduling chaos</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-lavender-200 text-lavender-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Application & Credential Verification</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Register domain expertise, maximum mentee capacity, and professional background.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-lavender-200 text-lavender-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Aligned Cohort Assignment</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Get matched with students whose learning targets directly mirror your expertise.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-lavender-200 text-lavender-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Progress Oversight & Early Warnings</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Monitor mentee milestones and receive alerts when goals stall over 14 days.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-lavender-200 text-lavender-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Structured Feedback & Scoring</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Submit rubric evaluations (technical, communication) and track student growth.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. BENEFITS COMPARISON */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Mutual Value</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 font-['Outfit']">
              Why Colleges, Students & Mentors Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Benefits */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-teal-600" />
                <span>Benefits for College Students</span>
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>Personalized matching based on realistic skill overlaps, not random assignments.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>Actionable milestone templates that translate vague career advice into weekly tasks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>Direct booking links for Google Meet with structured meeting topic agendas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>Transparent progress records and verified mentor feedback to boost resume confidence.</span>
                </li>
              </ul>
            </div>

            {/* Mentor & College Benefits */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-lavender-600" />
                <span>Benefits for Mentors & Academic Institutions</span>
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lavender-600 mt-0.5 flex-shrink-0" />
                  <span>Zero administrative friction: clear mentee capacity caps and organized schedules.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lavender-600 mt-0.5 flex-shrink-0" />
                  <span>Early warning alerts when mentees stall, allowing timely intervention before exams.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lavender-600 mt-0.5 flex-shrink-0" />
                  <span>Institutional dashboard for college deans to monitor department-wide career outcomes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lavender-600 mt-0.5 flex-shrink-0" />
                  <span>Verifiable audit trail of mentor reviews, sessions completed, and satisfaction indexes.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SAMPLE TESTIMONIALS (CLEARLY MARKED DEMO CONTENT) */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Sample Demonstration Feedback from College Trial</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 font-['Outfit']">
              What Students & Faculty Say
            </h2>
            <p className="text-xs text-slate-400 mt-1 italic">
              *The following feedback items are representative demonstration samples created for platform testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "Having Dr. Elena Vance as my mentor transformed my focus. Breaking my LLM fine-tuning project into weekly milestone checklists kept me on track for internship applications."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                  AJ
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Alex Johnson</div>
                  <div className="text-[11px] text-slate-500">3rd Year B.Tech Computer Science</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "The structured rubric for sessions is what makes this platform stand out. I can give targeted feedback in 5 minutes after a call, and my students immediately know what to fix."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-lavender-700 text-white font-bold flex items-center justify-center text-xs">
                  EV
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Dr. Elena Vance</div>
                  <div className="text-[11px] text-slate-500">Principal AI Research Scientist</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "For university administrators, seeing real-time telemetry on pairing completion and stalled goals eliminates the black box of student career advising."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-navy-800 text-white font-bold flex items-center justify-center text-xs">
                  AP
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Dr. Arthur Pendelton</div>
                  <div className="text-[11px] text-slate-500">Dean of Mentorship & Student Career Success</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit']">
            Ready to Supercharge Student Career Guidance?
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Experience the platform immediately with our pre-seeded demonstration accounts or register your college cohort today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 shadow transition flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleQuickDemo('STUDENT')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-teal-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 1-Click Interactive Demo</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
