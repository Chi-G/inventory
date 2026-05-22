<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'description',
        'category_id',
        'cost_price',
        'retail_price',
        'image_path',
        'barcode_value',
        'barcode_symbology',
        'attributes',
        'alert_threshold',
        'current_stock',
    ];

    protected $casts = [
        'attributes' => 'array',
        'cost_price' => 'float',
        'retail_price' => 'float',
    ];

    protected $appends = ['image_url'];

    // Removed current_stock append to favor real DB column

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    // Removed getCurrentStockAttribute to favor direct column access for performance

    /**
     * Helper to perform a stock adjustment and generate a movement record.
     */
    public function adjustStock(int $absoluteQuantity, string $type, ?string $notes = null, ?int $userId = null, ?int $supplierId = null)
    {
        // Enforce quantity constraints based on type
        $quantity = match ($type) {
            'IN' => abs($absoluteQuantity),
            'OUT' => -abs($absoluteQuantity),
            'ADJUSTMENT' => $absoluteQuantity,
            default => throw new \InvalidArgumentException("Invalid stock movement type: {$type}"),
        };

        // Prevent Stock-Outs that result in negative stock
        if ($type === 'OUT' && ($this->current_stock + $quantity < 0)) {
            throw new \Exception('Insufficient stock to process this Stock-Out transaction.');
        }

        return $this->stockMovements()->create([
            'quantity' => $quantity,
            'type' => $type,
            'notes' => $notes,
            'user_id' => $userId ?? auth()->id(),
            'supplier_id' => $supplierId,
        ]);
    }

    /**
     * Get the full URL for the product image.
     */
    public function getImageUrlAttribute()
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }
}
