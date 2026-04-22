<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index($slug = null)
    {
        $this->authorize('suppliers.view');
        
        return Inertia::render('Catalog/Suppliers/Index', [
            'suppliers' => Supplier::all()
        ]);
    }

    public function show(Supplier $supplier, $slug = null)
    {
        return redirect()->route('suppliers.index', ['slug' => auth()->user()->slug]);
    }

    public function store(Request $request, $slug = null)
    {
        $this->authorize('suppliers.create');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        Supplier::create($validated);

        return redirect()->back()->with('success', 'Supplier created successfully.');
    }

    public function update(Request $request, Supplier $supplier, $slug = null)
    {
        $this->authorize('suppliers.edit');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $supplier->update($validated);

        return redirect()->back()->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier, $slug = null)
    {
        $this->authorize('suppliers.delete');

        $supplier->delete();

        return redirect()->back()->with('success', 'Supplier deleted successfully.');
    }
}
