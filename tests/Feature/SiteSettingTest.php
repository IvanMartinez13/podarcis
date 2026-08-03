<?php

use App\Models\Page;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use App\Models\User;
use Database\Seeders\CmsSeeder;
use Database\Seeders\SiteSettingSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('site settings are shared through an explicit public dto', function () {
    SiteSetting::factory()->create([
        'brand_description' => 'Descripción corporativa',
        'navigation' => [
            ['id' => 'services', 'label' => 'Servicios', 'href' => '/servicios'],
        ],
        'header_cta' => ['label' => 'Contacto', 'href' => '/contacto'],
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('site.brandDescription', 'Descripción corporativa')
            ->where('site.navigation.0.href', '/servicios')
            ->where('site.headerCta.href', '/contacto')
            ->missing('site.id')
            ->missing('site.singletonKey'));
});

test('authenticated users can edit the singleton without create or delete routes', function () {
    $this->withoutVite();

    $user = User::factory()->create();
    SiteSetting::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.site-settings.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/site-settings/edit', false)
            ->has('siteSettings.navigation'));

    expect(app('router')->has('admin.site-settings.create'))->toBeFalse()
        ->and(app('router')->has('admin.site-settings.destroy'))->toBeFalse();
});

test('site settings update validates nested links and rejects unsafe schemes', function () {
    $user = User::factory()->create();
    SiteSetting::factory()->create();

    $this->actingAs($user)
        ->patch(route('admin.site-settings.update'), [
            'brand_description' => 'Nueva descripción',
            'navigation' => [
                ['id' => 'unsafe', 'label' => 'No seguro', 'href' => 'javascript:alert(1)'],
            ],
        ])
        ->assertSessionHasErrors(['navigation.0.href']);

    $this->actingAs($user)
        ->patch(route('admin.site-settings.update'), [
            'brand_description' => 'Nueva descripción',
            'navigation' => [
                ['id' => 'services', 'label' => 'Servicios', 'href' => '/servicios'],
            ],
            'header_cta' => ['label' => 'Escríbenos', 'href' => 'mailto:contacto@podarcis.com'],
        ])
        ->assertRedirect(route('admin.site-settings.edit'))
        ->assertSessionHasNoErrors();

    expect(SiteSetting::query()->sole()->brand_description)->toBe('Nueva descripción');
});

test('site settings can update home hero content from cms', function () {
    $user = User::factory()->create();
    SiteSetting::factory()->create();
    Page::factory()->published()->create([
        'slug' => 'inicio',
        'blocks' => [
            'hero' => [
                'title' => 'Título anterior',
            ],
        ],
    ]);

    $this->actingAs($user)
        ->patch(route('admin.site-settings.update'), [
            'brand_description' => 'Nueva descripción',
            'hero' => [
                'eyebrow' => 'Nuevo antetítulo',
                'title' => 'Nuevo título hero',
                'highlightText' => 'impacto real',
                'primaryCta' => [
                    'label' => 'Contactar',
                    'href' => '/contacto',
                ],
                'secondaryCta' => [
                    'label' => 'Servicios',
                    'href' => '/servicios',
                ],
            ],
        ])
        ->assertRedirect(route('admin.site-settings.edit'))
        ->assertSessionHasNoErrors();

    $hero = Page::query()->where('slug', 'inicio')->sole()->blocks['hero'];

    expect($hero['eyebrow'])->toBe('Nuevo antetítulo')
        ->and($hero['title'])->toBe('Nuevo título hero')
        ->and($hero['highlightText'])->toBe('impacto real')
        ->and($hero['primaryCta']['href'])->toBe('/contacto')
        ->and($hero['secondaryCta']['href'])->toBe('/servicios');
});

test('site settings seeder is idempotent', function () {
    $this->seed(SiteSettingSeeder::class);
    SiteSetting::query()->sole()->update([
        'brand_description' => 'Descripción editada desde el CMS',
    ]);
    $this->seed(SiteSettingSeeder::class);

    expect(SiteSetting::query()->count())->toBe(1)
        ->and(SiteSetting::query()->sole()->brand_description)->toBe('Descripción editada desde el CMS');
});

