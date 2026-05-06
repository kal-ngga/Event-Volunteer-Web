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
    Route::get('/eo/events/create', [\App\Http\Controllers\DashboardController::class, 'createEvent'])->name('eo.events.create');
    Route::post('/eo/events', [\App\Http\Controllers\DashboardController::class, 'storeEvent'])->name('eo.events.store');

    // EO: View applicants & manage
    Route::get('/eo/events/{id}/manage', [\App\Http\Controllers\DashboardController::class, 'manageEvent'])->name('eo.events.manage');
    Route::put('/eo/events/{id}', [\App\Http\Controllers\DashboardController::class, 'updateEvent'])->name('eo.events.update');
    Route::post('/eo/events/{id}/divisions', [\App\Http\Controllers\DashboardController::class, 'storeDivision'])->name('eo.events.divisions.store');
    Route::put('/eo/events/divisions/{id}', [\App\Http\Controllers\DashboardController::class, 'updateDivision'])->name('eo.events.divisions.update');
    Route::delete('/eo/events/divisions/{id}', [\App\Http\Controllers\DashboardController::class, 'destroyDivision'])->name('eo.events.divisions.destroy');
    
    Route::get('/eo/events/{id}/applicants', [\App\Http\Controllers\DashboardController::class, 'showApplicants'])->name('eo.events.applicants');
    Route::put('/eo/applications/{id}/status', [\App\Http\Controllers\DashboardController::class, 'updateApplicationStatus'])->name('eo.applications.status');
    Route::put('/eo/events/{id}/close', [\App\Http\Controllers\DashboardController::class, 'closeEvent'])->name('eo.events.close');

    Route::post('/event/{id}/apply', [ApplicationController::class, 'store'])->name('event.apply');
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy'])->name('application.destroy');

    // Volunteer: Profile
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'index'])->name('profile.index');
    Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');

    // Notifications
    Route::post('/notifications/{id}/read', function ($id) {
        \Illuminate\Support\Facades\DB::table('notifications')
            ->where('id', $id)
            ->where('user_id', request()->user()->id)
            ->update(['is_read' => true, 'updated_at' => now()]);
        return back();
    })->name('notifications.read');

    Route::post('/notifications/read-all', function () {
        \Illuminate\Support\Facades\DB::table('notifications')
            ->where('user_id', request()->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'updated_at' => now()]);
        return back();
    })->name('notifications.readAll');

    Route::get('/', function (\Illuminate\Http\Request $request) {
        $search = $request->input('search');

        $query = \Illuminate\Support\Facades\DB::table('events')
            ->join('event_categories', 'events.category_id', '=', 'event_categories.id')
            ->select('events.*', 'event_categories.name as category_name')
            ->where('events.status', 'published');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('events.title', 'like', '%' . $search . '%')
                  ->orWhere('events.location', 'like', '%' . $search . '%')
                  ->orWhere('event_categories.name', 'like', '%' . $search . '%');
            });
        }

        $events = $query->get();

        return Inertia::render('Catalog', [
            'user' => $request->user(),
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

