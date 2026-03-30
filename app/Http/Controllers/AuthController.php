<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLoginForm()
    {
        return Inertia::render('Login', [
            'nama' => 'Kal'
        ]);
    }

    /**
     * Handle an authentication attempt.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    public function showRegister()
        {
            return Inertia::render('Register'); // Memanggil file Register.jsx di React
        }

    public function processRegister(Request $request)
    {
        // 1. Validasi data yang dikirim dari React
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' butuh field password_confirmation
            'role_id' => 'required|in:2,3', // 2 = EO, 3 = Customer (Jangan izinkan daftar jadi Admin!)
        ]);

        // 2. Simpan ke database
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
        ]);

        // 3. Langsung login-kan user setelah berhasil mendaftar
        Auth::login($user);

        // 4. Arahkan ke halaman utama atau dashboard
        return redirect('/')->with('success', 'Registrasi berhasil!');
    } 
}
