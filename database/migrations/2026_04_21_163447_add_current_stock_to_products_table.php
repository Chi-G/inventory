<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->integer('current_stock')->default(0)->after('alert_threshold');
        });

        // Add performance indices to stock_movements
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->index(['product_id', 'created_at']);
            $table->index('type');
        });

        // Sync existing stock levels
        $products = \App\Models\Product::all();
        foreach ($products as $product) {
            $currentStock = \App\Models\StockMovement::where('product_id', $product->id)->sum('quantity');
            $product->update(['current_stock' => $currentStock]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('current_stock');
        });

        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropIndex(['product_id', 'created_at']);
            $table->dropIndex(['type']);
        });
    }
};
