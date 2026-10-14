import React from 'react';
import {
  Cpu,
  PhoneCall,
  Activity,
  Layers,
  ArrowRight,
  Shield,
  FileCheck,
  Users,
  Database,
  Lock,
  Workflow,
  Sparkles
} from 'lucide-react';

export default function ArchitecturePage() {
  const architecturalLayers = [
    {
      step: 'Stage 1',
      title: 'Multi-Channel Citizen Ingestion',
      icon: PhoneCall,
      color: 'border-blue-300 bg-blue-50 text-blue-800',
      items: [
        'National Helpline 14566 IVRS Gateway',
        'Direct Web Grievance Portal',
        'Mobile Citizen Application',
        'Integrated Chatbot & AI Voice Agent'
      ],
      desc: 'Seamless ingestion supporting multiple Indian languages with audio-streaming and text narrative inputs.'
    },
    {
      step: 'Stage 2',
      title: 'Interaction & Acoustic Processing',
      icon: Activity,
      color: 'border-indigo-300 bg-indigo-50 text-indigo-800',
      items: [
        'Automatic Speech Recognition (ASR) & Transcription',
        'Acoustic Telemetry: Hesitation Pauses & Silence Ratio',
        'Pitch Variability & Voice Tremor (Jitter) Extraction',
        'PII Scrubbing & De-identification Engine'
      ],
      desc: 'Raw audio is processed locally to extract acoustic distress markers without storing biometric voiceprints.'
    },
    {
      step: 'Stage 3',
      title: 'Modular AI Stress & Vulnerability Engine',
      icon: Cpu,
      color: 'border-purple-300 bg-purple-50 text-purple-800',
      items: [
        'Multi-factor Lexical Distress Scorer (Fear, Threat, Despair)',
        'Temporal Urgency & Immediacy Classifier',
        'Weighted Stress Vulnerability Index (SVI: 0-100)',
        'Explainable Feature Attribution Matrix'
      ],
      desc: 'Deterministic heuristics + NLP embeddings compute transparent SVI and categorize into LOW, MODERATE, HIGH, or CRITICAL.'
    },
    {
      step: 'Stage 4',
      title: 'Support Recommendation Engine',
      icon: FileCheck,
      color: 'border-amber-300 bg-amber-50 text-amber-800',
      items: [
        'Statutory PoA Protection Mapping',
        'Tele-MANAS & Clinical Counselling Referral',
        'Special SC/ST Police Cell Escalation',
        'Witness Protection Scheme Eligibility Rule-check'
      ],
      desc: 'Translates risk scores and detected markers into prioritized, actionable statutory assistance pathways.'
    },
    {
      step: 'Stage 5',
      title: 'Human Officer Triage & Multi-Agency Dispatch',
      icon: Users,
      color: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      items: [
        'Real-time Officer Intelligence Dashboard',
        'Critical Alert Rapid Response Modal (15-min SLA)',
        'Immutable Chain-of-Custody Audit Log',
        'District Magistrate & Police Liaison Bridges'
      ],
      desc: 'Authorized human officers review AI indicators, verify context, assign specialized personnel, and log actions.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-gov-blue text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
          <Workflow className="w-3.5 h-3.5" />
          <span>System Design & Technical Architecture</span>
        </div>
        <h1 className="text-3xl font-black text-gov-navy tracking-tight">
          NHAA 14566 Real-Time Stress & Trauma Assessment Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          End-to-end data pipeline from multi-channel citizen ingestion to acoustic/NLP evaluation, risk categorization, and multi-agency response dispatch.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {architecturalLayers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group"
              >
                {/* Connector Arrow for desktop */}
                {idx < architecturalLayers.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white border border-slate-300 rounded-full p-1 text-slate-400">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                      {layer.step}
                    </span>
                    <div className={`p-2 rounded-xl border ${layer.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {layer.title}
                  </h2>

                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {layer.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  {layer.items.map((item, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-[11px] text-slate-700">
                      <span className="text-gov-blue font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Deep Dive: Mathematical Formulation of SVI */}
      <div className="bg-gov-navy text-white rounded-2xl p-8 shadow-xl border border-blue-900 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center text-amber-300">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Stress Vulnerability Index (SVI) Formulation</h2>
            <p className="text-xs text-slate-300">Transparent, weighted multi-factor composite risk equation</p>
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700 font-mono text-xs text-slate-200 overflow-x-auto space-y-2">
          <div className="text-amber-300 font-bold">
            SVI = w_threat * T + w_fear * F + w_distress * D + w_urgency * U + w_acoustic * A
          </div>
          <div className="text-slate-400 text-[11px] pt-1 space-y-1">
            <div>• w_threat = 0.30 : Weight for explicit intimidation, weapons & retaliation mentions</div>
            <div>• w_fear = 0.25 : Weight for acute terror & home insecurity markers</div>
            <div>• w_distress = 0.20 : Weight for insomnia, anxiety & psychological despair signals</div>
            <div>• w_urgency = 0.15 : Weight for temporal immediacy ("tonight", "right now", "emergency")</div>
            <div>• w_acoustic = 0.10 : Weight for acoustic signals (pause ratio &gt; 1.8s, pitch jitter &gt; 50Hz)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-xl">
            <span className="font-bold text-emerald-400 block mb-1">LOW (0 – 24)</span>
            <p className="text-slate-300 text-[11px]">
              Routine informational resources, handbook dispatch, and standard grievance tracking.
            </p>
          </div>
          <div className="bg-amber-950/60 border border-amber-500/40 p-3 rounded-xl">
            <span className="font-bold text-amber-400 block mb-1">MODERATE (25 – 49)</span>
            <p className="text-slate-300 text-[11px]">
              Supportive tele-counselling referral, legal aid awareness, and case manager check-in.
            </p>
          </div>
          <div className="bg-orange-950/60 border border-orange-500/40 p-3 rounded-xl">
            <span className="font-bold text-orange-400 block mb-1">HIGH (50 – 74)</span>
            <p className="text-slate-300 text-[11px]">
              Priority counselling within 24h, court advocate assignment, and local police safety check.
            </p>
          </div>
          <div className="bg-red-950/60 border border-red-500/40 p-3 rounded-xl">
            <span className="font-bold text-red-400 block mb-1">CRITICAL (75 – 100)</span>
            <p className="text-slate-300 text-[11px]">
              Immediate human officer escalation, emergency police QRT dispatch, and witness protection review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
