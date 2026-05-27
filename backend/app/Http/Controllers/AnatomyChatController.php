<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnatomyChatController extends Controller
{
    public function handleChat(Request $request)
    {
        // ૧. ઇનપુટ વેલિડેશન
        $request->validate([
            'message' => 'required|string',
        ]);

        $userMessage = $request->input('message');
        
        // ૨. કોન્ફિગમાંથી API Key મેળવવો
        $apiKey = config('services.gemini.api_key'); 

        if (!$apiKey) {
            return response()->json([
                'reply' => '⚠️ Backend Configuration Error: Gemini API Key could not be loaded.'
            ], 500);
        }

        try {
            // ૩. તમારા લોગ લિસ્ટ મુજબના લેટેસ્ટ 'gemini-3.5-flash' મોડેલ પર v1 રિક્વેસ્ટ મોકલવી
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => "You are AnatomyAI, an expert medical and human anatomy assistant. The student is exploring interactive 3D models of human systems (Lungs, Heart, Abdomen, Circulatory, Skeletal, Muscular). Give a very accurate, professional, yet easy-to-understand response in 3-4 lines maximum. Student's question: " . $userMessage
                            ]
                        ]
                    ]
                ]
            ]);

            // ૪. જો રિસ્પોન્સ સક્સેસફુલ હોય તો ડેટા રિટર્ન કરવો
            if ($response->successful()) {
                $result = $response->json();
                $aiReply = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;
                
                if ($aiReply) {
                    return response()->json(['reply' => trim($aiReply)]);
                }
            }

            // ૫. એરર લોગિંગ
            Log::error('Gemini API Failure Response: ' . $response->body());
            return response()->json([
                'reply' => 'Anatomy AI server is currently busy. Please try again shortly.'
            ], 500);

        } catch (\Exception $e) {
            Log::error('AnatomyChatController Exception: ' . $e->getMessage());
            return response()->json([
                'reply' => 'Connection lost: Unable to reach the medical AI engine.'
            ], 500);
        }
    }
}