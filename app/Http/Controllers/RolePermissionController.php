<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolePermissionController extends Controller
{
    /**
     * Display the Role-Permission Matrix
     */
    public function index($slug)
    {
        // Fetch roles we want to manage (exclude super-admin for safety)
        $roles = Role::where('name', '!=', 'super-admin')->get();
        
        // Fetch all permissions grouped by their module
        $permissionsByModule = Permission::all()->groupBy('module');
        
        // Get the current mapping
        $matrix = [];
        foreach ($roles as $role) {
            $matrix[$role->id] = $role->permissions()->pluck('permission_id')->toArray();
        }

        return Inertia::render('Admin/Permissions/Index', [
            'roles' => $roles,
            'permissionsByModule' => $permissionsByModule,
            'matrix' => $matrix,
        ]);
    }

    /**
     * Update the permissions for a specific role
     */
    public function update(Request $request, $slug)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permission_id' => 'required|exists:permissions,id',
            'value' => 'required|boolean',
        ]);

        $role = Role::findOrFail($request->role_id);
        
        if ($request->value) {
            $role->permissions()->attach($request->permission_id);
        } else {
            $role->permissions()->detach($request->permission_id);
        }

        return redirect()->back()->with('success', 'Permissions updated successfully.');
    }
}
