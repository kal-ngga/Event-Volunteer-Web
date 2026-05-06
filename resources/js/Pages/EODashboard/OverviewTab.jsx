import React, { useState, useMemo } from 'react';
import { BarChart, DonutChart, StatCard } from './Charts';

export default function OverviewTab({ stats, events, allApplications, recentTransactions }) {
    const [timeFilter, setTimeFilter] = useState('6m'); // '1w', '1m', '3m', '6m', '1y'

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);
    };

    // Calculate dynamic chart data based on filter
    const chartData = useMemo(() => {
        if (!allApplications) return [];
        const now = new Date();
        let startDate = new Date();
        let formatKey = '';
        let stepCount = 0;
        let stepType = 'month';

        switch (timeFilter) {
            case '1w':
                startDate.setDate(now.getDate() - 6);
                stepCount = 7;
                stepType = 'day';
                break;
            case '1m':
                startDate.setDate(now.getDate() - 29);
                stepCount = 30;
                stepType = 'day';
                break;
            case '3m':
                startDate.setMonth(now.getMonth() - 2);
                startDate.setDate(1);
                stepCount = 3;
                stepType = 'month';
                break;
            case '6m':
                startDate.setMonth(now.getMonth() - 5);
                startDate.setDate(1);
                stepCount = 6;
                stepType = 'month';
                break;
            case '1y':
                startDate.setMonth(now.getMonth() - 11);
                startDate.setDate(1);
                stepCount = 12;
                stepType = 'month';
                break;
            default:
                break;
        }

        const data = [];
        for (let i = 0; i < stepCount; i++) {
            let label = '';
            let start = new Date(startDate);
            let end = new Date(startDate);

            if (stepType === 'day') {
                start.setDate(startDate.getDate() + i);
                end.setDate(startDate.getDate() + i);
                end.setHours(23, 59, 59, 999);
                label = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            } else if (stepType === 'month') {
                start.setMonth(startDate.getMonth() + i);
                start.setDate(1);
                end.setMonth(startDate.getMonth() + i + 1);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
                label = start.toLocaleDateString('id-ID', { month: 'short' });
            }

            const applicantsInPeriod = allApplications.filter(app => {
                const appDate = new Date(app.created_at);
                return appDate >= start && appDate <= end;
            });

            let revenue = 0;
            applicantsInPeriod.forEach(app => {
                if (app.payment_status === 'paid') {
                    const event = events.find(e => e.id === app.event_id);
                    if (event && event.is_paid) {
                        revenue += event.price || 0;
                    }
                }
            });

            data.push({
                month: label,
                applicants: applicantsInPeriod.length,
                revenue: revenue
            });
        }
        return data;
    }, [allApplications, events, timeFilter]);

    // Calculate Top Insights
    const topInsights = useMemo(() => {
        let maxRevenueEvent = null;
        let maxRevenue = -1;
        let maxApplicantsEvent = null;
        let maxApplicants = -1;

        events.forEach(event => {
            const eventApps = allApplications.filter(a => a.event_id === event.id);
            const applicantCount = eventApps.length;
            
            let revenue = 0;
            if (event.is_paid) {
                revenue = eventApps.filter(a => a.payment_status === 'paid').length * (event.price || 0);
            }

            if (revenue > maxRevenue) {
                maxRevenue = revenue;
                maxRevenueEvent = event;
            }

            if (applicantCount > maxApplicants) {
                maxApplicants = applicantCount;
                maxApplicantsEvent = event;
            }
        });

        return { maxRevenueEvent, maxRevenue, maxApplicantsEvent, maxApplicants };
    }, [events, allApplications]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    label="Total Event"
                    value={stats.totalEvents || 0}
                    color="bg-purple-50"
                    subtext={`${stats.publishedEvents || 0} sudah dipublikasi`}
                />
                <StatCard
                    icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    label="Total Pendaftar"
                    value={stats.totalApplicants || 0}
                    color="bg-blue-50"
                    subtext={`${stats.totalPending || 0} menunggu review`}
                />
                <StatCard
                    icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Diterima"
                    value={stats.totalAccepted || 0}
                    color="bg-green-50"
                    subtext={`${stats.totalRejected || 0} ditolak`}
                />
                <StatCard
                    icon={<svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Total Pendapatan"
                    value={formatCurrency(stats.totalRevenue)}
                    color="bg-amber-50"
                    subtext="Dari event berbayar"
                />
            </div>

            {/* Top Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Pendapatan Tertinggi</p>
                        <h4 className="text-lg font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                            {topInsights.maxRevenueEvent?.title || '-'}
                        </h4>
                        <p className="text-sm font-semibold text-gray-700 mt-1">
                            {formatCurrency(topInsights.maxRevenue)}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Paling Diminati</p>
                        <h4 className="text-lg font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                            {topInsights.maxApplicantsEvent?.title || '-'}
                        </h4>
                        <p className="text-sm font-semibold text-gray-700 mt-1">
                            {topInsights.maxApplicants} Pendaftar
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart - Applicants */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <h3 className="text-base font-bold text-gray-800 mb-1">Tren Pendaftar & Pendapatan</h3>
                            <p className="text-xs text-gray-400">Visualisasi data pendaftaran dan pemasukan</p>
                        </div>
                        <select 
                            value={timeFilter} 
                            onChange={e => setTimeFilter(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2"
                        >
                            <option value="1w">1 Minggu</option>
                            <option value="1m">1 Bulan</option>
                            <option value="3m">3 Bulan</option>
                            <option value="6m">6 Bulan</option>
                            <option value="1y">1 Tahun</option>
                        </select>
                    </div>
                    {chartData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BarChart data={chartData} dataKey="applicants" label="Jumlah Pendaftar" color="#7c3aed" />
                            <BarChart data={chartData} dataKey="revenue" label="Pendapatan (Rp)" color="#10b981" />
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-10 text-sm">Belum ada data.</div>
                    )}
                </div>

                {/* Donut Chart - Status Breakdown */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
                    <h3 className="text-base font-bold text-gray-800 mb-1 text-center">Status Pendaftar</h3>
                    <p className="text-xs text-gray-400 mb-5 text-center">Distribusi status aplikasi global</p>
                    <DonutChart
                        accepted={stats.totalAccepted || 0}
                        rejected={stats.totalRejected || 0}
                        pending={stats.totalPending || 0}
                    />
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-800">Aktivitas Terbaru</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Pendaftar dan transaksi terbaru di semua event Anda</p>
                </div>
                <div className="overflow-x-auto max-h-[400px]">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/80 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Relawan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aktivitas</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(!recentTransactions || recentTransactions.length === 0) ? (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm">Belum ada aktivitas terbaru.</td></tr>
                            ) : recentTransactions.map(tx => {
                                const isTransaction = tx.event_is_paid && tx.payment_status === 'paid';
                                return (
                                    <tr key={tx.id} className="hover:bg-purple-50/30 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="text-sm font-semibold text-gray-800">{tx.volunteer_name}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[150px]">{tx.event_title}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {isTransaction ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Pembayaran Lunas ({formatCurrency(tx.event_price)})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Pendaftaran Baru
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs text-gray-400">
                                            {new Date(tx.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
