import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Target,
  Calendar,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ListOrdered,
  Users
} from 'lucide-react';

export default function Features() {
  const [activeTab, setActiveTab] = useState('matching');

  const featureTabs = [
    { id: 'matching', label: 'AI Mentor Matching', icon: Brain },
    { id: 'goals', label: 'Goal Setting & Milestones', icon: Target },
    { id: 'sessions', label: '1-on-1 Sessions', icon: Calendar },
    { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
    { id: 'feedback', label: 'Feedback Rubrics', icon: MessageSquare }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Comprehensive Mentorship Suite
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Every feature designed to elevate college students from academic confusion to confident industry-ready professionals.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Feature Content Showcase */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 transition-all">
          
          {activeTab === 'matching' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Precision Compatibility</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
                  AI-Assisted Mentor Matching
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Eliminate random pairings. Our modular matching algorithm computes multi-dimensional compatibility scores based on four core criteria:
                </p>
                <div className="space-y-3 pt-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Academic Domain Taxonomy (35%):</strong> Evaluates alignment between student majors and mentor professional domains.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Jaccard Skill Overlap (30%):</strong> Measures exact and semantic overlap between skills sought and mentor expertise.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Career Goal Alignment (20%):</strong> Analyzes student career descriptions against industry verticals.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Workload & Availability (15%):</strong> Protects mentor time by capping maximum mentee limits.</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-teal-600" />
                    <span className="text-xs font-bold uppercase text-slate-700">Algorithmic Scoring Output</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    94% Composite
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Domain Alignment</span>
                      <span className="text-teal-700">100%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Skill Set Overlap (Jaccard)</span>
                      <span className="text-teal-700">92%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Career Path Semantic Fit</span>
                      <span className="text-teal-700">88%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Mentor Capacity & Rating Factor</span>
                      <span className="text-teal-700">96%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-lavender-600">Accountability Structure</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
                  Goal Setting & Milestone Decomposition
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Transform abstract semester aspirations into actionable step-by-step checklists. With our AI milestone generator, students get tailored checklists for their discipline.
                </p>
                <div className="space-y-3 pt-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-lavender-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Categorized Objectives:</strong> Academic, Technical Skill, Capstone Project, or Career Interview prep.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-lavender-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Interactive Checklist:</strong> Toggling milestones automatically calculates weighted progress percentage.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-lavender-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Target Deadlines:</strong> Keep students accountable to semester milestones and internship application cycles.</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-sm text-slate-900 mb-1">
                  Sample: Complete Transformer Fine-Tuning Project
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 text-xs">
                    <div className="w-4 h-4 rounded bg-teal-500 text-white flex items-center justify-center text-[10px]">✓</div>
                    <span className="line-through text-slate-400">Data gathering & tokenization preprocessing</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 text-xs">
                    <div className="w-4 h-4 rounded bg-teal-500 text-white flex items-center justify-center text-[10px]">✓</div>
                    <span className="line-through text-slate-400">HuggingFace PEFT & QLoRA training script setup</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 text-xs">
                    <div className="w-4 h-4 rounded border border-slate-300"></div>
                    <span className="text-slate-700 font-medium">Benchmark model evaluations and ROUGE scoring</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 text-xs">
                    <div className="w-4 h-4 rounded border border-slate-300"></div>
                    <span className="text-slate-700 font-medium">Deploy FastAPI demo endpoint with GPU acceleration</span>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Current Progress: 50%</span>
                  <span className="text-teal-600 font-semibold">2 of 4 Completed</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-navy-600">Seamless Collaboration</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
                  1-on-1 Mentoring Suite
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Eliminate back-and-forth email scheduling. Students submit session requests with concrete topics and agendas; mentors confirm, reschedule, or complete with one click.
                </p>
                <div className="space-y-3 pt-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Integrated Video Meeting Links:</strong> Instant Google Meet links attached to confirmed sessions.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Agenda Topic Validation:</strong> Requires clear topic descriptions so sessions are productive and prepared.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Session Logs & Archive:</strong> Complete history of discussions and shared mentor resources.</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="p-4 bg-white rounded-xl border border-teal-200 shadow-2xs mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">CONFIRMED</span>
                    <span className="text-xs text-slate-500">Thursday, 3:00 PM</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">LLM Fine-Tuning Hyperparameters Review</h4>
                  <p className="text-xs text-slate-500 mt-1">Mentor: Dr. Elena Vance • 45 Minutes</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-teal-700 font-semibold">meet.google.com/sih-ment-conf</span>
                    <button className="px-2.5 py-1 text-xs font-semibold bg-teal-600 text-white rounded-lg">Join Call</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Early Intervention</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
                  Progress Intelligence & Velocity Alerts
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Real-time telemetry detects when students fall behind. Automated algorithms flag stagnant goals and prioritize students who require unblocking support.
                </p>
                <div className="space-y-3 pt-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Momentum Status:</strong> Classifies student velocity as High Momentum, Steady, or Needs Attention.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Stagnant Milestone Detection:</strong> Flags goals with zero updates exceeding 14 calendar days.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Executive Briefings:</strong> Generates automated weekly progress digests for college administrators.</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase mb-1">
                    <span>⚠️ Attention Required Flag</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Student has 1 milestone stalled over 18 days: "Master Dynamic Programming Patterns". Recommended action: Schedule 15-minute unblocking call.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Multi-Criteria Rubric</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
                  Structured Feedback & Rating Rubrics
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Mentors provide verified, multi-criteria evaluations (Technical Skills, Communication, Qualitative Remarks) along with specific actionable next steps for the student.
                </p>
                <div className="space-y-3 pt-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>5-Star Multi-Criteria Ratings:</strong> Technical competence and soft-skills communication scored separately.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Actionable Next Steps:</strong> Explicit mentor checklist items for student to complete prior to next sync.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Permanent Growth Record:</strong> Students build verified mentorship testimonials to share on portfolios.</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Mentor Evaluation</span>
                    <span className="text-xs font-bold text-amber-500">★★★★★ (5.0)</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "Alex demonstrated strong command over attention mechanisms and quantization trade-offs."
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-xs">
                    <strong className="text-slate-800 block mb-1">Actionable Next Steps:</strong>
                    <span className="text-slate-600">1. Document architecture trade-offs. 2. Practice mock interview questions.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow transition"
          >
            <span>Experience All Features Now</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </Link>
        </div>

      </div>
    </div>
  );
}
