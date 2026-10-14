import React, { useState } from 'react';
import { api } from '../services/api';
import SviGauge from '../components/SviGauge';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Play,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Send,
  RefreshCw,
  Sliders,
  Layers
} from 'lucide-react';

export default function DemoSandbox() {
  const [inputText, setInputText] = useState(
    'They are threatening me and I am terrified. I don\'t know what to do anymore. I feel like there is no way out.'
  );
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [includeVoiceSignals, setIncludeVoiceSignals] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [pushedCaseId, setPushedCaseId] = useState(null);

  const testScenarios = [
    {
      id: 1,
      title: 'Scenario 1 — Low Risk',
      subtitle: 'Information about legal procedure',
      expected: 'SVI ~15–25 (LOW)',
      color: 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      text: 'I need information about the complaint procedure and legal process under the NHAA portal.'
    },
    {
      id: 2,
      title: 'Scenario 2 — Moderate',
      subtitle: 'Anxiety & sleep disruption',
      expected: 'SVI ~40–50 (MODERATE)',
      color: 'border-amber-200 bg-amber-50/50 hover:border-amber-500',
      badgeColor: 'bg-amber-100 text-amber-800',
      text: 'I am very worried about the case and I have been unable to sleep properly. I need someone to guide me.'
    },
    {
      id: 3,
      title: 'Scenario 3 — High Risk',
      subtitle: 'Retaliatory threats & displacement fear',
      expected: 'SVI ~65–75 (HIGH)',
      color: 'border-orange-200 bg-orange-50/50 hover:border-orange-500',
      badgeColor: 'bg-orange-100 text-orange-800',
      text: 'I am afraid to return home. They have threatened me because I complained. I don\'t feel safe.'
    },
    {
      id: 4,
      title: 'Scenario 4 — Critical',
      subtitle: 'Imminent threat & acute terror',
      expected: 'SVI ~80–95 (CRITICAL)',
      color: 'border-red-200 bg-red-50/50 hover:border-red-500',
      badgeColor: 'bg-red-100 text-red-800',
      text: 'They are threatening me and I am terrified. I don\'t know what to do anymore. I feel like there is no way out.'
    }
  ];

  const handleSelectScenario = (sc) => {
    setInputText(sc.text);
    setPushedCaseId(null);
  };

  const handleRunEvaluation = async () => {
    setLoading(true);
    setPushedCaseId(null);
    try {
      const simulatedVoiceData = includeVoiceSignals ? {
        durationSeconds: 15,
        pauseCount: inputText.toLowerCase().includes('terrified') ? 7 : inputText.toLowerCase().includes('worried') ? 4 : 1,
        averagePauseDurationSec: inputText.toLowerCase().includes('terrified') ? 2.2 : 1.1,
        pitchVariabilityHz: inputText.toLowerCase().includes('terrified') ? 80 : 30
      } : null;

      const res = await api.analyzeAssessment({
        text: inputText,
        language: selectedLanguage,
        voiceData: simulatedVoiceData,
        channel: includeVoiceSignals ? 'Voice' : 'Web'
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Evaluation error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePushToDashboard = async () => {
    if (!result) return;
    try {
      const res = await api.createCase({
        victimNameMasked: 'Judge Demo Tester',
        phoneMasked: '******9999',
        channel: includeVoiceSignals ? 'Voice' : 'Web',
        language: selectedLanguage === 'hi' ? 'Hindi' : selectedLanguage === 'te' ? 'Telugu' : 'English',
        state: 'Telangana',
        district: 'Hyderabad',
        svi: result.svi,
        riskLevel: result.riskLevel,
        confidence: result.confidence,
        indicators: result.indicators,
        narrative: inputText,
        narrativeSummary: result.summary,
        recommendations: result.recommendations,
        explainability: result.explainability,
        acousticMetrics: result.acousticMetrics,
        immediateSafetyAlert: result.immediateSafetyAlert
      });
      setPushedCaseId(res.data.id);
    } catch (err) {
      console.error(err);
      alert('Failed to register case with server.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart India Hackathon • Evaluation Sandbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Assessment & Stress Vulnerability Sandbox
          </h1>
          <p className="text-xs text-slate-300">
            Test pre-calibrated official SIH scenarios or enter arbitrary custom text to observe real-time SVI calculation, explainability weights, and acoustic telemetry.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="bg-gov-blue hover:bg-blue-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors flex items-center space-x-2 flex-shrink-0"
        >
          <Layers className="w-4 h-4" />
          <span>Open Live Officer Monitor &rarr;</span>
        </Link>
      </div>

      {/* Preset Scenario Cards */}
      <div>
        <h2 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3">
          1. Select a Benchmark SIH Scenario (Or Type Custom Narrative Below):
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testScenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(sc)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between shadow-sm ${sc.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">{sc.title}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${sc.badgeColor}`}>
                    {sc.expected}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mb-3">{sc.subtitle}</p>
                <p className="text-xs text-slate-700 italic line-clamp-3 bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                  "{sc.text}"
                </p>
              </div>
              <div className="pt-3 flex items-center justify-between text-[11px] font-bold text-gov-blue">
                <span>Load Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Input & Controls */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
          2. Narrative Text & Acoustic Ingestion Parameters:
        </h2>

        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter custom victim narrative in English, Hindi, or Telugu..."
          className="w-full p-4 text-xs sm:text-sm text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gov-blue focus:outline-none leading-relaxed font-mono"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Linguistic Context:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-semibold text-slate-800"
              >
                <option value="en">English (EN)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="te">Telugu (తెలుగు)</option>
              </select>
            </div>

            {/* Acoustic Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeVoiceSignals}
                onChange={(e) => setIncludeVoiceSignals(e.target.checked)}
                className="rounded border-slate-300 text-gov-blue focus:ring-gov-blue"
              />
              <span>Attach Simulated Acoustic Telemetry (Pauses & Jitter)</span>
            </label>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleRunEvaluation}
            className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{loading ? 'Evaluating Model...' : 'Run Live AI Risk Evaluation'}</span>
          </button>
        </div>
      </div>

      {/* Live AI Results Preview */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-bold text-gov-navy uppercase tracking-wider">
                  AI Model Evaluation Output
                </h3>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-mono">
                Model Confidence: {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-6">
              {/* Gauge */}
              <div className="md:col-span-5 flex justify-center">
                <SviGauge
                  score={result.svi}
                  riskLevel={result.riskLevel}
                  confidence={result.confidence}
                  size={190}
                />
              </div>

              {/* Indicators & Explainability */}
              <div className="md:col-span-7 space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px] mb-2">
                    Detected Distress & Threat Markers:
                  </span>
                  <div className="space-y-1.5">
                    {result.indicators?.map((ind, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800">{ind.name}</span>
                        <span className="font-bold font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {ind.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explainability Horizontal Bars */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px]">
                    Observable Feature Contribution Weights:
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <div className="flex justify-between text-slate-500 mb-0.5">
                        <span>Threat Perception</span>
                        <span className="font-bold text-slate-800">{result.explainability?.threatScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${result.explainability?.threatScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-500 mb-0.5">
                        <span>Fear Indicators</span>
                        <span className="font-bold text-slate-800">{result.explainability?.fearScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${result.explainability?.fearScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-500 mb-0.5">
                        <span>Emotional Distress</span>
                        <span className="font-bold text-slate-800">{result.explainability?.distressScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${result.explainability?.distressScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-500 mb-0.5">
                        <span>Temporal Urgency</span>
                        <span className="font-bold text-slate-800">{result.explainability?.urgencyScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${result.explainability?.urgencyScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Recommendations */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px] mb-2">
                Recommended Statutory Support Pathways:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {result.recommendations?.map((r, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gov-blue flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Direct Push To Live Officer Dashboard */}
          <div className="bg-gov-navy text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                Live End-to-End System Demonstration
              </span>
              <h4 className="font-bold text-sm mt-0.5">
                Push This Scenario into the Live Officer Monitor
              </h4>
              <p className="text-xs text-slate-300">
                Creates a new case on the backend database and updates the officer triage queue immediately.
              </p>
            </div>

            {pushedCaseId ? (
              <div className="flex items-center space-x-3">
                <span className="text-emerald-400 text-xs font-bold font-mono">
                  Created: {pushedCaseId}
                </span>
                <Link
                  to="/dashboard"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  View on Dashboard &rarr;
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePushToDashboard}
                className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Live Monitor</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
