<?php

namespace Database\Seeders;

use App\Models\Organ;
use Illuminate\Database\Seeder;

class OrganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert Human Skull data
        Organ::create([
            'name' => 'Human Skull',
            'latin_name' => 'Cranium',
            'category' => 'Skeletal',
            'description' => 'The skull is a bone structure that forms the head in vertebrates. It supports the structures of the face and provides a protective cavity for the brain.',
            'model_url' => 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
        ]);

        // Insert Heart data
        Organ::create([
            'name' => 'Heart',
            'latin_name' => 'Cor',
            'category' => 'Circulatory',
            'description' => 'The heart is a muscular organ in most animals, which pumps blood through the blood vessels of the circulatory system.',
            'model_url' => 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
        ]);
    }
}
