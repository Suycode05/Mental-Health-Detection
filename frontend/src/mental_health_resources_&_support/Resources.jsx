import React from 'react';
import { Link } from 'react-router-dom';

const Resources = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8 h-full">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Resources & Support</h2>
                <p className="text-slate-500 dark:text-slate-400">Curated tools, strategies, and professional help tailored for you.</p>
            </div>

            {/* Emergency Banner */}
            <div className="bg-red-500 text-white rounded-2xl p-6 shadow-xl shadow-red-500/20 mb-10 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                    <span className="material-symbols-outlined text-4xl">sos</span>
                </div>
                <div className="flex-1 text-center md:text-left z-10">
                    <h3 className="text-xl font-bold mb-1">Immediate Help Available</h3>
                    <p className="text-white/90 text-sm">If you or someone you know is in immediate danger, please don't wait.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto">
                    <button className="px-6 py-3 bg-white text-red-600 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">call</span>
                        Call 988
                    </button>
                    <button className="px-6 py-3 bg-red-600 border border-white/30 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
                        Crisis Text Line
                    </button>
                </div>
            </div>

            {/* Quick Access Categories */}
            <h3 className="text-xl font-bold mb-6">Personalized Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Strategy Card 1 */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">self_improvement</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Guided Meditation</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">5-min sessions to reduce anxiety and regain focus.</p>
                    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-1/3"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">3 sessions this week</p>
                </div>

                {/* Strategy Card 2 */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                    <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">breathing</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Breathing Exercises</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Techniques to lower heart rate during stress.</p>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase rounded-lg">Recommended</span>
                </div>

                {/* Strategy Card 3 */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                    <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">sleep</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Sleep Hygiene</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Tips for better rest based on your activity patterns.</p>
                </div>
            </div>

            {/* Split Section: Map & Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Nearby Clinics Map Placeholder */}
                <div className="lg:col-span-8 bg-slate-100 dark:bg-slate-800 rounded-3xl h-[400px] relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 z-10">
                        <span className="material-symbols-outlined text-4xl text-slate-400">location_on</span>
                        <p className="text-slate-500 font-bold">Interactive Map of Nearby Clinics</p>
                        <button className="px-5 py-2 bg-white dark:bg-card-dark shadow-sm rounded-lg text-sm font-bold text-primary hover:text-white hover:bg-primary transition-all">Enable Location</button>
                    </div>
                    <img className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Map background" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png" />
                </div>

                {/* Articles Feed */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex gap-4">
                            <div className="h-16 w-16 bg-slate-200 rounded-lg shrink-0 overflow-hidden">
                                <img className="h-full w-full object-cover" src="https://picsum.photos/100" alt="Article thumb" />
                            </div>
                            <div>
                                <h5 className="font-bold text-sm mb-1 line-clamp-2">Understanding Anxiety Triggers in Daily Life</h5>
                                <p className="text-xs text-slate-500">5 min read • Dr. Sarah Jenkins</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex gap-4">
                            <div className="h-16 w-16 bg-slate-200 rounded-lg shrink-0 overflow-hidden">
                                <img className="h-full w-full object-cover" src="https://picsum.photos/101" alt="Article thumb" />
                            </div>
                            <div>
                                <h5 className="font-bold text-sm mb-1 line-clamp-2">The Science of Sleep and Emotional Regulation</h5>
                                <p className="text-xs text-slate-500">8 min read • Wellness Journal</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 bg-primary rounded-2xl text-white flex items-center justify-between cursor-pointer hover:bg-primary/90 transition-colors">
                        <div>
                            <p className="font-bold text-lg">Connect with a Therapist</p>
                            <p className="text-sm opacity-90">Find a professional today</p>
                        </div>
                        <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resources;
