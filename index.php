<?php

/**
 * Laravel Subdirectory Proxy for Hostinger
 * This file allows the application to run from the root of the /inventory/ folder
 * while keeping the core logic secure inside /public/ and /app/
 */

require __DIR__.'/public/index.php';
