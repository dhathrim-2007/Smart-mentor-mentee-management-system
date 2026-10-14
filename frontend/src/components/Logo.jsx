import React from 'react';

export default function Logo({ className = "w-9 h-9", showText = true, textColor = "text-slate-900", subtitleColor = "text-slate-500" }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex-shrink-0 ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="compPrimaryGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="compTealGrad" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#2DD4BF" />
            </linearGradient>
            <linearGradient id="compLavenderGrad" x1="16" y1="12" x2="38" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#C4B5FD" />
            </linearGradient>
          </defs>

          {/* Navy Card Frame */}
          <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#compPrimaryGrad)" />
          <rect x="2" y="2" width="44" height="44" rx="12" stroke="#334155" strokeWidth="1" />

          {/* Growth Arc */}
          <path d="M14 34C14 24 22 16 34 14" stroke="url(#compTealGrad)" strokeWidth="3.5" strokeLinecap="round" />

          {/* Guidance Nexus Arc */}
          <path d="M14 22C20 22 26 18 34 26" stroke="url(#compLavenderGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 3" />

          {/* Apex Growth / Guidance Star Node */}
          <circle cx="34" cy="14" r="4.5" fill="#2DD4BF" />
          <circle cx="34" cy="14" r="1.8" fill="#FFFFFF" />

          {/* Base Node */}
          <circle cx="14" cy="34" r="3" fill="#8B5CF6" />
          <circle cx="14" cy="34" r="1.2" fill="#FFFFFF" />

          {/* Synergistic Connection Node */}
          <circle cx="25" cy="21" r="2.5" fill="#A78BFA" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg sm:text-xl font-['Outfit']">
            <span className={textColor}>Smart<span className="text-teal-600">AI</span></span>
            <span className="bg-lavender-100 text-lavender-700 text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-wide uppercase border border-lavender-200">
              Mentor
            </span>
          </div>
          <span className={`text-[11px] font-medium tracking-tight ${subtitleColor}`}>
            Growth & Guidance Ecosystem
          </span>
        </div>
      )}
    </div>
  );
}
