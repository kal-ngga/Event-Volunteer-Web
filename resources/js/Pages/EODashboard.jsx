import React, { useState, useEffect } from 'react';
import Navbar from '@/Component/Navbar';
import { useForm, router } from '@inertiajs/react';
import SidebarLayout from './EODashboard/SidebarLayout';
import OverviewTab from './EODashboard/OverviewTab';
import EventsTab from './EODashboard/EventsTab';
import FinancialTab from './EODashboard/FinancialTab';
import ApplicantsTab from './EODashboard/ApplicantsTab';

export default function EODashboard({ user, events, categories, stats = {}, monthlyData = [], recentTransactions = [], allApplications = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Get active tab from URL query params, default to 'overview'
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const activeTab = queryParams.get('tab') || 'overview';

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category_id: '',
        location: '',
        start_date: '',
        end_date: '',
        is_paid: false,
        price: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/eo/events', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                alert('Event successfully created and is waiting for admin approval!');
            },
        });
    };

    // Client-side search filtering
    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredTransactions = recentTransactions.filter(tx => 
        tx.volunteer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.event_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab stats={stats} monthlyData={monthlyData} events={filteredEvents} allApplications={allApplications} recentTransactions={filteredTransactions} />;
            case 'applicants':
                return <ApplicantsTab events={filteredEvents} />;
            case 'financial':
                return <FinancialTab stats={stats} events={filteredEvents} recentTransactions={filteredTransactions} allApplications={allApplications} />;
            case 'events':
                return <EventsTab events={filteredEvents} setIsModalOpen={setIsModalOpen} />;
            default:
                return <OverviewTab stats={stats} monthlyData={monthlyData} events={filteredEvents} allApplications={allApplications} recentTransactions={filteredTransactions} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['TT_Commons']">
            <Navbar user={user} onSearch={setSearchQuery} searchPlaceholder="Cari event, pendaftar, atau transaksi..." />

            <SidebarLayout user={user} activeMenu={activeTab} isModalOpen={isModalOpen}>
                
                {/* Tab Content */}
                {renderTabContent()}

                {/* Create Event Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative w-full max-w-2xl mx-auto my-6 z-[100]">
                            <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-xl outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-6 border-b border-solid border-gray-200 rounded-t-2xl">
                                    <h3 className="text-2xl font-bold text-gray-900">Buat Event Baru</h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-900 transition-colors"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <span className="block h-6 w-6 text-2xl outline-none focus:outline-none">&times;</span>
                                    </button>
                                </div>
                                <div className="relative p-6 flex-auto max-h-[70vh] overflow-y-auto">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Judul Event</label>
                                            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                            {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" value={data.category_id} onChange={e => setData('category_id', e.target.value)} required>
                                                <option value="">Pilih kategori</option>
                                                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                            </select>
                                            {errors.category_id && <div className="text-red-500 text-xs mt-1">{errors.category_id}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                                            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" value={data.location} onChange={e => setData('location', e.target.value)} required />
                                            {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                                <input type="datetime-local" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" value={data.start_date} onChange={e => setData('start_date', e.target.value)} required />
                                                {errors.start_date && <div className="text-red-500 text-xs mt-1">{errors.start_date}</div>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                                                <input type="datetime-local" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" value={data.end_date} onChange={e => setData('end_date', e.target.value)} required />
                                                {errors.end_date && <div className="text-red-500 text-xs mt-1">{errors.end_date}</div>}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" checked={data.is_paid} onChange={(e) => {setData('is_paid', e.target.checked); if (!e.target.checked) setData('price', '');}} />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </label>
                                                <span className="text-sm font-medium text-gray-700">Event Berbayar</span>
                                            </div>
                                            {data.is_paid && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                                                    <input type="number" min="1000" step="1000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" value={data.price} onChange={e => setData('price', e.target.value)} placeholder="Contoh: 50000" required />
                                                    {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-end pt-4 border-t border-solid border-gray-200 rounded-b mt-6">
                                            <button className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
                                            <button className="bg-purple-600 text-white active:bg-purple-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="submit" disabled={processing}>
                                                {processing ? 'Mengirim...' : 'Submit Event'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SidebarLayout>
        </div>
    );
}
