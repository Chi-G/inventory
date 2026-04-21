<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $this->authorize('categories.view');

        return Inertia::render('Catalog/Categories/Index', [
            'categories' => Category::roots()->withCount('children')->latest()->paginate(10),
            'parentCategories' => Category::roots()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('categories.create');

        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name|max:255',
            'description' => 'nullable|string|max:500',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        Category::create($validated);

        return redirect()->back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $this->authorize('categories.edit');

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:500',
            'parent_id' => 'nullable|exists:categories,id|different:id',
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Category updated successfully.');
    } 

    public function destroy(Category $category)
    {
        $this->authorize('categories.delete');

        if ($category->products()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete category containing products.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
