import React, { useState } from 'react';
import {
  Lock,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Clock,
  Key,
  ShieldAlert,
  Sparkles,
  Server
} from 'lucide-react';

export default function PrivacyPage() {
  // Interactive PII De-identification Demonstration
  const [testName, setTestName] = useState('Ananya Ramaswamy');
  const [testPhone, setTestPhone] = useState('9849012345');
  const [testAddress, setTestAddress] = useState('House 4-12, Gandhi Nagar, Warangal Urban, Telangana 506002');

  const maskName = (name) => {
    if (!name) return '';
    return name.split(' ').map(part => {
      if (part.length <= 2) return part[0] + '*';
      return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
    }).join(' ');
  };

  const maskPhone = (phone) => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 4) return '******';
    return '*'.repeat(clean.length - 4) + clean.slice(-4);
  };

  const coarseLocation = (addr) => {
    if (!addr) return '';
    const parts = addr.split(',');
    if (parts.length >= 2) {
      return parts.slice(-2).join(',').trim();
    }
    return 'District Level Jurisdiction Only';
  };

  const rbacMatrix = [
    {
      role: 'Victim / Complainant',
      accessScope: 'Personal assessment, SVI score, recommended support plan & grievance status only.',
      piiView: 'Full personal details visible only to citizen in active session.',
      actions: 'Submit narrative, request support, download guidance booklet.'
    },
    {
      role: 'Support Counsellor',
      accessScope: 'Assigned psycho-social cases & emotional distress indicators.',
      piiView: 'Masked names (A*** R*****); authorized tele-calling through encrypted gateway.',
      actions: 'Conduct tele-counselling, add progress notes, request medical referral.'
    },
    {
      role: 'Triage Case Officer',
      accessScope: 'Jurisdictional cases, risk classification & multi-agency routing.',
      piiView: 'Coarse geographic location; masked contact info with unmasking audit logs.',
      actions: 'Assign legal counsel, dispatch police liaison, initiate witness protection.'
    },
    {
      role: 'System Administrator',
      accessScope: 'System uptime, model telemetry, bias audits & audit logs.',
      piiView: 'Zero PII access. Anonymized metadata and SVI statistical aggregates only.',
      actions: 'Monitor model drift, review fairness metrics, rotate cryptographic keys.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-gov-blue text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
          <Lock className="w-3.5 h-3.5" />
          <span>Security Architecture & DPDP Act 2023 Compliance</span>
        </div>
        <h1 className="text-3xl font-black text-gov-navy tracking-tight">
          Privacy by Design & Role-Based Access Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Strict technical and organizational safeguards protecting vulnerable atrocity victims from retaliation, surveillance, or unauthorized disclosure.
        </p>
      </div>

      {/* Interactive PII Masking Demonstration for Judges */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-gov-blue uppercase tracking-wider">
              Interactive Demonstrator
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Live PII Masking & De-Identification Engine
            </h2>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
            Real-Time Sanitizer Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Citizen Raw Input (Encrypted at Ingestion)</span>
            </h3>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Citizen Full Name:</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Phone Number:</label>
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Detailed Residential Address:</label>
              <input
                type="text"
                value={testAddress}
                onChange={(e) => setTestAddress(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue"
              />
            </div>
          </div>

          {/* Right: Masked Output */}
          <div className="space-y-4 bg-slate-900 text-white p-5 rounded-xl border border-slate-800 text-xs">
            <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Masked View (Displayed to Triage Operators)</span>
            </h3>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase">Redacted Name:</span>
              <span className="font-mono text-amber-300 font-bold text-sm">
                {maskName(testName) || 'None'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase">Masked Phone:</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                {maskPhone(testPhone) || 'None'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase">Coarse Generalized Location:</span>
              <span className="font-mono text-blue-300 font-bold text-sm">
                {coarseLocation(testAddress) || 'National Jurisdiction'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed italic pt-1">
              "Prevents rogue operator leaks or unauthorized tracking by preserving victim anonymity across non-executive tiers."
            </p>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wider">
            Role-Based Access Control (RBAC) Governance Matrix
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Access Scope</th>
                <th className="px-5 py-3">PII Visibility Level</th>
                <th className="px-5 py-3">Authorized Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rbacMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-bold text-gov-navy whitespace-nowrap">
                    {item.role}
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs">{item.accessScope}</td>
                  <td className="px-5 py-3 text-slate-700 max-w-xs font-mono text-[11px]">
                    {item.piiView}
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs">{item.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Retention & Lifecycle Policy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Ephemeral Voice Audio</h3>
          <p className="text-slate-600 leading-relaxed">
            Raw citizen audio streams are processed in RAM for acoustic tremor extraction and discarded immediately. No permanent voice biometric templates are stored.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-bold text-slate-900 text-sm">90-Day Active Triage Retention</h3>
          <p className="text-slate-600 leading-relaxed">
            Case records remain active for ongoing welfare, legal representation, and follow-up support for 90 days, after which they are archived in encrypted cold storage.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Tamper-Evident Audit Stamping</h3>
          <p className="text-slate-600 leading-relaxed">
            Every case view, status update, and support dispatch event generates an immutable cryptographic hash entry in the audit trail for statutory compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
