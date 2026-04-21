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
            $url = config('app.url');

            // Force the Vite Asset URL at the PHP environment level
            putenv("VITE_ASSET_URL=$url");
            $_ENV['VITE_ASSET_URL'] = $url;
            $_SERVER['VITE_ASSET_URL'] = $url;

            // Ensure all generated URLs use the subdirectory path
            URL::forceRootUrl($url);
            URL::forceScheme('https');
        }
    }
}
