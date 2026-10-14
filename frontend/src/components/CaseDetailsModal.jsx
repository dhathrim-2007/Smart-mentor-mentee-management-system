import React, { useState } from 'react';
import {
  X,
  Shield,
  AlertTriangle,
  UserCheck,
  Scale,
  Stethoscope,
  PhoneCall,
  History,
  FileCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Mic,
  Lock,
  Flame,
  Send
} from 'lucide-react';
import SviGauge from './SviGauge';

export default function CaseDetailsModal({ caseItem, onClose, onUpdateCase }) {
  const [selectedAction, setSelectedAction] = useState('Reviewed');
  const [assignedOfficerName, setAssignedOfficerName] = useState(caseItem.assignedOfficer || 'Officer In-Charge');
  const [officerNotes, setOfficerNotes] = useState(caseItem.officerNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!caseItem) return null;

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let status = caseItem.status;
    let assignedService = caseItem.assignedService;

    if (selectedAction === 'Closed') {
      status = 'RESOLVED';
    } else if (selectedAction === 'Reviewed') {
      status = 'IN_REVIEW';
    } else {
      status = 'ACTIVE';
      assignedService = selectedAction;
    }

    try {
      await onUpdateCase(caseItem.id, {
        status,
        assignedService,
        assignedOfficer: assignedOfficerName,
        officerNotes,
        actor: `Officer (${assignedOfficerName})`
      });

      setToastMessage(`Action "${selectedAction}" executed and logged to audit trail.`);
      setTimeout(() => {
        setToastMessage('');
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gov-blue/80 flex items-center justify-center font-mono font-bold text-sm text-white">
              {caseItem.id.split('-')[1] || 'ID'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight">{caseItem.id}</h2>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    caseItem.riskLevel === 'CRITICAL'
                      ? 'bg-red-600 text-white'
                      : caseItem.riskLevel === 'HIGH'
                      ? 'bg-orange-600 text-white'
                      : caseItem.riskLevel === 'MODERATE'
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {caseItem.riskLevel} RISK
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Status: {caseItem.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                National Helpline Against Atrocities (14566) • Triage & Case Review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Quick Toast */}
          {toastMessage && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Grid Row 1: Demographics (Masked PII) & SVI Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Masked Citizen Demographics */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-gov-navy uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Privacy-Protected Citizen Profile</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                  DPDP Act Compliant (Masked)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Complainant Name</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {caseItem.victimNameMasked || 'C*** K*****'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Contact Number</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {caseItem.phoneMasked || '******4521'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Channel</span>
                  <span className="font-semibold text-slate-800 flex items-center space-x-1">
                    {caseItem.channel === 'Voice' ? <Mic className="w-3 h-3 text-blue-600" /> : null}
                    <span>{caseItem.channel}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Language</span>
                  <span className="font-semibold text-slate-800">{caseItem.language}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location (Coarse)</span>
                  <span className="font-semibold text-slate-800 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                    <span>{caseItem.district ? `${caseItem.district}, ${caseItem.state}` : caseItem.state}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Current Stage</span>
                  <span className="font-bold text-gov-blue">
                    {caseItem.stage || 'Investigation'}
                  </span>
                </div>
              </div>

              {/* Redacted Narrative Synopsis */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Interaction Narrative (Transcribed & Redacted)
                </span>
                <p className="text-xs text-slate-600 italic bg-white p-3 rounded border border-slate-200 leading-relaxed">
                  "{caseItem.narrative || caseItem.narrativeSummary}"
                </p>
              </div>
            </div>

            {/* SVI Gauge Card */}
            <div className="flex flex-col justify-center">
              <SviGauge
                score={caseItem.svi}
                riskLevel={caseItem.riskLevel}
                confidence={caseItem.confidence || 0.94}
                size={170}
              />
            </div>
          </div>

          {/* Longitudinal Trend & Prioritization Insight */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  caseItem.priority?.startsWith('Priority 1')
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : caseItem.priority?.startsWith('Priority 2')
                    ? 'bg-orange-100 text-orange-800 border border-orange-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {caseItem.priority || 'Priority 2 — Follow-up soon'}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Trajectory: {caseItem.prediction || 'STABLE'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Stage: <strong>{caseItem.stage || 'Investigation'}</strong>
              </span>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed">
              <strong>Prioritization Reason:</strong> {caseItem.priorityReason || caseItem.predictionReason || 'Case monitored under standard statutory protocol.'}
            </div>

            {/* Historical Check-in Points Pills */}
            {caseItem.checkinHistory && caseItem.checkinHistory.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                  Longitudinal Check-in Progression (Last {caseItem.checkinHistory.length} Sessions):
                </span>
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                  {caseItem.checkinHistory.map((chk, idx) => (
                    <div
                      key={idx}
                      className={`flex-shrink-0 p-2 rounded-lg border text-center text-xs min-w-[75px] ${
                        idx === caseItem.checkinHistory.length - 1
                          ? 'border-gov-blue bg-blue-50/80 font-bold text-gov-navy'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">{chk.label || `Chk ${idx + 1}`}</div>
                      <div className={`font-mono font-bold text-sm ${chk.missed ? 'text-red-500' : 'text-slate-800'}`}>
                        {chk.missed ? 'Missed' : `${chk.svi}/100`}
                      </div>
                      <div className="text-[9px] text-slate-400">{chk.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Row 2: Acoustic Telemetry & Detected Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Indicators */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-gov-blue" />
                <span>Detected Stress & Vulnerability Factors</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {caseItem.keyIndicators?.map((ind, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-300 font-medium"
                  >
                    • {ind}
                  </span>
                ))}
              </div>

              {/* Explainability factors if present */}
              {caseItem.explainability && (
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Fear Signals</span>
                    <span className="font-bold text-slate-700">{caseItem.explainability.fearScore || 50}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${caseItem.explainability.fearScore || 50}%` }}></div>
                  </div>

                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Threat Intensity</span>
                    <span className="font-bold text-slate-700">{caseItem.explainability.threatScore || 60}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${caseItem.explainability.threatScore || 60}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Acoustic Speech Telemetry */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-1.5">
                <Mic className="w-4 h-4 text-blue-600" />
                <span>Acoustic Speech & Voice Indicators</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Pause Patterns</span>
                  <span className="font-semibold text-slate-800">
                    {caseItem.acousticMetrics?.pauseRate || 'Normal flow'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Pitch Variability</span>
                  <span className="font-semibold text-slate-800">
                    {caseItem.acousticMetrics?.pitchVariance || '22 Hz baseline'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Speech Rate</span>
                  <span className="font-semibold text-slate-800">
                    {caseItem.acousticMetrics?.speechRateWpm || '115 WPM'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Vocal Stress Level</span>
                  <span
                    className={`font-bold ${
                      caseItem.acousticMetrics?.voiceStressLevel === 'ELEVATED'
                        ? 'text-red-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {caseItem.acousticMetrics?.voiceStressLevel || 'NORMAL'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Speech analysis captures acoustic tremor markers without storing raw personal voiceprints.
              </p>
            </div>
          </div>

          {/* Row 3: Recommended Actions */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-blue-700" />
              <span>AI Support Recommendations (Requires Officer Approval)</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {caseItem.recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start space-x-2 bg-white p-2 rounded border border-blue-100">
                  <span className="text-gov-blue font-bold">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Row 4: Officer Intervention & Triage Form */}
          <form onSubmit={handleActionSubmit} className="bg-slate-900 text-white p-5 rounded-xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Human-in-the-Loop Officer Triage Panel
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Assigned: {caseItem.assignedOfficer || 'Unassigned'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Select Action */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assign Intervention Action:
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Reviewed">Mark Case as Reviewed</option>
                  <option value="Counselling Assigned">Assign Trauma Counselling</option>
                  <option value="Legal Aid Assigned">Dispatch Legal Aid Counsel</option>
                  <option value="Medical Assistance">Request Emergency Medical Support</option>
                  <option value="Police Referral">Refer to Special PoA Police Cell</option>
                  <option value="Witness Protection Review">Initiate Witness Protection Review</option>
                  <option value="Follow-up Required">Flag for Priority Follow-up</option>
                  <option value="Closed">Mark Case Resolved & Closed</option>
                </select>
              </div>

              {/* Officer In-Charge */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Officer In-Charge Name:
                </label>
                <input
                  type="text"
                  value={assignedOfficerName}
                  onChange={(e) => setAssignedOfficerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Officer name / Designation"
                />
              </div>

              {/* Officer Notes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Officer Action Notes:
                </label>
                <input
                  type="text"
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., Notified local SHO; counsel assigned"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Updating Trail...' : 'Confirm Action & Update Audit Trail'}</span>
              </button>
            </div>
          </form>

          {/* Row 5: Immutable Audit Trail */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-gov-navy uppercase tracking-wider">
              <History className="w-4 h-4 text-gov-blue" />
              <span>Immutable Chain-of-Custody Audit Log</span>
            </div>
            <div className="space-y-2">
              {caseItem.auditLog && caseItem.auditLog.length > 0 ? (
                caseItem.auditLog.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between text-xs bg-white p-2.5 rounded border border-slate-200"
                  >
                    <div className="flex items-start space-x-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0"></span>
                      <div>
                        <span className="font-semibold text-slate-800 mr-2">{log.actor}:</span>
                        <span className="text-slate-600">{log.action}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1 flex-shrink-0 ml-4">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No audit log entries found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
