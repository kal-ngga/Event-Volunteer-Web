<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$apps = DB::table('applications')->get();
foreach($apps as $a) echo $a->id . ' - ' . $a->payment_status . ' - ' . $a->user_id . "
";

