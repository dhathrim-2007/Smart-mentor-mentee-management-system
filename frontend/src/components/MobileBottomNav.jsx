import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Home,
  ClipboardCheck,
  TrendingUp,
  HeartHandshake,
  User
} from 'lucide-react';

export default function MobileBottomNav() {
  const { t } = useLanguage();

  const navItems = [
    { to: '/victim', label: t('navHome') || 'Home', icon: Home, end: true },
    { to: '/victim/checkin', label: t('navCheckin') || 'Check-in', icon: ClipboardCheck, highlight: true },
    { to: '/victim/history', label: t('navHistory') || 'History', icon: TrendingUp },
    { to: '/victim/support', label: t('navSupport') || 'Support', icon: HeartHandshake },
    { to: '/victim/profile', label: t('navProfile') || 'Profile', icon: User }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 pb-[env(safe-area-inset-bottom,0.5rem)] pt-1"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `
                flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 py-1 rounded-xl transition-all select-none
                ${isActive
                  ? 'text-gov-blue font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {item.highlight ? (
                    <div className={`p-1.5 rounded-full ${isActive ? 'bg-gov-blue text-white shadow' : 'bg-gov-lightBlue text-gov-blue'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  )}
                  <span className="text-[10px] tracking-tight leading-none mt-0.5">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
