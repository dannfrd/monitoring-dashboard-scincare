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

    public function analysisIndex(): Response
    {
        $summary = $this->attempt(fn () => $this->client->summary(), [
            'analysis' => [],
        ]);

        return Inertia::render('Analysis/Index', [
            'analysisSummary' => $summary['analysis'] ?? [],
            'analyses' => $this->attempt(fn () => $this->client->analyses(200), []),
        ]);
    }

    public function recommendationIndex(): Response
    {
        $recentAnalyses = $this->attempt(fn () => $this->client->recentAnalyses(50), []);

        $recommendations = collect($recentAnalyses)
            ->map(function (array $entry): array {
                return [
                    'analysisId' => $entry['id'] ?? null,
                    'user' => data_get($entry, 'user.name', '-'),
                    'product' => data_get($entry, 'product.name', '-'),
                    'status' => $entry['status'] ?? data_get($entry, 'ai_analysis.status', '-'),
                    'recommendation' => $this->extractRecommendation($entry),
                    'createdAt' => $entry['created_at'] ?? null,
                ];
            })
            ->filter(fn (array $entry) => $entry['recommendation'] !== '-')
            ->values()
            ->all();

        return Inertia::render('Recommendations/Index', [
            'recommendations' => $recommendations,
            'lastUpdated' => now()->toIso8601String(),
        ]);
    }

    public function usersIndex(): Response
    {
        $users = $this->attempt(fn () => $this->client->users(200), []);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'lastUpdated' => now()->toIso8601String(),
        ]);
    }

    public function ingredientIndex(): Response
    {
        $summary = $this->attempt(fn () => $this->client->summary(), [
            'ingredients' => [],
        ]);

        return Inertia::render('Ingredients/Index', [
            'ingredientSummary' => $summary['ingredients'] ?? [],
            'ingredients' => $this->attempt(fn () => $this->client->ingredients(300), []),
        ]);
    }

    public function productsIndex(): Response
    {
        return Inertia::render('Products/Index', [
            'products' => $this->attempt(fn () => $this->client->products(200), []),
        ]);
    }

    public function analysisDetailsIndex(): Response
    {
        return Inertia::render('AnalysisDetails/Index', [
            'analysisDetails' => $this->attempt(fn () => $this->client->analysisDetails(200), []),
        ]);
    }

    public function userHistoriesIndex(): Response
    {
        return Inertia::render('UserHistories/Index', [
            'userHistories' => $this->attempt(fn () => $this->client->userHistories(200), []),
        ]);
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
            'entities' => [],
        ]);

        return [
            'health' => $this->attempt(fn () => $this->client->health($refresh), [
                'status' => 'unknown',
                'services' => [],
            ]),
            'analysisSummary' => $summary['analysis'] ?? [],
            'ingredientSummary' => $summary['ingredients'] ?? [],
            'entitySummary' => $summary['entities'] ?? [],
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

    protected function extractRecommendation(array $entry): string
    {
        $candidate = $entry['recommendation']
            ?? $entry['summary']
            ?? data_get($entry, 'ai_analysis.recommendation')
            ?? data_get($entry, 'ai_analysis.summary')
            ?? data_get($entry, 'ai_analysis.ai_analysis');

        if (is_string($candidate) && trim($candidate) !== '') {
            return trim($candidate);
        }

        if (is_array($candidate) && $candidate !== []) {
            return json_encode($candidate, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '-';
        }

        return '-';
    }
}
