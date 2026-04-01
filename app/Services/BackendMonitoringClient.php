<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class BackendMonitoringClient
{
    protected string $baseUrl;
    protected ?string $apiKey;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.skincare_monitoring.base_url'), '/');
        $this->apiKey = config('services.skincare_monitoring.api_key');
        $this->timeout = (int) config('services.skincare_monitoring.timeout', 10);
    }

    public function health(bool $refresh = false): array
    {
        return $this->remember('monitoring.health', 15, fn () => $this->get('/health'), $refresh);
    }

    public function summary(bool $refresh = false): array
    {
        return $this->remember('monitoring.summary', 30, fn () => $this->get('/metrics/summary'), $refresh);
    }

    public function recentAnalyses(int $limit = 15, bool $refresh = false): array
    {
        $limit = $this->sanitizeLimit($limit);
        $cacheKey = sprintf('monitoring.recent.%d', $limit);

        return $this->remember(
            $cacheKey,
            30,
            fn () => $this->get('/metrics/recent', ['limit' => $limit]),
            $refresh,
        );
    }

    protected function remember(string $cacheKey, int $seconds, Closure $callback, bool $refresh = false): mixed
    {
        if ($refresh) {
            Cache::forget($cacheKey);
        }

        return Cache::remember($cacheKey, $seconds, fn () => $callback());
    }

    protected function get(string $uri, array $query = []): array
    {
        $response = $this->http()->get($uri, $query);

        if ($response->failed()) {
            $response->throw();
        }

        return $response->json() ?? [];
    }

    protected function http(): PendingRequest
    {
        if (empty($this->baseUrl)) {
            throw new RuntimeException('Monitoring backend base URL is not configured.');
        }

        $request = Http::timeout($this->timeout)
            ->acceptJson()
            ->baseUrl($this->baseUrl);

        if ($this->apiKey) {
            $request = $request->withHeader('x-api-key', $this->apiKey);
        }

        return $request;
    }

    protected function sanitizeLimit(int $limit): int
    {
        return max(1, min(100, $limit));
    }
}
