import React, { useState, useRef, useEffect } from 'react';

const VideoAnalysis = () => {
    // ================ NEW: Face states ================
    const [faceEmotions, setFaceEmotions] = useState({});
    const [faceDominant, setFaceDominant] = useState("—");

    const [voiceEmotions, setVoiceEmotions] = useState({});      // e.g. { calm: 82, anxious: 12, ... }
    const [voiceDominant, setVoiceDominant] = useState("—");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(document.createElement("canvas"));
    const faceIntervalRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    // ================ Start / Stop Webcam ================
    const startAnalysis = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user", width: 640, height: 480 },
                audio: true 
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsAnalyzing(true);

            // Analyze every 1.5 seconds
            faceIntervalRef.current = setInterval(captureAndAnalyzeFace, 1800);

            // Voice recording + chunk sending
            const audioOnlyStream = new MediaStream(stream.getAudioTracks()); // only audio tracks
            // Inside startAnalysis():
mediaRecorderRef.current = new MediaRecorder(audioOnlyStream, {
    mimeType: 'audio/webm;codecs=opus'
});

let accumulatedChunks = [];

// Collect chunks locally
mediaRecorderRef.current.ondataavailable = (event) => {
    if (event.data.size > 0) {
        accumulatedChunks.push(event.data);
    }
};

// Send every 8 seconds (adjust as needed)
setInterval(async () => {
    if (accumulatedChunks.length === 0 || !isAnalyzing) return;

    const fullBlob = new Blob(accumulatedChunks, { type: 'audio/webm' });
    accumulatedChunks = [];  // clear for next interval

    await sendAudioChunk(fullBlob);
}, 8000);  // 8 seconds chunks

mediaRecorderRef.current.start();  // NO timeslice here — we control sending manually

            console.log("Both webcam + mic started");
        } catch (err) {
            console.error("Media access error:", err);
            alert("Camera and/or microphone access denied or unavailable.");
        }
    };

    // Stop everything
    const stopAnalysis = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (faceIntervalRef.current) {
            clearInterval(faceIntervalRef.current);
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }

        setIsAnalyzing(false);
        setFaceDominant("—");
        setFaceEmotions({});
        setVoiceDominant("—");
        setVoiceEmotions({});
    };

    // Capture frame and send to face endpoint
    const captureAndAnalyzeFace = async () => {
        if (!videoRef.current || !videoRef.current.videoWidth) return;

        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0);

        const base64 = canvas.toDataURL("image/jpeg", 0.7);

        try {
            const res = await fetch("http://localhost:5000/predict_face", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64 })
            });

            if (!res.ok) throw new Error(`Face HTTP ${res.status}`);

            const data = await res.json();
            if (data.facial_emotions && Object.keys(data.facial_emotions).length > 0) {
                setFaceEmotions(data.facial_emotions);
                setFaceDominant(data.dominant || "—");
            }
        } catch (e) {
            console.error("Face analysis error:", e);
        }
    };

    // Send audio chunk to voice endpoint
    const sendAudioChunk = async (audioBlob) => {
        try {
            const formData = new FormData();
            formData.append("audio", audioBlob, `chunk_${Date.now()}.webm`);

            const res = await fetch("http://localhost:5000/api/voice", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error(`Voice HTTP ${res.status}`);

            const data = await res.json();

            // Adapt this part to match what your /api/voice actually returns
            if (data.emotion || data.prediction || data.dominant) {
                // Example: assuming it returns something like { emotion: {calm: 82, anxious: 10}, dominant: "calm" }
                setVoiceEmotions(data.emotion || data.emotions || {});
                setVoiceDominant(data.dominant || data.prediction || "—");
            }
        } catch (e) {
            console.error("Voice chunk error:", e);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopAnalysis();
    }, []);

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8 h-full">
            {/* Header - keep your original */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">psychology</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Video Analysis</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Mental Health Assistant</p>
                    </div>
                </div>
                {/* ... your header buttons ... */}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Visualizer + Camera */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Main area - you can keep your voice visualizer here if you want */}
                    <div className="flex-1 min-h-[400px] rounded-2xl bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                        {/* Your original wave visualizer, timer, transcript placeholder */}
                        <p className="text-slate-500">Real-time multimodal analysis active when recording</p>
                    </div>

                    {/* Live Camera Feed */}
                    <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">camera</span>
                                Live Face Camera
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isAnalyzing ? "bg-green-500 text-white" : "bg-slate-300"}`}>
                                {isAnalyzing ? "● LIVE" : "OFF"}
                            </span>
                        </div>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full rounded-xl bg-black aspect-video object-cover"
                        />
                        <p className="mt-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                            Face Emotion: <span className="text-primary font-bold">{faceDominant}</span>
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-center gap-12 shadow-sm">
                        <button
                            onClick={isAnalyzing ? stopAnalysis : startAnalysis}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
                                isAnalyzing 
                                    ? "bg-red-500 shadow-red-500/30 hover:bg-red-600" 
                                    : "bg-green-500 shadow-green-500/30 hover:bg-green-600"
                            }`}>
                                <span className="material-symbols-outlined text-4xl">
                                    {isAnalyzing ? "stop" : "play_arrow"}
                                </span>
                            </div>
                            <span className="text-sm font-bold">
                                {isAnalyzing ? "Stop Analysis" : "Start Analysis"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right: Stats & Insight */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Face Emotions */}
                    <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">face</span>
                            Facial Emotion Analysis
                        </h3>
                        <div className="space-y-5">
                            {Object.keys(faceEmotions).length > 0 ? (
                                Object.entries(faceEmotions).map(([emo, val]) => (
                                    <div key={emo} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                                                {emo}
                                            </span>
                                            <span className="text-sm font-bold text-primary">{Math.round(val)}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1000"
                                                style={{ width: `${val}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-center py-8">
                                    {isAnalyzing ? "Analyzing face..." : "Start analysis to see results"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Voice Emotions - adapt keys/values to your backend response */}
                    <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">mic</span>
                            Voice Emotion Analysis
                        </h3>
                        <div className="space-y-5">
                            {Object.keys(voiceEmotions).length > 0 ? (
                                Object.entries(voiceEmotions).map(([emo, val]) => (
                                    <div key={emo} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                                                {emo}
                                            </span>
                                            <span className="text-sm font-bold text-primary">{Math.round(val)}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1000"
                                                style={{ width: `${val}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-center py-8">
                                    {isAnalyzing ? "Analyzing voice..." : "Start analysis to see results"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Combined Live Insight */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined">lightbulb</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-primary mb-2">Live Insight</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Face shows <span className="font-bold text-primary">{faceDominant}</span>.<br />
                                    Voice shows <span className="font-bold text-primary">{voiceDominant}</span>.
                                    { (faceDominant.toLowerCase().includes("sad") || voiceDominant.toLowerCase().includes("sad")) &&
                                        " Consider taking a short break or deep breathing." }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoAnalysis;