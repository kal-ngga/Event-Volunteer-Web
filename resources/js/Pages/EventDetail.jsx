import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Navbar from '@/Component/Navbar';

export default function EventDetail({ user, event, divisions = [], existingApplication, midtransClientKey }) {
    const [selectedDivision, setSelectedDivision] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { flash, errors } = usePage().props;

    if (!event) return <div>Event not found</div>;

    // Handle Midtrans Snap token from flash session
    useEffect(() => {
        if (flash?.snap_token && window.snap) {
            window.snap.pay(flash.snap_token, {
                onSuccess: function(result) {
                    setPaymentStatus('success');
                    alert('Pembayaran berhasil! Terima kasih.');
                    window.location.reload();
                },
                onPending: function(result) {
                    setPaymentStatus('pending');
                    alert('Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.');
                },
                onError: function(result) {
                    setPaymentStatus('error');
                    alert('Pembayaran gagal. Silakan coba lagi.');
                },
                onClose: function() {
                    if (!paymentStatus) {
                        alert('Anda menutup popup pembayaran. Silakan coba lagi untuk melanjutkan.');
                    }
                }
            });
        }
    }, [flash?.snap_token]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const handleApply = (e) => {
        e.preventDefault();
        if (!selectedDivision) {
            alert('Silakan pilih divisi terlebih dahulu.');
            return;
        }
        setIsSubmitting(true);
        router.post(`/event/${event.id}/apply`, { division_id: selectedDivision }, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const getApplicationStatusBadge = () => {
        if (!existingApplication) return null;
        
        const statusMap = {
            pending: { label: 'Menunggu Review', color: 'bg-yellow-100 text-yellow-800' },
            accepted: { label: 'Diterima', color: 'bg-green-100 text-green-800' },
            rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
        };
        const paymentMap = {
            free: { label: 'Gratis', color: 'bg-green-100 text-green-800' },
            unpaid: { label: 'Belum Bayar', color: 'bg-red-100 text-red-800' },
            pending: { label: 'Pembayaran Pending', color: 'bg-yellow-100 text-yellow-800' },
            paid: { label: 'Sudah Bayar', color: 'bg-green-100 text-green-800' },
            failed: { label: 'Gagal Bayar', color: 'bg-red-100 text-red-800' },
        };

        const appStatus = statusMap[existingApplication.status] || { label: existingApplication.status, color: 'bg-gray-100 text-gray-800' };
        const payStatus = paymentMap[existingApplication.payment_status] || { label: existingApplication.payment_status, color: 'bg-gray-100 text-gray-800' };

        return { appStatus, payStatus };
    };

    const statusBadge = getApplicationStatusBadge();

    return (
        <div className="min-h-screen bg-gray-50 font-['TT_Commons']">
            <Head title={event.title} />
            <Navbar user={user} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 w-full">
                <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali ke Katalog
                </Link>

                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Image */}
                    <div className="w-full h-64 sm:h-80 lg:h-96 relative bg-gray-200">
                        <img 
                            src={`https://placehold.co/1200x600/4CAF50/FFFFFF?text=${encodeURIComponent(event.category_name)}`} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                            <span className="px-4 py-1.5 bg-white/95 text-purple-700 text-sm font-bold rounded-full shadow-sm">
                                {event.category_name}
                            </span>
                            <span className="px-4 py-1.5 bg-white/95 text-blue-700 text-sm font-bold rounded-full shadow-sm capitalize">
                                {event.status === 'published' ? 'Pendaftaran Buka' : event.status}
                            </span>
                            {/* Paid / Free Badge */}
                            {event.is_paid ? (
                                <span className="px-4 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-full shadow-sm">
                                    Berbayar {formatCurrency(event.price)}
                                </span>
                            ) : (
                                <span className="px-4 py-1.5 bg-green-500 text-white text-sm font-bold rounded-full shadow-sm">
                                    Gratis
                                </span>
                            )}
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

                        {/* Divisions Section */}
                        {divisions.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Divisi Tersedia</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {divisions.map((div) => (
                                        <div key={div.id} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-gray-900">{div.division_name}</h3>
                                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-medium">
                                                    Kuota: {div.quota}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">{div.description || 'Tidak ada deskripsi.'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Application Section */}
                        <div className="pt-6 border-t border-gray-100">
                            {existingApplication ? (
                                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-900">Status Pendaftaran Anda</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${statusBadge.appStatus.color}`}>
                                            Aplikasi: {statusBadge.appStatus.label}
                                        </span>
                                        <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${statusBadge.payStatus.color}`}>
                                            Pembayaran: {statusBadge.payStatus.label}
                                        </span>
                                    </div>
                                    {existingApplication.payment_status === 'unpaid' && existingApplication.payment_token && (
                                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                            <button
                                                onClick={() => {
                                                    if (window.snap) {
                                                        window.snap.pay(existingApplication.payment_token, {
                                                            onSuccess: () => { alert('Pembayaran berhasil!'); window.location.reload(); },
                                                            onPending: () => { alert('Pembayaran sedang diproses.'); },
                                                            onError: () => { alert('Pembayaran gagal.'); },
                                                        });
                                                    }
                                                }}
                                                className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                                            >
                                                Lanjutkan Pembayaran
                                            </button>
                                            
                                            <button
                                                onClick={() => {
                                                    if(confirm('Apakah Anda yakin ingin membatalkan pendaftaran ini? Anda harus mendaftar dan membayar ulang jika ingin bergabung.')) {
                                                        router.delete(`/applications/${existingApplication.id}`, {
                                                            preserveScroll: true
                                                        });
                                                    }
                                                }}
                                                className="px-6 py-3 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-50 transition-colors"
                                            >
                                                Batalkan Pendaftaran
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : user.role_id === 3 ? (
                                <form onSubmit={handleApply} className="space-y-4">
                                    {divisions.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Divisi</label>
                                            <select
                                                className="w-full sm:w-auto rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 border text-gray-900"
                                                value={selectedDivision}
                                                onChange={(e) => setSelectedDivision(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Pilih Divisi --</option>
                                                {divisions.map((div) => (
                                                    <option key={div.id} value={div.id}>
                                                        {div.division_name} (Kuota: {div.quota})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto px-10 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm text-lg block text-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Memproses...' : event.is_paid ? `Daftar & Bayar ${formatCurrency(event.price)}` : 'Ayo Mendaftar!'}
                                    </button>
                                    
                                    {/* Tampilkan pesan error jika ada */}
                                    {errors && Object.keys(errors).length > 0 && (
                                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                                            <ul className="list-disc pl-5">
                                                {Object.values(errors).map((err, index) => (
                                                    <li key={index}>{err}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </form>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Login sebagai Volunteer untuk mendaftar.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
