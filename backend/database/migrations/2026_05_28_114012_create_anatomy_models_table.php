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
       
        Schema::create('anatomy_models', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // Organs, Anatomy, Systems
            $table->string('source_path'); // GLB ફાઇલની લિંક (e.g., /storage/models/lungs.glb)
            $table->text('desc');
            $table->string('medical_focus');
            $table->string('status'); // NORMAL, ANOMALY, SCANNING
            $table->string('telemetry');
            $table->string('metadata');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anatomy_models');
    }
};