<?php

namespace App\Http\Controllers;

use App\Services\BackendMonitoringClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MonitoringController extends Controller
{
    public function __construct(private BackendMonitoringClient $client)
    {
    }

    public function index(): Response
    {
        return Inertia::render('Monitoring/Overview', $this->buildPayload());
    }

    public function data(Request $request): JsonResponse
    {
        $limit = (int) $request->integer('limit', 15);

        return response()->json($this->buildPayload(refresh: true, limit: $limit));
    }

    protected function buildPayload(bool $refresh = false, int $limit = 15): array
    {
        $summary = $this->attempt(fn () => $this->client->summary($refresh), [
            'analysis' => [],
            'ingredients' => [],
        ]);

        return [
            'health' => $this->attempt(fn () => $this->client->health($refresh), [
                'status' => 'unknown',
                'services' => [],
            ]),
            'analysisSummary' => $summary['analysis'] ?? [],
            'ingredientSummary' => $summary['ingredients'] ?? [],
            'recentAnalyses' => $this->attempt(fn () => $this->client->recentAnalyses($limit, $refresh), []),
            'lastUpdated' => now()->toIso8601String(),
        ];
    }

    protected function attempt(callable $callback, mixed $fallback): mixed
    {
        try {
            return $callback();
        } catch (Throwable $throwable) {
            Log::warning('Monitoring data fetch failed', [
                'message' => $throwable->getMessage(),
            ]);

            return $fallback;
        }
    }
}
