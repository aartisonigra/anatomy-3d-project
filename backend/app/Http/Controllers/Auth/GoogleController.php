<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Log; // લોગિંગ માટે

class GoogleController extends Controller
{
    public function handleGoogleLogin(Request $request)
    {
        // 1. વેલિડેશન ચેક કરો (422 એરર અહીંથી આવતી હોય છે)
        $request->validate([
            'token' => 'required|string',
        ]);

        try {
            $token = $request->token;

            // ગૂગલ ક્લાયન્ટ સેટઅપ
            $client = new GoogleClient(['client_id' => env('GOOGLE_CLIENT_ID')]);

            // ટોકન વેરિફાય કરો
            $payload = $client->verifyIdToken($token);

            if ($payload) {
                $email = $payload['email'];
                $user = User::where('email', $email)->first();

                if (!$user) {
                    // નવો યુઝર બનાવો
                    $user = User::create([
                        'name'     => $payload['name'] ?? 'Google User',
                        'email'    => $email,
                        'google_id'=> $payload['sub'],
                        'password' => bcrypt(str()->random(16)),
                    ]);
                }

                // API માટે સેશનને બદલે Token (Sanctum) વાપરવું હિતાવહ છે
                // પણ અત્યારે Auth::login વાપરી શકાય છે
                Auth::login($user);

                return response()->json([
                    'message' => 'Login Successful',
                    'user'    => $user
                ], 200);
            }

            return response()->json(['message' => 'Invalid Google Token'], 401);

        } catch (\Exception $e) {
            Log::error('Google Login Error: ' . $e->getMessage());
            return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }
}
