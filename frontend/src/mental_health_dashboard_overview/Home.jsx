import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8 h-full">
            {/* Header Section */}
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-1">Good morning, Alex</h2>
                    <p className="text-slate-500 dark:text-slate-400">Here is your wellness summary for Oct 24th.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <span className="material-symbols-outlined text-xl">calendar_today</span>
                        <span>This Week</span>
                    </button>
                    <button className="relative h-10 w-10 flex items-center justify-center bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
                    </button>
                </div>
            </header>

            {/* Top Grid: Current State & Quick Actions */}
            <div className="grid grid-cols-12 gap-6 mb-6">
                {/* Current State Card */}
                <div className="col-span-12 lg:col-span-8 bg-white dark:bg-card-dark rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-shrink-0 relative">
                            <svg className="h-32 w-32 transform -rotate-90">
                                <circle className="text-slate-100 dark:text-slate-800" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                                <circle className="text-primary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364" strokeDashoffset="65" strokeWidth="8"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black">82%</span>
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Sentiment</span>
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold mb-3 uppercase tracking-wider">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Current State: Stable
                            </div>
                            <h3 className="text-xl font-bold mb-2">Excellent Emotional Baseline</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                Your sentiment score has improved by 5% since yesterday. Voice analysis indicates high resilience and steady breathing patterns.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                    <span className="material-symbols-outlined text-blue-400 text-lg">edit_note</span>
                                    <span className="text-xs font-medium">12 Day Streak</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                    <span className="material-symbols-outlined text-purple-400 text-lg">bedtime</span>
                                    <span className="text-xs font-medium">7.5h Avg. Sleep</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-primary/5 rounded-full blur-3xl"></div>
                </div>

                {/* Quick Actions */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                    <Link to="/voice" className="flex-1 group relative flex items-center gap-4 p-5 bg-primary rounded-3xl text-white text-left transition-all hover:shadow-lg hover:shadow-primary/25 overflow-hidden">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-2xl">mic</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg">Start Voice Note</p>
                            <p className="text-sm text-white/70">Analyze mood via speech</p>
                        </div>
                        <span className="material-symbols-outlined ml-auto text-white/40 group-hover:text-white transition-all">chevron_right</span>
                    </Link>
                    <Link to="/journal" className="flex-1 group relative flex items-center gap-4 p-5 bg-white dark:bg-card-dark border border-slate-100 dark:border-slate-800 rounded-3xl text-left transition-all hover:shadow-md overflow-hidden">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-2xl text-primary">edit_square</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg">Write Journal Entry</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Reflect on your day</p>
                        </div>
                        <span className="material-symbols-outlined ml-auto text-slate-300 dark:text-slate-600 group-hover:text-primary transition-all">chevron_right</span>
                    </Link>
                </div>
            </div>

            {/* Bottom Grid: Trends & Insights */}
            <div className="grid grid-cols-12 gap-6">
                {/* Mood Trend Graph */}
                <div className="col-span-12 lg:col-span-8 bg-white dark:bg-card-dark rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-lg">Weekly Mood Trends</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Historical Sentiment Analysis</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                <span className="h-2 w-2 rounded-full bg-primary"></span> Primary
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></span> Average
                            </span>
                        </div>
                    </div>
                    {/* Simplified Visual Graph Placeholder */}
                    <div className="h-64 flex items-end gap-1 relative">
                        {/* Background Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                            <div className="w-full border-t border-slate-100 dark:border-slate-800/50"></div>
                            <div className="w-full border-t border-slate-100 dark:border-slate-800/50"></div>
                            <div className="w-full border-t border-slate-100 dark:border-slate-800/50"></div>
                            <div className="w-full border-t border-slate-100 dark:border-slate-800/50"></div>
                            <div className="w-full border-t border-slate-100 dark:border-slate-800/50"></div>
                        </div>
                        {/* Graph Bars/Lines Representation */}
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => (
                            <div key={day} className="flex-1 flex flex-col justify-end group cursor-pointer relative z-10">
                                <div
                                    className={`w-full ${index === 3 ? 'bg-primary shadow-xl shadow-primary/20 ring-4 ring-primary/20 h-[90%]' : 'bg-primary/10 group-hover:bg-primary/20 h-[60%]'} rounded-t-lg transition-all`}
                                    style={{ height: index === 3 ? '90%' : `${40 + Math.random() * 40}%` }}
                                ></div>
                                <div className="h-1 w-full bg-primary rounded-t-full mt-1"></div>
                                <p className={`text-[10px] font-bold text-center mt-3 ${index === 3 ? 'text-primary' : 'text-slate-500'}`}>{day}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insights Feed */}
                <div className="col-span-12 lg:col-span-4 flex flex-col">
                    <div className="flex-1 bg-white dark:bg-card-dark rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Recent Insights</h3>
                        <div className="space-y-4">
                            {/* Insight Item 1 */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-all cursor-default">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-lg">bolt</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold mb-0.5">Focus Boost Detected</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">Your journal entry shows high cognitive clarity compared to your 30-day average.</p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">2 hours ago</p>
                                    </div>
                                </div>
                            </div>
                            {/* Insight Item 2 */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-all cursor-default">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-lg">sentiment_satisfied</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold mb-0.5">Consistent Tone</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">Voice analysis suggests a stable and calm tone throughout your morning check-in.</p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Yesterday, 10:15 PM</p>
                                    </div>
                                </div>
                            </div>
                            {/* Insight Item 3 */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-all cursor-default">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-lg">warning</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold mb-0.5">Stress Indicator</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">Slight elevation in speech speed noted. Consider a 5-minute breathing exercise.</p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Oct 22nd</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-4 text-center text-primary text-sm font-bold hover:underline">View All Insights</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
