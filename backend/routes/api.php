<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrganController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\AnatomyChatController; // 🧠 AI Assistant કંટ્રોલર અહીં ઉમેર્યો છે

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// 1. Fetch all organs
Route::get('/organs', [OrganController::class, 'index']);

// 2. Fetch single organ by ID
Route::get('/organs/{id}', [OrganController::class, 'show']);

// 3. Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Google Login (ફ્રન્ટએન્ડ ટોકન વેરિફિકેશન માટેનો મુખ્ય રૂટ)
Route::post('/google-login', [GoogleController::class, 'handleGoogleLogin']);

// 🚀 4. AI Assistant Chat Route
// આ રૂટ તમારા React Native એપ્લિકેશનના ચેટબોક્સમાંથી આવતી મેડિકલ ક્વેરીઝ હેન્ડલ કરશે
Route::post('/chat', [AnatomyChatController::class, 'handleChat']);


// જો ભવિષ્યમાં અલગથી રીડાયરેક્ટ વાપરવું હોય તો જ આ અનકમેન્ટ કરવા
// Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle']);
// Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);