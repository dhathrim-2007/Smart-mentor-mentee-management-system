import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import MobileBottomNav from '../../components/MobileBottomNav';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import {
  PhoneCall,
  Shield,
  Activity,
  HeartHandshake,
  TrendingUp,
  User,
  AlertTriangle
} from 'lucide-react';

export default function VictimAppLayout() {
  const { t, currentLang, setLanguage, languages } = useLanguage();
  const { activeCase } = useAuthRole();
  const location = useLocation();

  const desktopTabs = [
    { to: '/victim', label: t('navHome') || 'Home', icon: Shield, end: true },
    { to: '/victim/checkin', label: t('navCheckin') || 'Periodic Check-in', icon: Activity },
    { to: '/victim/history', label: t('navHistory') || 'History & Trends', icon: TrendingUp },
    { to: '/victim/support', label: t('navSupport') || 'Support & Legal Aid', icon: HeartHandshake },
    { to: '/victim/profile', label: t('navProfile') || 'Profile & Privacy', icon: User }
  ];

  const isCurrent = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      {/* Victim Top Banner */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gov-lightBlue flex items-center justify-center text-gov-navy font-bold text-xs border border-gov-blue/20">
              NHAA
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-gov-navy">Victim Portal</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                  {activeCase?.id || 'CASE-1040'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Continuous Well-being & Protection Monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Language Dropdown */}
            <select
              value={currentLang}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-lg px-2 py-1 focus:ring-1 focus:ring-gov-blue font-medium"
              aria-label="Select Language"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native}
                </option>
              ))}
            </select>

            {/* Quick Emergency 14566 Call */}
            <a
              href="tel:14566"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-xs"
            >
              <PhoneCall className="w-3 h-3" />
              <span className="hidden sm:inline">Call</span>
              <span>14566</span>
            </a>
          </div>
        </div>

        {/* Desktop / Tablet Navigation Bar */}
        <div className="hidden md:block bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 flex space-x-1">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              const active = isCurrent(tab.to, tab.end);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    active
                      ? 'border-gov-blue text-gov-blue bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Outlet Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <MobileBottomNav />
    </div>
  );
}
