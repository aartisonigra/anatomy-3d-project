<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    
    public function register(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

       
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 422);
        }

      
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        
        Auth::login($user);

        return response()->json([
            'message' => 'User registered successfully!',
            'user' => $user
        ], 201);
    }

     
    public function login(Request $request)
    {
       
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

       
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid email or password. Please check your credentials.'
            ], 401);
        }

        // જો સાચું હોય તો ઓથેન્ટિકેટેડ યુઝર મેળવો
        $user = Auth::user();

        return response()->json([
            'message' => 'Login successful!',
            'user' => $user
        ], 200);
    }

    /**
     * 🌐 ૩. ગુગલ લોગીન લોજિક (Google Login)
     */
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
                    'password' => Hash::make(Str::random(16)), // રેન્ડમ પાસવર્ડ જનરેટ કર્યો
                ]);
            }
        }

        Auth::login($user);

        return response()->json([
            'message' => 'Google Login successful!',
            'user' => $user
        ], 200);
    }

    /**
     * 🚪 ૪. લોગઆઉટ કરવા માટે
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully!'
        ], 200);
    }
}