import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function SidebarLayout({ user, activeMenu, children, isModalOpen }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>, href: '/dashboard?tab=overview' },
        { id: 'applicants', label: 'Kelola Pendaftar', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, href: '/dashboard?tab=applicants' },
        { id: 'financial', label: 'Laporan Keuangan', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, href: '/dashboard?tab=financial' },
        { id: 'events', label: 'Event Saya', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>, href: '/dashboard?tab=events' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-['TT_Commons'] pt-[76px]">
            {/* Mobile Sidebar Toggle Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-[76px] left-0 z-40 w-64 h-[calc(100vh-76px)] bg-white border-r border-gray-100 shadow-sm transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <div className="mb-6 px-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
                    </div>
                    <nav className="space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = activeMenu === item.id;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold ${
                                        isActive 
                                        ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' 
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`${isActive ? 'text-purple-600' : 'text-gray-400'}`}>
                                        {item.icon}
                                    </div>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                
                {/* Sidebar Footer User Profile */}
                <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <img 
                            className="w-10 h-10 rounded-full border border-gray-200" 
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`} 
                            alt={user?.name || "User Avatar"} 
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">Event Organizer</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 min-w-0 transition-all duration-300 ${isModalOpen ? 'overflow-hidden h-[calc(100vh-76px)]' : ''}`}>
                <div className="md:hidden p-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-[76px] z-30">
                    <span className="font-bold text-gray-800">{menuItems.find(m => m.id === activeMenu)?.label || 'Dashboard'}</span>
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -mr-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
