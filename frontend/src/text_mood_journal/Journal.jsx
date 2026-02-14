import React, { useState } from 'react';
import { submitJournal } from '../services/api';  // Assuming api.js is in src/services/api.js

const Journal = () => {
    const [entry, setEntry] = useState("Reflecting on the meeting earlier today and how the project is shaping up. I felt a bit nervous during the presentation, but the feedback was mostly positive.\n\nI've been thinking about the balance between work and rest lately. It's easy to get caught up in the grind, especially with the upcoming deadline on Monday. I want to make sure I don't burn out before we even reach the finish line.\n\nPerhaps I'll take a short walk after this entry to clear my head. The weather looks clear and crisp.");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [realTimeSentiment, setRealTimeSentiment] = useState("Neutral-Positive");  // Placeholder for real-time

    // Handler for submit button
    const handleSubmit = async () => {
        if (!entry.trim()) {
            setError("Please write something before submitting.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await submitJournal(entry);
            setResult(response);
            setRealTimeSentiment(response.prediction);  // Update real-time sentiment based on result
        } catch (err) {
            setError(err.message || "Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex overflow-hidden h-full">
            {/* List Pane (Entries Archive) */}
            <section className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-background-dark/50 overflow-hidden shrink-0 hidden md:flex">
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">Past Entries</h2>
                        <button className="size-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-sm">filter_list</span>
                        </button>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input className="w-full bg-white dark:bg-slate-900 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400" placeholder="Search thoughts..." type="text" />
                    </div>
                </div>
                {/* Scrollable Entries */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {/* Today Active */}
                    <div className="p-4 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium opacity-80 uppercase tracking-tighter">Oct 26, 2023</span>
                            <span className="material-symbols-outlined scale-75">pending</span>
                        </div>
                        <h3 className="font-bold text-sm mb-1 truncate">Currently Writing...</h3>
                        <p className="text-xs opacity-90 line-clamp-2">Reflecting on the meeting earlier today and how the project is shaping up...</p>
                    </div>
                    {/* Previous Entries - mapped for brevity */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Oct 25, 2023</span>
                            <span className="material-symbols-outlined text-yellow-500 text-lg fill-1">wb_sunny</span>
                        </div>
                        <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Successful Launch</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Finally got the beta version out. The team was so supportive and I feel...</p>
                    </div>
                </div>
            </section>

            {/* Editor Pane (Distraction-Free) */}
            <section className="flex-1 flex flex-col relative bg-white dark:bg-background-dark overflow-hidden">
                {/* Editor Header */}
                <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold">Mood Journal</h2>
                    </div>
                </div>
                {/* Actual Editor Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 xl:px-24">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center gap-4 text-slate-300 dark:text-slate-700">
                            <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">mic</span>
                                <span className="text-sm font-medium">Record Voice Analysis</span>
                            </button>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
                            <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">image</span>
                                <span className="text-sm font-medium">Add Context</span>
                            </button>
                        </div>
                        <textarea
                            className="w-full h-[60vh] bg-transparent border-none focus:ring-0 text-lg lg:text-xl leading-relaxed resize-none p-0 placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none"
                            placeholder="How are you feeling today? Let the words flow..."
                            value={entry}
                            onChange={(e) => setEntry(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                {/* Analysis Bar – Added result display */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                    <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Character Count</span>
                                <span className="text-sm font-medium">{entry.split(" ").length} words / {entry.length} chars</span>
                            </div>
                            <div className="h-8 w-px bg-slate-100 dark:bg-slate-800"></div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Real-time Sentiment</span>
                                    <span className="text-sm font-bold text-primary">{realTimeSentiment}</span>
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {result && (
                            <p className="text-sm text-green-500">
                                Confidence: {Math.round(result.confidence * 100)}%
                            </p>
                        )}
                        <button 
                            className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            <span>{loading ? 'Analyzing...' : 'Submit for AI Analysis'}</span>
                            <span className="material-symbols-outlined text-lg">bolt</span>
                        </button>
                    </div>
                    {result && (
                        <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <h3 className="text-lg font-bold mb-2">AI Analysis Result</h3>
                            <p className="text-sm">{result.message}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Journal;