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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('singleton_key')->default('site')->unique();
            $table->text('brand_description')->nullable();
            $table->json('navigation')->nullable();
            $table->json('header_cta')->nullable();
            $table->json('contact')->nullable();
            $table->json('social_links')->nullable();
            $table->json('footer_groups')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
