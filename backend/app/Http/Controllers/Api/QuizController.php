<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    // 📥 FETCH QUESTIONS: Serves full array to React Native
    public function index()
    {
        $questions = QuizQuestion::all();
        return response()->json($questions, 200);
    }

    // 📤 SAVE RESULT: Placeholder endpoint for when user finishes quiz
    public function saveResult(Request $request)
    {
        $validated = $request->validate([
            'score' => 'required|integer',
            'total_questions' => 'required|integer',
            'accuracy' => 'required|integer',
        ]);

        // Right now, we will return a success response.
        // Later, you can link this to a 'quiz_results' table for Leaderboards!
        return response()->json([
            'success' => true,
            'message' => 'Telemetry diagnostics saved successfully into central neural servers!'
        ], 201);
    }
}
