import React from 'react';
import ReportChart from '../components/ReportChart';

const Reports = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8 h-full">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Mental Health Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400">Detailed analytics and progress tracking.</p>
                </header>

                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                    <ReportChart />
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 max-w-2xl mx-auto">
                    <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined">insights</span>
                        Weekly Summary
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300">
                        Your mood has been generally positive this week. Consider maintaining your sleep schedule and hydration to keep the trend going.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reports;
