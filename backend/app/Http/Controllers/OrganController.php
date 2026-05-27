<?php

namespace App\Http\Controllers;

use App\Models\Organ;
use Illuminate\Http\Request;

class OrganController extends Controller
{
    // Fetch all anatomy organs from the database
    public function index()
    {
        $organs = Organ::all();
        return response()->json($organs, 200);
    }

    // Fetch a single anatomy organ by ID
    public function show($id)
    {
        $organ = Organ::find($id);

        if (!$organ) {
            return response()->json(['message' => 'Organ not found'], 404);
        }

        return response()->json($organ, 200);
    }
}
