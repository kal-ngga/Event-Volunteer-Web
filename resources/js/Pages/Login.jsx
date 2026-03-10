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
        <div className="w-screen h-screen bg-zinc-200 overflow-hidden flex flex-col lg:flex-row items-center justify-start">
            <Head title="Login" />
            <div className="w-full h-full bg-shadow flex flex-col items-center justify-center overflow-y-auto">
                <form onSubmit={submit} className='w-full max-w-2xl gap-6 bg-white rounded-lg outline-2 outline-offset-2 outline-slate-500 p-8 flex flex-col items-center justify-center'>
                    <div className="w-auto h-auto inline-flex flex-col justify-center items-center gap-2">
                        <div className="w-auto h-auto text-center justify-start text-neutral-800 text-4xl font-bold font-['TT_Commons']">
                            Penanguran? <br/>Cari volunteer di sini boss</div>
                        <div className="w-auto h-auto h-6 text-center justify-start text-neutral-500 text-xl font-normal font-['TT_Commons']">
                            Terserah deh mau jadi apa aja, yang penting jangan pengangguran.</div>
                    </div>
                    <div className="mb-4 w-full flex flex-col">
                        <label htmlFor="email" className="block text-blue-500  text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full appearance-none border rounded outline-2 outline-offset-[-2px] outline-zinc-100 py-2 px-3 text-gray-700 leading-tight focus:outline-4 focus:outline-blue-500 focus:shadow-outline transition-all duration-150"
                        />
                        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                    </div>
                    <div className="mb-6 w-full flex flex-col">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full appearance-none border rounded outline-2 outline-offset-[-2px] outline-zinc-100 py-2 px-3 text-gray-700 leading-tight focus:outline-4 focus:outline-blue-500 focus:shadow-outline transition-all duration-150"
                        />
                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="self-stretch px-6 py-3.5 bg-slate-100 rounded-xl inline-flex justify-center items-center gap-4 hover:bg-slate-200 transition-colors"
                    >
                        {processing ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}