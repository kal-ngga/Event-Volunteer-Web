<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$columns = DB::select("SHOW COLUMNS FROM users");
foreach ($columns as $c) {
    echo $c->Field . "\n";
}
