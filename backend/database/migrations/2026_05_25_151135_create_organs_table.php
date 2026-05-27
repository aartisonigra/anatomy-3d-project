<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organs', function (Blueprint $table) {
            $table->id();
            $table->string('name');             // ઓર્ગનનું નામ (e.g., Heart, Skull)
            $table->string('latin_name');       // લેટિન/મેડિકલ નામ (e.g., Cor, Cranium)
            $table->string('category');         // કેટેગરી (Skeletal, Muscular, Nervous)
            $table->text('description');        // ઓર્ગનની પૂરેપૂરી માહિતી
            $table->string('model_url');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organs');
    }
};
