import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, PhoneCall, UserCheck, X, CheckCircle, Radio } from 'lucide-react';

export default function CriticalAlertModal({ alertCase, onClose, onQuickEscalate }) {
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalatedSuccess, setEscalatedSuccess] = useState(false);

  if (!alertCase) return null;

  const handleEscalate = async (protocol) => {
    setIsEscalating(true);
    try {
      await onQuickEscalate(alertCase.id, protocol);
      setEscalatedSuccess(true);
      setTimeout(() => {
        setEscalatedSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEscalating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-red-500 animate-in fade-in zoom-in-95">
        {/* Urgent Header */}
        <div className="bg-red-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest bg-red-800 px-2 py-0.5 rounded">
                  PRIORITY 1
                </span>
                <h2 className="text-lg font-black tracking-tight">CRITICAL ALERT</h2>
              </div>
              <p className="text-xs text-red-100">National Helpline Immediate Escalation Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-slate-800">
          {escalatedSuccess ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-900">Emergency Protocol Dispatched</h3>
              <p className="text-xs text-slate-600">
                Liaison alert sent to District Control Room & MoSJE Special Nodal Officer.
              </p>
            </div>
          ) : (
            <>
              {/* Alert Metrics Card */}
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-red-950">{alertCase.id}</span>
                  <span className="bg-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                    SVI: {alertCase.svi} / 100
                  </span>
                </div>
                <div className="text-xs text-red-900 space-y-1">
                  <div>
                    <span className="font-semibold">Channel & Language:</span> {alertCase.channel} • {alertCase.language}
                  </div>
                  <div>
                    <span className="font-semibold">Coarse Jurisdiction:</span> {alertCase.district || 'District'}, {alertCase.state}
                  </div>
                  <div>
                    <span className="font-semibold">Key Distress Indicators:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {alertCase.keyIndicators?.map((k, idx) => (
                        <span key={idx} className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[11px] font-semibold border border-red-200">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Redacted Narrative */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">Interaction Excerpt:</span>
                <p className="italic leading-relaxed">
                  "{alertCase.narrativeSummary || alertCase.narrative}"
                </p>
              </div>

              {/* Warning Notice */}
              <div className="flex items-start space-x-2 bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  Severe threat indicators detected. System mandates authorized human officer intervention within 15 minutes.
                </p>
              </div>

              {/* Escalation Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isEscalating}
                  onClick={() => handleEscalate('Special Police PoA Escort')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Dispatch Special PoA Police Liaison & Escort</span>
                </button>

                <button
                  type="button"
                  disabled={isEscalating}
                  onClick={() => handleEscalate('Emergency Crisis Counsellor')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign Emergency Crisis Counsellor</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
