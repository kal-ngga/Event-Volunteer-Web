import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login({ nama }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="w-screen min-h-screen bg-red-500 overflow-hidden flex items-center justify-center font-['TT_Commons']">
            <Head title="Login" />

            {/* Top Navigation */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="text-white text-xl font-bold tracking-wide">Voluntree</span>
            </div>

            <div className="hidden md:flex absolute top-6 right-6 items-center gap-5">
                <button className="bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-white/20 transition">Sign In</button>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[400px] bg-white rounded-[24px] border border-zinc-200 p-8 shadow-xl flex flex-col mx-4">

                {/* Icon box */}
                <div className="w-12 h-12 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                </div>

                <h1 className="text-zinc-900 text-[22px] font-semibold mb-1">
                    Welcome to Voluntree
                </h1>
                <p className="text-zinc-500 text-[15px] mb-6">
                    Please sign in or sign up below.
                </p>

                <form onSubmit={submit} className="flex flex-col flex-1">
                    <div className="px-2 flex justify-between items-center mb-2">
                        <label htmlFor="email" className="text-zinc-700 text-[13px] font-medium">
                            Email
                        </label>
                        <button type="button" className="text-zinc-500 text-[13px] flex items-center gap-1.5 hover:text-zinc-900 transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Use Phone Number
                        </button>
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="you@email.com"
                            autoComplete="off"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-[15px]"
                        />
                        {errors.email && <div className="text-red-500 text-xs mt-1.5">{errors.email}</div>}
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="px-2 text-zinc-700 text-[13px] font-medium">
                                Password
                            </label>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-[15px]"
                        />
                        {errors.password && <div className="text-red-500 text-xs mt-1.5">{errors.password}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-zinc-900 text-white font-semibold rounded-xl py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50 mt-2 text-[15px]"
                    >
                        {processing ? 'Connecting...' : 'Continue with Email'}
                    </button>
                </form>

                <div className="mt-6 flex flex-col gap-2.5 pt-6 border-t border-zinc-100">
                    <button type="button" className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl py-2.5 transition-colors text-[14px] font-medium border border-zinc-200 shadow-sm">
                        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                    <button type="button" className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl py-2.5 transition-colors text-[14px] font-medium border border-zinc-200 shadow-sm">
                        <svg className="w-[18px] h-[18px] text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Sign in with Passkey
                    </button>
                </div>
            </div>
        </div>
    );
}