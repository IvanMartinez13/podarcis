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
        Schema::table('success_cases', function (Blueprint $table) {
            $table->string('featured_image_alt')->nullable()->after('featured_image');
            $table->string('seo_title')->nullable()->after('service_id');
            $table->text('seo_description')->nullable()->after('seo_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('success_cases', function (Blueprint $table) {
            $table->dropColumn(['featured_image_alt', 'seo_title', 'seo_description']);
        });
    }
};
