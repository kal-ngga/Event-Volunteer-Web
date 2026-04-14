<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // 1. Insert Roles
        DB::table('roles')->insert([
            ['name' => 'admin', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'eo', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'customer', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 2. Insert Users
        DB::table('users')->insert([
            [
                'role_id' => 1, 
                'name' => 'Kalingga Rafif',
                'email' => 'admin@eventconnect.com',
                'password' => Hash::make('password123'),
                'bio' => 'Project Manager',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_id' => 2,
                'name' => 'BEM Telkom',
                'email' => 'eo@bem.com',
                'password' => Hash::make('password123'),
                'bio' => 'Penyelenggara acara mahasiswa.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_id' => 3,
                'name' => 'Budi Volunteer',
                'email' => 'budi@gmail.com',
                'password' => Hash::make('password123'),
                'bio' => 'Mahasiswa aktif mencari pengalaman.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 3. Insert Event Categories
        DB::table('event_categories')->insert([
            ['name' => 'Seminar', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Workshop', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Volunteer Sosial', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 4. Insert Events (1 gratis + 1 berbayar)
        DB::table('events')->insert([
            [
                'eo_id' => 2, 
                'category_id' => 1, 
                'title' => 'Tech Leadership Seminar 2026',
                'location' => 'Auditorium Kampus',
                'start_date' => Carbon::now()->addDays(10),
                'end_date' => Carbon::now()->addDays(11),
                'image_path' => 'events/dummy-banner.jpg', 
                'status' => 'published',
                'is_paid' => false,
                'price' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'eo_id' => 2,
                'category_id' => 2,
                'title' => 'Workshop UI/UX Design Bootcamp',
                'location' => 'Gedung Creativitas Lt. 3',
                'start_date' => Carbon::now()->addDays(15),
                'end_date' => Carbon::now()->addDays(16),
                'image_path' => 'events/dummy-banner-2.jpg',
                'status' => 'published',
                'is_paid' => true,
                'price' => 50000,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 5. Insert Event Details
        DB::table('event_details')->insert([
            [
                'event_id' => 1,
                'description' => 'Seminar nasional membahas masa depan teknologi.',
                'activity_details' => 'Sesi 1: Keynote Speaker. Sesi 2: Panel Diskusi.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'event_id' => 2,
                'description' => 'Workshop intensif 2 hari belajar UI/UX dari praktisi industri.',
                'activity_details' => 'Hari 1: Fundamentals & Figma. Hari 2: Prototyping & User Testing.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 6. Insert Event Divisions
        DB::table('event_divisions')->insert([
            [
                'event_id' => 1,
                'division_name' => 'Dokumentasi',
                'quota' => 2,
                'description' => 'Mengambil foto dan video selama acara.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'event_id' => 1,
                'division_name' => 'Registrasi',
                'quota' => 4,
                'description' => 'Mengecek tiket peserta.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'event_id' => 2,
                'division_name' => 'Mentor Pendamping',
                'quota' => 3,
                'description' => 'Mendampingi peserta workshop saat sesi praktik.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'event_id' => 2,
                'division_name' => 'Logistik & Perlengkapan',
                'quota' => 2,
                'description' => 'Menyiapkan peralatan dan konsumsi.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 7. Insert Applications
        DB::table('applications')->insert([
            [
                'user_id' => 3, 
                'event_id' => 1, 
                'division_id' => 1, 
                'status' => 'pending',
                'payment_status' => 'free',
                'payment_token' => null,
                'applied_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}