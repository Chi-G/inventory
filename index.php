<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// 1. Maintenance Mode
if (file_exists($maintenance = __DIR__.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// 2. Autoloader (Fixed path: no longer using ../)
require __DIR__.'/vendor/autoload.php';

// 3. Bootstrap (Fixed path: no longer using ../)
/** @var Application $app */
$app = require_once __DIR__.'/bootstrap/app.php';

// 4. Handle Request
$app->handleRequest(Request::capture());
