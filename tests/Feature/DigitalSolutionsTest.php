<?php

use App\Models\Lead;
use App\Models\Page;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('digital solutions index only exposes published digital services with explicit dto fields', function () {
    $this->withoutVite();

    Service::factory()->published()->create([
        'title' => 'Consultoría',
        'kind' => 'consulting',
    ]);
    Service::factory()->create([
        'title' => 'Digital en borrador',
        'kind' => 'digital',
    ]);
    Service::factory()->create([
        'title' => 'Digital con publicación futura',
        'kind' => 'digital',
        'status' => 'published',
        'published_at' => now()->addDay(),
    ]);
    Service::factory()->published()->create([
        'title' => 'Plataforma ambiental',
        'kind' => 'digital',
        'logo_image' => 'cms/services/logos/product.png',
        'logo_image_alt' => 'Logotipo de la plataforma',
    ]);

    $this->get(route('digital-solutions.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('digital-solutions/index', false)
            ->has('digitalSolutions', 1)
            ->where('digitalSolutions.0.title', 'Plataforma ambiental')
            ->where('digitalSolutions.0.kind', 'digital')
            ->where('digitalSolutions.0.logoImageAlt', 'Logotipo de la plataforma')
            ->missing('digitalSolutions.0.status'));

    $this->get(route('services.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('services', 1)
            ->where('services.0.title', 'Consultoría'));
});

test('admin can upload replace and remove a service logo', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $service = Service::factory()->create();
    $payload = [
        'title' => $service->title,
        'slug' => $service->slug,
        'kind' => 'digital',
        'excerpt' => $service->excerpt,
        'description' => $service->description,
        'icon' => $service->icon,
        'featured_image' => '',
        'featured_image_alt' => '',
        'logo_image_alt' => 'Logotipo del producto',
        'blocks' => null,
        'seo_title' => '',
        'seo_description' => '',
        'is_featured' => false,
        'sort_order' => 10,
        'status' => 'draft',
        'published_at' => null,
    ];

    $this->actingAs($user)
        ->patch(route('admin.services.update', $service), [
            ...$payload,
            'logo_image_upload' => UploadedFile::fake()->image('logo.png', 400, 200),
        ])
        ->assertRedirect(route('admin.services.index'));

    $firstLogo = $service->refresh()->logo_image;

    expect($firstLogo)->toEndWith('.png');
    Storage::disk('public')->assertExists($firstLogo);

    $this->actingAs($user)
        ->patch(route('admin.services.update', $service), [
            ...$payload,
            'logo_image_upload' => UploadedFile::fake()->image('replacement.png', 400, 200),
        ])
        ->assertRedirect(route('admin.services.index'));

    $replacementLogo = $service->refresh()->logo_image;
    Storage::disk('public')->assertMissing($firstLogo);
    Storage::disk('public')->assertExists($replacementLogo);

    $this->actingAs($user)
        ->patch(route('admin.services.update', $service), [
            ...$payload,
            'remove_logo_image' => true,
        ])
        ->assertRedirect(route('admin.services.index'));

    expect($service->refresh()->logo_image)->toBeNull();
    Storage::disk('public')->assertMissing($replacementLogo);
});

test('home blocks expose the new contract and normalize legacy digital content', function () {
    Page::factory()->published()->create([
        'slug' => 'inicio',
        'blocks' => [
            'hero' => ['title' => 'Decisiones con impacto real'],
            'digital' => [
                'benefits' => [
                    ['id' => 'data', 'title' => 'Datos fiables', 'description' => 'Trazabilidad'],
                ],
                'cta' => ['label' => 'Ver soluciones', 'href' => '/soluciones-digitales'],
            ],
            'testimonials' => ['backgroundImage' => 'cms/pages/home/testimonials/background.webp'],
        ],
    ]);
    Testimonial::factory()->published()->featured()->create([
        'avatar' => 'cms/testimonials/avatars/client.png',
    ]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('home.blocks.hero.title', 'Decisiones con impacto real')
            ->where('home.blocks.digital.features.0.id', 'data')
            ->where('home.blocks.digital.primaryCta.href', '/soluciones-digitales')
            ->missing('home.blocks.digital.benefits')
            ->missing('home.blocks.digital.cta')
            ->where('home.blocks.testimonials.backgroundImage', fn (string $value): bool => str_ends_with($value, '/storage/cms/pages/home/testimonials/background.webp'))
            ->where('testimonials.0.avatar', fn (string $value): bool => str_ends_with($value, '/storage/cms/testimonials/avatars/client.png')));
});

test('home fixed background upload replaces and removes the stored image', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $page = Page::factory()->published()->create([
        'slug' => 'inicio',
        'blocks' => ['testimonials' => ['title' => 'Testimonios']],
    ]);
    $payload = [
        'title' => $page->title,
        'slug' => 'inicio',
        'excerpt' => $page->excerpt,
        'content' => $page->content,
        'blocks' => ['testimonials' => ['title' => 'Testimonios']],
        'seo_title' => $page->seo_title,
        'seo_description' => $page->seo_description,
        'og_image' => null,
        'status' => 'published',
        'published_at' => now()->toDateTimeString(),
    ];

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), [
            ...$payload,
            'testimonials_background_image_upload' => UploadedFile::fake()->image('forest.jpg', 1200, 700),
        ])
        ->assertRedirect(route('admin.pages.index'));

    $firstImage = data_get($page->refresh()->blocks, 'testimonials.backgroundImage');
    Storage::disk('public')->assertExists($firstImage);

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), [
            ...$payload,
            'testimonials_background_image_upload' => UploadedFile::fake()->image('forest-new.jpg', 1200, 700),
        ])
        ->assertRedirect(route('admin.pages.index'));

    $replacementImage = data_get($page->refresh()->blocks, 'testimonials.backgroundImage');
    Storage::disk('public')->assertMissing($firstImage);
    Storage::disk('public')->assertExists($replacementImage);

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), [
            ...$payload,
            'remove_testimonials_background_image' => true,
        ])
        ->assertRedirect(route('admin.pages.index'));

    expect(data_get($page->refresh()->blocks, 'testimonials.backgroundImage'))->toBeNull();
    Storage::disk('public')->assertMissing($replacementImage);
});

