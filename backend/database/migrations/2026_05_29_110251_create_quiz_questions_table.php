<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->string('category');     // Bones, Muscles, Organs etc.
            $table->string('type');         // MCQ Quiz, Timer Quiz, etc.
            $table->string('difficulty');   // Easy, Medium, Hard
            $table->text('question');       // The actual question text
            $table->json('options');        // Array of options: ["Skull", "Femur", ...]
            $table->string('answer');       // The correct answer string
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
