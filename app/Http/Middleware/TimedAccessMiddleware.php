<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class TimedAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Target user: drmally@elevate.com
        if ($user && $user->email === 'drmally@elevate.com') {
            
            // 1. Check if the session has expired (1 hour limit)
            if ($user->access_expires_at && Carbon::now()->gt($user->access_expires_at)) {
                // Set the lockout (using configured hours)
                $user->update([
                    'access_expires_at' => null,
                    'can_login_after' => Carbon::now()->addHours(\App\Models\User::LOCKOUT_HOURS),
                ]);

                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')->with('error', "Your session has expired. You can log in again in " . \App\Models\User::LOCKOUT_HOURS . " hours.");
            }
        }

        return $next($request);
    }
}
