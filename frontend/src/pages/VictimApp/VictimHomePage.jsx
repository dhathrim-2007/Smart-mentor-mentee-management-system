import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import VictimCaseStageTracker from '../../components/VictimCaseStageTracker';
import SviGauge from '../../components/SviGauge';
import {
  Activity,
  ClipboardCheck,
  Calendar,
  PhoneCall,
  UserCheck,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Lock
} from 'lucide-react';

export default function VictimHomePage() {
  const { t } = useLanguage();
  const { activeCase } = useAuthRole();

  const caseData = activeCase || {};
  const currentSvi = caseData.currentSvi || caseData.svi || 45;
  const stage = caseData.stage || 'Investigation';
  const prediction = caseData.prediction || 'STABLE';

  // Calm supportive messaging
  let calmMessage = t('calmLow');
  let statusBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';

  if (currentSvi >= 75) {
    calmMessage = t('calmCritical');
    statusBadgeColor = 'bg-red-50 text-red-800 border-red-200';
  } else if (currentSvi >= 50) {
    calmMessage = t('calmElevated');
    statusBadgeColor = 'bg-orange-50 text-orange-800 border-orange-200';
  } else if (currentSvi >= 25) {
    calmMessage = t('calmMod');
    statusBadgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Welcome & Reassurance Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
            National Helpline Against Atrocities (NHAA 14566)
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight mt-0.5">
            {t('victimGreeting')}, Citizen
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            {t('victimHomeSubtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-end">
          <Link
            to="/victim/support"
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors min-h-[44px]"
          >
            <HeartHandshake className="w-4 h-4 text-gov-blue" />
            <span>Need Help?</span>
          </Link>
        </div>
      </div>

      {/* Case Stage Progression Tracker */}
      <VictimCaseStageTracker currentStage={stage} />

      {/* Primary Action Card: Periodic Check-in Callout */}
      <div className="bg-gradient-to-r from-gov-navy via-blue-900 to-gov-navy text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-md">
            <div className="inline-flex items-center space-x-1.5 bg-blue-400/20 text-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('nextCheckinDue')}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {t('checkinReminderTitle') || 'Periodic Well-being Check-in'}
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed">
              Takes just 2 minutes to answer 5 simple questions. Helps your counsellor provide timely legal, medical, and protection support.
            </p>
          </div>

          <Link
            to="/victim/checkin"
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 flex-shrink-0 min-h-[48px]"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>{t('startCheckinBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Current Well-being & Reassurance Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Calm Status Card */}
        <div className="md:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Current Support Status
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Updated: Today
            </span>
          </div>

          <div className={`p-4 rounded-xl border ${statusBadgeColor} flex items-start space-x-3`}>
            <Activity className="w-5 h-5 flex-shrink-0 mt-0.5 text-gov-blue" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Well-being Observation
              </h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {calmMessage}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Trajectory</span>
              <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-gov-blue" />
                <span>{prediction}</span>
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Completed Check-ins</span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {caseData.checkinHistory?.length || 5} sessions
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI triage indicator — strictly non-diagnostic. Humans oversee all support.</span>
          </div>
        </div>

        {/* Right: Assigned Counsellor Contact */}
        <div className="md:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('counsellorCardTitle')}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            <div className="flex items-center space-x-3 mt-3">
              <div className="w-12 h-12 rounded-full bg-gov-lightBlue flex items-center justify-center text-gov-navy font-black text-sm border border-gov-blue/20">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gov-navy">
                  {caseData.assignedOfficer || 'Dr. Anjali Deshmukh'}
                </h3>
                <p className="text-xs text-slate-500">
                  Designated District Counsellor
                </p>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium inline-block mt-0.5">
                  Available on weekdays 9am-6pm
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Link
              to="/victim/support"
              className="w-full flex items-center justify-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-colors min-h-[44px]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t('requestCallBtn')}</span>
            </Link>

            <a
              href="tel:14566"
              className="w-full flex items-center justify-center space-x-2 text-slate-600 hover:text-red-700 font-bold text-xs py-2 text-center"
            >
              <span>Emergency 24x7: Call 14566</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/victim/checkin"
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-gov-blue hover:shadow-xs transition-all text-center space-y-1 min-h-[70px] flex flex-col justify-center items-center"
        >
          <ClipboardCheck className="w-5 h-5 text-gov-blue" />
          <span className="text-xs font-bold text-slate-800 block">Check-in</span>
        </Link>
        <Link
          to="/victim/history"
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-gov-blue hover:shadow-xs transition-all text-center space-y-1 min-h-[70px] flex flex-col justify-center items-center"
        >
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800 block">History & Trends</span>
        </Link>
        <Link
          to="/victim/support"
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-gov-blue hover:shadow-xs transition-all text-center space-y-1 min-h-[70px] flex flex-col justify-center items-center"
        >
          <HeartHandshake className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800 block">Support Services</span>
        </Link>
        <Link
          to="/victim/profile"
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-gov-blue hover:shadow-xs transition-all text-center space-y-1 min-h-[70px] flex flex-col justify-center items-center"
        >
          <Lock className="w-5 h-5 text-slate-600" />
          <span className="text-xs font-bold text-slate-800 block">Privacy & Data</span>
        </Link>
      </div>
    </div>
  );
}
