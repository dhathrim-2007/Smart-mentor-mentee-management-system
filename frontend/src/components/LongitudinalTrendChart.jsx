import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Dot
} from 'recharts';
import { AlertTriangle, Calendar, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function LongitudinalTrendChart({
  checkinHistory = [],
  prediction = 'STABLE',
  predictionReason = '',
  currentScore = 50
}) {
  if (!checkinHistory || checkinHistory.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
        <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-xs">No historical check-ins recorded yet.</p>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = checkinHistory.map((item, idx) => ({
    name: item.label ? item.label.replace('Check-in ', 'Chk ') : `Chk ${idx + 1}`,
    fullLabel: item.label || `Check-in ${idx + 1}`,
    svi: item.svi,
    date: item.date,
    daysAgo: item.daysAgo,
    missed: item.missed,
    event: item.event,
    mood: item.mood,
    safety: item.safety,
    sleep: item.sleep
  }));

  // Custom Dot renderer to highlight missed check-ins or critical spikes
  const renderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.missed) {
      return (
        <svg x={cx - 7} y={cy - 7} width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-500">
          <circle cx="12" cy="12" r="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }

    const isCritical = payload.svi >= 75;
    const isElevated = payload.svi >= 50;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={isCritical ? 6 : 4}
        fill={isCritical ? '#dc2626' : isElevated ? '#ea580c' : '#2563eb'}
        stroke="#ffffff"
        strokeWidth={2}
      />
    );
  };

  // Custom Tooltip for Mobile & Desktop
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs max-w-[210px] space-y-1">
          <div className="flex items-center justify-between font-bold border-b border-slate-700 pb-1">
            <span>{data.fullLabel}</span>
            <span className="text-amber-400 font-mono">{data.svi}/100</span>
          </div>
          <div className="text-[11px] text-slate-300">
            {data.date} {data.daysAgo ? `(${data.daysAgo})` : ''}
          </div>
          {data.missed ? (
            <div className="text-red-400 font-bold text-[10px] flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Missed Check-in Recorded</span>
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 grid grid-cols-3 gap-1 pt-0.5">
              <span>Mood: {data.mood || 'N/A'}/10</span>
              <span>Fear: {data.safety || 'N/A'}/10</span>
              <span>Sleep: {data.sleep || 'N/A'}/10</span>
            </div>
          )}
          {data.event && (
            <div className="text-[10px] text-blue-300 italic pt-0.5 border-t border-slate-800">
              "{data.event}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
      {/* Header & Trend Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
            Longitudinal Trend Analysis
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Sequential Distress Trajectory (Last 5 Check-ins)
          </h3>
        </div>

        {/* Prediction Badge */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            prediction === 'POTENTIAL ESCALATION'
              ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
              : prediction === 'WORSENING'
              ? 'bg-orange-100 text-orange-800 border border-orange-200'
              : prediction === 'IMPROVING'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {prediction === 'POTENTIAL ESCALATION' || prediction === 'WORSENING' ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : prediction === 'IMPROVING' ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>Prediction: {prediction}</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas: strictly non-overflowing */}
      <div className="w-full h-52 sm:h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sviGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Threshold Reference Lines */}
            <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} />
            <ReferenceLine y={50} stroke="#f97316" strokeDasharray="3 3" strokeWidth={1} />
            <ReferenceLine y={25} stroke="#eab308" strokeDasharray="2 2" strokeWidth={1} />

            <Area
              type="monotone"
              dataKey="svi"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#sviGradient)"
              dot={renderCustomDot}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Band Legend (Mobile-First) */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 gap-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Low (0-24)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Moderate (25-49)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Elevated (50-74)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Critical (75-100)</span>
          </span>
        </div>

        <div className="flex items-center space-x-1 text-slate-400">
          <Info className="w-3 h-3" />
          <span>Red X = Missed check-in</span>
        </div>
      </div>

      {/* Explainable Reasoning Alert Box */}
      {predictionReason && (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-slate-900 block mb-0.5">
            AI Escalation Reasoning:
          </span>
          <p className="text-[11px] text-slate-600">
            {predictionReason}
          </p>
        </div>
      )}
    </div>
  );
}
