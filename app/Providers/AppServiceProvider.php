<?php

namespace App\Providers;

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
            $this->app->bind('path.public', function() {
                return base_path();
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
            // Force the Vite Asset URL at the PHP environment level
            // This is the "Nuclear" fix for subdirectory asset 404s
            $url = config('app.url');
            putenv("VITE_ASSET_URL=$url");
            $_ENV['VITE_ASSET_URL'] = $url;
            $_SERVER['VITE_ASSET_URL'] = $url;

            \Illuminate\Support\Facades\URL::forceRootUrl($url);
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
