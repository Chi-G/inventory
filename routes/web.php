<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\BarcodeController;
use App\Http\Controllers\StockMovementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // User Management (Admin Only)
    Route::resource('users', UserController::class)->middleware('role:Admin,Super Admin');

    // Catalog Management
    Route::get('/products/export', [ProductController::class, 'export'])->name('products.export');
    Route::resource('products', ProductController::class);
    Route::get('/inventory/logs/export', [StockMovementController::class, 'export'])->name('inventory.logs.export');
    Route::get('/inventory/logs', [StockMovementController::class, 'index'])->name('inventory.logs');
    Route::post('/products/{product}/stock', [StockMovementController::class, 'store'])->name('products.stock');
    Route::get('/products/{product}/print', [ProductController::class, 'printBarcode'])->name('products.print');
    Route::get('/scan-center', [ProductController::class, 'scanCenter'])->name('scanner.index');
    Route::get('/api/lookup/{barcode}', [ProductController::class, 'apiLookup'])->name('api.products.lookup');
    Route::resource('categories', CategoryController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::get('/barcodes/{value}', [BarcodeController::class, 'generate'])->name('barcodes.generate');
});

require __DIR__.'/auth.php';
