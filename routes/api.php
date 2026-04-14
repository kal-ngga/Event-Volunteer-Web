<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MidtransController;

// Midtrans Webhook Callback (no CSRF, no auth)
Route::post('/midtrans-callback', [MidtransController::class, 'handleNotification']);
