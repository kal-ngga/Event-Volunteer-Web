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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eo_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('event_categories')->onDelete('cascade');
            
            $table->string('title');
            $table->string('location');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            
            // Ini kolom untuk menyimpan path gambar katalog Anda
            $table->string('image_path')->nullable(); 
            
            $table->enum('status', ['draft', 'published', 'completed'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
