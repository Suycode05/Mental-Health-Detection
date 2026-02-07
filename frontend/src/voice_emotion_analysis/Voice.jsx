import React from 'react';



const VoiceAnalysis = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8 h-full">
            {/* Header */}
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
                        {/* Decorative Background elements */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                        </div>
                        {/* Status Badge */}
                        <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            Listening...
                        </div>
                        {/* Timer readout */}
                        <div className="absolute top-6 right-6 font-mono text-2xl font-bold text-slate-700 dark:text-slate-300">
                            02:14:45
                        </div>
                        {/* Dynamic Circular Wave Visualizer */}
                        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border border-primary/20 shadow-[0_0_50px_-10px_rgba(25,127,230,0.3)]"></div>
                            <div className="absolute inset-4 rounded-full border border-primary/10"></div>
                            {/* Visual Wave Simulation */}
                            <div className="relative flex items-center justify-center gap-1 h-32">
                                <div className="w-2 bg-primary/40 rounded-full h-[60%] animate-wave"></div>
                                <div className="w-2 bg-primary/60 rounded-full h-[80%] animate-wave delay-75"></div>
                                <div className="w-2 bg-primary rounded-full h-[100%] animate-wave delay-150"></div>
                                <div className="w-2 bg-primary/60 rounded-full h-[70%] animate-wave delay-75"></div>
                                <div className="w-2 bg-primary/40 rounded-full h-[50%] animate-wave"></div>
                            </div>
                            {/* Central Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-6xl opacity-20">mic</span>
                            </div>
                        </div>
                        <p className="mt-8 text-slate-500 dark:text-slate-400 text-lg font-medium text-center max-w-md">"I've been feeling a bit overwhelmed with the project deadlines lately..."</p>
                    </div>
                    {/* Controls Bar */}
                    <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-center gap-8 shadow-sm">
                        <button className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
                                <span className="material-symbols-outlined text-2xl">pause</span>
                            </div>
                            <span className="text-xs font-bold text-slate-500">Pause</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 group">
                            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white shadow-xl shadow-red-500/30 group-hover:scale-105 transition-all">
                                <span className="material-symbols-outlined text-4xl">stop</span>
                            </div>
                            <span className="text-xs font-bold text-red-500">Stop Recording</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
                                <span className="material-symbols-outlined text-2xl">refresh</span>
                            </div>
                            <span className="text-xs font-bold text-slate-500">Reset</span>
                        </button>
                    </div>
                </div>

                {/* Right Panel: Analytics & Insights */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Emotion Probability Chart */}
                    <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">bar_chart</span>
                            Emotion Analysis
                        </h3>
                        <div className="space-y-5">
                            {/* Calm */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Calm</span>
                                    <span className="text-sm font-bold text-primary">68%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '68%' }}></div>
                                </div>
                            </div>
                            {/* Anxious */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Anxious</span>
                                    <span className="text-sm font-bold text-orange-400">22%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-400 rounded-full transition-all duration-1000" style={{ width: '22%' }}></div>
                                </div>
                            </div>
                            {/* Energetic */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Energetic</span>
                                    <span className="text-sm font-bold text-green-400">8%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-400 rounded-full transition-all duration-1000" style={{ width: '8%' }}></div>
                                </div>
                            </div>
                            {/* Sad */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sad</span>
                                    <span className="text-sm font-bold text-slate-400">2%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400 rounded-full transition-all duration-1000" style={{ width: '2%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Contextual Insight Card */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined">lightbulb</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-primary mb-2">Live Insight</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Your voice indicates a high level of <span className="font-bold text-slate-900 dark:text-white">Stability</span>. However, slight frequency jitters suggest rising anxiety levels. Consider taking a deep breath before continuing.
                                </p>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-3 text-xs font-bold text-primary bg-white dark:bg-background-dark rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
                            VIEW DETAILED REPORT
                        </button>
                    </div>
                </div>

                {/* Secondary Section: Recent Sessions */}
                <div className="col-span-12">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Recent Sessions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">sentiment_satisfied</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">Morning Check-in</h5>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">9:00 AM</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">Dominant: Calm (82%)</p>
                            </div>
                        </div>
                        {/* More sessions placeholders */}
                        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                            <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-400 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">sentiment_dissatisfied</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">Yesterday Evening</h5>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Yesterday</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">Dominant: Anxious (45%)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceAnalysis;
