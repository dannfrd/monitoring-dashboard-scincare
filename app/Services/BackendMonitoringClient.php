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

    public function login(string $email, string $password): array
    {
        $response = $this->http()->post('/auth/login', [
            'email' => $email,
            'password' => $password,
        ]);

        if ($response->failed()) {
            $response->throw();
        }

        return $response->json() ?? [];
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

    public function users(int $limit = 200, bool $refresh = false): array
    {
        $limit = $this->sanitizeLimit($limit, 500);
        $cacheKey = sprintf('monitoring.users.%d', $limit);

        return $this->remember(
            $cacheKey,
            30,
            fn () => $this->get('/metrics/users', ['limit' => $limit]),
            $refresh,
        );
    }

    public function analyses(int $limit = 200, bool $refresh = false): array
    {
        $limit = $this->sanitizeLimit($limit, 500);
        $cacheKey = sprintf('monitoring.analyses.%d', $limit);

        return $this->remember(
            $cacheKey,
            30,
            fn () => $this->get('/metrics/analyses', ['limit' => $limit]),
            $refresh,
        );
    }

    public function analysisDetails(int $limit = 200, bool $refresh = false): array
    {
        $limit = $this->sanitizeLimit($limit, 500);
        $cacheKey = sprintf('monitoring.analysis_details.%d', $limit);

        return $this->remember(
            $cacheKey,
            30,
            fn () => $this->get('/metrics/analysis-details', ['limit' => $limit]),
            $refresh,
        );
    }

    public function products(int $limit = 200, bool $refresh = false): array
    {
        $limit = $this->sanitizeLimit($limit, 500);
        $cacheKey = sprintf('monitoring.products.%d', $limit);

        return $this->remember(
            $cacheKey,
            30,
            fn () => $this->get('/metrics/products', ['limit' => $limit]),
            $refresh,
        );
    }

    public function ingredients(int $limit = 200, bool $refresh = false): array
    {
        $limit = $this->sanitizeLimit($limit, 500);
        $cacheKey = sprintf('monitoring.ingredients.%d', $limit);

        return $this->remember(
            $cacheKey,
            30,
            fn () => $this->get('/metrics/ingredients', ['limit' => $limit]),
            $refresh,
        );
    }

    public function userHistories(int $limit = 200, bool $refresh = false): array
    {
        $limit = $this->sanitizeLimit($limit, 500);
        $cacheKey = sprintf('monitoring.user_histories.%d', $limit);

        return $this->remember(
            $cacheKey,
            30,
            fn () => $this->get('/metrics/user-histories', ['limit' => $limit]),
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

    protected function sanitizeLimit(int $limit, int $max = 100): int
    {
        return max(1, min($max, $limit));
    }
}
