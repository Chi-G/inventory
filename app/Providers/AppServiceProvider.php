<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (config('app.env') === 'production') {
            // Re-bind the public path explicitly for Hostinger's subdirectory structure
            $this->app->bind('path.public', function() {
                return base_path('public');
            });
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        if (config('app.env') === 'production') {
            // Force HTTPS and the correct root URL
            URL::forceScheme('https');
            URL::forceRootUrl(config('app.url'));
            
            // Ensure Vite uses the correct asset URL
            $url = config('app.url');
            putenv("VITE_ASSET_URL=$url");
            $_ENV['VITE_ASSET_URL'] = $url;
            $_SERVER['VITE_ASSET_URL'] = $url;
        }
    }
}
