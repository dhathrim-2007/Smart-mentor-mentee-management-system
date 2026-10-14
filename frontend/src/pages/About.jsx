import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Target,
  ShieldCheck,
  TrendingUp,
  Brain,
  Award,
  Users,
  CheckCircle2,
  HeartHandshake,
  GraduationCap
} from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-lavender-100 text-lavender-800 border border-lavender-200 mb-3">
            <Compass className="w-3.5 h-3.5 text-lavender-600" />
            <span>Mission, Vision & Platform Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Bridging the Higher Education Mentorship Gap
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Empowering every college student with tailored industry insights, transparent accountability, and measurable career milestones.
          </p>
        </div>

        {/* Problem Statement Card */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              !
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">The Problem Statement</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            In traditional university ecosystems, students often navigate complex career landscapes in silos. Existing mentorship initiatives suffer from:
          </p>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-sm text-slate-800 mb-1">Arbitrary Pairings</h4>
              <p className="text-xs text-slate-600">Students matched without analyzing skill overlap, technical domain synergies, or mentor availability.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-sm text-slate-800 mb-1">Lack of Accountability</h4>
              <p className="text-xs text-slate-600">No structured milestone frameworks or checklists; sessions dissolve into unfocused casual talks.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-sm text-slate-800 mb-1">Zero Progress Telemetry</h4>
              <p className="text-xs text-slate-600">College deans have no visibility into which students are lagging behind before critical graduation placement cycles.</p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Outfit']">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To democratize high-impact career navigation for undergraduate students across engineering and sciences, utilizing AI-assisted matching and structured progress rubrics.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-lavender-100 text-lavender-700 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Outfit']">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              A national higher-education network where every undergraduate student graduates with a verified portfolio of completed milestones and a supportive industry mentor network.
            </p>
          </div>
        </div>

        {/* Proposed Institutional Impact */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 font-['Outfit'] flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-teal-600" />
            <span>Proposed Institutional Impact</span>
          </h2>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              By combining quantitative compatibility metrics with transparent human review, our platform delivers measurable college project and startup outcomes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <span><strong>70% Reduction</strong> in administrative overhead for college career departments.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <span><strong>3.4x Higher Completion</strong> of semester projects via milestone breakdown.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <span><strong>Early Detection</strong> of at-risk students before placement exams.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <span><strong>Verifiable Feedback Records</strong> for student portfolio enhancement.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical AI Notice */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <h3 className="text-lg font-bold font-['Outfit']">Ethical AI Governance Notice</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">"AI assists. Humans decide."</strong> Our matching algorithm is a modular, deterministic heuristic model based on domain taxonomy, weighted Jaccard skill overlap, and mentor workload. 
            The platform does not fabricate AI decisions or replace the human empathy of dedicated faculty and industry mentors.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Algorithmic Demonstration Engine v1.2</span>
            <span>Extensible for OpenAI / Google Gemini LLM API</span>
          </div>
        </div>

      </div>
    </div>
  );
}
