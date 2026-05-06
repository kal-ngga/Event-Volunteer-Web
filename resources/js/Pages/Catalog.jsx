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

    // Dynamically retrieve unique categories from the passed events
    const eventCategories = [...new Set(events.filter(e => e.category_name).map(e => e.category_name))];
    const categories = ['All', ...eventCategories.length > 0 ? eventCategories : ['Pendidikan', 'Lingkungan', 'Sosial', 'Kesehatan']];

const eventImages = [
        "Blockchain Blueprint 2026.avif",
        "Build with TRAE Jakarta.avif",
        "Build with TRAE Web App.avif",
        "Capital Circle Discovery Room Tangerang.avif",
        "Cuan 3 Digit Digital Marketing.avif",
        "Jakarta 2026 Summit.avif",
        "Luma Events.avif",
        "Luma Learn Build Earn.avif",
        "Master Class Kahf Brotherhood Community.avif",
        "One ScaleX Connect Indonesia Korea Startup Innovation 2026.avif",
        "Seedstars Villa Jakarta 2026.avif",
        "Seismic Solutions Jakarta Workshop.avif",
        "TERNYATA Showcase.avif"
    ];

    const getEventImage = (event) => {
        if (event.image_path) {
            return `/${event.image_path}`;
        }
        return `/images/events/${eventImages[event.id % eventImages.length]}`;
    };

    return (
        <div className="min-h-screen bg-transparent font-['TT_Commons']">
            <Head title="Dashboard" />
            <Navbar user={user} searchPlaceholder="Cari acara relawan..." />

            {/* Konten Utama Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 w-full">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-10 pb-8 relative rounded-2xl bg-gradient-to-r from-purple-100/60 via-purple-50/30 to-transparent p-6 -mx-6 md:mx-0">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                            <span className="text-sm text-purple-800 font-medium tracking-wide uppercase">Banyak Kegiatan Menunggumu!</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                            Jadilah Agen Perubahan,<br className="hidden md:block" /> Mulai Langkah Kebaikanmu
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                            Temukan berbagai misi sosial, lingkungan, dan kemanusiaan. Berikan dampak positif langsung ke masyarakat melalui platform Voluntree.org.
                        </p>
                    </div>

                    <div className="mt-8 lg:mt-0 flex-shrink-0 lg:max-w-md pt-6">
                        <div className="flex flex-wrap gap-x-2 gap-y-3 lg:justify-end">
                            {categories.map((cat, idx) => (
                                <button 
                                    key={idx}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm border ${
                                        idx === 0 
                                        ? 'bg-purple-700 text-white hover:bg-purple-800 border-transparent' 
                                        : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-purple-50 border-gray-100 hover:border-purple-200'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
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
                                image={getEventImage(event)}
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