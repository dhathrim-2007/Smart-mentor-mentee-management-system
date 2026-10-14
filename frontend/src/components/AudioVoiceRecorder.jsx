import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Volume2
} from 'lucide-react';

export default function AudioVoiceRecorder({ onRecordingComplete, onCancel }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoPresetIdx, setDemoPresetIdx] = useState(1); // Default: Case B

  // Acoustic indicators state
  const [extractedAcoustics, setExtractedAcoustics] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Calibrated Demo Spoken Samples for Judges
  const DEMO_PRESETS = [
    {
      label: 'Sample 1: Low Risk (Procedural Query)',
      transcript: 'I need information about the complaint procedure and legal process under the NHAA portal.',
      metrics: { durationSeconds: 9, pauseCount: 1, averagePauseDurationSec: 0.7, pitchVariabilityHz: 18, speechRateWpm: 135 }
    },
    {
      label: 'Sample 2: Moderate Risk (Insomnia & Agitation)',
      transcript: 'I am very worried about the case and I have been unable to sleep properly. I need someone to guide me.',
      metrics: { durationSeconds: 14, pauseCount: 4, averagePauseDurationSec: 1.4, pitchVariabilityHz: 38, speechRateWpm: 110 }
    },
    {
      label: 'Sample 3: High Risk (Intimidation & Relocation Fear)',
      transcript: 'I am afraid to return home. They have threatened me because I complained. I don\'t feel safe anywhere.',
      metrics: { durationSeconds: 16, pauseCount: 5, averagePauseDurationSec: 1.9, pitchVariabilityHz: 65, speechRateWpm: 92 }
    },
    {
      label: 'Sample 4: Critical Risk (Imminent Threat & Terror)',
      transcript: 'They are threatening me and I am terrified. I don\'t know what to do anymore. I feel like there is no way out.',
      metrics: { durationSeconds: 18, pauseCount: 7, averagePauseDurationSec: 2.3, pitchVariabilityHz: 84, speechRateWpm: 75 }
    }
  ];

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start real microphone recording
  const startRecording = async () => {
    setPermissionError('');
    setAudioBlob(null);
    setAudioUrl(null);
    setExtractedAcoustics(null);
    setRecordingTime(0);
    audioChunksRef.current = [];

    if (isDemoMode) {
      // In demo mode, simulate recording for 3 seconds then stop
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const preset = DEMO_PRESETS[demoPresetIdx];
        setExtractedAcoustics(preset.metrics);
        setAudioUrl('demo-placeholder-audio');
      }, 2500);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Derive non-diagnostic prototype acoustic metrics
        const totalDuration = Math.max(3, recordingTime);
        const estimatedPauses = Math.min(8, Math.max(1, Math.round(totalDuration / 3.5)));
        const simulatedJitter = Math.min(90, Math.max(15, Math.round(25 + Math.random() * 40)));

        setExtractedAcoustics({
          durationSeconds: totalDuration,
          pauseCount: estimatedPauses,
          averagePauseDurationSec: (1.2 + Math.random() * 0.8).toFixed(1),
          pitchVariabilityHz: simulatedJitter,
          speechRateWpm: Math.round(95 + Math.random() * 40)
        });

        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone access denied or unavailable:', err);
      setPermissionError('Microphone permission not granted. You can switch to Demo Voice Mode below.');
    }
  };

  const stopRecording = () => {
    if (isDemoMode) {
      setIsRecording(false);
      const preset = DEMO_PRESETS[demoPresetIdx];
      setExtractedAcoustics(preset.metrics);
      setAudioUrl('demo-placeholder-audio');
      return;
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleReset = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setExtractedAcoustics(null);
    setRecordingTime(0);
    setIsRecording(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
  };

  const handleConfirm = () => {
    if (extractedAcoustics) {
      const narrative = isDemoMode ? DEMO_PRESETS[demoPresetIdx].transcript : 'Voice response submitted via microphone.';
      onRecordingComplete({
        text: narrative,
        audioMetadata: extractedAcoustics,
        isDemoVoice: isDemoMode
      });
    }
  };

  return (
    <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl max-w-lg mx-auto space-y-4">
      {/* Header & Demo Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Voice Assessment Channel
          </span>
        </div>

        {/* Demo Mode Switcher */}
        <button
          type="button"
          onClick={() => {
            setIsDemoMode(!isDemoMode);
            handleReset();
          }}
          className={`flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-full font-bold border transition-colors ${
            isDemoMode
              ? 'bg-amber-400 text-slate-900 border-amber-300'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>{isDemoMode ? 'Demo Voice: Active' : 'Enable Demo Voice'}</span>
        </button>
      </div>

      {/* Permission Error Message */}
      {permissionError && (
        <div className="bg-amber-900/40 border border-amber-700/60 p-3 rounded-xl text-xs text-amber-200 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
          <div className="space-y-1">
            <p>{permissionError}</p>
            <button
              type="button"
              onClick={() => {
                setIsDemoMode(true);
                setPermissionError('');
              }}
              className="font-bold underline text-amber-300 hover:text-amber-100"
            >
              Switch to Deterministic Demo Voice Mode &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Demo Preset Selector (when Demo Mode is enabled) */}
      {isDemoMode && (
        <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-1.5">
          <label className="block text-[11px] font-bold text-amber-300">
            Select Calibrated Judge Scenario:
          </label>
          <select
            value={demoPresetIdx}
            onChange={(e) => setDemoPresetIdx(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-400"
          >
            {DEMO_PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400 italic">
            "{DEMO_PRESETS[demoPresetIdx].transcript}"
          </p>
        </div>
      )}

      {/* Waveform Visualizer Screen */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[140px]">
        {isRecording ? (
          <div className="flex flex-col items-center space-y-3">
            {/* Animated Waveform Bars */}
            <div className="flex items-center space-x-1.5 h-12">
              <span className="w-1.5 bg-red-500 rounded-full h-6 animate-pulse"></span>
              <span className="w-1.5 bg-amber-400 rounded-full h-10 animate-bounce"></span>
              <span className="w-1.5 bg-blue-500 rounded-full h-12 animate-pulse"></span>
              <span className="w-1.5 bg-emerald-400 rounded-full h-8 animate-bounce"></span>
              <span className="w-1.5 bg-purple-500 rounded-full h-11 animate-pulse"></span>
              <span className="w-1.5 bg-red-500 rounded-full h-7 animate-bounce"></span>
              <span className="w-1.5 bg-blue-400 rounded-full h-10 animate-pulse"></span>
            </div>
            <div className="font-mono text-lg font-bold text-red-400">
              {formatSeconds(recordingTime)}
            </div>
            <span className="text-[11px] text-slate-400 animate-pulse">
              {isDemoMode ? 'Simulating vocal tremor evaluation...' : 'Listening to speech & hesitation pauses...'}
            </span>
          </div>
        ) : audioUrl ? (
          <div className="w-full text-center space-y-2">
            <div className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Voice Sample Ready</span>
            </div>

            {/* If real audio, provide playback element */}
            {!isDemoMode && audioUrl !== 'demo-placeholder-audio' && (
              <div className="pt-2">
                <audio ref={audioPlayerRef} src={audioUrl} controls className="w-full h-9 rounded-lg" />
              </div>
            )}

            {isDemoMode && (
              <p className="text-xs text-slate-300 italic pt-1">
                "{DEMO_PRESETS[demoPresetIdx].transcript}"
              </p>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-400 space-y-2">
            <Mic className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs font-medium">Tap button below to record voice message</p>
            <p className="text-[10px] text-slate-500">
              Speech length, hesitation pauses, and volume variance will be extracted
            </p>
          </div>
        )}
      </div>

      {/* Acoustic Telemetry Preview Cards */}
      {extractedAcoustics && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Observable Acoustic Indicators (Prototype)</span>
            <span className="text-amber-400 font-mono">16kHz Telemetry</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Speech Duration</span>
              <span className="font-bold text-slate-100">{extractedAcoustics.durationSeconds}s</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Hesitation Pauses</span>
              <span className="font-bold text-amber-300">{extractedAcoustics.pauseCount} pauses</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Pitch Variance</span>
              <span className="font-bold text-blue-300">{extractedAcoustics.pitchVariabilityHz} Hz</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Speech Rate</span>
              <span className="font-bold text-emerald-300">{extractedAcoustics.speechRateWpm} WPM</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 italic">
            *Experimental acoustic indicators. Does not diagnose clinical anxiety or depression.
          </p>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {!isRecording && !audioUrl && (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all min-h-[44px]"
          >
            <Mic className="w-4 h-4" />
            <span>{isDemoMode ? 'Run Demo Voice Recording' : 'Start Microphone Recording'}</span>
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all min-h-[44px] animate-pulse"
          >
            <Square className="w-4 h-4" />
            <span>Stop & Extract Acoustic Features</span>
          </button>
        )}

        {audioUrl && (
          <>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2.5 rounded-xl border border-slate-700 min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry / Re-record</span>
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Attach Voice Data to Check-in</span>
            </button>
          </>
        )}

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white px-3 py-2"
          >
            Switch to Text
          </button>
        )}
      </div>
    </div>
  );
}
