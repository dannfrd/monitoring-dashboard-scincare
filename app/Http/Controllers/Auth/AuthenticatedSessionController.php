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
    public function store(Request $request, \App\Services\BackendMonitoringClient $client): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        try {
            $response = $client->login($validated['email'], $validated['password']);
            $userData = $response['user'] ?? null;
            
            if (!$userData) {
                throw ValidationException::withMessages([
                    'email' => 'Email atau password admin tidak valid.',
                ]);
            }
        } catch (\Illuminate\Http\Client\RequestException $e) {
            if ($e->response->status() === 401) {
                throw ValidationException::withMessages([
                    'email' => 'Email atau password admin tidak valid.',
                ]);
            }
            
            \Illuminate\Support\Facades\Log::error('Backend login error: ' . $e->getMessage());
            throw ValidationException::withMessages([
                'email' => 'Terjadi kesalahan saat menghubungi server backend.',
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Backend login error: ' . $e->getMessage());
            throw ValidationException::withMessages([
                'email' => 'Terjadi kesalahan sistem.',
            ]);
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        $request->session()->regenerate();

        $request->session()->put('admin_authenticated', true);
        $request->session()->put('admin_user', [
            'id' => $userData['id'] ?? 0,
            'name' => $userData['name'] ?? 'System Admin',
            'email' => $userData['email'] ?? $validated['email'],
            'role' => $userData['role'] ?? 'admin',
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
