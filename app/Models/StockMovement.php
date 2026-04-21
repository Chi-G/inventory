<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id',
        'supplier_id',
        'user_id',
        'quantity',
        'type',
        'notes',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::created(function ($movement) {
            $movement->product->increment('current_stock', $movement->quantity);
        });

        static::deleted(function ($movement) {
            $movement->product->decrement('current_stock', $movement->quantity);
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
