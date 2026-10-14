import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  Sparkles,
  MapPin,
  MessageSquare
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Prospective Student',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await api.contact.submitInquiry(formData);
      if (res.success) {
        setSuccessResult(res);
        setFormData({
          name: '',
          email: '',
          role: 'Prospective Student',
          subject: '',
          message: ''
        });
      } else {
        setErrorMessage(res.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-3">
            <Mail className="w-3.5 h-3.5 text-teal-600" />
            <span>Direct Communication & Partnerships</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Connect With Our Team
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Have questions about student onboarding, mentor verification, or launching a department pilot at your university? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Institutional Partnerships</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart AI Mentor partners with colleges, academic departments, and engineering institutes to deploy organized mentorship cohorts.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Campus Cohort Onboarding</h4>
                    <p className="text-xs text-slate-500">Dedicated institutional dashboards for college deans and department heads.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-lavender-100 text-lavender-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Response Turnaround</h4>
                    <p className="text-xs text-slate-500">All submitted inquiries are reviewed by our platform administrators within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-navy-100 text-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">College Innovation Hub</h4>
                    <p className="text-xs text-slate-500">Smart India Hackathon Prototype & Startup Demonstration Center.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Fast Evaluator Support</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Evaluating this project for a college presentation or startup pitch? You can also use the <strong>1-Click Demo Login</strong> in the navigation header to explore Student, Mentor, and Admin workflows immediately without waiting!
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
            
            {successResult ? (
              <div className="p-8 text-center bg-teal-50/60 rounded-2xl border border-teal-200 animate-in fade-in duration-200">
                <div className="w-14 h-14 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-['Outfit']">Inquiry Submitted Successfully!</h3>
                <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
                  Thank you for reaching out. Your message has been logged in our institutional inquiry queue.
                </p>
                <div className="my-5 inline-block px-4 py-2 bg-white rounded-xl border border-teal-300 text-xs text-teal-800 font-mono font-bold">
                  Reference Ticket: {successResult.referenceCode}
                </div>
                <div>
                  <button
                    onClick={() => setSuccessResult(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Send Us an Inquiry</h3>
                </div>

                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Professor Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. sjenkins@university.edu"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Affiliation / Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    >
                      <option value="Prospective Student">Prospective Student</option>
                      <option value="Mentor Applicant">Mentor Applicant</option>
                      <option value="College Dean / Faculty Chair">College Dean / Faculty Chair</option>
                      <option value="Industry Partner">Industry Partner</option>
                      <option value="Hackathon Judge / Evaluator">Hackathon Judge / Evaluator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Department Pilot for 200 Students"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements, cohort size, or specific questions..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    required
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-teal-400" />
                        <span>Submit Inquiries Directly to Administration</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
