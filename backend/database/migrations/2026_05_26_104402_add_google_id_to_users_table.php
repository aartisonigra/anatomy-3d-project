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
        Schema::table('users', function (Blueprint $table) {
            // નવું google_id કોલમ ઉમેરો
            $table->string('google_id')->nullable()->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // જો માઈગ્રેશન રોલબેક થાય તો કોલમ ડિલીટ કરો
            $table->dropColumn('google_id');
        });
    }
};
