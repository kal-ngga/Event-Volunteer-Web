import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Component/Navbar';

export default function EventDetail({ user, event }) {
    if (!event) return <div>Event not found</div>;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['TT_Commons']">
            <Head title={event.title} />
            <Navbar user={user} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 w-full">
                <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali ke Dashboard
                </Link>

                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Image */}
                    <div className="w-full h-64 sm:h-80 lg:h-96 relative bg-gray-200">
                        <img 
                            src={`https://placehold.co/1200x600/4CAF50/FFFFFF?text=${encodeURIComponent(event.category_name)}`} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-4 py-1.5 bg-white/95 text-purple-700 text-sm font-bold rounded-full shadow-sm">
                                {event.category_name}
                            </span>
                            <span className="px-4 py-1.5 bg-white/95 text-blue-700 text-sm font-bold rounded-full shadow-sm capitalize">
                                {event.status === 'published' ? 'Pendaftaran Buka' : event.status}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-10 space-y-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
                                {event.title}
                            </h1>
                            <p className="text-xl text-gray-500 font-medium">
                                Penyelenggara: <span className="text-gray-900">{event.eo_name || 'Organization'}</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 pb-8 border-b border-gray-100">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 bg-purple-50 p-2.5 rounded-xl border border-purple-100 text-purple-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Tanggal Pelaksanaan</h3>
                                    <p className="text-gray-900 font-medium text-lg mt-1">{formatDate(event.start_date)} - {formatDate(event.end_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 bg-red-50 p-2.5 rounded-xl border border-red-100 text-red-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Lokasi</h3>
                                    <p className="text-gray-900 font-medium text-lg mt-1">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tentang Kegiatan</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {event.description || 'Detail kegiatan belum ditambahkan oleh penyelenggara.'}
                            </p>
                        </div>
                        
                        {event.activity_details && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rincian Aktivitas</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {event.activity_details}
                                </p>
                            </div>
                        )}

                        <div className="pt-6">
                            <button className="w-full sm:w-auto px-10 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm text-lg block text-center">
                                Ayo Mendaftar!
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
