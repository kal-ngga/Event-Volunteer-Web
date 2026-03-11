import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Navbar from '@/Component/Navbar';
import Card from '@/Component/Card';

export default function Dashboard({ user }) {
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['TT_Commons']">
            <Head title="Dashboard" />
            <Navbar user={user} />

            {/* Konten Utama Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                            Dashboard Relawan
                        </h1>
                        <p className="mt-2 text-md text-gray-600">
                            Selamat datang kembali, <span className="font-semibold text-gray-800">{user?.name || 'User'}</span>! Temukan berbagai kegiatan relawan terbaru di bawah ini.
                        </p>
                    </div>
                    <form onSubmit={handleLogout} className="mt-6 md:mt-0 flex-shrink-0">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            Log Out
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <Card 
                        title="Program Mengajar Pelosok Desa" 
                        category="Pendidikan" 
                        type="Kelompok"
                        image="https://placehold.co/400x300/4CAF50/FFFFFF?text=Education"
                        location="Kabupaten Bogor, Jawa Barat"
                        startDate="01 April 2026"
                        endDate="15 Mei 2026"
                    />
                    <Card 
                        title="Penghijauan Hutan Kota" 
                        category="Lingkungan" 
                        type="Individu"
                        image="https://placehold.co/400x300/4CAF50/FFFFFF?text=Nature"
                        location="Taman Kota Jakarta Selatan"
                        startDate="20 Maret 2026"
                        endDate=""
                    />
                    <Card 
                        title="Distribusi Bantuan Bencana Alam" 
                        category="Sosial" 
                        type="Kelompok"
                        image="https://placehold.co/400x300/FF9800/FFFFFF?text=Bantuan"
                        location="Cianjur, Jawa Barat"
                        startDate="10 Maret 2026"
                        endDate="30 Maret 2026"
                    />
                    <Card 
                        title="Program Mengajar Pelosok Desa" 
                        category="Pendidikan" 
                        type="Kelompok"
                        image="https://placehold.co/400x300/4CAF50/FFFFFF?text=Education"
                        location="Kabupaten Bogor, Jawa Barat"
                        startDate="01 April 2026"
                        endDate="15 Mei 2026"
                    />
                    <Card 
                        title="Penghijauan Hutan Kota" 
                        category="Lingkungan" 
                        type="Individu"
                        image="https://placehold.co/400x300/4CAF50/FFFFFF?text=Nature"
                        location="Taman Kota Jakarta Selatan"
                        startDate="20 Maret 2026"
                        endDate=""
                    />
                    <Card 
                        title="Distribusi Bantuan Bencana Alam" 
                        category="Sosial" 
                        type="Kelompok"
                        image="https://placehold.co/400x300/FF9800/FFFFFF?text=Bantuan"
                        location="Cianjur, Jawa Barat"
                        startDate="10 Maret 2026"
                        endDate="30 Maret 2026"
                    />
                </div>
            </main>
            <footer className="w-full bg-red-700 py-6 px-6 flex items-center justify-center gap-2">
                <p className="text-white text-lg font-light font-['TT_Commons'] text-center">
                    Copyright © 2026
                </p>
                <p className="text-white text-lg font-medium font-['TT_Commons'] text-center">
                    Kelompok 4
                </p>
                <p className="text-white text-lg font-light font-['TT_Commons'] text-center">
                    Integrasi Aplikasi Enterprise.
                </p>
            </footer>
        </div>
    );
}
