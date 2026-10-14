import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import {
  Globe,
  Bell,
  Lock,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Download,
  AlertCircle,
  Eye
} from 'lucide-react';

export default function VictimProfilePage() {
  const { currentLang, setLanguage, languages } = useLanguage();
  const { activeCase } = useAuthRole();

  const [notificationFrequency, setNotificationFrequency] = useState('weekly');
  const [quietHours, setQuietHours] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [consentRevoked, setConsentRevoked] = useState(false);

  const handleClearCache = () => {
    localStorage.clear();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 4000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
          Settings & Privacy
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight mt-0.5">
          Citizen Preferences & Data Governance
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Control your communication language, notification frequency, and privacy rights under the DPDP Act, 2023.
        </p>
      </div>

      {/* Language Selection Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
          <Globe className="w-4 h-4 text-gov-blue" />
          <span>Preferred Communication Language</span>
        </div>
        <p className="text-xs text-slate-500">
          All questions, check-in prompts, and helpline options will adapt to your selected language.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`p-3 rounded-xl border text-left text-xs transition-all min-h-[44px] ${
                currentLang === l.code
                  ? 'border-gov-blue bg-blue-50 font-bold text-gov-navy ring-1 ring-gov-blue'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="text-sm font-bold">{l.native}</div>
              <div className="text-[10px] text-slate-500">{l.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Notification Preferences Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
          <Bell className="w-4 h-4 text-gov-blue" />
          <span>Check-in Reminder Frequency</span>
        </div>

        <div className="space-y-2">
          {[
            { id: 'weekly', label: 'Weekly Check-in (Recommended)', desc: 'Standard periodic monitoring cadence' },
            { id: 'biweekly', label: 'Bi-weekly Check-in', desc: 'Every 14 days during stable trial phases' },
            { id: 'postcourt', label: 'Court Hearing Triggered', desc: 'Sent automatically 24h after scheduled judicial appearances' }
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                notificationFrequency === item.id ? 'border-gov-blue bg-blue-50/50 font-medium text-slate-900' : 'border-slate-200 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="freq"
                checked={notificationFrequency === item.id}
                onChange={() => setNotificationFrequency(item.id)}
                className="mt-0.5 text-gov-blue focus:ring-gov-blue"
              />
              <div>
                <span className="font-bold text-xs block">{item.label}</span>
                <span className="text-[11px] text-slate-500 block">{item.desc}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 block">Quiet Hours Protection</span>
            <span className="text-[11px] text-slate-500">No notifications sent between 9:00 PM and 8:00 AM</span>
          </div>
          <input
            type="checkbox"
            checked={quietHours}
            onChange={(e) => setQuietHours(e.target.checked)}
            className="h-4 w-4 rounded text-gov-blue focus:ring-gov-blue"
          />
        </div>
      </div>

      {/* Privacy & Data Controls (DPDP Act Compliance) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
          <Lock className="w-4 h-4 text-gov-blue" />
          <span>Data Governance & Privacy Controls</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-slate-600 text-[11px] leading-relaxed">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Personal Data Protection (DPDP) Act, 2023 Principles:</span>
          </div>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Purpose Limitation:</strong> Check-in responses are processed solely for psychological triage and protective support.</li>
            <li><strong>Data Minimization:</strong> Personal names and numbers are masked (`A*** R*****`, `******8194`).</li>
            <li><strong>Ephemeral Voice:</strong> Raw speech recordings are discarded after non-diagnostic acoustic feature extraction.</li>
          </ul>
        </div>

        {cacheCleared && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Local cached telemetry and session tokens wiped.</span>
          </div>
        )}

        {consentRevoked && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Consent status marked as withdrawn. Automatic reminders paused.</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleClearCache}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-colors min-h-[44px]"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear Local Storage</span>
          </button>

          <button
            type="button"
            onClick={() => setConsentRevoked(!consentRevoked)}
            className="flex items-center space-x-1.5 border border-red-200 text-red-600 hover:bg-red-50 font-bold px-4 py-2.5 rounded-xl transition-colors min-h-[44px]"
          >
            <span>{consentRevoked ? 'Re-enable Monitoring Consent' : 'Withdraw Digital Consent'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
