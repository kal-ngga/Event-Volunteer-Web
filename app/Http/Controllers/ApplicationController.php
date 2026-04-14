<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Midtrans\Config as MidtransConfig;
use Midtrans\Snap;

class ApplicationController extends Controller
{
    public function __construct()
    {
        // Set Midtrans configuration
        MidtransConfig::$serverKey = config('midtrans.server_key');
        MidtransConfig::$isProduction = config('midtrans.is_production');
        MidtransConfig::$isSanitized = config('midtrans.is_sanitized');
        MidtransConfig::$is3ds = config('midtrans.is_3ds');
    }

    public function store(Request $request, $eventId)
    {
        $user = Auth::user();

        // Only volunteers/customers can apply
        if ($user->role_id != 3) {
            abort(403, 'Only volunteers can apply to events.');
        }

        $request->validate([
            'division_id' => 'required|integer|exists:event_divisions,id',
        ]);

        // Get the event
        $event = DB::table('events')->where('id', $eventId)->where('status', 'published')->first();
        if (!$event) {
            return back()->withErrors(['event' => 'Event not found or not published.']);
        }

        // Check the division belongs to this event
        $division = DB::table('event_divisions')
            ->where('id', $request->division_id)
            ->where('event_id', $eventId)
            ->first();
        if (!$division) {
            return back()->withErrors(['division_id' => 'Division not found for this event.']);
        }

        // Check if already applied
        $existingApplication = DB::table('applications')
            ->where('user_id', $user->id)
            ->where('event_id', $eventId)
            ->first();
        if ($existingApplication) {
            return back()->withErrors(['event' => 'You have already applied to this event.']);
        }

        // Check quota
        $acceptedCount = DB::table('applications')
            ->where('division_id', $request->division_id)
            ->where('event_id', $eventId)
            ->count();
        if ($acceptedCount >= $division->quota) {
            return back()->withErrors(['division_id' => 'This division is already full.']);
        }

        if (!$event->is_paid) {
            // FREE EVENT: save directly
            DB::table('applications')->insert([
                'user_id' => $user->id,
                'event_id' => $eventId,
                'division_id' => $request->division_id,
                'status' => 'pending',
                'payment_status' => 'free',
                'payment_token' => null,
                'applied_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return back()->with('success', 'Pendaftaran berhasil! Menunggu konfirmasi dari EO.');
        }

        // PAID EVENT: create application with unpaid status, then generate Snap token
        $applicationId = DB::table('applications')->insertGetId([
            'user_id' => $user->id,
            'event_id' => $eventId,
            'division_id' => $request->division_id,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'payment_token' => null,
            'applied_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Generate Midtrans Snap Token
        $orderId = 'VOL-' . $applicationId . '-' . time();

        $transactionDetails = [
            'order_id' => $orderId,
            'gross_amount' => (int) $event->price,
        ];

        $customerDetails = [
            'first_name' => $user->name,
            'email' => $user->email,
        ];

        $itemDetails = [
            [
                'id' => 'EVENT-' . $event->id,
                'price' => (int) $event->price,
                'quantity' => 1,
                'name' => substr($event->title, 0, 50), // Midtrans max 50 chars
            ]
        ];

        $params = [
            'transaction_details' => $transactionDetails,
            'customer_details' => $customerDetails,
            'item_details' => $itemDetails,
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            // Save snap token and order_id to application record
            DB::table('applications')->where('id', $applicationId)->update([
                'payment_token' => $snapToken,
                'updated_at' => now(),
            ]);

            return back()->with([
                'snap_token' => $snapToken,
                'success' => 'Silakan selesaikan pembayaran.',
            ]);
        } catch (\Exception $e) {
            // If payment generation fails, remove the application
            DB::table('applications')->where('id', $applicationId)->delete();
            \Illuminate\Support\Facades\Log::error('Midtrans Snap Error: ' . $e->getMessage(), [
                'exception' => $e,
                'params' => $params
            ]);
            return back()->withErrors(['payment' => 'Gagal terhubung dengan sistem pembayaran (Midtrans).']);
        }
    }

    public function destroy($id)
    {
        $user = Auth::user();

        $application = DB::table('applications')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$application) {
            abort(404, 'Application not found.');
        }

        // Only allow deletion if status is pending and payment is unpaid/pending
        if ($application->status !== 'pending') {
            return back()->withErrors(['application' => 'Cannot cancel an application that has already been processed by the EO.']);
        }

        if (in_array($application->payment_status, ['paid', 'free'])) {
            return back()->withErrors(['application' => 'Cannot cancel an application that has already been paid/is free.']);
        }

        DB::table('applications')->where('id', $id)->delete();

        return back()->with('success', 'Pendaftaran berhasil dibatalkan. Anda dapat mendaftar kembali.');
    }
}
