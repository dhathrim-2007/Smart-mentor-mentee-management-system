import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import SviGauge from '../components/SviGauge';
import AudioRecorderSim from '../components/AudioRecorderSim';
import {
  Activity,
  Globe,
  ShieldCheck,
  Mic,
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
  PhoneCall,
  Sparkles,
  HeartHandshake,
  Scale,
  Stethoscope,
  ShieldAlert,
  HelpCircle,
  Lock
} from 'lucide-react';

export default function AssessmentFlow() {
  const { currentLang, setLanguage, languages, t } = useLanguage();
  const navigate = useNavigate();

  // Wizard state: 1 = Language, 2 = Consent, 3 = Narrative/Voice, 4 = Processing, 5 = Results
  const [currentStep, setCurrentStep] = useState(1);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [consentDisclaimerChecked, setConsentDisclaimerChecked] = useState(false);

  // Input states
  const [narrativeText, setNarrativeText] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceMetadata, setVoiceMetadata] = useState(null);

  // Processing & Results
  const [processingStage, setProcessingStage] = useState(0);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isSubmittingCase, setIsSubmittingCase] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Processing pipeline stages
  const processingStages = [
    'Processing natural language and multi-dialect tokens...',
    'Extracting emotional stress and fear indicators...',
    'Evaluating temporal urgency and threat markers...',
    'Analyzing acoustic speech patterns, pauses and vocal strain...',
    'Synthesizing Stress Vulnerability Index (SVI)...',
    'Generating prioritized support recommendations...'
  ];

  // Quick preset scenarios for testing & judges
  const presetScenarios = [
    {
      title: 'Scenario 1: Low Risk',
      desc: 'Procedural information inquiry',
      expected: 'SVI ~15-25 (LOW)',
      text: 'I need information about the complaint procedure and legal process under the NHAA portal.'
    },
    {
      title: 'Scenario 2: Moderate Risk',
      desc: 'Sleep anxiety & case worry',
      expected: 'SVI ~40-50 (MODERATE)',
      text: 'I am very worried about the case and I have been unable to sleep properly. I need someone to guide me.'
    },
    {
      title: 'Scenario 3: High Risk',
      desc: 'Retaliatory threats & fear of return',
      expected: 'SVI ~65-75 (HIGH)',
      text: 'I am afraid to return home. They have threatened me because I complained. I don\'t feel safe.'
    },
    {
      title: 'Scenario 4: Critical Risk',
      desc: 'Imminent danger & feelings of no escape',
      expected: 'SVI ~85-95 (CRITICAL)',
      text: 'They are threatening me and I am terrified. I don\'t know what to do anymore. I feel like there is no way out.'
    }
  ];

  // Load a preset scenario into the narrative box
  const loadScenario = (preset) => {
    setNarrativeText(preset.text);
    setVoiceMetadata(null);
  };

  // Trigger analysis
  const handleStartAnalysis = async () => {
    if (!narrativeText.trim()) {
      setErrorMessage('Please enter a description of what you are experiencing, or record your voice.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(4); // Move to Processing
    setProcessingStage(0);

    // Simulate progressive processing animations
    const interval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev < processingStages.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 450);

    try {
      const response = await api.analyzeAssessment({
        text: narrativeText,
        language: currentLang,
        voiceData: voiceMetadata,
        channel: voiceMetadata ? 'Voice' : 'Web'
      });

      setTimeout(() => {
        clearInterval(interval);
        setAssessmentResult(response.data);
        setCurrentStep(5); // Move to Results
      }, 2400);
    } catch (err) {
      clearInterval(interval);
      setErrorMessage(err.message || 'Error occurred during AI analysis');
      setCurrentStep(3);
    }
  };

  // Submit assessment as an official case to the Officer Dashboard
  const handleSubmitCase = async () => {
    if (!assessmentResult) return;
    setIsSubmittingCase(true);
    try {
      const casePayload = {
        victimNameMasked: 'A*** R*****',
        phoneMasked: '******8194',
        channel: voiceMetadata ? 'Voice' : 'Web',
        language: languages.find(l => l.code === currentLang)?.label || 'English',
        state: 'Telangana',
        district: 'Warangal',
        svi: assessmentResult.svi,
        riskLevel: assessmentResult.riskLevel,
        confidence: assessmentResult.confidence,
        indicators: assessmentResult.indicators,
        narrative: narrativeText,
        narrativeSummary: assessmentResult.summary,
        recommendations: assessmentResult.recommendations,
        explainability: assessmentResult.explainability,
        acousticMetrics: assessmentResult.acousticMetrics,
        immediateSafetyAlert: assessmentResult.immediateSafetyAlert
      };

      const res = await api.createCase(casePayload);
      setCreatedCaseId(res.data.id);
    } catch (err) {
      console.error(err);
      alert('Failed to register case with server.');
    } finally {
      setIsSubmittingCase(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Stepper Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span className={currentStep >= 1 ? 'text-gov-blue' : ''}>1. Language</span>
          <span className={currentStep >= 2 ? 'text-gov-blue' : ''}>2. Consent</span>
          <span className={currentStep >= 3 ? 'text-gov-blue' : ''}>3. Narrative</span>
          <span className={currentStep >= 4 ? 'text-gov-blue' : ''}>4. AI Analysis</span>
          <span className={currentStep >= 5 ? 'text-gov-blue' : ''}>5. SVI & Support</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-gov-blue h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Emergency Strip */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 flex items-center justify-between text-xs text-red-900">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{t('emergencyBanner')}</span>
        </div>
        <a
          href="tel:14566"
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded text-[11px] flex-shrink-0 ml-2"
        >
          Call 14566
        </a>
      </div>

      {/* STEP 1: LANGUAGE SELECTION */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="w-12 h-12 rounded-full bg-gov-lightBlue text-gov-navy flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight">
              {t('stepLanguage')}
            </h2>
            <p className="text-xs text-slate-500">
              Please choose the language you are most comfortable communicating in.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-4">
            {languages.map((lang) => {
              const selected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    selected
                      ? 'border-gov-blue bg-blue-50/70 text-gov-navy ring-2 ring-gov-blue'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block text-sm font-bold">{lang.native}</span>
                  <span className="block text-[11px] text-slate-500">{lang.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors"
            >
              <span>Continue to Consent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TRANSPARENT CONSENT */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gov-navy">{t('consentHeading')}</h2>
              <p className="text-xs text-slate-500">
                Ethical data governance under DPDP Act & MoSJE guidelines
              </p>
            </div>
          </div>

          {/* Consent Text */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-3 leading-relaxed">
            <p className="font-medium text-slate-800">
              {t('consentText')}
            </p>
            <ul className="space-y-2 list-disc pl-4 text-slate-600">
              <li>
                <strong>Purpose of Processing:</strong> Your narrative and acoustic speech indicators are analyzed in real-time solely to compute an indicative Stress Vulnerability Index (SVI) to triage support services.
              </li>
              <li>
                <strong>Non-Diagnostic Guarantee:</strong> This assessment does not provide psychiatric or medical diagnoses. It identifies observable distress markers to expedite human help.
              </li>
              <li>
                <strong>Confidentiality & Minimization:</strong> Personal identifiers are redacted or masked before being displayed to support operators. Raw voice recordings are discarded post-feature extraction.
              </li>
              <li>
                <strong>Human Oversight:</strong> Support decisions are authorized exclusively by designated MoSJE / NHAA case officers.
              </li>
            </ul>
          </div>

          {/* Non-deceptive Checkbox */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentDisclaimerChecked}
                onChange={(e) => setConsentDisclaimerChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-gov-blue focus:ring-gov-blue"
              />
              <span className="text-xs font-medium text-slate-800">
                {t('consentCheckbox')}
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex space-x-3">
              <Link
                to="/"
                className="text-xs text-slate-500 hover:text-red-600 font-medium px-4 py-2.5 rounded-lg border border-slate-200"
              >
                {t('disagreeBtn')}
              </Link>
              <button
                type="button"
                disabled={!consentDisclaimerChecked}
                onClick={() => {
                  setConsentAgreed(true);
                  setCurrentStep(3);
                }}
                className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{t('agreeBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: NARRATIVE & VOICE INPUT */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-gov-navy">{t('stepNarrative')}</h2>
              <p className="text-xs text-slate-500">{t('narrativePrompt')}</p>
            </div>

            {/* Voice Input Toggle Button */}
            <button
              type="button"
              onClick={() => setVoiceMode(!voiceMode)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                voiceMode
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{voiceMode ? 'Switch to Text Input' : t('voiceOption')}</span>
            </button>
          </div>

          {/* Error banner */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Voice Mode or Text Mode */}
          {voiceMode ? (
            <AudioRecorderSim
              onTranscriptionComplete={(text, audioMeta) => {
                setNarrativeText(text);
                setVoiceMetadata(audioMeta);
                setVoiceMode(false);
              }}
              onCancel={() => setVoiceMode(false)}
            />
          ) : (
            <div className="space-y-4">
              {/* Voice Telemetry Banner if recorded */}
              {voiceMetadata && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Voice Recording Attached: {voiceMetadata.pauseCount} pauses • {voiceMetadata.pitchVariabilityHz} Hz jitter • {voiceMetadata.speechRateWpm} WPM
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceMetadata(null)}
                    className="text-[11px] underline text-emerald-700 hover:text-emerald-900"
                  >
                    Clear Audio
                  </button>
                </div>
              )}

              <textarea
                value={narrativeText}
                onChange={(e) => setNarrativeText(e.target.value)}
                rows={6}
                placeholder={t('narrativePlaceholder')}
                className="w-full p-4 text-sm text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gov-blue focus:border-gov-blue focus:outline-none placeholder-slate-400 font-normal leading-relaxed resize-y"
              />

              {/* Demo Mode Presets for Quick Testing (Judges / Hackathon) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hackathon Demo Scenarios (Click to test deterministic risk tiers):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {presetScenarios.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loadScenario(preset)}
                      className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-gov-blue hover:bg-blue-50/50 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{preset.title}</span>
                        <span className="text-[10px] text-gov-blue bg-blue-100 px-1.5 py-0.2 rounded font-mono">
                          {preset.expected}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{preset.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleStartAnalysis}
              className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>Analyze Stress & Risk Indicators</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI PROCESSING ANIMATION */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-gov-blue border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-gov-blue">
              <Activity className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight">
              {t('analyzingText')}
            </h2>
            <p className="text-xs text-slate-500">
              Evaluating multi-dimensional linguistic, emotional and speech features
            </p>
          </div>

          {/* Sequential Stages Progress */}
          <div className="max-w-md mx-auto space-y-2.5 text-left text-xs">
            {processingStages.map((stage, idx) => {
              const isCompleted = idx < processingStage;
              const isCurrent = idx === processingStage;
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-blue-50 text-gov-blue font-bold border border-blue-200 shadow-sm'
                      : isCompleted
                      ? 'text-emerald-700 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-4 h-4 rounded-full border-2 border-gov-blue border-t-transparent animate-spin flex-shrink-0"></span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0"></span>
                  )}
                  <span>{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: SVI RESULT & SUPPORT PLAN */}
      {currentStep === 5 && assessmentResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Critical Emergency Banner if immediate safety is flagged */}
          {assessmentResult.immediateSafetyAlert && (
            <div className="bg-red-600 text-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h3 className="font-bold text-sm tracking-wide uppercase">
                    Immediate Support Recommended
                  </h3>
                  <p className="text-xs text-red-100 mt-1 leading-relaxed">
                    AI cannot determine your safety with certainty. If you are in immediate danger, contact emergency services or NHAA 14566 immediately and seek help from a trusted person or authorized professional.
                  </p>
                </div>
              </div>
              <a
                href="tel:14566"
                className="bg-white text-red-700 font-black text-xs px-4 py-2.5 rounded-xl hover:bg-red-50 flex-shrink-0 shadow"
              >
                Call 14566 Now
              </a>
            </div>
          )}

          {/* SVI Gauge & Key Indicators Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* SVI Gauge */}
              <div className="md:col-span-5 flex justify-center">
                <SviGauge
                  score={assessmentResult.svi}
                  riskLevel={assessmentResult.riskLevel}
                  confidence={assessmentResult.confidence}
                  size={200}
                />
              </div>

              {/* Detected Indicators */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {t('detectedIndicators')}
                  </span>
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    "Potential indicators detected through linguistic and acoustic analysis."
                  </p>
                </div>

                <div className="space-y-2">
                  {assessmentResult.indicators?.map((ind, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block">{ind.name}</span>
                        <span className="text-slate-600 text-[11px] leading-tight block mt-0.5">
                          {ind.description}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex-shrink-0 ${
                          ind.level === 'CRITICAL'
                            ? 'bg-red-100 text-red-800'
                            : ind.level === 'HIGH'
                            ? 'bg-orange-100 text-orange-800'
                            : ind.level === 'MODERATE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ind.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Explainability Section: Horizontal Progress Bars */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3">
                {t('explainabilityTitle')} (Observable Feature Weights)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Fear-related language</span>
                    <span className="font-bold text-slate-800">{assessmentResult.explainability?.fearScore || 10}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${assessmentResult.explainability?.fearScore || 10}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Threat-related indicators</span>
                    <span className="font-bold text-slate-800">{assessmentResult.explainability?.threatScore || 5}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: `${assessmentResult.explainability?.threatScore || 5}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Distress & anxiety markers</span>
                    <span className="font-bold text-slate-800">{assessmentResult.explainability?.distressScore || 20}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${assessmentResult.explainability?.distressScore || 20}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Temporal urgency indicators</span>
                    <span className="font-bold text-slate-800">{assessmentResult.explainability?.urgencyScore || 15}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${assessmentResult.explainability?.urgencyScore || 15}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Support Plan Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-gov-navy">{t('supportPlanTitle')}</h3>
                <p className="text-xs text-slate-500">
                  Prioritized support matrix mapped by the NHAA triage engine
                </p>
              </div>
              <span className="text-xs font-bold text-gov-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Category: {assessmentResult.supportCategory}
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              {assessmentResult.recommendations?.map((rec, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{rec}</span>
                </li>
              ))}
            </ul>

            <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-[11px] italic">
              "Final intervention decisions should be made by authorized human professionals."
            </div>
          </div>

          {/* Case Submission & Action Area */}
          <div className="bg-gov-navy text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Send Case to NHAA Triage Officer</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Submits this assessment directly to the live Case Officer Intelligence Dashboard.
              </p>
            </div>

            {createdCaseId ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-emerald-400 text-xs font-bold block">Case Registered: {createdCaseId}</span>
                  <span className="text-[11px] text-slate-300">Visible on Officer Live Monitor</span>
                </div>
                <Link
                  to="/dashboard"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  View on Dashboard
                </Link>
              </div>
            ) : (
              <button
                type="button"
                disabled={isSubmittingCase}
                onClick={handleSubmitCase}
                className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingCase ? 'Submitting Case...' : t('requestSupportBtn')}</span>
              </button>
            )}
          </div>

          {/* Restart Assessment Button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setNarrativeText('');
                setVoiceMetadata(null);
                setAssessmentResult(null);
                setCreatedCaseId(null);
                setCurrentStep(3);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Start Another Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
