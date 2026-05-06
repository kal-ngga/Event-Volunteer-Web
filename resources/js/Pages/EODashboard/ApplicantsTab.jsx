import React from 'react';
import { Link } from '@inertiajs/react';

export default function ApplicantsTab({ events }) {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800">Kelola Pendaftar</h3>
                <p className="text-sm text-gray-500">Pilih event untuk mengelola pendaftar (terima/tolak) dan melihat detail relawan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length === 0 ? (
                    <div className="col-span-full bg-white p-8 rounded-xl text-center border border-gray-100">
                        <p className="text-gray-500">Belum ada event yang dibuat.</p>
                    </div>
                ) : events.map(event => (
                    <Link 
                        key={event.id}
                        href={`/eo/events/${event.id}/applicants`}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all hover:border-purple-200 group flex flex-col h-full cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-purple-50 text-purple-700">
                                {event.category_name}
                            </span>
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                                event.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                            }`}>
                                {event.status}
                            </span>
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
                            {event.title}
                        </h4>
                        
                        <div className="text-xs text-gray-500 mb-4 flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {event.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {formatDate(event.start_date)}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-semibold uppercase">Pendaftar</span>
                                <span className="text-lg font-black text-gray-800">{event.applicant_count || 0}</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-green-600 font-semibold uppercase bg-green-50 px-1.5 rounded">Diterima</span>
                                    <span className="text-sm font-bold text-gray-800">{event.accepted_count || 0}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-amber-600 font-semibold uppercase bg-amber-50 px-1.5 rounded">Menunggu</span>
                                    <span className="text-sm font-bold text-gray-800">{event.pending_count || 0}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
