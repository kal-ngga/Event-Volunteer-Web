import React, { useState } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';

const CATEGORIES = [
    'Pendidikan', 'Lingkungan', 'Sosial', 'Ekonomi', 
    'Kesehatan', 'Teknologi', 'Budaya', 'Politik', 
    'Psikologi', 'Hukum', 'Olahraga', 'Sejarah'
];

export default function Register() {
    const [phase, setPhase] = useState(1);
    const [localErrors, setLocalErrors] = useState({});
    
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
        name: '',
        role_id: '',
        bio: '',
        categories: [],
    });

    const submit = (e) => {
        e.preventDefault();
        setLocalErrors({});
        
        if (phase === 1) {
            // Strict Phase 1 Validation
            if (!data.email) {
                setLocalErrors({ email: 'Email wajib diisi.' });
                return;
            }
            if (!data.password) {
                setLocalErrors({ password: 'Password wajib diisi.' });
                return;
            }
            if (data.password !== data.password_confirmation) {
                setLocalErrors({ password_confirmation: 'Password yang dimasukkan tidak sama.' });
                return;
            }
            if (data.password.length < 8) {
                setLocalErrors({ password: 'Password minimal 8 karakter.' });
                return;
            }
            setPhase(2);
        } else if (phase === 2) {
            // Strict Phase 2 Validation
            if (!data.name) {
                setLocalErrors({ name: 'Nama lengkap wajib diisi.' });
                return;
            }
            if (!data.role_id) {
                setLocalErrors({ role_id: 'Role wajib dipilih.' });
                return;
            }
            /* bio is optional for now */
            setPhase(3);
        } else {
            post('/register');
        }
    };

    const handlePrev = () => {
        if (phase > 1) {
            setPhase(phase - 1);
            setLocalErrors({});
        }
    };

    const toggleCategory = (category) => {
        if (data.categories.includes(category)) {
            setData('categories', data.categories.filter(c => c !== category));
        } else {
            setData('categories', [...data.categories, category]);
        }
    };

    const clearCategories = () => {
        setData('categories', []);
    };

    return (
        <div className="w-screen min-h-screen bg-purple-500 flex items-center justify-center font-['TT_Commons'] py-4 sm:py-12">
            <Head title="Register" />

            {/* Top Navigation */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="text-white text-xl font-bold tracking-wide">Voluntree</span>
            </div>

            <div className="hidden md:flex absolute top-6 right-6 items-center gap-5">
                <Link href="/login" className="bg-white/20 text-white text-m font-medium px-6 py-2 rounded-full hover:bg-white/100 transition">Login to your account</Link>
            </div>

            {/* Register Card with Fixed Height and Scrollable Inner Form */}
            <div className="w-full max-w-[400px] h-auto max-h-[95vh] bg-white rounded-[24px] border border-zinc-200 p-8 shadow-xl flex flex-col mx-4 overflow-hidden relative transition-all duration-500 ease-in-out">                
                {/* Header Section (Fixed at Top) */}
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center mb-5">
                        <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                    </div>

                    <div className="flex justify-between items-start mb-1">
                        <h1 className="text-zinc-900 text-[22px] font-semibold">
                            Create Account
                        </h1>
                        {phase > 1 && (
                            <button type="button" onClick={handlePrev} className="text-zinc-400 hover:text-zinc-700 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Form Progress Area (Scrollable if needed) */}
                <form onSubmit={submit} className="flex flex-col flex-1 overflow-y-auto pr-1 overflow-x-hidden">
                    
                    {/* Dynamic Phase Title and Progress Bar */}
                    <div className="mt-2 mb-5">
                        <div className="text-zinc-600 text-[13px] font-semibold mb-2">
                            {phase === 1 && "Email & Password"}
                            {phase === 2 && "Information About You"}
                            {phase === 3 && "What you interested in"}
                        </div>
                        {/* Phase Indicators */}
                        <div className="flex items-center gap-2.5">
                            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${phase >= 1 ? 'bg-purple-500' : 'bg-zinc-200'}`} />
                            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${phase >= 2 ? 'bg-purple-500' : 'bg-zinc-200'}`} />
                            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${phase >= 3 ? 'bg-purple-500' : 'bg-zinc-200'}`} />
                        </div>
                    </div>

                    {/* PHASE 1: Email & Password */}
                    {phase === 1 && (
                        <div className="animate-[fadeIn_0.3s_ease-in-out]">
                            <div className="mb-4">
                                <label htmlFor="email" className="px-2 text-zinc-700 text-[13px] font-medium mb-1.5 block">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="you@email.com"
                                    autoComplete="email"
                                    className={`w-full bg-zinc-50 border ${localErrors.email || errors.email ? 'border-red-500' : 'border-zinc-200'} rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-[15px]`}
                                />
                                {(localErrors.email || errors.email) && <div className="text-red-500 text-xs mt-1.5 px-2">{localErrors.email || errors.email}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="px-2 text-zinc-700 text-[13px] font-medium mb-1.5 block">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    className={`w-full bg-zinc-50 border ${localErrors.password || errors.password ? 'border-red-500' : 'border-zinc-200'} rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-[15px]`}
                                />
                                {(localErrors.password || errors.password) && <div className="text-red-500 text-xs mt-1.5 px-2">{localErrors.password || errors.password}</div>}
                                
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password_confirmation" className="px-2 text-zinc-700 text-[13px] font-medium mb-1.5 block">
                                    Rewrite Password
                                </label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm Password"
                                    className={`w-full bg-zinc-50 border ${localErrors.password_confirmation ? 'border-red-500' : 'border-zinc-200'} rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-[15px]`}
                                />
                                {localErrors.password_confirmation && <div className="text-red-500 text-xs mt-1.5 px-2">{localErrors.password_confirmation}</div>}

                                <div className="mt-3 px-2 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-zinc-500 text-[12px]">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Harus lebih dari 8 karakter
                                    </div>
                                    <div className="flex items-center gap-1.5 text-zinc-500 text-[12px]">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Minimal 1 huruf besar
                                    </div>
                                    <div className="flex items-center gap-1.5 text-zinc-500 text-[12px]">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Minimal 1 angka
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PHASE 2: Information About You */}
                    {phase === 2 && (
                        <div className="animate-[fadeIn_0.3s_ease-in-out]">
                            <div className="mb-4">
                                <label htmlFor="name" className="px-2 text-zinc-700 text-[13px] font-medium mb-1.5 block">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Your Full Name"
                                    autoComplete="name"
                                    className={`w-full bg-zinc-50 border ${localErrors.name || errors.name ? 'border-red-500' : 'border-zinc-200'} rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-[15px]`}
                                />
                                {(localErrors.name || errors.name) && <div className="text-red-500 text-xs mt-1.5 px-2">{localErrors.name || errors.name}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="role_id" className="px-2 text-zinc-700 text-[13px] font-medium mb-1.5 block">
                                    What you want to be
                                </label>
                                <div className="relative">
                                    <select
                                        id="role_id"
                                        name="role_id"
                                        value={data.role_id}
                                        onChange={(e) => setData('role_id', e.target.value)}
                                        className={`w-full bg-zinc-50 border ${localErrors.role_id || errors.role_id ? 'border-red-500' : 'border-zinc-200'} rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-[15px] appearance-none cursor-pointer`}
                                    >
                                        <option value="" disabled>Select your role</option>
                                        <option value="3">Volunteer</option>
                                        <option value="2">Organization</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                {(localErrors.role_id || errors.role_id) && <div className="text-red-500 text-xs mt-1.5 px-2">{localErrors.role_id || errors.role_id}</div>}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="bio" className="px-2 text-zinc-700 text-[13px] font-medium mb-1.5 block">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    placeholder="Insert your short bio description..."
                                    rows="3"
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-[15px] resize-none"
                                />
                                <div className="text-right mt-1 px-2 text-[11px] text-zinc-400 font-medium">
                                    {data.bio.length} characters
                                </div>
                                {errors.bio && <div className="text-red-500 text-xs mt-1 px-2">{errors.bio}</div>}
                            </div>
                        </div>
                    )}

                    {/* PHASE 3: Event Categories */}
                    {phase === 3 && (
                        <div className="animate-[fadeIn_0.3s_ease-in-out]">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <div className="text-zinc-700 text-[13px] font-medium">Option limit: 3 Selected</div>
                                {data.categories.length > 0 && (
                                    <button 
                                        type="button" 
                                        onClick={clearCategories}
                                        className="text-red-500 hover:text-red-700 text-[12px] font-medium transition"
                                    >
                                        Clear Selection
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => toggleCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 border
                                            ${data.categories.includes(cat) 
                                                ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm' 
                                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            {errors.categories && <div className="text-red-500 text-xs mb-4 px-2">{errors.categories}</div>}
                        </div>
                    )}

                    {/* Navigation Buttons (Sticky Bottom) */}
                    <div className="mt-auto pt-4 border-t border-zinc-100">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-zinc-900 text-white font-semibold rounded-xl py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50 text-[15px] shadow-sm"
                        >
                            {phase < 3 ? 'Simpan' : (processing ? 'Creating account...' : 'Create Account')}
                        </button>
                        
                        <div className="mt-4 md:hidden text-center pb-2">
                            <Link href="/login" className="text-zinc-600 text-[14px] font-medium hover:text-zinc-900 transition-colors">
                                Already have an account? Login
                            </Link>
                        </div>
                        
                        {phase === 1 && (
                            <div className="mt-4 pb-2 text-center">
                                <p className="text-zinc-500 text-[12px] leading-relaxed">
                                    Dengan bergabung, Anda menyetujui <a href="#" className="font-medium text-zinc-700 hover:text-zinc-900 underline">Persyaratan Layanan</a> kami. Silakan baca <a href="#" className="font-medium text-zinc-700 hover:text-zinc-900 underline">Kebijakan Privasi</a>.
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* Hide scrollbar for form area to keep it clean */
                form::-webkit-scrollbar {
                    width: 4px;
                }
                form::-webkit-scrollbar-track {
                    background: transparent;
                }
                form::-webkit-scrollbar-thumb {
                    background-color: #d4d4d8;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}