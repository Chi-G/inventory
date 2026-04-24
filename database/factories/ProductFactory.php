<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sku' => 'SKU-'.$this->faker->unique()->bothify('??###'),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'category_id' => Category::factory(),
            'cost_price' => $this->faker->randomFloat(2, 10, 100),
            'retail_price' => $this->faker->randomFloat(2, 110, 200),
            'barcode_value' => $this->faker->unique()->ean13(),
            'alert_threshold' => 10,
            'current_stock' => 50,
        ];
    }
}