test('cms seeder creates idempotent public page records without provisional claims', function () {
    $this->seed(CmsSeeder::class);
    Page::query()->where('slug', 'inicio')->update([
        'excerpt' => 'Copy editado desde el CMS',
    ]);
    $this->seed(CmsSeeder::class);

    expect(Page::query()->whereIn('slug', ['inicio', 'servicios', 'blog', 'casos-de-exito'])->count())->toBe(4)
        ->and(Page::query()->where('slug', 'inicio')->value('excerpt'))->toBe('Copy editado desde el CMS')
        ->and(Service::query()->where('kind', 'digital')->count())->toBe(4)
        ->and(SuccessCase::query()->whereNotNull('client_name')->count())->toBe(0)
        ->and(SuccessCase::query()->where('status', 'published')->count())->toBe(0)
        ->and(Testimonial::query()->where('status', 'published')->count())->toBe(0);
});

test('home exposes only the published inicio page', function () {
    Page::factory()->create([
        'slug' => 'inicio',
        'status' => 'draft',
        'blocks' => ['hero' => ['title' => 'Borrador']],
    ]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page->where('home', null));

    Page::query()->where('slug', 'inicio')->update([
        'status' => 'published',
        'published_at' => now()->subMinute(),
    ]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('home.slug', 'inicio')
            ->where('home.blocks.hero.title', 'Borrador'));
});

test('public content includes presentation fields and suppresses seed placeholders', function () {
    $this->withoutVite();

    $service = Service::factory()->published()->featured()->create([
        'kind' => 'digital',
        'featured_image' => 'https://placehold.co/1200x760?text=Servicio',
        'featured_image_alt' => 'Plataforma ambiental',
    ]);

    SuccessCase::factory()->published()->for($service)->create([
        'client_name' => 'Cliente PODARCIS',
        'featured_image' => 'https://placehold.co/1200x760?text=Caso',
        'featured_image_alt' => 'Proyecto ambiental',
        'seo_title' => 'Caso técnico',
        'seo_description' => 'Descripción SEO del caso.',
    ]);

    $this->get(route('digital-solutions.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('digitalSolutions.0.kind', 'digital')
            ->where('digitalSolutions.0.featuredImage', null)
            ->where('digitalSolutions.0.imageAlt', 'Plataforma ambiental'));

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('successCases.0.clientName', null)
            ->where('successCases.0.featuredImage', null));

    $this->get(route('success-cases.show', SuccessCase::query()->sole()))
        ->assertInertia(fn (Assert $page) => $page
            ->where('successCase.seoTitle', 'Caso técnico')
            ->where('successCase.seoDescription', 'Descripción SEO del caso.'));
});

test('home page blocks require stable identifiers and safe cta urls', function () {
    $user = User::factory()->create();
    $page = Page::factory()->published()->create(['slug' => 'inicio']);

    $payload = [
        'title' => 'Inicio',
        'slug' => 'inicio',
        'excerpt' => 'Contenido principal.',
        'content' => null,
        'blocks' => [
            'hero' => [
                'highlightText' => 'impacto real',
                'primaryCta' => ['label' => 'Contacto', 'href' => 'javascript:alert(1)'],
            ],
            'metrics' => [
                ['id' => 'impact', 'value' => '360º', 'label' => 'visión técnica'],
            ],
            'digital' => [
                'title' => 'Soluciones digitales',
                'description' => 'Herramientas para tomar decisiones.',
                'features' => [
                    ['id' => 'data', 'icon' => 'chart', 'title' => 'Datos'],
                    ['id' => 'data', 'icon' => 'shield', 'title' => 'Cumplimiento'],
                ],
                'primaryCta' => ['label' => 'Ver soluciones', 'href' => '/soluciones-digitales'],
                'secondaryCta' => ['label' => 'Solicitar demo', 'href' => '/contacto?source=digital_solution_demo'],
            ],
        ],
        'seo_title' => 'Inicio',
        'seo_description' => 'Descripción',
        'og_image' => null,
        'status' => 'published',
        'published_at' => now()->toDateTimeString(),
    ];

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), $payload)
        ->assertSessionHasErrors([
            'blocks.hero.primaryCta.href',
            'blocks.digital.features.1.id',
        ]);

    data_set($payload, 'blocks.hero.primaryCta.href', '/contacto');
    data_set($payload, 'blocks.digital.features.1.id', 'compliance');

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), $payload)
        ->assertRedirect(route('admin.pages.index'))
        ->assertSessionHasNoErrors();

    expect($page->refresh()->blocks['metrics'][0]['id'])->toBe('impact');
});
