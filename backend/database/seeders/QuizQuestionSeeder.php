<?php

namespace database\seeders;

use Illuminate\Database\Seeder;
use App\Models\QuizQuestion;

class QuizQuestionSeeder extends Seeder
{
    public function run(): void
    {
        QuizQuestion::truncate(); // Clear existing rows to avoid duplication

        $questions = [
            [
                'category' => '🦴 Bones',
                'type' => 'MCQ Quiz',
                'difficulty' => 'Easy',
                'question' => 'Which bone is the longest and strongest in the human body?',
                'options' => ['Skull', 'Femur', 'Rib', 'Ulna'],
                'answer' => 'Femur',
            ],
            [
                'category' => '🫀 Organs',
                'type' => 'Identify Organ Quiz 🔥',
                'difficulty' => 'Medium',
                'question' => 'Identify this 3D highlighted cardiovascular engine:',
                'options' => ['Lungs', 'Heart', 'Liver', 'Kidneys'],
                'answer' => 'Heart',
            ],
            [
                'category' => '🧠 Nervous System',
                'type' => 'Timer Quiz ⏱',
                'difficulty' => 'Hard',
                'question' => 'Which part of the brain controls high-fidelity 3D muscle coordination?',
                'options' => ['Cerebrum', 'Brainstem', 'Cerebellum', 'Medulla'],
                'answer' => 'Cerebellum',
            ]
        ];

        foreach ($questions as $q) {
            QuizQuestion::create($q);
        }
    }
}
