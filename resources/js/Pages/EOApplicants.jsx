import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Component/Navbar';
import SidebarLayout from './EODashboard/SidebarLayout';

export default function EOApplicants({ user, event, applicants }) {
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleStatusUpdate = (applicationId, status) => {
        const action = status === 'accepted' ? 'Accept' : 'Reject';
        if (confirm(`Are you sure you want to ${action} this applicant?`)) {
            router.put(`/eo/applications/${applicationId}/status`, { status: status }, {
                preserveScroll: true,
                onSuccess: () => alert(`Success: Applicant status changed to ${status}!`),
                onError: (errors) => {
                    const message = Object.values(errors).join('\n');
                    alert(`Error: ${message}`);
                }
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
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
            pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
            rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
        };
        const s = map[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${s.color}`}>{s.label}</span>;
    };

    const canManage = (applicant) => {
        // Can only accept/reject if payment is free or paid
        return ['free', 'paid'].includes(applicant.payment_status) && applicant.status === 'pending';
    };

    // Client-side search filtering
    const filteredApplicants = applicants.filter(applicant => 
        applicant.volunteer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.volunteer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.division_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 font-['TT_Commons']">
            <Head title={`Applicants - ${event.title}`} />
            <Navbar user={user} onSearch={setSearchQuery} searchPlaceholder="Cari nama relawan, email, atau divisi..." />

            <SidebarLayout user={user} activeMenu="applicants" isModalOpen={!!selectedApplicant}>
                <div className="animate-fade-in">
                    <Link href="/dashboard?tab=applicants" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors font-medium">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Kembali ke Daftar Event
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-gray-200">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                {event.title}
                            </h1>
                            <p className="mt-2 text-md text-gray-600">
                                {applicants.length} volunteer(s) have applied to this event.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                            <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                                {event.category_name}
                            </span>
                            {event.is_paid ? (
                                <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-orange-100 text-orange-800">
                                    Berbayar
                                </span>
                            ) : (
                                <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                                    Gratis
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Volunteer
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Division
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applied At
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Payment
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredApplicants.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                No applicants found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredApplicants.map((applicant) => (
                                            <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            className="w-10 h-10 rounded-full object-cover"
                                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.volunteer_name)}&background=random`}
                                                            alt={applicant.volunteer_name}
                                                        />
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-900">{applicant.volunteer_name}</div>
                                                            <div className="text-xs text-gray-500">{applicant.volunteer_email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                        {applicant.division_name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(applicant.applied_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {paymentBadge(applicant.payment_status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {applicationBadge(applicant.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {canManage(applicant) && (
                                                        <div className="flex gap-2 justify-end mb-2">
                                                            <button
                                                                onClick={() => handleStatusUpdate(applicant.id, 'accepted')}
                                                                className="text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors font-semibold text-xs"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(applicant.id, 'rejected')}
                                                                className="text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors font-semibold text-xs"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    {!canManage(applicant) && (
                                                        <div className="flex justify-end mb-2">
                                                            {applicant.status !== 'pending' ? (
                                                                <span className="text-gray-400 text-xs">Done</span>
                                                            ) : (
                                                                <span className="text-yellow-600 text-xs font-medium">Awaiting Payment</span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => setSelectedApplicant(applicant)}
                                                        className="text-purple-600 hover:text-purple-900 bg-white border border-purple-200 hover:bg-purple-50 px-3 py-1 rounded-md transition-colors font-semibold text-xs text-center w-full shadow-sm"
                                                    >
                                                        View Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Applicant Detail Slide-Over */}
                {selectedApplicant && (
                    <div className="fixed inset-0 z-[100] overflow-hidden">
                        <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setSelectedApplicant(null)}></div>
                        <div className="fixed inset-y-0 right-0 max-w-full flex">
                            <div className="w-screen max-w-md transform transition-transform ease-in-out duration-300 translate-x-0">
                                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Detail Pelamar
                                        </h3>
                                        <button
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={() => setSelectedApplicant(null)}
                                        >
                                            <span className="sr-only">Tutup panel</span>
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="relative flex-1 p-6">
                                        <div className="space-y-6">
                                            {/* Profile header */}
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    className="w-16 h-16 rounded-full object-cover shadow-sm border border-gray-100"
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApplicant.volunteer_name)}&background=random`}
                                                    alt={selectedApplicant.volunteer_name}
                                                />
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900">{selectedApplicant.volunteer_name}</h4>
                                                    <p className="text-gray-500">{selectedApplicant.volunteer_email}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Badges row */}
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                                                    Divisi: {selectedApplicant.division_name}
                                                </span>
                                                <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                                                    Status: {applicationBadge(selectedApplicant.status)}
                                                </span>
                                                <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                                                    Bayar: {paymentBadge(selectedApplicant.payment_status)}
                                                </span>
                                            </div>

                                            {/* About Section */}
                                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
                                                <h5 className="font-bold text-gray-900 mb-2">BIO</h5>
                                                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                                                    {selectedApplicant.volunteer_bio || "Volunteer ini belum menuliskan bio atau pengalaman mereka."}
                                                </p>
                                            </div>

                                            {/* Portfolio and CV Actions */}
                                            <div className="flex flex-col gap-3">
                                                <h5 className="font-bold text-gray-900">Dokumen Pendukung</h5>
                                                {selectedApplicant.portfolio_url ? (
                                                    <a href={selectedApplicant.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">Lihat Portofolio</p>
                                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{selectedApplicant.portfolio_url}</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm text-center">Tidak ada link portofolio.</div>
                                                )}

                                                {selectedApplicant.cv_path ? (
                                                    <a href={`/${selectedApplicant.cv_path}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">Download CV</p>
                                                                <p className="text-xs text-gray-500">Unduh dokumen PDF</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm text-center">Tidak ada file CV.</div>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-500 bg-white border-t border-gray-100 pt-4">
                                                <strong>Tanggal Daftar:</strong> {formatDate(selectedApplicant.applied_at)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                                        {canManage(selectedApplicant) ? (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        handleStatusUpdate(selectedApplicant.id, 'rejected');
                                                        setSelectedApplicant(null);
                                                    }}
                                                    className="w-full flex-1 text-red-600 bg-red-50 hover:bg-red-100 font-bold uppercase px-6 py-3 rounded-lg outline-none focus:outline-none transition-all duration-150 border border-red-200"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleStatusUpdate(selectedApplicant.id, 'accepted');
                                                        setSelectedApplicant(null);
                                                    }}
                                                    className="w-full flex-1 bg-green-600 hover:bg-green-700 text-white font-bold uppercase px-6 py-3 rounded-lg shadow-sm hover:shadow-md outline-none focus:outline-none transition-all duration-150"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="w-full text-gray-700 bg-white border border-gray-300 font-bold uppercase px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-150"
                                                onClick={() => setSelectedApplicant(null)}
                                            >
                                                Tutup
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SidebarLayout>
        </div>
    );
}
