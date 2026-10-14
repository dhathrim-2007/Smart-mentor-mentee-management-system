import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from 'lucide-react';

export default function SviGauge({ score = 0, riskLevel = 'LOW', confidence = 0.92, size = 200 }) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

  // SVG dimensions
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Styling based on risk level
  const getRiskDetails = () => {
    switch (riskLevel?.toUpperCase()) {
      case 'CRITICAL':
        return {
          strokeColor: '#DC2626', // Crimson Red
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-300',
          badgeBg: 'bg-red-600',
          icon: Flame,
          label: 'CRITICAL RISK',
          subtext: 'Immediate human escalation and emergency protection triage required.'
        };
      case 'HIGH':
        return {
          strokeColor: '#EA580C', // Deep Orange
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-300',
          badgeBg: 'bg-orange-600',
          icon: AlertTriangle,
          label: 'HIGH RISK',
          subtext: 'Prioritized counselling, legal aid allocation, and local safety assessment.'
        };
      case 'MODERATE':
        return {
          strokeColor: '#D97706', // Amber Yellow
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-300',
          badgeBg: 'bg-amber-600',
          icon: AlertCircle,
          label: 'MODERATE RISK',
          subtext: 'Supportive counselling referral and statutory rights guidance recommended.'
        };
      default:
        return {
          strokeColor: '#16A34A', // Green
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-300',
          badgeBg: 'bg-emerald-600',
          icon: ShieldCheck,
          label: 'LOW RISK',
          subtext: 'Informational resources, routine guidance, and standard monitoring.'
        };
    }
  };

  const details = getRiskDetails();
  const Icon = details.icon;

  return (
    <div className={`flex flex-col items-center p-6 rounded-2xl border ${details.borderColor} ${details.bgColor} shadow-sm transition-all`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={details.strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            SVI Score
          </span>
          <div className="flex items-baseline space-x-0.5">
            <span className="text-4xl font-black text-slate-900 tracking-tight">
              {normalizedScore}
            </span>
            <span className="text-sm font-semibold text-slate-400">/100</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">
            Confidence {(confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Risk Category Badge */}
      <div className="mt-4 flex flex-col items-center text-center">
        <div
          className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-white text-xs font-black tracking-wide uppercase shadow-sm ${details.badgeBg}`}
        >
          <Icon className="w-4 h-4" />
          <span>{details.label}</span>
        </div>
        <p className="text-xs text-slate-600 mt-2 max-w-xs font-medium">
          {details.subtext}
        </p>
      </div>
    </div>
  );
}