test('contact accepts and persists the digital solution demo source', function () {
    config()->set('services.turnstile.secret_key', 'secret');
    Http::fake([
        'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response(['success' => true]),
    ]);

    $this->get(route('contact.index', ['source' => 'digital_solution_demo']))
        ->assertInertia(fn (Assert $page) => $page->where('contactSource', 'digital_solution_demo'));

    $this->post(route('contact.store'), [
        'name' => 'Cliente digital',
        'email' => 'cliente@example.com',
        'message' => 'Quiero solicitar una demostración.',
        'privacy_accepted' => true,
        'cf_turnstile_response' => 'token',
        'source' => 'digital_solution_demo',
    ])->assertRedirect();

    expect(Lead::query()->sole()->source)->toBe('digital_solution_demo');
});

test('admin user seeder is opt in and never overwrites an existing account', function () {
    config()->set('admin', [
        'name' => 'Administración',
        'email' => 'admin@example.com',
        'password' => 'InitialPassword123!',
    ]);

    $this->seed(AdminUserSeeder::class);

    $user = User::query()->sole();

    expect($user->name)->toBe('Administración')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and(Hash::check('InitialPassword123!', $user->password))->toBeTrue();

    config()->set('admin.name', 'Nombre reemplazado');
    config()->set('admin.password', 'ReplacementPassword123!');
    $this->seed(AdminUserSeeder::class);

    $user->refresh();

    expect($user->name)->toBe('Administración')
        ->and(Hash::check('InitialPassword123!', $user->password))->toBeTrue()
        ->and(User::query()->count())->toBe(1);
});

test('admin user seeder requires explicit credentials in production', function () {
    config()->set('admin', [
        'name' => null,
        'email' => null,
        'password' => null,
    ]);
    $this->app->detectEnvironment(fn (): string => 'production');

    expect(fn () => (new AdminUserSeeder)->run())
        ->toThrow(RuntimeException::class, 'PODARCIS_ADMIN_NAME');
});
