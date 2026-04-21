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
            // FORCE the Application URL to fix Hostinger subdirectory issues
            config(['app.url' => 'https://forahia.com/inventory']);
            
            // Re-bind the public path explicitly
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
            $url = 'https://forahia.com/inventory';

            // Force Scheme and Root URL for all generated links
            URL::forceScheme('https');
            URL::forceRootUrl($url);
            
            // Force Vite Asset URL
            putenv("VITE_ASSET_URL=$url");
            $_ENV['VITE_ASSET_URL'] = $url;
            $_SERVER['VITE_ASSET_URL'] = $url;
        }
    }
}
