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

        // Native useAssetUrl might be missing in older point releases, so we macro it
        if (!Vite::hasMacro('useAssetUrl')) {
            Vite::macro('useAssetUrl', function ($url) {
                // This is a simplified version of the native method
                // It works by telling Laravel's asset() helper to use the prefix
                config(['app.asset_url' => $url]);
                return $this;
            });
        }

        // Force Vite to look in the /inventory/build directory
        if (config('app.env') === 'production') {
            Vite::useAssetUrl(config('app.url'));
            Vite::useBuildDirectory('build');
            
            \Illuminate\Support\Facades\URL::forceRootUrl(config('app.url'));
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
