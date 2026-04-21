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
        if (config('app.env') === 'production' || env('APP_ENV') === 'production') {
            // FORCE the Application URL at the very beginning of the lifecycle
            $url = 'https://forahia.com/inventory';
            config(['app.url' => $url]);
            
            // Register the public path explicitly
            $this->app->bind('path.public', function() {
                return base_path('public');
            });

            // Force the root URL immediately for early-loading providers
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
            
            // Force Vite Asset URL
            putenv("VITE_ASSET_URL=$url");
            $_ENV['VITE_ASSET_URL'] = $url;
            $_SERVER['VITE_ASSET_URL'] = $url;
        }
    }
}
