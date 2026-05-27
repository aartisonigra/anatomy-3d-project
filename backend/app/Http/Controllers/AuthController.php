<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


class AuthController extends Controller
{
    // Google Login Logic
    public function googleLogin(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'google_id' => 'required|string',
        ]);

        // ચેક કરો કે આ ગુગલ ID વાળો યુઝર ડેટાબેઝમાં છે?
        $user = User::where('google_id', $request->google_id)->first();

        if (!$user) {
            // જો ગુગલ ID ન મળે, તો ઈમેલથી ચેક કરો
            $user = User::where('email', $request->email)->first();

            if ($user) {
                // જો યુઝર હોય તો ગુગલ ID અપડેટ કરો
                $user->update(['google_id' => $request->google_id]);
            } else {
                // નવો યુઝર બનાવો
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'google_id' => $request->google_id,
                    'password' => Hash::make(Str::random(16)),
                ]);
            }
        }

        Auth::login($user);

        return response()->json([
            'message' => 'Google Login successful!',
            'user' => $user
        ], 200);
    }

    // તમે અહીં તમારા register() અને login() ફંક્શન પણ ઉમેરી શકો છો
}
