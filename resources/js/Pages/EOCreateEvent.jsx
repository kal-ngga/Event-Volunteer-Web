import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '@/Component/Navbar';
import SidebarLayout from './EODashboard/SidebarLayout';

export default function EOCreateEvent({ user, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category_id: '',
        location: '',
        start_date: '',
        end_date: '',
        is_paid: false,
        price: '',
        description: '',
        activity_details: '',
        thumbnail: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('thumbnail', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/eo/events', {
            preserveScroll: true,
            // Inertia will automatically use FormData because we have a File object
            onSuccess: () => {
                alert('Event berhasil disimpan!');
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-['TT_Commons']">
            <Head title="Buat Event Baru" />
            <Navbar user={user} />

            <SidebarLayout user={user} activeMenu="events">
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Kembali ke Dashboard
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                            Buat Event Baru
                        </h1>
                        <p className="mt-1 text-gray-500">Isi detail event di bawah ini dengan lengkap untuk menarik relawan.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                                required
                                            />
                                            <p className="mt-2 text-xs text-slate-500">Format: JPG, PNG, GIF. Maksimal 5MB. Rasio disarankan 16:9.</p>
                                            {errors.thumbnail && <div className="text-red-500 text-xs mt-1">{errors.thumbnail}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Event</label>
                                    <input 
                                        type="text" 
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                        required
                                    />
                                    {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                                    <select 
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                        required
                                    >
                                        <option value="">Pilih Kategori...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    {errors.category_id && <div className="text-red-500 text-xs mt-1">{errors.category_id}</div>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lokasi</label>
                                    <input 
                                        type="text" 
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                        required
                                    />
                                    {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal Mulai</label>
                                    <input 
                                        type="datetime-local" 
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                        required
                                    />
                                    {errors.start_date && <div className="text-red-500 text-xs mt-1">{errors.start_date}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Selesai</label>
                                    <input 
                                        type="datetime-local" 
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                        required
                                    />
                                    {errors.end_date && <div className="text-red-500 text-xs mt-1">{errors.end_date}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Tipe Event</label>
                                    <select 
                                        value={data.is_paid ? '1' : '0'}
                                        onChange={e => {
                                            const isPaid = e.target.value === '1';
                                            setData('is_paid', isPaid);
                                            if (!isPaid) setData('price', '');
                                        }}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                    >
                                        <option value="0">Gratis</option>
                                        <option value="1">Berbayar</option>
                                    </select>
                                </div>

                                {data.is_paid && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Harga (Rp)</label>
                                        <input 
                                            type="number" 
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors" 
                                            required
                                        />
                                        {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Utama</label>
                                    <textarea 
                                        rows="4"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                        placeholder="Jelaskan secara singkat tentang event ini..."
                                        required
                                    ></textarea>
                                    {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Rincian Aktivitas</label>
                                    <textarea 
                                        rows="4"
                                        value={data.activity_details}
                                        onChange={e => setData('activity_details', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                        placeholder="Jelaskan apa saja yang akan dilakukan oleh relawan..."
                                        required
                                    ></textarea>
                                    {errors.activity_details && <div className="text-red-500 text-xs mt-1">{errors.activity_details}</div>}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 text-lg"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan & Publikasikan (Draft)'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </SidebarLayout>
        </div>
    );
}
