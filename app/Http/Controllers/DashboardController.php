<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Core KPIs
        $totalProducts = Product::count();
        
        // Total Value: SUM(movements.quantity * products.retail_price)
        $totalValue = DB::table('stock_movements')
            ->join('products', 'stock_movements.product_id', '=', 'products.id')
            ->select(DB::raw('SUM(stock_movements.quantity * products.retail_price) as total_value'))
            ->first()
            ->total_value ?? 0;

        // Low Stock Count: Products where SUM(movements.quantity) <= alert_threshold
        // Using leftJoin to include products with no movements (stock = 0)
        $lowStockCount = Product::select('products.id')
            ->leftJoin('stock_movements', 'products.id', '=', 'stock_movements.product_id')
            ->groupBy('products.id', 'products.alert_threshold')
            ->having(DB::raw('COALESCE(SUM(stock_movements.quantity), 0)'), '<=', DB::raw('products.alert_threshold'))
            ->get()
            ->count();

        $totalSuppliers = Supplier::count();

        // 2. Recent Movements
        $recentMovements = StockMovement::with(['product', 'user'])
            ->latest()
            ->limit(5)
            ->get();

        // 3. Stock Status Distribution
        $productsWithStock = Product::select('products.id', 'products.alert_threshold')
            ->leftJoin('stock_movements', 'products.id', '=', 'stock_movements.product_id')
            ->selectRaw('products.id, products.alert_threshold, COALESCE(SUM(stock_movements.quantity), 0) as current_stock')
            ->groupBy('products.id', 'products.alert_threshold')
            ->get();

        $stockStatus = [
            'out_of_stock' => $productsWithStock->where('current_stock', '<=', 0)->count(),
            'low_stock' => $productsWithStock->filter(function($p) {
                return $p->current_stock > 0 && $p->current_stock <= $p->alert_threshold;
            })->count(),
            'healthy' => $productsWithStock->where('current_stock', '>', 'alert_threshold')->count(),
        ];

        // 4. Trends (Last 30 Days)
        $days = 30;
        $trendData = StockMovement::selectRaw('DATE(created_at) as date, type, SUM(quantity) as total')
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy('date', 'type')
            ->get()
            ->groupBy('date');

        $trends = [];
        for ($i = $days; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $movements = $trendData->get($date);
            
            $trends[] = [
                'date' => now()->subDays($i)->format('d M'),
                'in' => $movements ? (int)abs($movements->where('type', 'IN')->sum('total')) : 0,
                'out' => $movements ? (int)abs($movements->where('type', 'OUT')->sum('total')) : 0,
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_products' => $totalProducts,
                'inventory_value' => (float)$totalValue,
                'low_stock_count' => $lowStockCount,
                'total_suppliers' => $totalSuppliers,
                'total_users' => User::count(),
            ],
            'recentMovements' => $recentMovements,
            'stockStatus' => $stockStatus,
            'trends' => $trends,
        ]);
    }
}
