<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$applicationId = 25; // Budi's application
$application = DB::table('applications')
    ->join('events', 'applications.event_id', '=', 'events.id')
    ->select('applications.*', 'events.eo_id', 'events.is_paid')
    ->where('applications.id', $applicationId)
    ->first();
print_r($application);
if ($application->is_paid && !in_array($application->payment_status, ['paid', 'free'])) {
    echo "BLOCKED\n";
} else {
    echo "ALLOWED\n";
}
