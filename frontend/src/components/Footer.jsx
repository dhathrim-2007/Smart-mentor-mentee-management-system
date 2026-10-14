import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { ShieldCheck, HeartHandshake, Compass, Sparkles, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo textColor="text-white" subtitleColor="text-slate-400" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering college students through intelligent AI-assisted mentor matching, 
              curriculum-aligned goal tracking, milestone accountability, and 1-on-1 career guidance.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-teal-400 border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Startup Pilot & College Demo 2026
              </span>
            </div>
          </div>

          {/* Platform Columns */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition">Home</Link></li>
              <li><Link to="/features" className="hover:text-teal-400 transition">AI Mentor Matching</Link></li>
              <li><Link to="/features" className="hover:text-teal-400 transition">Milestone Tracking</Link></li>
              <li><Link to="/how-it-works" className="hover:text-teal-400 transition">Student Journey</Link></li>
              <li><Link to="/how-it-works" className="hover:text-teal-400 transition">Mentor Journey</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="hover:text-teal-400 transition">Mentee Portal</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition">Mentor Portal</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition">Administrator Portal</Link></li>
              <li><Link to="/register" className="hover:text-teal-400 transition">Become a Mentor</Link></li>
              <li><Link to="/register" className="hover:text-teal-400 transition">Student Registration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company & Impact</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-teal-400 transition">Our Mission & Vision</Link></li>
              <li><Link to="/about" className="hover:text-teal-400 transition">The Mentorship Gap</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition">College Partnerships</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition">Support & Inquiries</Link></li>
            </ul>
          </div>

        </div>

        {/* Ethical Governance Notice */}
        <div className="py-6 border-b border-slate-800 my-4 bg-slate-950/40 rounded-xl px-5 border border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>
                <strong className="text-slate-200">Ethical AI Transparency Model:</strong> AI algorithm assists in calculating multi-attribute compatibility scores and structured milestones. Human mentors provide authentic wisdom, empathy, and qualitative guidance.
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 text-slate-500">
              <span>Rule-Based Heuristic v1.2</span>
              <span>•</span>
              <span>Zero Hallucination Guarantee</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Smart AI Mentor–Mentee Management System. Built for Smart India Hackathon & Higher Education Innovation.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400 transition">Privacy & Data Ethics</Link>
            <Link to="/about" className="hover:text-slate-400 transition">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-400 transition">Contact Us</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
