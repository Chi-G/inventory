<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\BarcodeController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\RolePermissionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// This handles the root of the app (forahia.com/inventory/)
Route::any('/', function () {
    return redirect()->route('login');
});
// One-time fix for missing permissions in production
Route::any('/debug-files', function() {
    $publicPath = public_path();
    $file = $publicPath . '/brand-logo.png';
    return response()->json([
        'path' => $file,
        'exists' => file_exists($file),
        'readable' => is_readable($file),
        'perms' => file_exists($file) ? substr(sprintf('%o', fileperms($file)), -4) : null,
        'size' => file_exists($file) ? filesize($file) : null,
        'owner' => file_exists($file) ? posix_getpwuid(fileowner($file))['name'] : null,
    ]);
});

// Standard Auth Routes (Login, etc.)
require __DIR__.'/auth.php';

// All Protected Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Traffic controller: Catch the default 'dashboard' route call and forward to the slugged version
    Route::get('/dashboard', function () {
        return redirect()->route('dashboard.index', ['slug' => auth()->user()->slug]);
    })->name('dashboard');

    // All pages prefixed with {slug} (e.g. /admin-uuid/dashboard)
    Route::middleware(['identity', 'auth'])->prefix('{slug}')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::resource('users', UserController::class)->middleware('role:Admin,Super Admin');
        Route::get('/permissions', [RolePermissionController::class, 'index'])->name('permissions.index');
        Route::post('/permissions', [RolePermissionController::class, 'update'])->name('permissions.update');

        Route::get('/products/export', [ProductController::class, 'export'])->name('products.export'); 
        Route::resource('products', ProductController::class);
        
        Route::get('/logs/export', [StockMovementController::class, 'export'])->name('inventory.logs.export');
        Route::get('/logs', [StockMovementController::class, 'index'])->name('inventory.logs');
        
        Route::post('/products/{product}/stock', [StockMovementController::class, 'store'])->name('products.stock');
        Route::get('/products/{product}/print', [ProductController::class, 'printBarcode'])->name('products.print');
        Route::get('/scan-center', [ProductController::class, 'scanCenter'])->name('scanner.index');
        Route::get('/api/lookup/{barcode}', [ProductController::class, 'apiLookup'])->name('api.products.lookup');
        
        Route::resource('categories', CategoryController::class);
        Route::resource('suppliers', SupplierController::class);
        Route::get('/barcodes/{value}', [BarcodeController::class, 'generate'])->name('barcodes.generate');
    });
});