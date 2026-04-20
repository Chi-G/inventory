<?php

use App\Models\Category;

require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Starting category reorganization...\n";

// 1. Create or Find "Furniture" Parent
$furniture = Category::firstOrCreate(['name' => 'Furniture'], ['description' => 'Home and office furniture collections.']);
echo "Furniture Parent ID: {$furniture->id}\n";

// 2. Move furniture children
$furnitureChildrenIds = [8, 9, 10, 11, 12, 13, 14, 15, 16];
Category::whereIn('id', $furnitureChildrenIds)->update(['parent_id' => $furniture->id]);
echo "Moved furniture sub-categories under Furniture.\n";

// 3. Rename existing parents
$renames = [
    2 => 'Beddings',
    3 => 'Lighting',
    4 => 'Wall Decor & Clocks',
    5 => 'Home Accessories & Decor',
    6 => 'Home Fragrance',
    7 => 'Artificial Plants & Flowers',
];

foreach ($renames as $id => $newName) {
    Category::where('id', $id)->update(['name' => $newName]);
    echo "Renamed category #{$id} to '{$newName}'.\n";
}

// 4. Ensure Beddings sub-categories are correct (they mostly are, but good to check)
$beddingsChildrenIds = [17, 18, 19, 20, 21, 22];
Category::whereIn('id', $beddingsChildrenIds)->update(['parent_id' => 2]);

// 5. Clean up any roots that shouldn't be roots (except the 7)
$validParentIds = [$furniture->id, 2, 3, 4, 5, 6, 7];
$otherRoots = Category::whereNull('parent_id')
    ->whereNotIn('id', $validParentIds)
    ->get();

foreach ($otherRoots as $root) {
    if (str_contains(strtolower($root->name), 'furniture') || in_array($root->id, $furnitureChildrenIds)) {
        $root->update(['parent_id' => $furniture->id]);
    }
    echo "Checked root: {$root->name}\n";
}

echo "Category reorganization complete.\n";
