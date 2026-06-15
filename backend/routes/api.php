<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrganController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\AnatomyChatController;
use App\Http\Controllers\AnatomyController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\Api\QuizController;

/*
|--------------------------------------------------------------------------
| API Routes - Anatomy Learning App
|--------------------------------------------------------------------------
*/

// --- 1. Organs & 3D Models ---
Route::get('/organs', [OrganController::class, 'index']);
Route::get('/organs/{id}', [OrganController::class, 'show']);
Route::get('/anatomy-models', [AnatomyController::class, 'index']);

// --- 2. Authentication ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/google-login', [GoogleController::class, 'handleGoogleLogin']);

// --- 3. AI Assistant (Anatomy Chat) ---
Route::post('/chat', [AnatomyChatController::class, 'handleChat']);

// --- 4. Quiz Engine ---
Route::get('/quiz-questions', [QuizController::class, 'index']);
Route::post('/quiz-results/save', [QuizController::class, 'saveResult']);

// --- 5. Settings ---
Route::get('/settings', [SettingsController::class, 'getSettings']);
Route::post('/settings/save', [SettingsController::class, 'saveSettings']);

// --- 🌟 6. Real-Time Simulation: Live Vitals Module 🌟 ---
Route::get('/live-vitals', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Real-time health data fetched successfully',
        'data' => [
            'heart_rate' => rand(70, 95),
            'spo2'       => rand(95, 100),
            'bp_sys'     => rand(110, 130),
            'bp_dia'     => rand(70, 85),
            'body_temp'  => number_format(rand(360, 375) / 10, 1),
            'timestamp'  => now()->format('H:i:s')
        ]
    ]);
});
