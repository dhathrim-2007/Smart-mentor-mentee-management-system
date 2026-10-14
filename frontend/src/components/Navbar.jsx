import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleDemoSelect = async (role) => {
    setDemoMenuOpen(false);
    setMobileMenuOpen(false);
    try {
      await demoLogin(role);
      if (role === 'STUDENT') navigate('/student/dashboard');
      else if (role === 'MENTOR') navigate('/mentor/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'STUDENT') return '/student/dashboard';
    if (user.role === 'MENTOR') return '/mentor/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group">
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-teal-700 bg-teal-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Quick Demo Selector for Evaluators */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-lavender-100 hover:bg-lavender-200 text-lavender-800 rounded-lg border border-lavender-300 transition shadow-2xs"
                title="Instant login with pre-configured demonstration accounts"
              >
                <Sparkles className="w-3.5 h-3.5 text-lavender-600 animate-pulse" />
                <span>1-Click Demo</span>
                <ChevronDown className="w-3 h-3 text-lavender-600" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => handleDemoSelect('STUDENT')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-800 text-left transition"
                  >
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="font-semibold">Alex Johnson (Student)</div>
                      <div className="text-[10px] text-slate-500">CS & AI • 3 active goals</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('MENTOR')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-lavender-50 hover:text-lavender-800 text-left transition"
                  >
                    <Briefcase className="w-4 h-4 text-lavender-600" />
                    <div>
                      <div className="font-semibold">Dr. Elena Vance (Mentor)</div>
                      <div className="text-[10px] text-slate-500">Principal AI Scientist</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('ADMIN')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-navy-50 hover:text-navy-900 text-left transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-navy-600" />
                    <div>
                      <div className="font-semibold">Dr. Arthur (Administrator)</div>
                      <div className="text-[10px] text-slate-500">Platform Dean & Oversight</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated User or Login CTA */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 transition border border-slate-200"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-teal-500"
                  />
                  <div className="text-left text-xs">
                    <span className="font-semibold text-slate-800 block truncate max-w-[120px]">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-medium text-teal-600 uppercase tracking-wider block">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-semibold text-slate-800">{user?.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                    </div>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-800 font-medium transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-600" />
                      <span>{user?.role} Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left transition"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <span className="text-teal-400 font-normal">→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => handleDemoSelect('STUDENT')}
              className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'text-teal-700 bg-teal-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3">
              1-Click Demo Accounts
            </div>
            <div className="grid grid-cols-3 gap-2 px-1">
              <button
                onClick={() => handleDemoSelect('STUDENT')}
                className="py-1.5 px-2 text-xs font-medium text-teal-800 bg-teal-50 rounded-lg border border-teal-200 text-center"
              >
                Student
              </button>
              <button
                onClick={() => handleDemoSelect('MENTOR')}
                className="py-1.5 px-2 text-xs font-medium text-lavender-800 bg-lavender-100 rounded-lg border border-lavender-300 text-center"
              >
                Mentor
              </button>
              <button
                onClick={() => handleDemoSelect('ADMIN')}
                className="py-1.5 px-2 text-xs font-medium text-navy-800 bg-navy-100 rounded-lg border border-navy-200 text-center"
              >
                Admin
              </button>
            </div>

            {isAuthenticated ? (
              <div className="pt-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-teal-600 text-white font-medium text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to {user?.role} Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full mt-2 py-2 text-center text-sm text-red-600 font-medium"
                >
                  Sign Out ({user?.name})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-semibold text-white bg-slate-900 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
