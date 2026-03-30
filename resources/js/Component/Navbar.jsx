import React from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar({ user }) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-12 py-4 bg-purple-700 border-b border-purple-800 flex justify-between items-center overflow-hidden shadow-md">
            {/* Background decorative elements */}
            <div className="w-[300px] h-[300px] absolute -right-20 -top-20 opacity-20 bg-white rounded-full blur-3xl pointer-events-none" />
            <div className="w-[300px] h-[300px] absolute -left-20 -top-20 opacity-20 bg-white rounded-full blur-3xl pointer-events-none" />
            
            {/* Logo Area */}
            <div className="relative z-10 flex items-center">
                <Link href="/dashboard" className="text-white text-2xl font-bold font-['TT_Commons'] tracking-wide">
                    Voluntree.org
                </Link>
            </div>

            {/* Profile & Actions Area */}
            <div className="relative z-10 flex items-center gap-6">
                {/* Notification Bell */}
                <button className="w-8 h-8 relative cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <img 
                        className="w-10 h-10 rounded-full outline outline-2 outline-white object-cover" 
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`} 
                        alt={user?.name || "User Avatar"} 
                    />
                    <div className="hidden md:block text-white">
                        <div className="font-medium text-sm font-['TT_Commons'] leading-tight">{user?.name || 'Guest'}</div>
                        <div className="text-xs opacity-80 font-['TT_Commons']">{user?.email || 'Welcome'}</div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
