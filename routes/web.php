<?php

use App\Http\Controllers\MonitoringController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return session('admin_authenticated', false)
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

Route::middleware(['admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/monitoring', [MonitoringController::class, 'index'])->name('monitoring.index');
    Route::get('/analisis-user', [MonitoringController::class, 'analysisIndex'])->name('analysis.index');
    Route::get('/rekomendasi', [MonitoringController::class, 'recommendationIndex'])->name('recommendations.index');
    Route::get('/data-bahan', [MonitoringController::class, 'ingredientIndex'])->name('ingredients.index');
    Route::get('/monitoring/data', [MonitoringController::class, 'data'])->name('monitoring.data');
});

require __DIR__.'/auth.php';
