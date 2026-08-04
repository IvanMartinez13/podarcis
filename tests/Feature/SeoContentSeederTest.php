<?php

use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SiteSetting;
use Database\Seeders\SeoContentSeeder;

it('seeds the SEO architecture idempotently and retires placeholders', function () {
    Post::factory()->published()->create(['slug' => 'como-preparar-una-auditoria-ambiental']);

    $this->seed(SeoContentSeeder::class);
    $this->seed(SeoContentSeeder::class);

    expect(Service::query()->published()->count())->toBe(12)
        ->and(Service::query()->published()->where('kind', 'digital')->count())->toBe(3)
        ->and(Page::query()->published()->where('slug', 'like', 'servicios/%')->count())->toBe(9)
        ->and(Post::query()->where('slug', 'como-preparar-una-auditoria-ambiental')->value('status'))->toBe('draft')
        ->and(SiteSetting::query()->where('singleton_key', 'site')->firstOrFail()->contact)
        ->toMatchArray([
            'legal_name' => 'PODARCIS SL',
            'locality' => 'Palma de Mallorca',
            'country' => 'ES',
        ]);
});
