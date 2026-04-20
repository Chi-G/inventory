<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            'Furniture' => ['Sofas', 'Centre Tables', 'Side Tables', 'Accent Chairs', 'Dining Sets', 'Console Tables', 'Beds', 'Wardrobes', 'Bookshelves'],
            'Beddings' => ['Duvets', 'Bedsheet Sets', 'Throw Pillows', 'Blankets', 'Pillowcases', 'Mattress Protectors'],
            'Lighting' => ['Table Lamps', 'Floor Lamps', 'Wall Sconces'],
            'Wall Decor' => ['Wall Clocks', 'Wall Arts', 'Mirrors', 'Picture Frames', 'Wall Shelves'],
            'Home Decor' => ['Vases', 'Figurines', 'Faux Books', 'Cushions', 'Candle Holders', 'Trays'],
            'Fragrance' => ['Scented Candles', 'Diffusers', 'Room Sprays', 'Essential Oils'],
            'Plants' => ['Artificial Plants', 'Artificial Flowers', 'Potted Arrangements', 'Hanging Plants'],
        ];

        foreach ($catalog as $parentName => $subCategories) {
            $parent = Category::updateOrCreate(
                ['name' => $parentName],
                ['description' => "Main $parentName category"]
            );

            foreach ($subCategories as $subName) {
                Category::updateOrCreate(
                    ['name' => $subName, 'parent_id' => $parent->id],
                    ['description' => "$subName under $parentName"]
                );
            }
        }
    }
}
