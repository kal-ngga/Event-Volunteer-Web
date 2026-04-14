<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MidtransController extends Controller
{
    /**
     * Handle Midtrans webhook notification.
     * Endpoint: POST /api/midtrans-callback
     */
    public function handleNotification(Request $request)
    {
        $payload = $request->all();

        Log::info('Midtrans Notification Received', $payload);

        $serverKey = config('midtrans.server_key');
        $orderId = $payload['order_id'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signatureKey = $payload['signature_key'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;

        // Handle Midtrans Test Notification
        if (strpos($orderId, 'payment_notif_test') !== false) {
            Log::info('Midtrans Test Notification received successfully.');
            return response()->json(['message' => 'Test notification received']);
        }

        // Verify signature
        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
        if ($signatureKey !== $expectedSignature) {
            Log::warning('Midtrans: Invalid signature key', ['order_id' => $orderId]);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // Extract application ID from order_id format: VOL-{applicationId}-{timestamp}
        $parts = explode('-', $orderId);
        if (count($parts) < 3 || $parts[0] !== 'VOL') {
            Log::warning('Midtrans: Invalid order_id format', ['order_id' => $orderId]);
            return response()->json(['message' => 'Invalid order ID format'], 400);
        }
        $applicationId = $parts[1];

        // Determine payment status based on transaction status
        $paymentStatus = 'pending';

        if ($transactionStatus == 'capture') {
            // For credit card, check fraud status
            $paymentStatus = ($fraudStatus == 'accept') ? 'paid' : 'failed';
        } elseif ($transactionStatus == 'settlement') {
            $paymentStatus = 'paid';
        } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
            $paymentStatus = 'failed';
        } elseif ($transactionStatus == 'pending') {
            $paymentStatus = 'pending';
        }

        // Update the application record
        $updated = DB::table('applications')
            ->where('id', $applicationId)
            ->update([
                'payment_status' => $paymentStatus,
                'updated_at' => now(),
            ]);

        Log::info('Midtrans: Payment status updated', [
            'application_id' => $applicationId,
            'payment_status' => $paymentStatus,
            'transaction_status' => $transactionStatus,
            'updated' => $updated,
        ]);

        return response()->json(['message' => 'OK']);
    }
}
