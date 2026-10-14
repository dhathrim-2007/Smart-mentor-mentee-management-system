import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  PhoneCall,
  Shield,
  Activity,
  HeartHandshake,
  Scale,
  Stethoscope,
  ShieldAlert,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  Eye,
  FileText,
  AlertTriangle,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();

  const supportCards = [
    {
      title: 'Counselling & Trauma Care',
      desc: 'Immediate psycho-social support, empathetic trauma relief, and licensed professional tele-counselling.',
      icon: HeartHandshake,
      color: 'border-blue-200 bg-blue-50/50 text-blue-700'
    },
    {
      title: 'Statutory Legal Aid',
      desc: 'Free legal representation under PoA Act, assistance with charge-sheet tracking, and protection petitions.',
      icon: Scale,
      color: 'border-indigo-200 bg-indigo-50/50 text-indigo-700'
    },
    {
      title: 'Emergency Medical Support',
      desc: 'Prioritized medical aid, medico-legal documentation, and emergency ambulance coordination.',
      icon: Stethoscope,
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-700'
    },
    {
      title: 'Police Intervention Liaison',
      desc: 'Direct bridge to Special SC/ST Protection Cells, District Nodal Officers, and local Station House Officers.',
      icon: Shield,
      color: 'border-amber-200 bg-amber-50/50 text-amber-700'
    },
    {
      title: 'Witness Protection Scheme',
      desc: 'Judicial protection measures against intimidation, threat surveillance, and secure safe-house relocation.',
      icon: ShieldAlert,
      color: 'border-red-200 bg-red-50/50 text-red-700'
    },
    {
      title: 'Welfare & Rehabilitation',
      desc: 'Expedited processing of statutory relief funds, compensation schemes, and social reintegration aid.',
      icon: Users,
      color: 'border-purple-200 bg-purple-50/50 text-purple-700'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      detail: 'Available via web text, voice speech-to-text, or IVRS telephone line.'
    },
    {
      step: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      detail: 'Analyzes fear markers, threat perception, acoustic tremors & pauses.'
    },
    {
      step: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      detail: 'Evaluated into LOW, MODERATE, HIGH, or CRITICAL risk categories.'
    },
    {
      step: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      detail: 'Generates specialized triage plan (counselling, legal, police, protection).'
    },
    {
      step: '05',
      title: t('step5Title'),
      desc: t('step5Desc'),
      detail: 'Authorized human officers review, assign personnel, and dispatch response.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gov-lightBlue/50 via-white to-slate-50 border-b border-slate-200 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* MoSJE Official Tag */}
              <div className="inline-flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-300 shadow-sm text-xs text-gov-navy font-semibold">
                <img src="/emblem.svg" alt="Emblem" className="w-4 h-4 object-contain" />
                <span>Ministry of Social Justice and Empowerment • MoSJE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gov-navy tracking-tight leading-tight">
                {t('heroTitle')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl">
                {t('heroSubtitle')}
              </p>

              {/* National Helpline 14566 Callout Card */}
              <div className="bg-white p-4 rounded-xl border border-gov-blue/20 shadow-md inline-block max-w-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-12 h-12 rounded-full bg-gov-blue text-white flex items-center justify-center flex-shrink-0">
                      <PhoneCall className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        National Helpline Against Atrocities
                      </span>
                      <span className="text-2xl font-black text-gov-navy font-mono">
                        14566
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold block">
                        Toll-Free • 24x7 Multi-lingual Ingestion
                      </span>
                    </div>
                  </div>
                  <a
                    href="tel:14566"
                    className="w-full sm:w-auto bg-gov-navy hover:bg-gov-blue text-white font-bold text-xs px-4 py-2.5 rounded-lg text-center transition-colors"
                  >
                    Call Now
                  </a>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/assess"
                  className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <Activity className="w-4 h-4" />
                  <span>{t('startAssessmentBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/demo"
                  className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm px-5 py-3.5 rounded-xl shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Judge Demo Sandbox</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-colors"
                >
                  <span>Officer Portal</span>
                </Link>
              </div>

              {/* Non-Diagnostic Quick Note */}
              <div className="flex items-center space-x-2 text-xs text-slate-500 pt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Ethical AI Governance: Support triage only • No automated psychiatric diagnosis • Human-in-the-loop.
                </span>
              </div>
            </div>

            {/* Right Hero Graphic: Live SVI Triage Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                      NHAA Real-Time SVI Engine
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                    PROTOTYPE ACTIVE
                  </span>
                </div>

                {/* Interactive preview stats */}
                <div className="mt-4 space-y-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        Evaluated Linguistic Distress
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        Threat Perception + Acute Fear
                      </span>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full">
                      CRITICAL / HIGH
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        Acoustic Speech Analysis
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        Pauses & Pitch Jitter Telemetry
                      </span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
                      84 Hz Variance
                    </span>
                  </div>

                  <div className="bg-gov-navy text-white p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">Stress Vulnerability Index (SVI)</span>
                      <span className="font-mono text-amber-300 font-bold">72 / 100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <p className="text-[11px] text-slate-300 pt-1">
                      Automated triage recommends priority counselling, witness protection assessment, and legal aid.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                    <span>Multi-channel Ingestion:</span>
                    <div className="flex space-x-1.5 font-semibold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">Voice/IVRS</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">Web</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">Mobile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-gov-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            System Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy mt-3 tracking-tight">
            {t('howItWorks')}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A transparent, 5-stage triage process ensuring rapid response while preserving citizen dignity and confidentiality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-2xl font-black text-gov-blue/20 block font-mono mb-2">
                  {step.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available Support Services Cards */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-gov-blue uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">
              Integrated Redressal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy mt-3 tracking-tight">
              {t('availableSupport')}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Based on the Stress Vulnerability Index and flagged indicators, the system maps victims to approved statutory services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-gov-blue/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{card.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{card.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-gov-blue">
                    <span>MoSJE Scheme Provision</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy, Ethics & Governance Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gov-navy text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-blue-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-900/60 px-3 py-1 rounded-full text-xs text-amber-300 font-semibold border border-blue-800">
                <Lock className="w-3.5 h-3.5" />
                <span>Privacy by Design & DPDP Compliance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t('privacyTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('privacyDesc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs text-slate-200">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Explicit Informed Consent</strong>
                    Citizens retain full ownership; no coercive or pre-selected consent.
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Strict PII Masking</strong>
                    Complainant identity is masked (e.g. A*** R*****) in all operator views.
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Non-Diagnostic Boundaries</strong>
                    Algorithms evaluate risk tiers, never claiming psychiatric diagnosis.
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Immutable Audit Logging</strong>
                    Every officer review and support allocation is permanently stamped.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/80 p-6 rounded-xl border border-slate-700 text-center space-y-4">
              <div className="w-16 h-16 bg-gov-blue/40 rounded-full flex items-center justify-center mx-auto text-amber-300 border border-blue-500/30">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                "AI assists. Humans decide."
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The Department of Social Justice and Empowerment ensures that artificial intelligence serves solely as a triage accelerator. Final welfare and protection decisions rest exclusively with authorized human officers.
              </p>
              <div className="pt-2">
                <Link
                  to="/responsible-ai"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 hover:text-amber-200"
                >
                  <span>Explore Responsible AI Framework</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
