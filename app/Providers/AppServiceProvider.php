<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Permission;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (config('app.env') === 'production' || env('APP_ENV') === 'production') {
            // FORCE the Application URL for consistency across all URL generation
            $url = 'https://forahia.com/inventory';
            config(['app.url' => $url]);
            
            // Fix for Hostinger's public path detection in subdirectories
            $this->app->bind('path.public', function() {
                return base_path('public');
            });

            // Force HTTPS and the Root URL immediately
            URL::forceRootUrl($url);
            URL::forceScheme('https');
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        if (config('app.env') === 'production' || env('APP_ENV') === 'production') {
            $url = 'https://forahia.com/inventory';

            // Ensure all generated URLs use the subdirectory path
            URL::forceRootUrl($url);
            URL::forceScheme('https');
            
            // Inject asset URL for Vite manifest resolution
            putenv("VITE_ASSET_URL=$url");
            $_ENV['VITE_ASSET_URL'] = $url;
        }

        // --- DYNAMIC PERMISSION SYSTEM ---
        
        // 1. Super Admin Bypass (God Mode)
        Gate::before(function ($user, $ability) {
            return $user->role === 'Super Admin' ? true : null;
        });

        // 2. Register all permissions as Gates
        if (Schema::hasTable('permissions')) {
            try {
                $permissions = Permission::all();
                foreach ($permissions as $permission) {
                    Gate::define($permission->name, function ($user) use ($permission) {
                        return $user->hasPermission($permission->name);
                    });
                }
            } catch (\Exception $e) {
                // Silently fail if DB is not ready
            }
        }
    }
}
