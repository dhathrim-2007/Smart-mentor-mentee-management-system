import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthRole } from '../../context/AuthRoleContext';
import { api } from '../../services/api';
import SviGauge from '../../components/SviGauge';
import AudioVoiceRecorder from '../../components/AudioVoiceRecorder';
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  Moon,
  Shield,
  Users,
  Mic,
  FileText,
  PhoneCall,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  HeartHandshake,
  Scale,
  ShieldAlert
} from 'lucide-react';

export default function PeriodicCheckinFlow() {
  const { t, currentLang } = useLanguage();
  const { activeCase, updateActiveCase } = useAuthRole();
  const navigate = useNavigate();

  // Multi-step: 1 = Emotional Mood, 2 = Safety & Fear, 3 = Sleep Quality, 4 = Social & Functioning, 5 = Text/Voice, 6 = Results
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [answers, setAnswers] = useState({
    mood: 5, // 0 = peaceful, 10 = acute distress
    safety: 3, // 0 = very safe, 10 = high fear/threats
    fear: 3,
    sleep: 4, // 0 = restful, 10 = severe insomnia
    isolation: 3, // 0 = strong support, 10 = ostracized
    dailyFunctioning: 3 // 0 = managing well, 10 = impaired
  });

  const [narrativeText, setNarrativeText] = useState('');
  const [voiceMetadata, setVoiceMetadata] = useState(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  // Processing and submission states
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkinResult, setCheckinResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sliders handler
  const handleSliderChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // Submit check-in to backend
  const handleSubmitCheckin = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const payload = {
        caseId: activeCase?.id || 'CASE-1040',
        answers,
        text: narrativeText,
        voiceData: voiceMetadata,
        language: currentLang,
        event: 'Periodic well-being check-in submitted'
      };

      const res = await api.submitPeriodicCheckin(payload);

      if (res.success) {
        setCheckinResult(res.data);
        if (res.data.case) {
          updateActiveCase(res.data.case);
        }
        setCurrentStep(6); // Go to Results Screen
      }
    } catch (err) {
      console.error('Error submitting check-in:', err);
      setErrorMessage(err.message || 'Error occurred while analyzing check-in.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Stepper Indicator (1 to 5) */}
      {currentStep <= 5 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="text-gov-blue">Step {currentStep} of 5</span>
            <span className="font-normal text-slate-400">Periodic Well-being Check-in</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-gov-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* STEP 1: EMOTIONAL STATE & MOOD */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
              Question 1 of 5
            </span>
            <h2 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight mt-1">
              {t('checkinStep1Title')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('checkinStep1Desc')}
            </p>
          </div>

          {/* Visual Mood Scale Indicator */}
          <div className="flex items-center justify-between px-2 pt-4">
            <div className="text-center">
              <Smile className={`w-8 h-8 mx-auto ${answers.mood <= 3 ? 'text-emerald-500 scale-110' : 'text-slate-300'}`} />
              <span className="text-[11px] text-slate-500 mt-1 block">Peaceful</span>
            </div>
            <div className="text-center">
              <Meh className={`w-8 h-8 mx-auto ${answers.mood > 3 && answers.mood <= 7 ? 'text-amber-500 scale-110' : 'text-slate-300'}`} />
              <span className="text-[11px] text-slate-500 mt-1 block">Somewhat Worried</span>
            </div>
            <div className="text-center">
              <Frown className={`w-8 h-8 mx-auto ${answers.mood > 7 ? 'text-red-500 scale-110' : 'text-slate-300'}`} />
              <span className="text-[11px] text-slate-500 mt-1 block">Severe Distress</span>
            </div>
          </div>

          {/* Touch-Friendly Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Distress Severity:</span>
              <span className="text-base font-black font-mono text-gov-blue bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                {answers.mood} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={answers.mood}
              onChange={(e) => handleSliderChange('mood', e.target.value)}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-blue"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 (Calm)</span>
              <span>5 (Moderate)</span>
              <span>10 (Overwhelming)</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-xs transition-colors min-h-[44px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SAFETY & FEAR INDICATORS */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
              Question 2 of 5
            </span>
            <h2 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight mt-1">
              {t('checkinStep2Title')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('checkinStep2Desc')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Perceived Threat / Insecurity:</span>
                <span className="text-base font-black font-mono text-gov-blue bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  {answers.safety} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={answers.safety}
                onChange={(e) => {
                  handleSliderChange('safety', e.target.value);
                  handleSliderChange('fear', e.target.value);
                }}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-blue"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 (Completely Safe)</span>
                <span>5 (Uneasy / Stalking fear)</span>
                <span>10 (Direct Physical Threat)</span>
              </div>
            </div>

            {/* Qualitative Helper Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => { handleSliderChange('safety', 2); handleSliderChange('fear', 2); }}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  answers.safety <= 3 ? 'border-gov-blue bg-blue-50/70 font-bold text-gov-navy' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="font-semibold">I Feel Safe</div>
                <div className="text-[10px] text-slate-500">No recent threats or intimidation</div>
              </button>

              <button
                type="button"
                onClick={() => { handleSliderChange('safety', 6); handleSliderChange('fear', 6); }}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  answers.safety > 3 && answers.safety <= 7 ? 'border-amber-500 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="font-semibold">Apprehensive</div>
                <div className="text-[10px] text-slate-500">Verbal threats or hostility</div>
              </button>

              <button
                type="button"
                onClick={() => { handleSliderChange('safety', 9); handleSliderChange('fear', 9); }}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  answers.safety > 7 ? 'border-red-500 bg-red-50 font-bold text-red-900' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="font-semibold">In Immediate Danger</div>
                <div className="text-[10px] text-slate-500">Physical violence or coercion</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-xs transition-colors min-h-[44px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SLEEP QUALITY & REST */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
              Question 3 of 5
            </span>
            <h2 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight mt-1">
              {t('checkinStep3Title')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('checkinStep3Desc')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Sleep Impairment / Insomnia:</span>
              </span>
              <span className="text-base font-black font-mono text-gov-blue bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                {answers.sleep} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={answers.sleep}
              onChange={(e) => handleSliderChange('sleep', e.target.value)}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-blue"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 (Sleeping well)</span>
              <span>5 (Interrupted / Restless)</span>
              <span>10 (Severe Insomnia / Nightmares)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-xs transition-colors min-h-[44px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SOCIAL ISOLATION & DAILY FUNCTIONING */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
              Question 4 of 5
            </span>
            <h2 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight mt-1">
              {t('checkinStep4Title')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('checkinStep4Desc')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Social Isolation / Ostracism:</span>
                <span className="text-base font-black font-mono text-gov-blue bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  {answers.isolation} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={answers.isolation}
                onChange={(e) => handleSliderChange('isolation', e.target.value)}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-blue"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 (Good Support)</span>
                <span>5 (Feeling Left Out)</span>
                <span>10 (Boycott / Complete Isolation)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Difficulty in Daily Functioning / Work:</span>
                <span className="text-base font-black font-mono text-gov-blue bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  {answers.dailyFunctioning} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={answers.dailyFunctioning}
                onChange={(e) => handleSliderChange('dailyFunctioning', e.target.value)}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-blue"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 (Able to Manage)</span>
                <span>5 (Struggling at Work/Home)</span>
                <span>10 (Cannot Function)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-xs transition-colors min-h-[44px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: OPTIONAL NARRATIVE & VOICE RESPONSE */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest block">
              Question 5 of 5
            </span>
            <h2 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight mt-1">
              {t('checkinStep5Title')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('checkinStep5Desc')}
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Toggle Voice / Text */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
              className="flex items-center space-x-1.5 text-xs font-bold text-gov-blue hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 min-h-[40px]"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{showVoiceRecorder ? 'Switch to Text Box' : 'Record Voice Instead'}</span>
            </button>
          </div>

          {showVoiceRecorder ? (
            <AudioVoiceRecorder
              onRecordingComplete={(data) => {
                setNarrativeText(data.text);
                setVoiceMetadata(data.audioMetadata);
                setShowVoiceRecorder(false);
              }}
              onCancel={() => setShowVoiceRecorder(false)}
            />
          ) : (
            <div className="space-y-3">
              {voiceMetadata && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Voice Attached: {voiceMetadata.durationSeconds}s • {voiceMetadata.pauseCount} pauses</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceMetadata(null)}
                    className="underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}

              <textarea
                value={narrativeText}
                onChange={(e) => setNarrativeText(e.target.value)}
                rows={4}
                placeholder="Optional: Mention any recent court dates, incidents, threats, or changes in how you feel..."
                className="w-full p-3.5 text-xs text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gov-blue focus:border-gov-blue focus:outline-none placeholder-slate-400 font-normal leading-relaxed resize-y"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSubmitCheckin}
              className="flex items-center space-x-2 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-colors min-h-[44px] disabled:opacity-50"
            >
              <Activity className="w-4 h-4" />
              <span>{isProcessing ? 'Evaluating Telemetry...' : 'Submit & Analyze Check-in'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: CHECK-IN RESULT & SUPPORT PLAN */}
      {currentStep === 6 && checkinResult && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
          {/* Top Success Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-xs text-emerald-900 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Check-in Processed Successfully</h3>
              <p className="mt-0.5 text-emerald-800 leading-relaxed">
                Your longitudinal record has been updated. If additional support is helpful, your assigned counsellor will be notified.
              </p>
            </div>
          </div>

          {/* Dynamic Distress Score Gauge Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex justify-center">
                <SviGauge
                  score={checkinResult.score}
                  riskLevel={checkinResult.riskLevel}
                  confidence={0.93}
                  size={190}
                />
              </div>

              <div className="md:col-span-7 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Dynamic Distress Score
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl font-black text-gov-navy font-mono">
                      {checkinResult.score}/100
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      checkinResult.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      checkinResult.riskLevel === 'ELEVATED' ? 'bg-orange-100 text-orange-800' :
                      checkinResult.riskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {checkinResult.riskCategory}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Previous Check-in</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {checkinResult.previousScore}/100
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Rate of Change</span>
                    <span className={`font-bold font-mono ${checkinResult.change > 0 ? 'text-red-600' : checkinResult.change < 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {checkinResult.change > 0 ? `+${checkinResult.change}` : checkinResult.change} pts
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-[11px] text-slate-700 leading-relaxed">
                  <strong className="text-gov-navy block font-semibold">Longitudinal Prediction:</strong>
                  <span>{checkinResult.predictionReason}</span>
                </div>
              </div>
            </div>

            {/* Explainable Factor Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Observable Factor Weighting (Why was this score computed?)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Threat / Fear</span>
                  <span className="font-bold text-slate-900">{checkinResult.explainability?.safetyScore || 30}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Sleep Disruption</span>
                  <span className="font-bold text-slate-900">{checkinResult.explainability?.sleepScore || 40}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Emotional Mood</span>
                  <span className="font-bold text-slate-900">{checkinResult.explainability?.moodScore || 50}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Social Isolation</span>
                  <span className="font-bold text-slate-900">{checkinResult.explainability?.isolationScore || 30}%</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                *AI-assisted risk/triage indicator — not a medical diagnosis.
              </p>
            </div>
          </div>

          {/* Recommended Support Actions */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Recommended Next Support Steps
            </h4>
            <div className="space-y-2">
              {checkinResult.recommendations?.map((rec, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">{rec.title}</span>
                    <span className="text-slate-600 text-[11px] block mt-0.5">{rec.action}</span>
                    <span className="text-[10px] text-slate-400 italic block mt-1">Reason: {rec.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/victim/history"
              className="flex-1 bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs py-3.5 rounded-xl text-center shadow-xs transition-colors min-h-[44px] flex items-center justify-center space-x-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View Longitudinal History Graph</span>
            </Link>
            <Link
              to="/victim"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 px-6 rounded-xl text-center transition-colors min-h-[44px] flex items-center justify-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
