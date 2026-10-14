import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthRole } from '../context/AuthRoleContext';
import {
  Sparkles,
  Smartphone,
  UserCheck,
  Shield,
  BarChart2,
  Sliders,
  ChevronDown,
  Check
} from 'lucide-react';

export default function RoleSwitcherBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentRole,
    setCurrentRole,
    activeBenchmarkKey,
    switchBenchmarkCase,
    benchmarkCases
  } = useAuthRole();

  const [caseMenuOpen, setCaseMenuOpen] = useState(false);

  const roles = [
    { id: 'Victim', label: 'Victim App', path: '/victim', icon: Smartphone },
    { id: 'Counsellor', label: 'Counsellor', path: '/dashboard', icon: UserCheck },
    { id: 'District Officer', label: 'District Officer', path: '/dashboard', icon: Shield },
    { id: 'National Admin', label: 'National Analytics', path: '/analytics', icon: BarChart2 },
    { id: 'Sandbox', label: 'Judge Sandbox', path: '/demo', icon: Sparkles }
  ];

  const handleRoleSelect = (roleObj) => {
    setCurrentRole(roleObj.id);
    navigate(roleObj.path);
  };

  const currentBench = benchmarkCases.find(c => c.benchmarkKey === activeBenchmarkKey) || benchmarkCases[0];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-3 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Role Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center space-x-1 bg-amber-500/20 text-amber-300 font-bold px-2 py-1 rounded text-[11px] flex-shrink-0 mr-1 border border-amber-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            <span>SIH Demo:</span>
          </div>

          {roles.map((r) => {
            const Icon = r.icon;
            const isCurrent = currentRole === r.id || (r.path === location.pathname && r.id !== 'Sandbox');
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-semibold text-[11px] whitespace-nowrap transition-colors flex-shrink-0 min-h-[32px] ${
                  isCurrent
                    ? 'bg-gov-blue text-white shadow-sm ring-1 ring-blue-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1-Click Benchmark Scenario Quick-Selector */}
        <div className="relative flex items-center justify-between w-full sm:w-auto space-x-2">
          <span className="text-slate-400 text-[11px] whitespace-nowrap hidden md:inline">
            Active Case:
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setCaseMenuOpen(!caseMenuOpen)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1 rounded-md text-[11px] font-bold min-h-[32px]"
            >
              <span>{currentBench.title}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${currentBench.badgeColor}`}>
                {currentBench.badge}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {caseMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-700">
                  Select Calibrated SIH Benchmark Case:
                </div>
                {benchmarkCases.map((b) => (
                  <button
                    key={b.benchmarkKey}
                    type="button"
                    onClick={() => {
                      switchBenchmarkCase(b.benchmarkKey);
                      setCaseMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-700 transition-colors ${
                      activeBenchmarkKey === b.benchmarkKey ? 'bg-slate-700/60 text-white font-bold' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{b.title}</div>
                      <div className="text-[10px] text-slate-400">{b.stage} • SVI {b.currentSvi}</div>
                    </div>
                    {activeBenchmarkKey === b.benchmarkKey && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
