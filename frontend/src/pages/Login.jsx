import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectAfterAuth = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }
    if (userRole === 'STUDENT') navigate('/student/dashboard', { replace: true });
    else if (userRole === 'MENTOR') navigate('/mentor/dashboard', { replace: true });
    else if (userRole === 'ADMIN') navigate('/admin/dashboard', { replace: true });
    else navigate('/', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login(email, password);
      redirectAfterAuth(res.user?.role);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await demoLogin(role);
      redirectAfterAuth(res.user?.role);
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to access your goals, sessions, and mentorship dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        
        {/* 1-Click Demo Logins for Judges/Evaluators */}
        <div className="bg-lavender-50/70 border border-lavender-200 rounded-2xl p-4 mb-6 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lavender-900 mb-2.5">
            <Sparkles className="w-4 h-4 text-lavender-600 animate-pulse" />
            <span>Fast 1-Click Demo Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('STUDENT')}
              className="py-2 px-2 text-xs font-semibold bg-white text-teal-800 rounded-xl border border-teal-200 hover:bg-teal-50 transition shadow-2xs flex flex-col items-center gap-1 text-center"
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('MENTOR')}
              className="py-2 px-2 text-xs font-semibold bg-white text-lavender-800 rounded-xl border border-lavender-200 hover:bg-lavender-50 transition shadow-2xs flex flex-col items-center gap-1 text-center"
            >
              <Briefcase className="w-4 h-4 text-lavender-600" />
              <span>Mentor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="py-2 px-2 text-xs font-semibold bg-white text-navy-800 rounded-xl border border-navy-200 hover:bg-navy-50 transition shadow-2xs flex flex-col items-center gap-1 text-center"
            >
              <ShieldCheck className="w-4 h-4 text-navy-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Traditional Credentials Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm">
          
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@smartmentor.ai"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-teal-700 hover:underline">
              Register as Mentee or Mentor
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
