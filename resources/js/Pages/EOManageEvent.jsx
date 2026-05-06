import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Navbar from '@/Component/Navbar';
import SidebarLayout from './EODashboard/SidebarLayout';

export default function EOManageEvent({ user, event, divisions, categories }) {
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'divisions'

    // Form for event details
    const { data: eventData, setData: setEventData, post: postUpdate, processing: savingEvent, errors: eventErrors } = useForm({
        _method: 'put',
        title: event.title || '',
        category_id: event.category_id || '',
        location: event.location || '',
        start_date: event.start_date ? event.start_date.split('T')[0] : '', // simplified for datetime-local
        end_date: event.end_date ? event.end_date.split('T')[0] : '',
        is_paid: event.is_paid || false,
        price: event.price || '',
        description: event.description || '',
        activity_details: event.activity_details || '',
        thumbnail: null,
    });

    const [previewUrl, setPreviewUrl] = useState(event.image_path ? `/${event.image_path}` : null);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEventData('thumbnail', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Form for new division
    const { data: divData, setData: setDivData, post, processing: savingDiv, errors: divErrors, reset: resetDiv } = useForm({
        division_name: '',
        quota: '',
        description: '',
    });

    // States for editing division
    const [editingDivisionId, setEditingDivisionId] = useState(null);
    const { data: editDivData, setData: setEditDivData, put: putDiv, processing: updatingDiv, errors: editDivErrors, reset: resetEditDiv } = useForm({
        division_name: '',
        quota: '',
        description: '',
    });

    const handleUpdateEvent = (e) => {
        e.preventDefault();
        postUpdate(`/eo/events/${event.id}`, {
            preserveScroll: true,
            onSuccess: () => alert('Berhasil mengupdate event!'),
        });
    };

    const handleAddDivision = (e) => {
        e.preventDefault();
        post(`/eo/events/${event.id}/divisions`, {
            preserveScroll: true,
            onSuccess: () => {
                resetDiv();
                alert('Berhasil menambah divisi!');
            },
        });
    };

    const handleDeleteDivision = (divId) => {
        if (confirm('Yakin ingin menghapus divisi ini?')) {
            router.delete(`/eo/events/divisions/${divId}`, {
                preserveScroll: true,
                onSuccess: () => alert('Divisi dihapus.'),
                onError: (errs) => {
                    if (errs.error) alert(errs.error);
                }
            });
        }
    };

    const handleEditDivision = (div) => {
        setEditingDivisionId(div.id);
        setEditDivData({
            division_name: div.division_name,
            quota: div.quota,
            description: div.description || '',
        });
    };

    const handleUpdateDivision = (e, divId) => {
        e.preventDefault();
        putDiv(`/eo/events/divisions/${divId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingDivisionId(null);
                resetEditDiv();
                alert('Divisi berhasil diperbarui!');
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-['TT_Commons']">
            <Head title={`Kelola - ${event.title}`} />
            <Navbar user={user} />

            <SidebarLayout user={user} activeMenu="events">
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Kembali ke Daftar Event
                        </Link>
                        
                        <Link 
                            href={`/eo/events/${event.id}/applicants`}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            Kelola Pendaftar
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                            Kelola: {event.title}
                        </h1>
                        <p className="mt-1 text-gray-500">Edit informasi acara dan atur divisi relawan.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-6 inline-flex">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'details' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Detail Event
                        </button>
                        <button
                            onClick={() => setActiveTab('divisions')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'divisions' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Divisi & Kuota ({divisions.length})
                        </button>
                    </div>

                    {activeTab === 'details' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <form onSubmit={handleUpdateEvent} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Thumbnail Event</label>
                                        <div className="flex items-center gap-6">
                                            {previewUrl ? (
                                                <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-40 h-40 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500">
                                                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <span className="text-xs">Preview</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={handleThumbnailChange}
                                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                                                />
                                                <p className="mt-2 text-xs text-slate-500">Format: JPG, PNG, GIF. Maksimal 5MB. Biarkan kosong jika tidak ingin mengubah gambar.</p>
                                                {eventErrors.thumbnail && <div className="text-red-500 text-xs mt-1">{eventErrors.thumbnail}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Event</label>
                                        <input 
                                            type="text" 
                                            value={eventData.title}
                                            onChange={e => setEventData('title', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                        />
                                        {eventErrors.title && <div className="text-red-500 text-xs mt-1">{eventErrors.title}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                                        <select 
                                            value={eventData.category_id}
                                            onChange={e => setEventData('category_id', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                        >
                                            <option value="">Pilih Kategori...</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        {eventErrors.category_id && <div className="text-red-500 text-xs mt-1">{eventErrors.category_id}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Lokasi</label>
                                        <input 
                                            type="text" 
                                            value={eventData.location}
                                            onChange={e => setEventData('location', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                        />
                                        {eventErrors.location && <div className="text-red-500 text-xs mt-1">{eventErrors.location}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal Mulai</label>
                                        <input 
                                            type="datetime-local" 
                                            value={eventData.start_date}
                                            onChange={e => setEventData('start_date', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                        />
                                        {eventErrors.start_date && <div className="text-red-500 text-xs mt-1">{eventErrors.start_date}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Selesai</label>
                                        <input 
                                            type="datetime-local" 
                                            value={eventData.end_date}
                                            onChange={e => setEventData('end_date', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                        />
                                        {eventErrors.end_date && <div className="text-red-500 text-xs mt-1">{eventErrors.end_date}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Tipe Event</label>
                                        <select 
                                            value={eventData.is_paid ? '1' : '0'}
                                            onChange={e => {
                                                const isPaid = e.target.value === '1';
                                                setEventData('is_paid', isPaid);
                                                if (!isPaid) setEventData('price', '');
                                            }}
                                            className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                        >
                                            <option value="0">Gratis</option>
                                            <option value="1">Berbayar</option>
                                        </select>
                                    </div>

                                    {eventData.is_paid && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Harga (Rp)</label>
                                            <input 
                                                type="number" 
                                                value={eventData.price}
                                                onChange={e => setEventData('price', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                            />
                                            {eventErrors.price && <div className="text-red-500 text-xs mt-1">{eventErrors.price}</div>}
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Utama</label>
                                        <textarea 
                                            rows="4"
                                            value={eventData.description}
                                            onChange={e => setEventData('description', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                            placeholder="Jelaskan secara singkat tentang event ini..."
                                        ></textarea>
                                        {eventErrors.description && <div className="text-red-500 text-xs mt-1">{eventErrors.description}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Rincian Aktivitas</label>
                                        <textarea 
                                            rows="4"
                                            value={eventData.activity_details}
                                            onChange={e => setEventData('activity_details', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                            placeholder="Jelaskan apa saja yang akan dilakukan oleh relawan..."
                                        ></textarea>
                                        {eventErrors.activity_details && <div className="text-red-500 text-xs mt-1">{eventErrors.activity_details}</div>}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={savingEvent}
                                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {savingEvent ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'divisions' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                {divisions.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                                        Belum ada divisi. Silakan tambah divisi di samping.
                                    </div>
                                ) : divisions.map(div => (
                                    <div key={div.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all hover:border-indigo-300">
                                        {editingDivisionId === div.id ? (
                                            <form onSubmit={(e) => handleUpdateDivision(e, div.id)} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Divisi</label>
                                                        <input 
                                                            type="text" 
                                                            value={editDivData.division_name}
                                                            onChange={e => setEditDivData('division_name', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Kuota</label>
                                                        <input 
                                                            type="number" 
                                                            value={editDivData.quota}
                                                            onChange={e => setEditDivData('quota', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
                                                            min="1"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Deskripsi Tugas</label>
                                                        <textarea 
                                                            rows="2"
                                                            value={editDivData.description}
                                                            onChange={e => setEditDivData('description', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 pt-2">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setEditingDivisionId(null)}
                                                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        Batal
                                                    </button>
                                                    <button 
                                                        type="submit"
                                                        disabled={updatingDiv}
                                                        className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                                    >
                                                        {updatingDiv ? 'Menyimpan...' : 'Simpan'}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-lg">{div.division_name}</h4>
                                                    <p className="text-sm text-slate-500 mt-1">{div.description || 'Tidak ada rincian tugas.'}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-indigo-100">
                                                        Kuota: {div.quota}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleEditDivision(div)}
                                                        className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                                                        title="Edit Divisi"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteDivision(div.id)}
                                                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                        title="Hapus Divisi"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-28">
                                    <h3 className="font-bold text-slate-900 mb-4">Tambah Divisi Baru</h3>
                                    <form onSubmit={handleAddDivision} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Divisi</label>
                                            <input 
                                                type="text" 
                                                value={divData.division_name}
                                                onChange={e => setDivData('division_name', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white" 
                                                required
                                            />
                                            {divErrors.division_name && <div className="text-red-500 text-xs mt-1">{divErrors.division_name}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Kuota (Orang)</label>
                                            <input 
                                                type="number" 
                                                value={divData.quota}
                                                onChange={e => setDivData('quota', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white" 
                                                min="1"
                                                required
                                            />
                                            {divErrors.quota && <div className="text-red-500 text-xs mt-1">{divErrors.quota}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Tugas</label>
                                            <textarea 
                                                rows="3"
                                                value={divData.description}
                                                onChange={e => setDivData('description', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                                            ></textarea>
                                            {divErrors.description && <div className="text-red-500 text-xs mt-1">{divErrors.description}</div>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={savingDiv}
                                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                                        >
                                            {savingDiv ? 'Menambah...' : '+ Tambah Divisi'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SidebarLayout>
        </div>
    );
}
