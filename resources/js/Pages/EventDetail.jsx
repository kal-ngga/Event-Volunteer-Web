import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Navbar from '@/Component/Navbar';

export default function EventDetail({ user, event, divisions = [], existingApplication, midtransClientKey }) {
    const [selectedDivision, setSelectedDivision] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snapLoaded, setSnapLoaded] = useState(false);

    const { flash, errors } = usePage().props;

    if (!event) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-slate-900">Event not found</div>;

    // Dynamically load Midtrans script to avoid Inertia SPA navigation issues
    useEffect(() => {
        if (!midtransClientKey) return;

        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('ngrok');
        const scriptUrl = midtransClientKey.includes('SB-') || isLocalhost
            ? 'https://app.sandbox.midtrans.com/snap/snap.js'
            : 'https://app.midtrans.com/snap/snap.js';
        
        let scriptTag = document.querySelector(`script[src="${scriptUrl}"]`);
        
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.src = scriptUrl;
            scriptTag.setAttribute('data-client-key', midtransClientKey);
            scriptTag.onload = () => setSnapLoaded(true);
            document.body.appendChild(scriptTag);
        } else {
            setSnapLoaded(true);
        }

        return () => {
            // We usually don't remove snap.js once loaded to avoid issues, but we can clean up if needed.
        }
    }, [midtransClientKey]);

    // Handle Midtrans Snap token from flash session (fallback)
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
        } else if (flash?.snap_token && !window.snap) {
            alert('Sistem pembayaran (Midtrans) belum siap. Silakan refresh halaman.');
        } 
        
        // Handle all possible errors robustly
        if (errors?.payment) {
            alert(errors.payment);
        } else if (errors?.event) {
            alert(errors.event);
        } else if (errors?.division_id) {
            alert(errors.division_id);
        } else if (Object.keys(errors || {}).length > 0) {
            // Catch-all for other errors
            alert(Object.values(errors)[0]);
        }
    }, [flash?.snap_token, flash?.success, errors]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const options = { hour: 'numeric', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleTimeString('en-US', options);
    };

    const getShortMonth = (dateString) => {
        if (!dateString) return "M";
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    };

    const getDay = (dateString) => {
        if (!dateString) return "0";
        return new Date(dateString).getDate();
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
            onSuccess: (page) => {
                const flashToken = page.props.flash?.snap_token;
                if (flashToken) {
                    if (window.snap) {
                        window.snap.pay(flashToken, {
                            onSuccess: function(result) {
                                alert('Pembayaran berhasil! Terima kasih.');
                                window.location.reload();
                            },
                            onPending: function(result) {
                                alert('Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.');
                            },
                            onError: function(result) {
                                alert('Pembayaran gagal. Silakan coba lagi.');
                            },
                            onClose: function() {
                                alert('Anda menutup popup pembayaran. Silakan coba lagi untuk melanjutkan.');
                            }
                        });
                    } else {
                        alert('Sistem pembayaran belum siap. Silakan refresh dan coba lagi.');
                    }
                }
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const getApplicationStatusBadge = () => {
        if (!existingApplication) return null;
        
        const statusMap = {
            pending: { label: 'Menunggu Review', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            accepted: { label: 'Diterima', color: 'bg-green-100 text-green-800 border-green-200' },
            rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800 border-red-200' },
        };
        const paymentMap = {
            free: { label: 'Gratis', color: 'bg-green-100 text-green-800 border-green-200' },
            unpaid: { label: 'Belum Bayar', color: 'bg-red-100 text-red-800 border-red-200' },
            pending: { label: 'Pembayaran Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            paid: { label: 'Sudah Bayar', color: 'bg-green-100 text-green-800 border-green-200' },
            failed: { label: 'Gagal Bayar', color: 'bg-red-100 text-red-800 border-red-200' },
        };

        const appStatus = statusMap[existingApplication.status] || { label: existingApplication.status, color: 'bg-slate-100 text-slate-800' };
        const payStatus = paymentMap[existingApplication.payment_status] || { label: existingApplication.payment_status, color: 'bg-slate-100 text-slate-800' };

        return { appStatus, payStatus };
    };

    const statusBadge = getApplicationStatusBadge();

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

    const eventImageUrl = getEventImage(event);

    return (
        <div className="min-h-screen relative font-['TT_Commons'] text-slate-800">
            {/* Dynamic Blurred Background (Ultra Soft Light Version) */}
            <div 
                className="fixed inset-0 z-0 pointer-events-none blur-[120px] scale-150 opacity-30 saturate-100"
                style={{
                    backgroundImage: `url('${eventImageUrl}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            {/* Soft Overlay for readability & glassmorphism */}
            <div className="fixed inset-0 z-0 bg-slate-50/85 backdrop-blur-2xl pointer-events-none" />

            <div className="relative z-10">
                <Head title={event.title} />
                <Navbar user={user} />

                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
                    <Link href="/" className="inline-flex items-center text-slate-600 hover:text-purple-600 mb-8 transition-colors text-sm font-medium">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Catalog
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
                        
                        {/* ================= LEFT COLUMN ================= */}
                        <div className="space-y-6">
                            {/* Thumbnail */}
                            <div className="w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl relative border border-slate-200">
                                <img 
                                    src={eventImageUrl} 
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Presented By */}
                            <div className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(event.eo_name || 'EO')}&background=random`} 
                                        alt={event.eo_name}
                                        className="w-10 h-10 rounded-full" 
                                    />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Presented by</p>
                                        <p className="text-sm font-bold text-slate-900">{event.eo_name || 'Organization'}</p>
                                    </div>
                                </div>
                                <button className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                                    Subscribe
                                </button>
                            </div>

                            {/* Organization Intro */}
                            <p className="text-sm text-slate-600 leading-relaxed px-1">
                                Welcome to {event.eo_name || 'our organization'}. We are dedicated to providing the best volunteering experiences and connecting passionate individuals with meaningful causes.
                            </p>

                            {/* Tags */}
                            <div className="space-y-3 px-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full border border-slate-200 bg-white/60 text-xs text-slate-600 backdrop-blur-sm"># {event.category_name}</span>
                                    {event.is_paid ? (
                                        <span className="px-3 py-1 rounded-full border border-slate-200 bg-white/60 text-xs text-slate-600 backdrop-blur-sm"># Premium</span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full border border-slate-200 bg-white/60 text-xs text-slate-600 backdrop-blur-sm"># Free</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ================= RIGHT COLUMN ================= */}
                        <div className="space-y-8 lg:pt-4">
                            
                            {/* Location Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-xs text-slate-700 font-medium shadow-sm">
                                <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Featured in <strong className="text-slate-900">{event.location}</strong>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                                {event.title}
                            </h1>

                            {/* Date & Location Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center border border-slate-200 flex-shrink-0 shadow-sm">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 leading-none">{getShortMonth(event.start_date)}</span>
                                        <span className="text-lg font-bold text-slate-900 leading-none mt-1">{getDay(event.start_date)}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{formatDate(event.start_date)}</p>
                                        <p className="text-xs text-slate-500 mt-1">{formatTime(event.start_date)} - {formatTime(event.end_date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-200 flex-shrink-0 shadow-sm">
                                        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{event.location}</p>
                                        <p className="text-xs text-slate-500 mt-1">Indonesia</p>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Box */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 overflow-hidden shadow-xl relative">
                                <div className="p-4 bg-slate-50/80 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900">Registration</h3>
                                </div>

                                <div className="p-6 sm:p-8 space-y-6">
                                    {existingApplication ? (
                                        /* Already Applied — Show Status */
                                        <div className="space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-200">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">Application Submitted</p>
                                                    <p className="text-xs text-slate-500 mt-1">You have already registered for a division in this event.</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Current Status</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${statusBadge.appStatus.color}`}>
                                                        {statusBadge.appStatus.label}
                                                    </span>
                                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${statusBadge.payStatus.color}`}>
                                                        {statusBadge.payStatus.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {existingApplication.payment_status === 'unpaid' && existingApplication.payment_token && (
                                                <div className="pt-2 border-t border-slate-200">
                                                    <button
                                                        onClick={() => {
                                                            if (window.snap) {
                                                                window.snap.pay(existingApplication.payment_token, {
                                                                    onSuccess: () => { alert('Pembayaran berhasil!'); window.location.reload(); },
                                                                    onPending: () => { alert('Pembayaran pending.'); },
                                                                    onError: () => { alert('Pembayaran gagal.'); }
                                                                });
                                                            } else {
                                                                alert('Sistem pembayaran belum siap.');
                                                            }
                                                        }}
                                                        className="w-full px-6 py-3 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
                                                    >
                                                        Selesaikan Pembayaran ({formatCurrency(event.price)})
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                                                        <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Select Division</p>
                                                        <p className="text-[10px] text-slate-500">Choose your volunteer role.</p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 sm:max-w-xs">
                                                    <select 
                                                        value={selectedDivision}
                                                        onChange={e => setSelectedDivision(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none"
                                                    >
                                                        <option value="">-- Choose Division --</option>
                                                        {divisions.map(d => (
                                                            <option key={d.id} value={d.id}>{d.division_name} ({d.quota} spots left)</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {event.is_paid && (
                                                <div className="flex items-start gap-4 p-4">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 border border-orange-200">
                                                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Premium Event</p>
                                                        <p className="text-xs text-slate-600 mt-1">A registration fee of <strong className="text-slate-900">{formatCurrency(event.price)}</strong> applies. Payment is required upon acceptance.</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="h-px w-full bg-slate-200 my-6" />

                                            <div>
                                                <p className="text-sm text-slate-600 mb-5">
                                                    Welcome, <strong>{user.name}</strong>! To join the event, please complete your registration below.
                                                </p>
                                                
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                                                    <div className="flex items-center gap-3 bg-white py-2 px-3 rounded-xl border border-slate-200">
                                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} className="w-8 h-8 rounded-full" />
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900">{user.name}</p>
                                                            <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={handleApply}
                                                        disabled={isSubmitting}
                                                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg flex items-center justify-center min-w-[160px]"
                                                    >
                                                        {isSubmitting ? (
                                                            <span className="flex items-center gap-2">
                                                                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                                Applying...
                                                            </span>
                                                        ) : 'Request to Join'}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* About Event Section */}
                            <div className="pt-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">About Event</h3>
                                
                                <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed space-y-6">
                                    <p className="text-base">{event.description || 'No detailed description provided by the organizer.'}</p>
                                    
                                    {event.activity_details && (
                                        <div className="bg-white/80 rounded-2xl p-6 border border-slate-200 mt-8">
                                            <h4 className="text-slate-900 font-bold text-lg mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                Activity Highlights
                                            </h4>
                                            <p className="text-sm">{event.activity_details}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Detailed Divisions Breakdown */}
                                <h3 className="text-lg font-bold text-slate-900 mt-12 mb-6 border-b border-slate-200 pb-4">Divisions Breakdown</h3>
                                {divisions.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {divisions.map(div => (
                                            <div key={div.id} className="bg-white/80 rounded-2xl p-6 border border-slate-200 hover:bg-white/90 transition-colors shadow-sm">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-bold text-slate-900 text-base">{div.division_name}</h4>
                                                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-purple-100 border border-purple-200 rounded-lg text-purple-700">
                                                        {div.quota} Spots
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    {div.description || 'General support and volunteering tasks.'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic">No divisions specified for this event.</p>
                                )}
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
