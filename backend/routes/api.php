<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrganController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\AnatomyChatController;
use App\Http\Controllers\AnatomyController;     // 🌟 3D Models કંટ્રોલર
use App\Http\Controllers\SettingsController;    // ⚙️ સેટિંગ્સ માટેનો કંટ્રોલર
use App\Http\Controllers\Api\QuizController;    // 🔥 NEW: ક્વિઝ સિસ્ટમ માટેનો કંટ્રોલર

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Fetch all organs
Route::get('/organs', [OrganController::class, 'index']);

// 2. Fetch single organ by ID
Route::get('/organs/{id}', [OrganController::class, 'show']);

// 3. Fetch all 3D Anatomy Models
Route::get('/anatomy-models', [AnatomyController::class, 'index']);

// 4. Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/google-login', [GoogleController::class, 'handleGoogleLogin']);

// 5. AI Assistant Chat Route
Route::post('/chat', [AnatomyChatController::class, 'handleChat']);

// ⚙️ System Configuration & Settings Routes
Route::get('/settings', [SettingsController::class, 'getSettings']);
Route::post('/settings/save', [SettingsController::class, 'saveSettings']);

// 🔥 NEW: Quiz Engine Module Routes
// આ બે ન્યુ રૂટ્સ ફ્રન્ટએન્ડ એપમાં ડાયરેક્ટ ડેટા સપ્લાય અને રીઝલ્ટ સ્ટોર કરશે
Route::get('/quiz-questions', [QuizController::class, 'index']);
Route::post('/quiz-results/save', [QuizController::class, 'saveResult']);
