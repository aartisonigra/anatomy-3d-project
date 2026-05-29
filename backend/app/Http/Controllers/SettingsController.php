<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SettingsController extends Controller
{
    // સેટિંગ્સ મેળવવા માટે (GET)
    public function getSettings()
    {
        // અહીં તમે ડેટાબેઝમાંથી ડેટા લાવી શકો, અત્યારે ડેમો ડેટા મોકલીએ છીએ
        return response()->json([
            'profileName' => 'Aarti Sonigra',
            'themeMode' => 'dark',
            'autoRotate' => true,
            'showLabels' => true,
        ], 200);
    }

    
    public function saveSettings(Request $request)
    {
        // ફ્રન્ટએન્ડમાંથી આવતા ડેટાને વેલિડેટ કરો
        $validatedData = $request->validate([
            'profileName' => 'required|string|max:255',
            'themeMode' => 'string',
            'autoRotate' => 'boolean',
            'showLabels' => 'boolean',
        ]);

        return response()->json([
            'success' => true,
            'message' => '💾 all system settings saved in configuration system'
        ], 200);
    }
}
