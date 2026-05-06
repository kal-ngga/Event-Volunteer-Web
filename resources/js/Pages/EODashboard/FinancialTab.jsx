import React, { useState, useMemo } from 'react';
import { StatCard } from './Charts';

export default function FinancialTab({ stats, events, recentTransactions, allApplications }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const paidEvents = events.filter(e => e.is_paid);

    // Filter dynamic data based on date selection
    const { filteredStats, filteredTransactions, eventRevenues } = useMemo(() => {
        let appsToConsider = allApplications;
        let txsToConsider = recentTransactions;

        if (startDate) {
            appsToConsider = appsToConsider.filter(a => new Date(a.created_at) >= new Date(startDate));
            txsToConsider = txsToConsider.filter(t => new Date(t.created_at) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            appsToConsider = appsToConsider.filter(a => new Date(a.created_at) <= end);
            txsToConsider = txsToConsider.filter(t => new Date(t.created_at) <= end);
        }

        let totalRevenue = 0;
        let totalAccepted = 0;
        const revenuesByEvent = {};

        paidEvents.forEach(e => revenuesByEvent[e.id] = { ...e, applicant_count: 0, revenue: 0 });

        appsToConsider.forEach(app => {
            if (app.payment_status === 'paid' && revenuesByEvent[app.event_id]) {
                revenuesByEvent[app.event_id].applicant_count++;
                revenuesByEvent[app.event_id].revenue += revenuesByEvent[app.event_id].price || 0;
                totalRevenue += revenuesByEvent[app.event_id].price || 0;
            }
            if (app.status === 'accepted') totalAccepted++;
        });

        return {
            filteredStats: { totalRevenue, totalAccepted },
            filteredTransactions: txsToConsider,
            eventRevenues: Object.values(revenuesByEvent)
        };
    }, [allApplications, recentTransactions, startDate, endDate, paidEvents]);

    const avgRevenue = paidEvents.length > 0 ? filteredStats.totalRevenue / paidEvents.length : 0;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Filter Section */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Laporan Keuangan</h3>
                    <p className="text-sm text-gray-500">Filter data berdasarkan rentang waktu tertentu</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                    />
                    <span className="text-gray-400">to</span>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                    />
                    {(startDate || endDate) && (
                        <button 
                            onClick={() => { setStartDate(''); setEndDate(''); }}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    icon={<svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Total Pendapatan"
                    value={formatCurrency(filteredStats.totalRevenue)}
                    color="bg-amber-50"
                    subtext="Periode terpilih"
                />
                <StatCard
                    icon={<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                    label="Event Berbayar"
                    value={paidEvents.length}
                    color="bg-indigo-50"
                    subtext="Total event aktif"
                />
                <StatCard
                    icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    label="Rata-rata Pendapatan"
                    value={formatCurrency(avgRevenue)}
                    color="bg-emerald-50"
                    subtext="Per event berbayar"
                />
                <StatCard
                    icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    label="Pendaftar Lunas"
                    value={filteredStats.totalAccepted || 0}
                    color="bg-blue-50"
                    subtext="Telah membayar di periode ini"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue per Event Breakdown */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-base font-bold text-gray-800">Pendapatan Per Event</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Pendaftar</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Pendapatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {eventRevenues.length === 0 ? (
                                    <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-400 text-sm">Belum ada event berbayar.</td></tr>
                                ) : eventRevenues.map(event => (
                                    <tr key={event.id} className="hover:bg-purple-50/30 transition-colors">
                                        <td className="px-6 py-3 text-sm font-semibold text-gray-800">{event.title}</td>
                                        <td className="px-4 py-3 text-right text-sm font-bold text-gray-700">{event.applicant_count}</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-green-700">{formatCurrency(event.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-base font-bold text-gray-800">Riwayat Transaksi</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Transaksi lunas berdasarkan filter periode</p>
                    </div>
                    <div className="overflow-x-auto max-h-[400px] flex-1">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/80 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Relawan</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Jumlah</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTransactions.filter(tx => tx.event_is_paid && tx.payment_status === 'paid').length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm">Belum ada transaksi di periode ini.</td></tr>
                                ) : filteredTransactions.filter(tx => tx.event_is_paid && tx.payment_status === 'paid').map(tx => (
                                    <tr key={tx.id} className="hover:bg-purple-50/30 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="text-sm font-semibold text-gray-800">{tx.volunteer_name}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[150px]">{tx.event_title}</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-green-700">{formatCurrency(tx.event_price)}</td>
                                        <td className="px-4 py-3 text-right text-xs text-gray-400">{formatDate(tx.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
