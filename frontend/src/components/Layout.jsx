import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Helper to determine active link styling
    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        const baseClass = "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all";
        const activeClass = "bg-primary text-white";
        const inactiveClass = "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800";
        return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">

            {/* Mobile Hamburger Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-card-dark text-slate-600 dark:text-slate-300 shadow-md"
                onClick={toggleSidebar}
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Sidebar Navigation */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 flex items-center gap-3 justify-between lg:justify-start">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">MindFlow AI</h1>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={closeSidebar} className="lg:hidden text-slate-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    <Link to="/" onClick={closeSidebar} className={getLinkClass("/")}>
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Overview</span>
                    </Link>
                    <Link to="/journal" onClick={closeSidebar} className={getLinkClass("/journal")}>
                        <span className="material-symbols-outlined">menu_book</span>
                        <span>Journal</span>
                    </Link>
                    <Link to="/voice" onClick={closeSidebar} className={getLinkClass("/voice")}>
                        <span className="material-symbols-outlined">mic</span>
                        <span>Voice Analysis</span>
                    </Link>
                    <Link to="/reports" onClick={closeSidebar} className={getLinkClass("/reports")}>
                        <span className="material-symbols-outlined">bar_chart</span>
                        <span>Reports</span>
                    </Link>
                    <Link to="/resources" onClick={closeSidebar} className={getLinkClass("/resources")}>
                        <span className="material-symbols-outlined">library_books</span>
                        <span>Resources</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 mb-4">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">System Status</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-medium">Privacy Shield Active</span>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                        <img className="h-10 w-10 rounded-full object-cover" alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMZckT9iprP7BzEtAWNHHwIdKZGWB1BEcID97y8_B7XXSTkyFr2JCByMlYx5ujuO6RLQOCb9fZOiZA4qqnEhjyZdxi7KRPWSI8VkhNG6wEVxTAO-EjjxG9vTgwiVgiSmQ8DYDKg9jU88ziy6W_aB392O59o0zRddGe9GCcWBpN6mMr8DOiqO99gbj5f-MLO5QJdXVNZj0jmSC7E4DUcVw8-NhEd-n_Lf-8UREOCaivjcbJTG2YQnFUvLrKVv6m1laWAtspHDRI9wg" />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">Alex Chen</p>
                            <p className="text-xs text-slate-500 truncate">Professional Plan</p>
                        </div>
                        <button className="ml-auto text-slate-400 hover:text-slate-100">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden flex flex-col relative w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
