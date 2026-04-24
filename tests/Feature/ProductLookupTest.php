<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductLookupTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_can_be_found_by_sku_barcode_or_id()
    {
        $user = User::factory()->create(['role' => 'Admin']);
        $slug = $user->slug;
        $category = Category::factory()->create();

        $product = Product::factory()->create([
            'sku' => 'SKU123',
            'barcode_value' => 'BAR456',
            'category_id' => $category->id,
        ]);

        $this->actingAs($user);

        // Search by SKU
        $response = $this->get(route('api.products.lookup', ['barcode' => 'SKU123', 'slug' => $slug]));
        $response->assertStatus(200);
        $response->assertJsonPath('id', $product->id);

        // Search by Barcode
        $response = $this->get(route('api.products.lookup', ['barcode' => 'BAR456', 'slug' => $slug]));
        $response->assertStatus(200);
        $response->assertJsonPath('id', $product->id);

        // Search by ID
        $response = $this->get(route('api.products.lookup', ['barcode' => $product->id, 'slug' => $slug]));
        $response->assertStatus(200);
        $response->assertJsonPath('id', $product->id);

        // Search by Hyphenated ID (e.g. from print sheet format "ID-RANDOM")
        $response = $this->get(route('api.products.lookup', ['barcode' => $product->id.'-N9EDBN', 'slug' => $slug]));
        $response->assertStatus(200);
        $response->assertJsonPath('id', $product->id);

        // Search non-existent
        $response = $this->get(route('api.products.lookup', ['barcode' => 'NONEXISTENT', 'slug' => $slug]));
        $response->assertStatus(404);
    }
}
