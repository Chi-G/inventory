<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HardenIdentitySlug
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, \Closure $next): \Symfony\Component\HttpFoundation\Response
    {
        $slug = $request->route('slug');
        $user = $request->user();

        if ($user && $slug && strtolower($user->slug) !== strtolower($slug)) {
            // Only redirect for GET requests to avoid losing POST/PUT data
            if ($request->isMethod('GET')) {
                // Get the current route name and parameters
                $routeName = $request->route()->getName();
                $parameters = $request->route()->parameters();
                
                // Override the incorrect slug with the correct one
                $parameters['slug'] = $user->slug;

                return redirect()->route($routeName, $parameters);
            }
        }

        $request->route()->forgetParameter('slug');

        return $next($request);
    }
}
