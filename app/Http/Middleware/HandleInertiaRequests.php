<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'can' => $request->user() ? $this->getPermissions($request->user()) : [],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'app' => [
                'url' => config('app.url'),
                'asset_url' => asset(''),
                'is_production' => app()->environment('production'),
            ],
            'pusher' => [
                'key' => config('broadcasting.connections.pusher.key'),
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
            ],
        ];
    }

    /**
     * Get permission map for the user.
     */
    protected function getPermissions($user): array
    {
        // 1. Fetch all permission names once
        $allPermissions = \App\Models\Permission::pluck('name');

        // 2. Shortcut for Super Admin
        if ($user->role === 'Super Admin') {
            return $allPermissions->mapWithKeys(fn($name) => [$name => true])->toArray();
        }

        // 3. Efficiently map for regular users
        // Load the user's specific permissions through their role
        $rolePermissions = $user->role_relation ? $user->role_relation->permissions->pluck('name')->toArray() : [];

        return $allPermissions->mapWithKeys(function ($name) use ($rolePermissions) {
            return [$name => in_array($name, $rolePermissions)];
        })->toArray();
    }
}
