import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminDashboard from './AdminDashboard';
import EODashboard from './EODashboard';

export default function Dashboard({ user, events, categories }) {
    // If somehow a customer ends up here, redirect them to the catalog
    if (user.role_id === 3) {
        if (typeof window !== 'undefined') {
            router.get('/');
        }
        return null;
    }

    return (
        <>
            <Head title="Dashboard" />
            
            {user.role_id === 1 && (
                <AdminDashboard user={user} events={events} />
            )}
            
            {user.role_id === 2 && (
                <EODashboard user={user} events={events} categories={categories} />
            )}
        </>
    );
}
