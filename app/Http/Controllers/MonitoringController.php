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
            'recentAnalyses' => $this->attempt(fn () => $this->client->recentAnalyses(30), []),
            'lastUpdated' => now()->toIso8601String(),
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

    public function ingredientIndex(): Response
    {
        $summary = $this->attempt(fn () => $this->client->summary(), [
            'ingredients' => [],
        ]);

        $recentAnalyses = $this->attempt(fn () => $this->client->recentAnalyses(100), []);

        $usage = [];
        foreach ($recentAnalyses as $entry) {
            $matchedIngredients = $entry['matched_ingredients'] ?? data_get($entry, 'ai_analysis.matched_ingredients', []);

            if (! is_array($matchedIngredients)) {
                continue;
            }

            foreach ($matchedIngredients as $ingredient) {
                $name = trim((string) $ingredient);
                if ($name === '') {
                    continue;
                }

                $usage[$name] = ($usage[$name] ?? 0) + 1;
            }
        }

        arsort($usage);

        $topUsage = collect(array_slice($usage, 0, 12, true))
            ->map(fn (int $count, string $name) => [
                'name' => $name,
                'count' => $count,
            ])
            ->values()
            ->all();

        return Inertia::render('Ingredients/Index', [
            'ingredientSummary' => $summary['ingredients'] ?? [],
            'topIngredients' => $topUsage,
            'lastUpdated' => now()->toIso8601String(),
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
