import React, { useState } from 'react';
import { useAuthRole } from '../../context/AuthRoleContext';
import {
  PhoneCall,
  HeartHandshake,
  Scale,
  ShieldAlert,
  IndianRupee,
  Home,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  ExternalLink
} from 'lucide-react';

export default function VictimSupportPage() {
  const { activeCase } = useAuthRole();
  const [requestSent, setRequestSent] = useState(false);
  const [selectedService, setSelectedService] = useState('General Counselling');

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 5000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Page Title */}
      <div>
        <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
          Victim Support Services
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight mt-0.5">
          Statutory Support & Emergency Pathways
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Direct human assistance authorized under the SC/ST Prevention of Atrocities Act and MoSJE guidelines.
        </p>
      </div>

      {/* Emergency Call Banner */}
      <div className="bg-red-600 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5 animate-bounce text-amber-300" />
          <div>
            <h3 className="font-black text-sm uppercase tracking-wide">
              Immediate Danger / Emergency SOS
            </h3>
            <p className="text-xs text-red-100 mt-0.5 leading-relaxed">
              If you or your family face active threats, call emergency law enforcement immediately. This digital system assists in monitoring and triage, but immediate physical danger requires human emergency response.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto">
          <a
            href="tel:14566"
            className="flex-1 sm:flex-initial bg-white text-red-700 hover:bg-red-50 font-black text-xs px-4 py-3 rounded-xl shadow text-center flex items-center justify-center space-x-1 min-h-[44px]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>NHAA 14566</span>
          </a>
          <a
            href="tel:112"
            className="flex-1 sm:flex-initial bg-red-950 text-white hover:bg-black font-black text-xs px-4 py-3 rounded-xl shadow text-center flex items-center justify-center space-x-1 min-h-[44px]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Police 112</span>
          </a>
        </div>
      </div>

      {/* Request Follow-up Form */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-gov-navy">
              Request Officer / Counsellor Follow-up
            </h3>
            <p className="text-xs text-slate-500">
              Your request is routed directly to your assigned case worker ({activeCase?.assignedOfficer || 'Dr. Anjali Deshmukh'}).
            </p>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
            Case: {activeCase?.id || 'CASE-1040'}
          </span>
        </div>

        {requestSent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong>Request Received:</strong> Your designated case officer has been notified. A team member will reach out within 24 business hours.
            </div>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Nature of Assistance Needed:
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-gov-blue"
              >
                <option value="General Counselling">Trauma & Psychological Tele-Counselling</option>
                <option value="Legal Aid Representation">Legal Aid Advocate Representation (PoA Act)</option>
                <option value="Witness Protection Review">Witness Protection Protocol / Intimidation Report</option>
                <option value="Relocation & Safe Shelter">Temporary Safe Shelter / Relocation Assistance</option>
                <option value="Compensation Tracking">Statutory Relief & Compensation Follow-up</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Brief Note (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="Mention convenient callback timings or specific concerns..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-gov-blue resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 min-h-[44px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Follow-up Request</span>
            </button>
          </form>
        )}
      </div>

      {/* Available Statutory Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        {/* Legal Aid Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">
            Free Legal Aid & Representation
          </h4>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Under Section 15A of the PoA Act, complainants are entitled to free, state-sponsored legal counsel through the District Legal Services Authority (DLSA) at every stage of bail, charge-sheet, and trial.
          </p>
        </div>

        {/* Witness Protection Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">
            Witness Protection Scheme, 2018
          </h4>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Statutory framework providing police escort, concealment of identity in records, installation of security cameras, and temporary relocation if threatened by accused parties.
          </p>
        </div>

        {/* Psychological Care Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">
            Tele-MANAS Psychological Care
          </h4>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            24x7 multilingual mental health counselling network (14416) providing trauma-informed psychological first aid and sustained follow-up for victims of violence.
          </p>
        </div>

        {/* Rehabilitation & Compensation Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">
            Mandatory Relief Compensation
          </h4>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Immediate financial relief under Annexure I of the SC/ST PoA Rules (25% at FIR, 50% at charge-sheet, 25% on conviction) processed through the District Collectorate.
          </p>
        </div>
      </div>
    </div>
  );
}
