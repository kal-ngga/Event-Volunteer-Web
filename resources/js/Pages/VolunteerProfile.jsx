import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import Navbar from '@/Component/Navbar';

export default function VolunteerProfile({ user, applications }) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        bio: user.bio || '',
        portfolio_url: user.portfolio_url || '',
        cv_file: null,
    });

    const { flash } = usePage().props;
    const [cvFileName, setCvFileName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile', {
            preserveScroll: true,
            forceFormData: true, // required for file uploads
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('cv_file', file);
        if (file) {
            setCvFileName(file.name);
        }
    };

    const paymentBadge = (status) => {
        const map = {
            free: { label: 'Gratis', color: 'bg-green-100 text-green-800' },
            unpaid: { label: 'Belum Bayar', color: 'bg-red-100 text-red-800' },
            pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            paid: { label: 'Lunas', color: 'bg-green-100 text-green-800' },
            failed: { label: 'Gagal', color: 'bg-red-100 text-red-800' },
        };
        const s = map[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${s.color}`}>{s.label}</span>;
    };

    const applicationBadge = (status) => {
        const map = {
            pending: { label: 'Menunggu Review', color: 'bg-yellow-100 text-yellow-800' },
            accepted: { label: 'Diterima', color: 'bg-green-100 text-green-800' },
            rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
        };
        const s = map[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${s.color}`}>{s.label}</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['TT_Commons']">
            <Head title="My Profile" />
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 w-full">
                
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl relative" role="alert">
                        <strong className="font-bold">Success! </strong>
                        <span className="block sm:inline">{flash.success}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Edit Profile Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8">
                            <div className="flex flex-col items-center mb-6 border-b border-gray-100 pb-6">
                                <img 
                                    className="w-24 h-24 rounded-full object-cover shadow-sm mb-4"
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                    alt={user.name}
                                />
                                <h2 className="text-2xl font-bold text-gray-900 text-center">{user.name}</h2>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 border"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tentang Saya (Bio)</label>
                                    <textarea
                                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 border h-28 resize-none"
                                        placeholder="Ceritakan tentang diri Anda, pengalaman, dan skill..."
                                        value={data.bio}
                                        onChange={e => setData('bio', e.target.value)}
                                    />
                                    {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio / LinkedIn URL</label>
                                    <input
                                        type="url"
                                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 border"
                                        placeholder="https://linkedin.com/in/..."
                                        value={data.portfolio_url}
                                        onChange={e => setData('portfolio_url', e.target.value)}
                                    />
                                    {errors.portfolio_url && <p className="text-red-500 text-xs mt-1">{errors.portfolio_url}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CV (PDF/DOC)</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                <p className="mb-2 text-sm text-gray-500 font-semibold">{cvFileName ? cvFileName : 'Klik untuk upload'}</p>
                                                <p className="text-xs text-gray-400">PDF, DOC, DOCX (Max 2MB)</p>
                                            </div>
                                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    {user.cv_path && !cvFileName && (
                                        <a href={`/storage/${user.cv_path}`} target="_blank" rel="noreferrer" className="text-purple-600 text-xs inline-block mt-2 hover:underline">
                                            Lihat CV Saat Ini
                                        </a>
                                    )}
                                    {errors.cv_file && <p className="text-red-500 text-xs mt-1">{errors.cv_file}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Profil'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Application History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Riwayat Pendaftaran Event</h2>
                            
                            {applications.length === 0 ? (
                                <div className="text-center py-10">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Riwayat</h3>
                                    <p className="text-gray-500 mb-6">Anda belum pernah mendaftar ke event manapun.</p>
                                    <Link href="/" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
                                        Cari Event Sekarang
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applications.map((app) => (
                                        <div key={app.id} className="border border-gray-100 rounded-xl p-5 hover:border-purple-200 transition-colors flex flex-col sm:flex-row justify-between gap-4">
                                            <div>
                                                <Link href={`/event/${app.event_id}`} className="text-lg font-bold text-gray-900 hover:text-purple-600 transition-colors">
                                                    {app.event_title}
                                                </Link>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        {formatDate(app.start_date)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        {app.location}
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-50 text-purple-700">
                                                        Divisi: {app.division_name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start sm:items-end gap-2">
                                                {applicationBadge(app.status)}
                                                {app.payment_status && app.payment_status !== 'free' && paymentBadge(app.payment_status)}
                                                
                                                <div className="text-xs text-gray-400 mt-2">
                                                    Daftar: {formatDate(app.applied_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
