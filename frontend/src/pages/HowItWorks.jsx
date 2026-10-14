import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Award
} from 'lucide-react';

export default function HowItWorks() {
  const [roleMode, setRoleMode] = useState('student');

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy-100 text-navy-800 border border-navy-200 mb-3">
            <Compass className="w-3.5 h-3.5 text-navy-600" />
            <span>Structured Guidance Walkthrough</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            How Smart AI Mentor Works
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A transparent, accountable four-phase framework designed for academic progress and career readiness.
          </p>

          {/* Toggle Role Selector */}
          <div className="mt-8 inline-flex p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => setRoleMode('student')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                roleMode === 'student'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>For College Students (Mentees)</span>
            </button>
            <button
              onClick={() => setRoleMode('mentor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                roleMode === 'mentor'
                  ? 'bg-white text-lavender-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-lavender-600" />
              <span>For Industry & Faculty Mentors</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 mb-12">
          
          {roleMode === 'student' ? (
            <div className="space-y-10 relative before:absolute before:inset-0 before:left-7 before:w-0.5 before:bg-teal-100 hidden sm:block">
              {/* Step 1 */}
              <div className="relative flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border-2 border-teal-500 text-teal-700 font-extrabold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                  01
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Intake & Profile Setup</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Create your profile in under 2 minutes. Enter your major, year, GPA, target career aspirations, and prioritized skill competencies (e.g. Deep Learning, Distributed Systems, Cloud Architecture).
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Skill taxonomy mapping ensures exact compatibility</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border-2 border-teal-500 text-teal-700 font-extrabold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                  02
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">AI-Assisted Mentor Matching</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Our modular algorithm calculates multi-attribute compatibility scores across all approved mentors. The system presents scored matches complete with clear explanations of why each mentor fits your trajectory.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>View rationale, shared expertise, and verified industry background</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border-2 border-teal-500 text-teal-700 font-extrabold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                  03
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Milestone Goals & Accountability</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Break long-term ambitions into concrete weekly milestones. Use one-click AI milestone suggestions or create custom task lists. Progress bars update automatically as you tick off completed items.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Automated warnings alert you if a milestone is stalled over 14 days</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border-2 border-teal-500 text-teal-700 font-extrabold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                  04
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">1-on-1 Sessions & Verified Feedback</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Request 30 or 45-minute syncs with concrete agendas. Join seamlessly via Google Meet links. After each session, receive structured rubrics and actionable next steps from your mentor.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Build a permanent record of verified mentorship progress</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-10 relative before:absolute before:inset-0 before:left-7 before:w-0.5 before:bg-lavender-200 hidden sm:block">
              {/* Step 1 */}
              <div className="relative flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-lavender-50 border-2 border-lavender-600 text-lavender-800 font-extrabold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                  01
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Registration & Expertise Profile</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Register with your organization, current designation, domain specialization, and set your maximum mentee cap (e.g. 3-5 students). Administrator verification ensures institutional credibility.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-lavender-800 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Protects your calendar by capping mentee limits</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-lavender-50 border-2 border-lavender-600 text-lavender-800 font-extrabold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                  02
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Aligned Cohort Matching</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Receive mentees whose academic trajectory and technical goals directly intersect with your background. No mismatched guidance or random pairings.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-lavender-800 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Review mentee profiles, GPA, and goals prior to first sync</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-lavender-50 border-2 border-lavender-600 text-lavender-800 font-extrabold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                  03
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Streamlined Session Orchestration</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Accept or reschedule incoming student booking requests with a single click. Every meeting request includes required agenda topics so discussions remain focused and high-yield.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-lavender-800 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Automatic Google Meet link generation and instant student notifications</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-lavender-50 border-2 border-lavender-600 text-lavender-800 font-extrabold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                  04
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Structured Rubric Evaluation</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Submit concise, rubric-based feedback in under 3 minutes: score technical comprehension, communication clarity, and assign 2-3 specific action items for the student's next check-in.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-lavender-800 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Automatic progress tracking marks milestones as verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile view fallback */}
          <div className="sm:hidden space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-teal-600">Step 1: Intake & Profile</span>
              <p className="text-xs text-slate-600 mt-1">Define discipline, goals, and prioritized skill competencies.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-teal-600">Step 2: AI Compatibility Pairing</span>
              <p className="text-xs text-slate-600 mt-1">Match based on domain taxonomy and Jaccard skill overlap.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-teal-600">Step 3: Milestone Decompositions</span>
              <p className="text-xs text-slate-600 mt-1">Track goals with step-by-step checklists and velocity alerts.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-teal-600">Step 4: 1-on-1 Sessions & Rubrics</span>
              <p className="text-xs text-slate-600 mt-1">Conduct Google Meet syncs and receive structured mentor evaluations.</p>
            </div>
          </div>

        </div>

        {/* CTA Bar */}
        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow transition"
          >
            <span>Start Your Mentorship Journey</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </Link>
        </div>

      </div>
    </div>
  );
}
