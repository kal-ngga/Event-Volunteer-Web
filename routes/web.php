<?php

use App\Http\Controllers\AuthController;
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
    Route::get('/', function () {
        $events = \Illuminate\Support\Facades\DB::table('events')
            ->join('event_categories', 'events.category_id', '=', 'event_categories.id')
            ->select('events.*', 'event_categories.name as category_name')
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
            ->select('events.*', 'event_categories.name as category_name', 'users.name as eo_name', 'event_details.description', 'event_details.activity_details')
            ->where('events.id', $id)
            ->first();

        if (!$event) {
            abort(404);
        }

        return Inertia::render('EventDetail', [
            'user' => request()->user(),
            'event' => $event
        ]);
    })->name('event.detail');
});
