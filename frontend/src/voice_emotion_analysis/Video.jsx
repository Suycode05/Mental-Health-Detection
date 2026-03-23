import React, { useState, useRef, useEffect } from "react";

const VideoAnalysis = () => {
	// Face states
	const [faceEmotions, setFaceEmotions] = useState({});
	const [faceDominant, setFaceDominant] = useState("—");

	// Voice states
	const [voiceEmotions, setVoiceEmotions] = useState({});
	const [voiceDominant, setVoiceDominant] = useState("—");

	// Session control
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [showSummary, setShowSummary] = useState(false);
	const [summary, setSummary] = useState(null);

	const videoRef = useRef(null);
	const canvasRef = useRef(document.createElement("canvas"));
	const mediaRecorderRef = useRef(null);
	const streamRef = useRef(null);
	const faceIntervalRef = useRef(null);
	const voiceIntervalRef = useRef(null);

	// Start both camera + microphone
	const startAnalysis = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 640 },
					height: { ideal: 480 },
				},
				audio: true,
			});

			streamRef.current = stream;
			if (videoRef.current) videoRef.current.srcObject = stream;
			setIsAnalyzing(true);
			setShowSummary(false); // hide summary when starting new session

			// Face analysis
			faceIntervalRef.current = setInterval(captureAndAnalyzeFace, 1800);

			// Voice accumulation
			let accumulatedChunks = [];
			const audioOnlyStream = new MediaStream(stream.getAudioTracks());
			mediaRecorderRef.current = new MediaRecorder(audioOnlyStream, {
				mimeType: "audio/webm;codecs=opus",
			});

			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) accumulatedChunks.push(event.data);
			};

			const voiceSendInterval = setInterval(async () => {
				if (!isAnalyzing || accumulatedChunks.length === 0) return;
				const audioBlob = new Blob(accumulatedChunks, { type: "audio/webm" });
				accumulatedChunks = [];
				console.log(
					"Sending accumulated voice chunk, size:",
					audioBlob.size / 1024,
					"KB",
				);
				await sendAudioChunk(audioBlob);
			}, 12000);

			voiceIntervalRef.current = voiceSendInterval;
			mediaRecorderRef.current.start();
            console.log("MediaRecorder state after start:", mediaRecorderRef.current.state);  // should be "recording"

			console.log("Analysis started");
		} catch (err) {
			console.error("Media access failed:", err);
			alert("Camera and/or microphone access denied or unavailable.");
		}
	};

	// Stop analysis + generate summary
	const stopAnalysis = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
		}
		if (faceIntervalRef.current) clearInterval(faceIntervalRef.current);
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== "inactive"
		) {
			mediaRecorderRef.current.stop();
		}
		if (voiceIntervalRef.current) {
			clearInterval(voiceIntervalRef.current);
			voiceIntervalRef.current = null;
		}

		// Generate summary
		const faceTop = faceDominant !== "—" ? faceDominant : "Neutral";
		const voiceTop = voiceDominant !== "—" ? voiceDominant : "Calm";

		const combinedInsight = `
            Face dominant: ${faceTop}  
            Voice dominant: ${voiceTop}  
            Overall mood: ${getCombinedMood(faceTop, voiceTop)}
        `;

		setSummary({
			faceDominant: faceTop,
			voiceDominant: voiceTop,
			faceEmotions: { ...faceEmotions },
			voiceEmotions: { ...voiceEmotions },
			insight: combinedInsight.trim(),
		});

		setShowSummary(true);
		setIsAnalyzing(false);
	};

	// Simple combined mood logic (customize as you like)
	const getCombinedMood = (face, voice) => {
		if (
			face.toLowerCase().includes("sad") ||
			voice.toLowerCase().includes("sad") ||
			voice.toLowerCase().includes("depressed")
		) {
			return "Low mood detected – consider resting or talking to someone.";
		}
		if (
			face.toLowerCase().includes("happy") ||
			voice.toLowerCase().includes("energetic")
		) {
			return "Positive energy detected – good moment!";
		}
		if (
			face.toLowerCase().includes("anxious") ||
			voice.toLowerCase().includes("anxious")
		) {
			return "Some tension present – try deep breathing.";
		}
		return "Balanced / neutral state.";
	};

	// Reset everything
	const resetSession = () => {
		setFaceEmotions({});
		setFaceDominant("—");
		setVoiceEmotions({});
		setVoiceDominant("—");
		setShowSummary(false);
		setSummary(null);
		// Video will be black again since stream is stopped
	};

	// Face capture (unchanged)
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
				body: JSON.stringify({ image: base64 }),
			});
			if (!res.ok) throw new Error(`Face HTTP ${res.status}`);
			const data = await res.json();
			if (
				data.facial_emotions &&
				Object.keys(data.facial_emotions).length > 0
			) {
				setFaceEmotions(data.facial_emotions);
				setFaceDominant(data.dominant || "—");
			}
		} catch (e) {
			console.error("Face analysis error:", e);
		}
	};

	// Voice chunk send (unchanged)
	const sendAudioChunk = async (audioBlob) => {
		try {
			const formData = new FormData();
			formData.append("audio", audioBlob, `chunk_${Date.now()}.webm`);

			const res = await fetch("http://localhost:5000/api/voice", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) throw new Error(`Voice HTTP ${res.status}`);

			const data = await res.json();
			if (data.emotion || data.emotions || data.prediction) {
				setVoiceEmotions(data.emotion || data.emotions || {});
				setVoiceDominant(data.dominant || data.prediction || "—");
			}
		} catch (e) {
			console.error("Voice chunk error:", e);
		}
	};

	useEffect(() => () => stopAnalysis(), []);

	return (
		<div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8 h-full">
			{/* Header */}
			<header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				{/* your header content */}
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Left panel */}
				<div className="lg:col-span-8 flex flex-col gap-6">
					{/* Camera feed */}
					<div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-bold flex items-center gap-2">
								<span className="material-symbols-outlined text-primary">
									camera
								</span>
								Live Face Camera
							</h3>
							<span
								className={`px-3 py-1 rounded-full text-xs font-bold ${isAnalyzing ? "bg-green-500 text-white" : "bg-slate-300"}`}
							>
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
							Face:{" "}
							<span className="text-primary font-bold">{faceDominant}</span>
						</p>
					</div>

					{/* Controls */}
					<div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-center gap-12 shadow-sm">
						<button
							onClick={isAnalyzing ? stopAnalysis : startAnalysis}
							className={`flex flex-col items-center gap-2 group ${isAnalyzing ? "text-red-500" : "text-green-500"}`}
						>
							<div
								className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
									isAnalyzing
										? "bg-red-500 hover:bg-red-600"
										: "bg-green-500 hover:bg-green-600"
								}`}
							>
								<span className="material-symbols-outlined text-4xl">
									{isAnalyzing ? "stop" : "play_arrow"}
								</span>
							</div>
							<span className="text-sm font-bold">
								{isAnalyzing ? "Stop Analysis" : "Start Analysis"}
							</span>
						</button>

						{/* Reset button - only visible after stop */}
						{showSummary && (
							<button
								onClick={resetSession}
								className="flex flex-col items-center gap-2 group text-blue-500"
							>
								<div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-xl hover:bg-blue-600 transition-all">
									<span className="material-symbols-outlined text-3xl">
										restart_alt
									</span>
								</div>
								<span className="text-sm font-bold">Reset</span>
							</button>
						)}
					</div>
				</div>

				{/* Right panel - stats */}
				<div className="lg:col-span-4 flex flex-col gap-6">
					{/* Face Emotions */}
					<div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
						<h3 className="text-lg font-bold mb-4">Facial Emotions</h3>
						{Object.keys(faceEmotions).length > 0 ? (
							Object.entries(faceEmotions).map(([emo, val]) => (
								<div key={emo} className="mb-3">
									<div className="flex justify-between text-sm mb-1">
										<span className="capitalize">{emo}</span>
										<span>{Math.round(val)}%</span>
									</div>
									<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
										<div
											className="h-full bg-primary transition-all"
											style={{ width: `${val}%` }}
										/>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-slate-400 py-4">
								{isAnalyzing ? "Analyzing..." : "Start to see results"}
							</p>
						)}
					</div>

					{/* Voice Emotions */}
					<div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
						<h3 className="text-lg font-bold mb-4">Voice Emotions</h3>
						{Object.keys(voiceEmotions).length > 0 ? (
							Object.entries(voiceEmotions).map(([emo, val]) => (
								<div key={emo} className="mb-3">
									<div className="flex justify-between text-sm mb-1">
										<span className="capitalize">{emo}</span>
										<span>{Math.round(val)}%</span>
									</div>
									<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
										<div
											className="h-full bg-primary transition-all"
											style={{ width: `${val}%` }}
										/>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-slate-400 py-4">
								{isAnalyzing ? "Analyzing..." : "Start to see results"}
							</p>
						)}
					</div>

					{/* Summary Card - appears after stop */}
					{showSummary && summary && (
						<div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md">
							<h3 className="text-xl font-bold text-primary mb-4">
								Session Summary
							</h3>
							<div className="space-y-3 text-sm">
								<p>
									<strong>Face dominant:</strong> {summary.faceDominant}
								</p>
								<p>
									<strong>Voice dominant:</strong> {summary.voiceDominant}
								</p>
								<p className="font-medium mt-4">{summary.insight}</p>
							</div>
							<button
								onClick={resetSession}
								className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
							>
								Start New Session
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default VideoAnalysis;
