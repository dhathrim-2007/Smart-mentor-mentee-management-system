import React from 'react';
import { useAuthRole } from '../../context/AuthRoleContext';
import LongitudinalTrendChart from '../../components/LongitudinalTrendChart';
import {
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  FileText
} from 'lucide-react';

export default function VictimHistoryPage() {
  const { activeCase } = useAuthRole();

  const caseData = activeCase || {};
  const history = caseData.checkinHistory || [];
  const currentSvi = caseData.currentSvi || caseData.svi || 45;
  const prediction = caseData.prediction || 'STABLE';
  const predictionReason = caseData.predictionReason || '';

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
          Continuous Monitoring
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight mt-0.5">
          Check-in History & Longitudinal Trends
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Visualizes your distress trajectory across complaint, investigation, and trial milestones.
        </p>
      </div>

      {/* Responsive Longitudinal Chart (Never overflows horizontally on 360px) */}
      <LongitudinalTrendChart
        checkinHistory={history}
        prediction={prediction}
        predictionReason={predictionReason}
        currentScore={currentSvi}
      />

      {/* Sequential Session Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Detailed Check-in Log (Past Sessions)
        </h3>

        <div className="space-y-2.5">
          {history.map((chk, idx) => {
            const isLatest = idx === history.length - 1;
            return (
              <div
                key={chk.id || idx}
                className={`bg-white rounded-xl p-4 border transition-all ${
                  isLatest
                    ? 'border-gov-blue shadow-xs ring-1 ring-blue-200'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs font-mono ${
                      chk.missed
                        ? 'bg-red-100 text-red-700'
                        : chk.svi >= 75
                        ? 'bg-red-600 text-white'
                        : chk.svi >= 50
                        ? 'bg-orange-500 text-white'
                        : chk.svi >= 25
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}>
                      {chk.missed ? '✕' : chk.svi}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          {chk.label || `Check-in ${idx + 1}`}
                        </h4>
                        {isLatest && (
                          <span className="bg-gov-blue text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                            Latest
                          </span>
                        )}
                        {chk.missed && (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.2 rounded">
                            Missed
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{chk.date}</span>
                        </span>
                        {chk.daysAgo && <span>• {chk.daysAgo}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Indicator Pills */}
                  {!chk.missed ? (
                    <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                      <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        Mood: {chk.mood}/10
                      </span>
                      <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        Fear: {chk.safety}/10
                      </span>
                      <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        Sleep: {chk.sleep}/10
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-red-600 font-medium">
                      Citizen did not respond to automated reminder
                    </span>
                  )}
                </div>

                {/* Milestone Event or Notes */}
                {chk.event && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-gov-blue flex-shrink-0" />
                    <span><strong>Milestone:</strong> {chk.event}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
