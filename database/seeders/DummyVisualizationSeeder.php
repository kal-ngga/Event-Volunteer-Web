<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Faker\Factory as Faker;

class DummyVisualizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Create 20 dummy volunteer users
        $userIds = [];
        for ($i = 0; $i < 20; $i++) {
            $userId = DB::table('users')->insertGetId([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'),
                'role_id' => 3, // Volunteer
                'bio' => $faker->sentence,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $userIds[] = $userId;
        }

        // Fetch events and their divisions
        $events = DB::table('events')->get();
        $divisions = DB::table('event_divisions')->get()->groupBy('event_id');

        // Distribution of statuses
        $statuses = ['accepted', 'accepted', 'accepted', 'pending', 'pending', 'rejected'];

        foreach ($events as $event) {
            $eventDivisions = isset($divisions[$event->id]) ? $divisions[$event->id]->pluck('id')->toArray() : null;
            if (!$eventDivisions) continue;

            // Generate a random number of applications per event (5 to 15)
            $appCount = rand(5, 15);
            $shuffledUsers = collect($userIds)->shuffle()->take($appCount);

            foreach ($shuffledUsers as $userId) {
                // Random date within the last 6 months to make the chart look nice
                $appliedAt = Carbon::now()->subDays(rand(0, 180));
                
                $status = $statuses[array_rand($statuses)];
                
                $paymentStatus = 'free';
                if ($event->is_paid) {
                    if ($status === 'accepted') {
                        $paymentStatus = 'paid';
                    } elseif ($status === 'rejected') {
                        $paymentStatus = $faker->randomElement(['failed', 'unpaid']);
                    } else {
                        $paymentStatus = $faker->randomElement(['paid', 'pending', 'unpaid']);
                    }
                }

                DB::table('applications')->insert([
                    'user_id' => $userId,
                    'event_id' => $event->id,
                    'division_id' => $eventDivisions[array_rand($eventDivisions)],
                    'status' => $status,
                    'payment_status' => $paymentStatus,
                    'created_at' => $appliedAt,
                    'updated_at' => $appliedAt,
                ]);

                // Create a notification if accepted or rejected
                if ($status !== 'pending') {
                    $statusLabel = $status === 'accepted' ? 'Diterima' : 'Ditolak';
                    $msg = $status === 'accepted' 
                        ? "Selamat! Lamaran kamu untuk \"{$event->title}\" telah diterima."
                        : "Mohon maaf, lamaran kamu untuk \"{$event->title}\" belum bisa diterima.";
                        
                    DB::table('notifications')->insert([
                        'user_id' => $userId,
                        'title' => "Lamaran {$statusLabel}!",
                        'message' => $msg,
                        'is_read' => false,
                        'created_at' => $appliedAt,
                        'updated_at' => $appliedAt,
                    ]);
                }
            }
        }
        
        $this->command->info('Successfully seeded dummy visualization data!');
    }
}
