<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Http;

it('imports published WordPress articles and skips explicitly retired posts', function () {
    User::factory()->create();
    Http::fake([
        'https://www.podarcis.com/wp-json/wp/v2/posts*' => Http::response([
            [
                'slug' => 'registro-balear-huella-carbono',
                'date_gmt' => '2025-01-20T09:00:00',
                'title' => ['rendered' => 'Registro balear de huella de carbono'],
                'excerpt' => ['rendered' => '<p>Guía práctica para organizaciones.</p>'],
                'content' => ['rendered' => '<h2>Requisitos</h2><p>Contenido válido.</p><script>alert(1)</script>'],
                '_embedded' => [
                    'wp:term' => [[['taxonomy' => 'category', 'name' => 'Sostenibilidad', 'slug' => 'sostenibilidad']]],
                    'wp:featuredmedia' => [['source_url' => 'https://www.podarcis.com/image.webp', 'alt_text' => 'Huella de carbono']],
                ],
            ],
            [
                'slug' => 'hola-mundo',
                'title' => ['rendered' => 'Hola mundo'],
                'content' => ['rendered' => '<p>No importar</p>'],
            ],
        ], 200, ['X-WP-TotalPages' => '1']),
    ]);

    $this->artisan('seo:import-wordpress-posts')->assertSuccessful();

    $post = Post::query()->where('slug', 'registro-balear-huella-carbono')->firstOrFail();
    expect($post->status)->toBe('published')
        ->and($post->category?->slug)->toBe('sostenibilidad')
        ->and($post->content)->not->toContain('<script>');

    $this->assertDatabaseMissing('posts', ['slug' => 'hola-mundo']);
});
