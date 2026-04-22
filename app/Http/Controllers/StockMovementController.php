<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Exception;

class StockMovementController extends Controller
{
    /**
     * Display a listing of stock movements.
     */
    public function index(Request $request, $slug = null)
    {
        $this->authorize('inventory.view');
        
        $movements = \App\Models\StockMovement::with(['product', 'user', 'supplier'])
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return \Inertia\Inertia::render('Inventory/Logs', [
            'movements' => $movements,
            'filters' => $request->only(['type']),
        ]);
    }

    /**
     * Handle incoming stock adjustments.
     */
    public function store(Request $request, Product $product, $slug = null)
    {
        $this->authorize('inventory.adjust');

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:IN,OUT,ADJUSTMENT',
            'notes' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        try {
            $product->adjustStock(
                $validated['quantity'],
                $validated['type'],
                $validated['notes'],
                $request->user()->id,
                $validated['supplier_id'] ?? null
            );

            $action = match ($validated['type']) {
                'IN' => 'Stock-In',
                'OUT' => 'Stock-Out',
                'ADJUSTMENT' => 'Stock Adjustment',
            };

            // Dispatch broadcasting event
            event(new \App\Events\StockUpdated($product->fresh(), $request->user(), $validated['type']));

            return back()->with('success', "{$action} of {$validated['quantity']} units recorded successfully for {$product->name}.");
            
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
    public function export($slug = null)
    {
        $this->authorize('inventory.export');

        $movements = \App\Models\StockMovement::with(['product', 'user', 'supplier'])->latest()->get();
        $csvHeader = ['Date', 'Type', 'Product SKU', 'Product Name', 'Quantity', 'Handled By', 'Supplier', 'Notes'];

        $callback = function() use ($movements, $csvHeader) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $csvHeader);

            foreach ($movements as $m) {
                fputcsv($file, [
                    $m->created_at->format('Y-m-d H:i:s'),
                    $m->type,
                    $m->product->sku,
                    $m->product->name,
                    ($m->type === 'OUT' ? '-' : '+') . $m->quantity,
                    $m->user?->name ?? 'System',
                    $m->supplier?->name ?? 'N/A',
                    $m->notes ?? '',
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=movement_logs_" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ]);
    }
}
