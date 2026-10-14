import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Search,
  Scale,
  Heart,
  IndianRupee,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function VictimCaseStageTracker({ currentStage = 'Investigation' }) {
  const { t } = useLanguage();

  const stages = [
    { id: 'Complaint Registration', label: t('stageComplaint') || 'Complaint', icon: FileText },
    { id: 'Investigation', label: t('stageInvestigation') || 'Investigation', icon: Search },
    { id: 'Trial', label: t('stageTrial') || 'Trial', icon: Scale },
    { id: 'Rehabilitation', label: t('stageRehabilitation') || 'Rehabilitation', icon: Heart },
    { id: 'Compensation', label: t('stageCompensation') || 'Compensation', icon: IndianRupee },
    { id: 'Follow-up', label: t('stageFollowup') || 'Follow-up', icon: Activity }
  ];

  const currentIdx = stages.findIndex(s => s.id.toLowerCase() === currentStage.toLowerCase()) !== -1
    ? stages.findIndex(s => s.id.toLowerCase() === currentStage.toLowerCase())
    : 1;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
            {t('stageTrackerTitle') || 'Legal & Rehabilitation Progress'}
          </span>
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5 mt-0.5">
            <span>Current Stage:</span>
            <span className="text-gov-blue underline decoration-gov-blue/40">
              {stages[currentIdx]?.label || currentStage}
            </span>
          </h3>
        </div>
        <span className="bg-blue-50 text-gov-blue text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
          Step {currentIdx + 1} of 6
        </span>
      </div>

      {/* Responsive Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className="bg-gov-blue h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentIdx + 1) / stages.length) * 100}%` }}
        ></div>
      </div>

      {/* Stepper Display: Horizontal scrollable on small mobile, clean flex on desktop */}
      <div className="flex items-center justify-between pt-1 overflow-x-auto scrollbar-none gap-1 sm:gap-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div
              key={stage.id}
              className={`flex flex-col items-center flex-shrink-0 min-w-[50px] sm:min-w-[64px] text-center ${
                isCurrent ? 'scale-105' : ''
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-gov-blue text-white ring-2 ring-blue-300 shadow'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>
              <span
                className={`text-[9px] sm:text-[10px] mt-1 line-clamp-1 ${
                  isCurrent
                    ? 'font-bold text-gov-blue'
                    : isDone
                    ? 'text-slate-600 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
