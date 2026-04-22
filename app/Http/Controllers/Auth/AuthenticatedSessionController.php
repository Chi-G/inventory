<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // 1. Pre-auth check for timed-access user
        $user = \App\Models\User::where('email', $request->email)->first();
        if ($user && $user->email === 'drmally@elevate.com' && $user->can_login_after) {
            if (\Carbon\Carbon::now()->lessThan($user->can_login_after)) {
                $hoursRemaining = round(\Carbon\Carbon::now()->diffInHours($user->can_login_after, false), 1);
                return back()->withErrors([
                    'email' => "Access restricted. You must wait {$hoursRemaining} more hours before logging in again.",
                ]);
            }
        }

        $request->authenticate();

        $request->session()->regenerate();

        // 2. Set expiry for timed-access user
        if ($request->user()->email === 'drmally@elevate.com') {
            $request->user()->update([
                'access_expires_at' => \Carbon\Carbon::now()->addHours(\App\Models\User::TIMED_ACCESS_HOURS),
                'can_login_after' => null, // Clear any previous blocks
            ]);
        }

        return redirect()->intended(route('dashboard.index', ['slug' => $request->user()->slug], absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Set lockout for timed-access user upon logout
        if ($user && $user->email === 'drmally@elevate.com') {
            $user->update([
                'access_expires_at' => null,
                'can_login_after' => \Carbon\Carbon::now()->addHours(\App\Models\User::LOCKOUT_HOURS),
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
