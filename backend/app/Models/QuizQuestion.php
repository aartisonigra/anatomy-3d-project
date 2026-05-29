<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'type',
        'difficulty',
        'question',
        'options',
        'answer'
    ];

    // Automatically convert JSON string to PHP Array & vice-versa
    protected $casts = [
        'options' => 'array',
    ];
}
