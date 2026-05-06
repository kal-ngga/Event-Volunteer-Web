import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function EventsTab({ events, setIsModalOpen }) {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);
    };

    const handleCloseEvent = (eventId, eventTitle) => {
        if (confirm(`Apakah Anda yakin ingin menutup pendaftaran untuk event "${eventTitle}"?\n\nVolunteer tidak akan bisa lagi mendaftar ke event ini.`)) {
            router.put(`/eo/events/${eventId}/close`, {}, {
                preserveScroll: true,
                onSuccess: () => alert('Status event berhasil diubah menjadi Closed.')
            });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Daftar Event Saya</h3>
                    <p className="text-sm text-gray-500">Kelola semua event yang telah Anda buat</p>
                </div>
                <Link
                    href="/eo/events/create"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    Buat Event Baru
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Title</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Belum ada event yang dibuat.</td></tr>
                            ) : events.map(event => (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{event.applicant_count || 0} pendaftar</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{event.category_name}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {event.is_paid ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Berbayar {formatCurrency(event.price)}</span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Gratis</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(event.start_date)} - {formatDate(event.end_date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            event.status === 'published' ? 'bg-green-100 text-green-800' 
                                            : event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' 
                                            : event.status === 'closed' ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/eo/events/${event.id}/manage`}
                                                className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition-colors text-xs font-semibold"
                                            >
                                                Kelola Event
                                            </Link>
                                            
                                            {event.status === 'published' && (
                                                <button
                                                    onClick={() => handleCloseEvent(event.id, event.title)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors text-xs font-semibold border border-red-100"
                                                >
                                                    Tutup Pendaftaran
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
