<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ડેટાબેઝમાં ઈમેઈલ યુનિક હોવો જોઈએ, એટલે પહેલા ચેક કરો કે યુઝર છે કે નહીં
        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        $this->call([
            OrganSeeder::class,
        ]);
    }
}
