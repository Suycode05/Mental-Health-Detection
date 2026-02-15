import React, { useState, useRef } from 'react';

const VoiceAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [transcribedText, setTranscribedText] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  const [recentSessions, setRecentSessions] = useState([
    {
      time: "9:00 AM",
      title: "Morning Check-in",
      dominant: "Calm",
      percent: 82,
      color: "green",
      icon: "sentiment_satisfied"
    },
    {
      time: "Yesterday",
      title: "Yesterday Evening",
      dominant: "Anxious",
      percent: 45,
      color: "orange",
      icon: "sentiment_dissatisfied"
    }
  ]);

  const startRecording = async () => {
    try {
      if (mediaRecorderRef.current) stopRecording();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsAnalyzing(true);
        analyzeVoice(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setSeconds(0);
      setAnalysis(null);
      setTranscribedText('');
      timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Cannot access microphone: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const analyzeVoice = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'voice.webm');

    try {
      const res = await fetch('http://localhost:5000/api/voice', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log("Backend response:", data);  // ← Debug: check in console

      // Handle multi-prob dict (new backend format)
      const emotions = data.prediction || {};  // Dict like {"Calm": 0.68, ...}
      const dominant = data.dominant || Object.keys(emotions)[0] || "Unknown";
      const confidence = Math.round((data.confidence || 0) * 100);

      setAnalysis({
        emotions,  // For bars
        dominant,
        confidence,
        insight: data.message || "No insight available."
      });
      setTranscribedText(data.transcribed_text || "[No speech detected]");

      // Update recent sessions
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const colorMap = { Calm: 'green', Anxious: 'orange', Energetic: 'green', Sad: 'slate', Depressed: 'slate' };
      const iconMap = { Calm: 'sentiment_satisfied', Anxious: 'sentiment_dissatisfied', Energetic: 'sentiment_very_satisfied', Sad: 'sentiment_very_dissatisfied', Depressed: 'sentiment_very_dissatisfied' };
      const color = colorMap[dominant] || 'primary';
      const icon = iconMap[dominant] || 'psychology';

      setRecentSessions(prev => [{
        time: now,
        title: "New Voice Session",
        dominant,
        percent: confidence,
        color,
        icon
      }, ...prev.slice(0, 3)]);

    } catch (err) {
      console.error("Voice analysis failed:", err);
      setTranscribedText("[Analysis error]");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getEmotionColor = (emotion) => {
    const colors = { Calm: 'primary', Anxious: 'orange-400', Energetic: 'green-400', Sad: 'slate-400', Depressed: 'slate-400' };
    return colors[emotion] || 'primary';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8 h-full">
      {/* Header – unchanged */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">psychology</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Voice Emotion Analysis</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Mental Health Assistant</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4">
          <div className="hidden md:flex items-center gap-6 mr-4">
            <a className="text-sm font-bold text-primary" href="#">Live Monitor</a>
            <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">History</a>
            <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Insights</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Visualizer & Controls */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Visualizer Card */}
          <div className="flex-1 min-h-[400px] rounded-2xl bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
            </div>
            {/* Status Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className={`flex h-2 w-2 rounded-full ${isRecording ? 'bg-primary animate-pulse' : isAnalyzing ? 'bg-yellow-500 animate-pulse' : analysis ? 'bg-green-500' : 'bg-slate-400'}`}></span>
              {isRecording ? 'Listening...' : isAnalyzing ? 'Analyzing...' : analysis ? 'Analyzed' : 'Ready'}
            </div>
            {/* Timer readout */}
            <div className="absolute top-6 right-6 font-mono text-2xl font-bold text-slate-700 dark:text-slate-300">
              {isRecording || isAnalyzing ? formatTime(seconds) : analysis ? `${analysis.confidence}%` : "00:00"}
            </div>
            {/* Dynamic Circular Wave Visualizer */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-primary/20 shadow-[0_0_50px_-10px_rgba(25,127,230,0.3)]"></div>
              <div className="absolute inset-4 rounded-full border border-primary/10"></div>
              <div className="relative flex items-center justify-center gap-1 h-32">
                <div className="w-2 bg-primary/40 rounded-full h-[60%] animate-wave"></div>
                <div className="w-2 bg-primary/60 rounded-full h-[80%] animate-wave delay-75"></div>
                <div className="w-2 bg-primary rounded-full h-[100%] animate-wave delay-150"></div>
                <div className="w-2 bg-primary/60 rounded-full h-[70%] animate-wave delay-75"></div>
                <div className="w-2 bg-primary/40 rounded-full h-[50%] animate-wave"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-6xl opacity-20">mic</span>
              </div>
            </div>
            <p className="mt-8 text-slate-500 dark:text-slate-400 text-lg font-medium text-center max-w-md">
              {isRecording ? '"Speak naturally about how you feel..."' : isAnalyzing ? '"Transcribing & analyzing..."' : transcribedText || '"I\'ve been feeling a bit overwhelmed..."'}
            </p>
          </div>
          {/* Controls Bar */}
          <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-center gap-8 shadow-sm">
            <button className="flex flex-col items-center gap-2 group" onClick={isRecording ? stopRecording : startRecording} disabled={isAnalyzing}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}`}>
                <span className="material-symbols-outlined text-2xl">{isRecording ? 'pause' : 'mic'}</span>
              </div>
              <span className="text-xs font-bold text-slate-500">{isRecording ? 'Pause' : 'Start Recording'}</span>
            </button>
            <button className="flex flex-col items-center gap-2 group" onClick={stopRecording} disabled={!isRecording || isAnalyzing}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-500/30 group-hover:scale-105 transition-all ${isRecording ? 'bg-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <span className="material-symbols-outlined text-4xl">stop</span>
              </div>
              <span className="text-xs font-bold text-red-500">Stop Recording</span>
            </button>
            <button className="flex flex-col items-center gap-2 group" onClick={() => { setAnalysis(null); setTranscribedText(''); setSeconds(0); setIsAnalyzing(false); }}>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
                <span className="material-symbols-outlined text-2xl">refresh</span>
              </div>
              <span className="text-xs font-bold text-slate-500">Reset</span>
            </button>
          </div>
        </div>

        {/* Right Panel: Analytics & Insights */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Emotion Probability Chart – now dynamic */}
          <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bar_chart</span>
              Emotion Analysis
            </h3>
            <div className="space-y-5">
              {['Calm', 'Anxious', 'Energetic', 'Sad', 'Depressed'].map(emotion => {
                const percent = analysis ? Math.round((analysis.emotions[emotion] || 0) * 100) : 0;
                const color = getEmotionColor(emotion);

                return (
                  <div key={emotion} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{emotion}</span>
                      <span className={`text-sm font-bold text-${color}`}>{percent}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${color} rounded-full transition-all duration-1000`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Contextual Insight Card – now dynamic */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-start gap-4 relative z-10">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">Live Insight</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {analysis?.insight || 'Start recording to receive real-time voice emotion insights.'}
                </p>
              </div>
            </div>
            <button className="w-full mt-4 py-3 text-xs font-bold text-primary bg-white dark:bg-background-dark rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
              VIEW DETAILED REPORT
            </button>
          </div>
        </div>

        {/* Secondary Section: Recent Sessions – now dynamic */}
        <div className="col-span-12">
          <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Recent Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentSessions.map((session, i) => (
              <div key={i} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl bg-${session.color}-500/10 flex items-center justify-center text-${session.color}-500 group-hover:bg-${session.color}-500 group-hover:text-white transition-colors`}>
                  <span className="material-symbols-outlined">{session.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{session.title}</h5>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{session.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Dominant: {session.dominant} ({session.percent}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAnalysis;