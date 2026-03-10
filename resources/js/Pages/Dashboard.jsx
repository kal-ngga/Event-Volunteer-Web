import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Dashboard({ user }) {
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <Head title="Dashboard" />
            <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 font-['TT_Commons']">
                    Welcome to Dashboard
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Hello, {user?.name}! You are successfully logged in.
                </p>
                <form onSubmit={handleLogout} className="mt-8">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        Log Out
                    </button>
                </form>
            </div>
        </div>
    );
}
