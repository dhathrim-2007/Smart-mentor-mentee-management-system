import React, { useState, useEffect } from 'react';
import { Mic, Square, Play, Pause, RefreshCw, Volume2, AlertCircle, CheckCircle } from 'lucide-react';

export default function AudioRecorderSim({ onTranscriptionComplete, onCancel }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [transcriptPreview, setTranscriptPreview] = useState('');
  const [acousticData, setAcousticData] = useState(null);
  const [simulatedSampleIdx, setSimulatedSampleIdx] = useState(0);

  // Preset spoken audio samples with realistic acoustic telemetry
  const SAMPLE_VOICE_NARRATIVES = [
    {
      title: 'Sample A: High Retaliation Threat (Telugu/English)',
      text: 'I am afraid to return home. They have threatened me because I complained. I don\'t feel safe anywhere.',
      audioMeta: {
        durationSeconds: 14,
        pauseCount: 5,
        averagePauseDurationSec: 1.8,
        pitchVariabilityHz: 68,
        jitterPercent: 2.9,
        speechRateWpm: 94
      }
    },
    {
      title: 'Sample B: Extreme Helplessness (Hindi/English)',
      text: 'They are threatening me and I am terrified. I don\'t know what to do anymore. I feel like there is no way out.',
      audioMeta: {
        durationSeconds: 18,
        pauseCount: 7,
        averagePauseDurationSec: 2.3,
        pitchVariabilityHz: 82,
        jitterPercent: 3.8,
        speechRateWpm: 76
      }
    },
    {
      title: 'Sample C: Moderate Procedural Anxiety',
      text: 'I am very worried about the case and I have been unable to sleep properly. I need someone to guide me.',
      audioMeta: {
        durationSeconds: 12,
        pauseCount: 3,
        averagePauseDurationSec: 1.2,
        pitchVariabilityHz: 35,
        jitterPercent: 1.5,
        speechRateWpm: 112
      }
    },
    {
      title: 'Sample D: Low Risk Procedural Information',
      text: 'I need information about the complaint procedure and legal process under the NHAA portal.',
      audioMeta: {
        durationSeconds: 9,
        pauseCount: 1,
        averagePauseDurationSec: 0.7,
        pitchVariabilityHz: 19,
        jitterPercent: 0.9,
        speechRateWpm: 135
      }
    }
  ];

  // Timer counter
  useEffect(() => {
    let interval = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setTimerSeconds(0);
    setTranscriptPreview('');
    setAcousticData(null);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);

    // Pick simulated spoken sample
    const sample = SAMPLE_VOICE_NARRATIVES[simulatedSampleIdx % SAMPLE_VOICE_NARRATIVES.length];
    setTranscriptPreview(sample.text);
    setAcousticData(sample.audioMeta);
  };

  const handleConfirmTranscript = () => {
    if (transcriptPreview && acousticData) {
      onTranscriptionComplete(transcriptPreview, acousticData);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-700 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            NHAA 14566 Voice Ingestion Channel
          </span>
        </div>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
        >
          Cancel
        </button>
      </div>

      {/* Spoken scenario selector for demo testing */}
      <div className="mt-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Demo Audio Signal Preset:
        </label>
        <select
          value={simulatedSampleIdx}
          onChange={(e) => setSimulatedSampleIdx(Number(e.target.value))}
          disabled={isRecording}
          className="w-full bg-slate-900 border border-slate-700 text-xs rounded p-2 text-slate-200 focus:outline-none focus:border-gov-blue"
        >
          {SAMPLE_VOICE_NARRATIVES.map((s, idx) => (
            <option key={idx} value={idx}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* Waveform & Status Visualizer */}
      <div className="my-6 py-6 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
        {isRecording ? (
          <div className="flex flex-col items-center">
            {/* Pulsing Audio Waveform Bars */}
            <div className="flex items-center space-x-1.5 h-16 px-4">
              <span className="w-1.5 bg-red-500 rounded-full h-8 animate-wave-1"></span>
              <span className="w-1.5 bg-amber-400 rounded-full h-12 animate-wave-2"></span>
              <span className="w-1.5 bg-blue-500 rounded-full h-16 animate-wave-3"></span>
              <span className="w-1.5 bg-emerald-400 rounded-full h-10 animate-wave-4"></span>
              <span className="w-1.5 bg-purple-500 rounded-full h-14 animate-wave-5"></span>
              <span className="w-1.5 bg-red-500 rounded-full h-12 animate-wave-2"></span>
              <span className="w-1.5 bg-amber-400 rounded-full h-6 animate-wave-1"></span>
              <span className="w-1.5 bg-blue-500 rounded-full h-14 animate-wave-4"></span>
              <span className="w-1.5 bg-emerald-400 rounded-full h-16 animate-wave-3"></span>
              <span className="w-1.5 bg-purple-500 rounded-full h-8 animate-wave-5"></span>
            </div>
            <div className="text-xl font-mono font-bold text-red-400 mt-3">
              {formatTimer(timerSeconds)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Recording microphone & acoustic tremors...</span>
            </div>
          </div>
        ) : transcriptPreview ? (
          <div className="w-full px-6">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-bold mb-2">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Speech Transcribed Successfully</span>
              </div>
              <span className="text-slate-400 font-mono">16kHz Acoustic Telemetry Extracted</span>
            </div>
            <p className="text-sm text-slate-200 bg-slate-900 p-3 rounded border border-slate-800 italic">
              "{transcriptPreview}"
            </p>

            {/* Extracted Acoustic Signals */}
            {acousticData && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Speech Pauses</span>
                  <span className="text-amber-300 font-bold">{acousticData.pauseCount} pauses</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Avg Pause</span>
                  <span className="text-blue-300 font-bold">{acousticData.averagePauseDurationSec}s</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Pitch Jitter</span>
                  <span className="text-red-400 font-bold">{acousticData.pitchVariabilityHz} Hz</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Speech Rate</span>
                  <span className="text-emerald-400 font-bold">{acousticData.speechRateWpm} WPM</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-4">
            <Mic className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium">Click "Start Recording" to simulate citizen voice input</p>
            <p className="text-[11px] text-slate-500 mt-1">Captures speech patterns, hesitation pauses & vocal strain</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {!isRecording && !transcriptPreview && (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors"
          >
            <Mic className="w-4 h-4" />
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <>
            <button
              type="button"
              onClick={togglePause}
              className="flex items-center space-x-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-colors"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop & Transcribe</span>
            </button>
          </>
        )}

        {transcriptPreview && (
          <>
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3.5 py-2 rounded-lg border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-record</span>
            </button>
            <button
              type="button"
              onClick={handleConfirmTranscript}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Use This Transcript & Audio Data</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
