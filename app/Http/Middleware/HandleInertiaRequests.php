<?php

namespace App\Http\Middleware;

use App\Services\BackendMonitoringClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;
use Throwable;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'monitoringStatus' => fn () => $this->monitoringStatus($request),
        ];
    }

    protected function monitoringStatus(Request $request): array
    {
        if (! $request->user()) {
            return [];
        }

        try {
            return app(BackendMonitoringClient::class)->health();
        } catch (Throwable $throwable) {
            Log::debug('Unable to fetch monitoring status', [
                'message' => $throwable->getMessage(),
            ]);

            return [
                'status' => 'unknown',
                'services' => [],
            ];
        }
    }
}
