import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function Navbar({ user, onSearch, searchPlaceholder }) {
    const { notifications = [] } = usePage().props;
    const [searchQuery, setSearchQuery] = useState(
        typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('search') || '' : ''
    );
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    // Dynamic search: if onSearch callback is provided, use it (local filtering).
    // Otherwise fall back to server-side catalog search.
    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        } else {
            router.get('/', { search: searchQuery }, { preserveState: true });
        }
    };

    // Also trigger search on every keystroke when onSearch is provided (live filter)
    const handleSearchChange = (value) => {
        setSearchQuery(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const markAsRead = (id) => {
        router.post(`/notifications/${id}/read`, {}, { preserveState: true, preserveScroll: true });
    };

    const markAllRead = () => {
        router.post('/notifications/read-all', {}, { preserveState: true, preserveScroll: true });
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const placeholder = searchPlaceholder || 'Cari acara relawan, lokasi, atau kategori...';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-12 py-4 bg-purple-700 border-b border-purple-800 flex justify-between items-center shadow-md">
            {/* Background decorative elements */}
            <div className="w-[300px] h-[300px] absolute -right-20 -top-20 opacity-20 bg-white rounded-full blur-3xl pointer-events-none" />
            <div className="w-[300px] h-[300px] absolute -left-20 -top-20 opacity-20 bg-white rounded-full blur-3xl pointer-events-none" />

            {/* Logo Area */}
            <div className="relative z-10 flex-shrink-0 flex items-center">
                <Link href={user?.role_id === 1 || user?.role_id === 2 ? "/dashboard" : "/"} className="text-white text-2xl font-bold font-['TT_Commons'] tracking-wide">
                    Voluntree.org
                </Link>
            </div>

            {/* Middle Search Bar */}
            <div className="relative z-10 flex-1 max-w-4xl px-8 hidden md:block">
                <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder={placeholder} 
                        className="w-full pl-6 pr-12 py-2.5 rounded-full bg-white border-none focus:ring-2 focus:ring-purple-300 text-gray-700 shadow-sm font-['TT_Commons']"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 p-1 focus:outline-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Profile & Actions Area */}
            <div className="relative z-10 flex shrink-0 items-center gap-5">
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                        className="relative text-white hover:text-purple-200 transition-colors"
                    >
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 rounded-full border-2 border-purple-700 text-[10px] text-white font-bold px-1">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifDropdown && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 text-sm">Notifikasi</h3>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                                        Tandai semua dibaca
                                    </button>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                        Belum ada notifikasi.
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div 
                                            key={notif.id} 
                                            onClick={() => { if (!notif.is_read) markAsRead(notif.id); }}
                                            className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-purple-50 transition-colors ${!notif.is_read ? 'bg-purple-50/50' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{notif.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                        {new Date(notif.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile with Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        className="flex items-center gap-3 group focus:outline-none"
                    >
                        <img 
                            className="w-10 h-10 rounded-full outline outline-2 outline-white/80 object-cover shadow-sm group-hover:opacity-90 transition-opacity" 
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`} 
                            alt={user?.name || "User Avatar"} 
                        />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileDropdown && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                            {/* User Info Header */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'Guest'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                            </div>
                            {/* Menu Items */}
                            <div className="py-1">
                                <Link 
                                    href="/profile" 
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Edit Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
