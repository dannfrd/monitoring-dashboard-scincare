<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
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
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $adminEmail = (string) env('ADMIN_EMAIL', 'admin@skincare.local');
        $adminPassword = (string) env('ADMIN_PASSWORD', 'admin12345');
        $adminName = (string) env('ADMIN_NAME', 'Skincare Admin');

        if ($validated['email'] !== $adminEmail || $validated['password'] !== $adminPassword) {
            throw ValidationException::withMessages([
                'email' => 'Email atau password admin tidak valid.',
            ]);
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        $request->session()->regenerate();

        $request->session()->put('admin_authenticated', true);
        $request->session()->put('admin_user', [
            'name' => $adminName,
            'email' => $adminEmail,
            'role' => 'admin',
        ]);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
