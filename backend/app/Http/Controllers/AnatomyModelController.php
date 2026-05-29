<?php

namespace App\Http\Controllers;

use App\Models\AnatomyModel;
use Illuminate\Http\Request;

class AnatomyController extends Controller
{
    // બધા 3D મોડેલ્સ ફ્રન્ટએન્ડને મોકલવા માટે
    public function index()
    {
        $models = AnatomyModel::all()->map(function($model) {
            // જો ક્લાઉડ કે સ્ટોરેજમાં ફાઇલ હોય તો તેની લાઈવ ફૂલ URL બનાવવા માટે
            if (!filter_var($model->source_path, FILTER_VALIDATE_URL)) {
                $model->source_path = asset($model->source_path); 
            }
            return $model;
        });

        return response()->json($models, 200);
    }
}