<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'processRegister']);

// Protected Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::put('/admin/events/{id}/approve', [\App\Http\Controllers\DashboardController::class, 'approveEvent'])->name('admin.events.approve');
    Route::post('/eo/events', [\App\Http\Controllers\DashboardController::class, 'storeEvent'])->name('eo.events.store');

    // EO: View applicants & manage
    Route::get('/eo/events/{id}/applicants', [\App\Http\Controllers\DashboardController::class, 'showApplicants'])->name('eo.events.applicants');
    Route::put('/eo/applications/{id}/status', [\App\Http\Controllers\DashboardController::class, 'updateApplicationStatus'])->name('eo.applications.status');

    Route::post('/event/{id}/apply', [ApplicationController::class, 'store'])->name('event.apply');
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy'])->name('application.destroy');

    // Volunteer: Profile
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'index'])->name('profile.index');
    Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');

    Route::get('/', function () {
        $events = \Illuminate\Support\Facades\DB::table('events')
            ->join('event_categories', 'events.category_id', '=', 'event_categories.id')
            ->select('events.*', 'event_categories.name as category_name')
            ->where('events.status', 'published')
            ->get();

        return Inertia::render('Catalog', [
            'user' => request()->user(),
            'events' => $events
        ]);
    })->name('catalog');

    Route::get('/event/{id}', function ($id) {
        $event = \Illuminate\Support\Facades\DB::table('events')
            ->join('event_categories', 'events.category_id', '=', 'event_categories.id')
            ->join('users', 'events.eo_id', '=', 'users.id')
            ->leftJoin('event_details', 'events.id', '=', 'event_details.event_id')
            ->select(
                'events.*',
                'event_categories.name as category_name',
                'users.name as eo_name',
                'event_details.description',
                'event_details.activity_details'
            )
            ->where('events.id', $id)
            ->where('events.status', 'published')
            ->first();

        if (!$event) {
            abort(404);
        }

        // Get divisions for this event
        $divisions = \Illuminate\Support\Facades\DB::table('event_divisions')
            ->where('event_id', $id)
            ->get();

        // Check if user already applied
        $existingApplication = \Illuminate\Support\Facades\DB::table('applications')
            ->where('user_id', request()->user()->id)
            ->where('event_id', $id)
            ->first();

        return Inertia::render('EventDetail', [
            'user' => request()->user(),
            'event' => $event,
            'divisions' => $divisions,
            'existingApplication' => $existingApplication,
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    })->name('event.detail');
});

