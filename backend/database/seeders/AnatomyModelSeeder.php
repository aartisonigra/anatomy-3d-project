<?php

namespace Database\Seeders;

use App\Models\AnatomyModel;
use Illuminate\Database\Seeder;

class AnatomyModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $models = [
            [
                'title' => 'Human Heart',
                'category' => 'Organs',
                'source_path' => 'storage/models/heart.glb',
                'desc' => 'Detailed 3D structure of the human heart showing ventricles and valves.',
                'medical_focus' => 'Cardiology',
                'status' => 'NORMAL',
                'telemetry' => 'BPM: 72 | Flow: Steady',
                'metadata' => 'Scale: 1:1 | High-Poly',
            ],
            [
                'title' => 'Respiratory System',
                'category' => 'Systems',
                'source_path' => 'storage/models/lungs.glb',
                'desc' => 'Complete respiratory tract including trachea, bronchi, and lungs.',
                'medical_focus' => 'Pulmonology',
                'status' => 'ANOMALY',
                'telemetry' => 'Capacity: 4.2L | Node detected in left lobe',
                'metadata' => 'Pathology Model v2',
            ],
            [
                'title' => 'Knee Joint',
                'category' => 'Anatomy',
                'source_path' => 'storage/models/knee.glb',
                'desc' => '3D representation of the knee joint, ligaments, and meniscus.',
                'medical_focus' => 'Orthopedics',
                'status' => 'SCANNING',
                'telemetry' => 'Flexion: 130° | Extension: 0°',
                'metadata' => 'Rigged for animation',
            ],
            // 💡 તમે આ રીતે જ તમારા બાકીના બધા (૨૬) મોડેલ્સનો ડેટા અહીં નીચે એડ કરી શકો છો...
        ];

        foreach ($models as $model) {
            AnatomyModel::create($model);
        }
    }
}