import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Eye,
  AlertTriangle,
  FileText,
  Heart,
  Scale,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function ResponsibleAiPage() {
  const ethicalPillars = [
    {
      title: 'Human-in-the-Loop Governance',
      desc: 'AI provides triage and prioritization signals; final welfare, legal, and protective actions are authorized strictly by designated human officers.',
      icon: UserCheck
    },
    {
      title: 'Non-Diagnostic Boundaries',
      desc: 'The platform categorically does NOT diagnose psychiatric conditions, PTSD, or clinical disorders. Outputs are restricted to risk-vulnerability indicators.',
      icon: ShieldCheck
    },
    {
      title: 'Explicit Informed Consent',
      desc: 'Citizens are clearly notified before submitting narratives. Consent is voluntary, unbundled, and non-deceptive in compliance with the DPDP Act.',
      icon: FileText
    },
    {
      title: 'Data Minimization & PII Scrubbing',
      desc: 'Citizen names, phone numbers, and precise addresses are automatically redacted or masked in operator views. Raw audio recordings are ephemeral.',
      icon: Lock
    },
    {
      title: 'Transparent Explainability',
      desc: 'Observable linguistic and acoustic weights (fear, threat, pauses, jitter) are surfaced transparently to officers, preventing black-box opacity.',
      icon: Eye
    },
    {
      title: 'Multilingual & Dialect Fairness',
      desc: 'Triage rules are calibrated across regional languages (Telugu, Hindi, Tamil, Marathi, Bengali, etc.) to prevent linguistic or geographical bias.',
      icon: Scale
    },
    {
      title: 'Emergency Life-Safety Escalation',
      desc: 'Expressions of acute lethal danger or self-harm immediately trigger priority human escalation, bypassing standard queue wait times.',
      icon: AlertTriangle
    },
    {
      title: 'Immutable Audit Trail',
      desc: 'Every assessment, review, support dispatch, and status transition is recorded with timestamp and operator badge for full legal accountability.',
      icon: Clock
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-blue-900">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-900/60 px-3.5 py-1.5 rounded-full text-xs text-amber-300 font-bold border border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MoSJE Ethical AI Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Responsible AI & Trauma-Informed Ethics
          </h1>
          <p className="text-base text-slate-200 leading-relaxed font-medium">
            Deploying algorithmic triage with profound sensitivity to victim dignity, procedural justice, and statutory safeguards under the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act.
          </p>
          <div className="pt-2">
            <span className="inline-block bg-white text-gov-navy font-black text-sm px-4 py-2 rounded-xl shadow">
              "AI assists. Humans decide."
            </span>
          </div>
        </div>
      </div>

      {/* 8 Ethical Pillars Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gov-navy tracking-tight">
            Core Principles of Ethical Triage
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            How the NHAA assessment module guarantees trust, safety, and accountability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {ethicalPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-gov-blue/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gov-lightBlue text-gov-navy flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold mt-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enforced by Policy</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison: Support Triage vs Medical Diagnosis */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gov-navy tracking-tight">
          Clear Boundary: Support & Triage vs. Clinical Diagnosis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-emerald-900 text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>What This AI Platform DOES:</span>
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Evaluates textual and acoustic distress indicators (fear, threats, pauses, tremor).</li>
              <li>• Assigns a transparent Stress Vulnerability Index (SVI) between 0 and 100.</li>
              <li>• Categorizes incoming grievances into operational priority queues (LOW, MODERATE, HIGH, CRITICAL).</li>
              <li>• Recommends statutory welfare, legal aid, counselling, or witness protection channels.</li>
              <li>• Flags immediate emergencies for rapid 15-minute human officer intervention.</li>
            </ul>
          </div>

          <div className="bg-red-50/70 border border-red-300 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-red-900 text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-700" />
              <span>What This AI Platform DOES NOT DO:</span>
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Does NOT make psychiatric diagnoses (depression, anxiety disorders, PTSD).</li>
              <li>• Does NOT replace certified clinical psychologists or medical professionals.</li>
              <li>• Does NOT take automated punitive or legal actions without human judicial review.</li>
              <li>• Does NOT store permanent voiceprints or facial biometrics.</li>
              <li>• Does NOT penalize victims whose dialects or speech cadences differ from standard baselines.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
