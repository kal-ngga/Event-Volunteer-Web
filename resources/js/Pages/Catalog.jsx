import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Navbar from '@/Component/Navbar';
import Card from '@/Component/Card';

export default function Dashboard({ user, events = [] }) {
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post('/logout');
    };

    // Helper to format date "YYYY-MM-DD HH:mm:ss" into "DD MMMM YYYY"
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['TT_Commons']">
            <Head title="Dashboard" />
            <Navbar user={user} />

            {/* Konten Utama Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                            Dashboard Relawan
                        </h1>
                        <p className="mt-2 text-md text-gray-600">
                            Selamat datang kembali, <span className="font-semibold text-gray-800">{user?.name || 'User'}</span>! Temukan berbagai kegiatan relawan terbaru di bawah ini.
                        </p>
                    </div>
                    <form onSubmit={handleLogout} className="mt-6 md:mt-0 flex-shrink-0">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            Log Out
                        </button>
                    </form>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">Belum ada acara yang tersedia saat ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events.map((event) => (
                            <Card 
                                key={event.id}
                                href={`/event/${event.id}`}
                                title={event.title} 
                                category={event.category_name} 
                                type="Volunteer" // Tipe didefaultkan Volunteer karena tidak ada spesifik "Individu/Kelompok" di DB events
                                image={`https://placehold.co/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(event.category_name)}`}
                                location={event.location}
                                startDate={formatDate(event.start_date)}
                                endDate={formatDate(event.end_date)}
                            />
                        ))}
                    </div>
                )}
            </main>
            
            <footer className="w-full bg-purple-100 py-4 px-8 gap-2 flex flex-col md:flex-row items-center justify-center md:gap-4 mt-auto">
                <p className="text-purple-700 text-sm md:text-lg font-light font-['TT_Commons'] text-center">
                    Copyright © 2026
                </p>
                <p className="text-purple-700 text-sm md:text-lg font-medium font-['TT_Commons'] text-center">
                    Kelompok 4
                </p>
                <p className="text-purple-700 text-sm md:text-lg font-light font-['TT_Commons'] text-center whitespace-nowrap">
                    Integrasi Aplikasi Enterprise.
                </p>
            </footer>
        </div>
    );
}