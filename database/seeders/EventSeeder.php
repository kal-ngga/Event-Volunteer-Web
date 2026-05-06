<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // ============================================================
        // Pastikan ada minimal 3 kategori (sesuai DatabaseSeeder)
        // 1 = Seminar, 2 = Workshop, 3 = Volunteer Sosial
        // Tambah kategori baru jika perlu
        // ============================================================
        $extraCategories = [
            ['name' => 'Konser & Musik', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Olahraga', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Pendidikan', 'created_at' => $now, 'updated_at' => $now],
        ];
        DB::table('event_categories')->insert($extraCategories);
        // Kategori sekarang: 1=Seminar, 2=Workshop, 3=Volunteer Sosial, 4=Konser & Musik, 5=Olahraga, 6=Pendidikan

        // ============================================================
        // 10 Events — 5 GRATIS + 5 BERBAYAR
        // Semua di-assign ke eo_id = 2 (BEM Telkom)
        // ============================================================
        $events = [
            // --- GRATIS (is_paid = false) ---
            [
                'eo_id'       => 2,
                'category_id' => 3, // Volunteer Sosial
                'title'       => 'Bakti Sosial Desa Harapan',
                'location'    => 'Desa Harapan, Bandung Selatan',
                'start_date'  => $now->copy()->addDays(5),
                'end_date'    => $now->copy()->addDays(6),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => false,
                'price'       => null,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'eo_id'       => 2,
                'category_id' => 1, // Seminar
                'title'       => 'Seminar Kesehatan Mental Mahasiswa',
                'location'    => 'Aula Gedung Serbaguna',
                'start_date'  => $now->copy()->addDays(8),
                'end_date'    => $now->copy()->addDays(8),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => false,
                'price'       => null,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'eo_id'       => 2,
                'category_id' => 6, // Pendidikan
                'title'       => 'Mengajar Anak-Anak di Pelosok',
                'location'    => 'SDN Cikutra 04, Bandung',
                'start_date'  => $now->copy()->addDays(12),
                'end_date'    => $now->copy()->addDays(14),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => false,
                'price'       => null,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'eo_id'       => 2,
                'category_id' => 3, // Volunteer Sosial
                'title'       => 'Penghijauan Kampus Bersama',
                'location'    => 'Area Taman Telkom University',
                'start_date'  => $now->copy()->addDays(20),
                'end_date'    => $now->copy()->addDays(20),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => false,
                'price'       => null,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'eo_id'       => 2,
                'category_id' => 5, // Olahraga
                'title'       => 'Fun Run Charity 5K',
                'location'    => 'Lapangan Gasibu, Bandung',
                'start_date'  => $now->copy()->addDays(25),
                'end_date'    => $now->copy()->addDays(25),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => false,
                'price'       => null,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],

            // --- BERBAYAR (is_paid = true) ---
            [
                'eo_id'       => 2,
                'category_id' => 2, // Workshop
                'title'       => 'Workshop Fotografi & Videografi',
                'location'    => 'Studio Kreatif Lt. 2',
                'start_date'  => $now->copy()->addDays(7),
                'end_date'    => $now->copy()->addDays(8),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => true,
                'price'       => 75000,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'eo_id'       => 2,
                'category_id' => 4, // Konser & Musik
                'title'       => 'Konser Amal "Suara untuk Negeri"',
                'location'    => 'Sasana Budaya Ganesha',
                'start_date'  => $now->copy()->addDays(14),
                'end_date'    => $now->copy()->addDays(14),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => true,
                'price'       => 100000,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'eo_id'       => 2,
                'category_id' => 1, // Seminar
                'title'       => 'Seminar Nasional AI & Big Data',
                'location'    => 'Auditorium Telkom University',
                'start_date'  => $now->copy()->addDays(18),
                'end_date'    => $now->copy()->addDays(19),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => true,
                'price'       => 50000,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'eo_id'       => 2,
                'category_id' => 2, // Workshop
                'title'       => 'Bootcamp Web Development Full-Stack',
                'location'    => 'Lab Komputer Gedung B',
                'start_date'  => $now->copy()->addDays(22),
                'end_date'    => $now->copy()->addDays(24),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => true,
                'price'       => 150000,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'eo_id'       => 2,
                'category_id' => 5, // Olahraga
                'title'       => 'Turnamen Futsal Antar Fakultas',
                'location'    => 'GOR Telkom University',
                'start_date'  => $now->copy()->addDays(30),
                'end_date'    => $now->copy()->addDays(31),
                'image_path'  => null,
                'status'      => 'published',
                'is_paid'     => true,
                'price'       => 25000,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
        ];

        DB::table('events')->insert($events);

        // ============================================================
        // Ambil ID event yang baru diinsert
        // Asumsi: DatabaseSeeder sudah insert 2 event (id 1 & 2)
        // Jadi event baru dimulai dari id 3
        // ============================================================
        $startId = 3;

        // ============================================================
        // Event Details untuk 10 event baru
        // ============================================================
        $details = [
            [
                'event_id'         => $startId,
                'description'      => 'Kegiatan bakti sosial memberikan bantuan sembako dan layanan kesehatan gratis kepada warga Desa Harapan yang membutuhkan.',
                'activity_details' => 'Pagi: Pembagian sembako. Siang: Pemeriksaan kesehatan gratis. Sore: Kegiatan bersama anak-anak.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'event_id'         => $startId + 1,
                'description'      => 'Seminar interaktif membahas pentingnya kesehatan mental bagi mahasiswa di era digital.',
                'activity_details' => 'Sesi 1: Keynote oleh Psikolog. Sesi 2: Diskusi Panel. Sesi 3: Workshop Self-Care.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'event_id'         => $startId + 2,
                'description'      => 'Program pengajaran sukarela untuk anak-anak SD di daerah kurang mampu selama 3 hari.',
                'activity_details' => 'Hari 1: Pengenalan & ice-breaking. Hari 2: Kelas Matematika & Bahasa. Hari 3: Kelas Seni & Penutupan.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'event_id'         => $startId + 3,
                'description'      => 'Aksi penanaman 500 pohon di area kampus untuk menciptakan lingkungan yang lebih hijau dan asri.',
                'activity_details' => 'Pagi: Briefing & pembagian kelompok. Siang: Penanaman pohon. Sore: Dokumentasi & penutupan.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'event_id'         => $startId + 4,
                'description'      => 'Lomba lari santai 5 kilometer untuk mengumpulkan donasi bagi anak-anak panti asuhan.',
                'activity_details' => '06:00 Registrasi. 07:00 Pemanasan. 07:30 Start lari. 09:00 Penyerahan hadiah & donasi.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'event_id'         => $startId + 5,
                'description'      => 'Workshop hands-on belajar teknik fotografi dan videografi profesional menggunakan DSLR dan smartphone.',
                'activity_details' => 'Hari 1: Dasar fotografi, komposisi, lighting. Hari 2: Videografi, editing, dan showcase karya.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'event_id'         => $startId + 6,
                'description'      => 'Konser musik amal menampilkan band-band lokal dan nasional. Seluruh hasil tiket disumbangkan untuk pendidikan.',
                'activity_details' => '16:00 Opening Act. 18:00 Band Lokal. 20:00 Headliner. 22:00 Penutupan & pengumuman donasi.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'event_id'         => $startId + 7,
                'description'      => 'Seminar nasional 2 hari menghadirkan pakar AI dan Big Data dari berbagai perusahaan teknologi terkemuka.',
                'activity_details' => 'Hari 1: Keynote AI, Panel Machine Learning. Hari 2: Workshop Big Data, Hackathon mini.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'event_id'         => $startId + 8,
                'description'      => 'Bootcamp intensif 3 hari membangun aplikasi web full-stack dengan React, Laravel, dan deployment.',
                'activity_details' => 'Hari 1: Frontend React.js. Hari 2: Backend Laravel API. Hari 3: Integrasi, testing & deploy.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'event_id'         => $startId + 9,
                'description'      => 'Turnamen futsal seru antar fakultas memperebutkan piala rektor dan hadiah jutaan rupiah.',
                'activity_details' => 'Hari 1: Babak penyisihan grup. Hari 2: Semifinal, Final & penyerahan hadiah.',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
        ];

        DB::table('event_details')->insert($details);

        // ============================================================
        // Event Divisions — masing-masing event punya 2 divisi
        // ============================================================
        $divisions = [
            // Event 3: Bakti Sosial Desa Harapan
            ['event_id' => $startId,     'division_name' => 'Distribusi Sembako',    'quota' => 5, 'description' => 'Mendistribusikan paket sembako ke rumah-rumah warga.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId,     'division_name' => 'Posko Kesehatan',       'quota' => 3, 'description' => 'Membantu tenaga medis saat pemeriksaan kesehatan gratis.', 'created_at' => $now, 'updated_at' => $now],

            // Event 4: Seminar Kesehatan Mental
            ['event_id' => $startId + 1, 'division_name' => 'Moderator & MC',        'quota' => 2, 'description' => 'Memandu jalannya sesi seminar dan diskusi.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId + 1, 'division_name' => 'Dokumentasi',            'quota' => 3, 'description' => 'Mengambil foto dan video selama seminar berlangsung.', 'created_at' => $now, 'updated_at' => $now],

            // Event 5: Mengajar Anak-Anak
            ['event_id' => $startId + 2, 'division_name' => 'Pengajar Matematika',   'quota' => 4, 'description' => 'Mengajarkan Matematika dasar untuk siswa SD.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId + 2, 'division_name' => 'Pengajar Seni',         'quota' => 3, 'description' => 'Mengajarkan kegiatan seni, menggambar, dan musik.', 'created_at' => $now, 'updated_at' => $now],

            // Event 6: Penghijauan Kampus
            ['event_id' => $startId + 3, 'division_name' => 'Tim Tanam',             'quota' => 10, 'description' => 'Menanam dan merawat bibit pohon di titik yang ditentukan.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId + 3, 'division_name' => 'Logistik & Air',        'quota' => 4,  'description' => 'Menyiapkan peralatan tanam dan distribusi air.', 'created_at' => $now, 'updated_at' => $now],

            // Event 7: Fun Run Charity 5K
            ['event_id' => $startId + 4, 'division_name' => 'Marshal Jalur',         'quota' => 6, 'description' => 'Menjaga keamanan dan mengarahkan peserta di sepanjang jalur lari.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId + 4, 'division_name' => 'Pos Hidrasi',           'quota' => 4, 'description' => 'Membagikan air minum di titik-titik pemberhentian.', 'created_at' => $now, 'updated_at' => $now],

            // Event 8: Workshop Fotografi & Videografi (Berbayar)
            ['event_id' => $startId + 5, 'division_name' => 'Asisten Instruktur',    'quota' => 3, 'description' => 'Mendampingi peserta saat sesi praktik fotografi.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId + 5, 'division_name' => 'Perlengkapan Studio',   'quota' => 2, 'description' => 'Menyiapkan lighting, backdrop, dan peralatan studio.', 'created_at' => $now, 'updated_at' => $now],

            // Event 9: Konser Amal (Berbayar)
            ['event_id' => $startId + 6, 'division_name' => 'Stage Crew',            'quota' => 5, 'description' => 'Membantu set-up dan tear-down panggung konser.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId + 6, 'division_name' => 'Ticketing & Gerbang',   'quota' => 4, 'description' => 'Mengecek tiket dan mengarahkan penonton masuk venue.', 'created_at' => $now, 'updated_at' => $now],

            // Event 10: Seminar Nasional AI & Big Data (Berbayar)
            ['event_id' => $startId + 7, 'division_name' => 'Technical Support',     'quota' => 3, 'description' => 'Mengelola proyektor, sound system, dan koneksi internet.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId + 7, 'division_name' => 'Registrasi Peserta',    'quota' => 4, 'description' => 'Melakukan check-in peserta dan membagikan ID card.', 'created_at' => $now, 'updated_at' => $now],

            // Event 11: Bootcamp Web Dev (Berbayar)
            ['event_id' => $startId + 8, 'division_name' => 'Mentor Pendamping',     'quota' => 4, 'description' => 'Mendampingi peserta saat coding session dan debugging.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId + 8, 'division_name' => 'Konsumsi & Logistik',   'quota' => 2, 'description' => 'Mengatur snack, makan siang, dan kebutuhan peserta.', 'created_at' => $now, 'updated_at' => $now],

            // Event 12: Turnamen Futsal (Berbayar)
            ['event_id' => $startId + 9, 'division_name' => 'Wasit & Pencatat Skor', 'quota' => 4, 'description' => 'Memimpin pertandingan dan mencatat skor setiap tim.', 'created_at' => $now, 'updated_at' => $now],
            ['event_id' => $startId + 9, 'division_name' => 'Komentator & Humas',    'quota' => 2, 'description' => 'Membawakan komentari pertandingan dan mengelola media sosial.', 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('event_divisions')->insert($divisions);
    }
}
