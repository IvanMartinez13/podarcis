<?php

use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SiteSetting;
use Inertia\Testing\AssertableInertia as Assert;

it('serves the Spanish application shell and shared organization data', function () {
    SiteSetting::factory()->create([
        'contact' => [
            'legal_name' => 'PODARCIS SL',
            'phone' => '+34 871 961 697',
            'street_address' => 'C/ Ter, 27',
            'locality' => 'Palma de Mallorca',
            'country' => 'ES',
        ],
    ]);

    $this->get('/')
        ->assertOk()
        ->assertSee('lang="es"', false)
        ->assertSee('PODARCIS')
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('seo.siteName', 'PODARCIS')
            ->where('seo.organization.name', 'PODARCIS SL')
            ->where('seo.organization.address.addressLocality', 'Palma de Mallorca'));

    expect(config('inertia.ssr.bundle'))->toEndWith('bootstrap/ssr/app.js');
});

it('publishes only indexable records in the XML sitemap', function () {
    $page = Page::factory()->published()->create(['slug' => 'inicio']);
    $service = Service::factory()->published()->create(['slug' => 'estudios-ambientales']);
    $post = Post::factory()->published()->create(['slug' => 'articulo-publicado']);
    Page::factory()->create(['slug' => 'borrador']);

    $this->get('/sitemap.xml')
        ->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
        ->assertSee(route('home'), false)
        ->assertSee(route('services.show', $service), false)
        ->assertSee(route('blog.show', $post), false)
        ->assertDontSee('borrador');

    expect($page->status)->toBe('published');
});

it('paginates the public blog with indexable links', function () {
    Post::factory()->published()->count(13)->create();

    $this->get('/blog')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('blog/index')
            ->has('posts.data', 12)
            ->where('posts.current_page', 1)
            ->where('posts.last_page', 2));
});

it('keeps draft services out of public routes', function () {
    $service = Service::factory()->create(['slug' => 'servicio-borrador']);

    $this->get(route('services.show', $service))->assertNotFound();
});
