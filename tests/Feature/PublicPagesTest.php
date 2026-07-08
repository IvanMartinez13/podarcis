<?php

use App\Models\Category;
use App\Models\Lead;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config()->set('services.turnstile.site_key', 'test-site-key');
    config()->set('services.turnstile.secret_key', 'test-secret-key');
});

function fakePublicTurnstileVerification(bool $success = true): void
{
    Http::fake([
        'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response(['success' => $success]),
    ]);
}

test('home renders with dynamic cms props', function () {
    Service::factory()->published()->featured()->ordered(10)->create(['title' => 'Servicio destacado']);
    Post::factory()->published()->create(['title' => 'Artículo publicado']);
    SuccessCase::factory()->published()->create(['title' => 'Caso publicado']);
    Testimonial::factory()->published()->featured()->ordered(10)->create(['name' => 'Cliente satisfecho']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('services', 1)
            ->where('services.0.title', 'Servicio destacado')
            ->has('posts', 1)
            ->where('posts.0.title', 'Artículo publicado')
            ->has('successCases', 1)
            ->where('successCases.0.title', 'Caso publicado')
            ->has('testimonials', 1)
            ->where('testimonials.0.name', 'Cliente satisfecho'));
});

test('services index and show expose only published services', function () {
    $published = Service::factory()->published()->ordered(10)->create(['title' => 'Servicio publicado']);
    $draft = Service::factory()->create(['title' => 'Servicio borrador']);

    $this->get(route('services.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/index')
            ->has('services', 1)
            ->where('services.0.title', 'Servicio publicado'));

    $this->get(route('services.show', $published))->assertOk();
    $this->get(route('services.show', $draft))->assertNotFound();
});

test('blog index and show expose only published posts', function () {
    $category = Category::factory()->create();
    $published = Post::factory()->published()->for($category)->create(['title' => 'Post publicado']);
    $draft = Post::factory()->for($category)->create(['title' => 'Post borrador']);

    $this->get(route('blog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('blog/index')
            ->has('posts', 1)
            ->where('posts.0.title', 'Post publicado'));

    $this->get(route('blog.show', $published))->assertOk();
    $this->get(route('blog.show', $draft))->assertNotFound();
});

test('success cases index and show expose only published cases', function () {
    $service = Service::factory()->published()->create();
    $published = SuccessCase::factory()->published()->for($service)->create(['title' => 'Caso publicado']);
    $related = SuccessCase::factory()->published()->for($service)->create(['title' => 'Caso relacionado']);
    $draft = SuccessCase::factory()->for($service)->create(['title' => 'Caso borrador']);

    $this->get(route('success-cases.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('success-cases/index')
            ->has('successCases', 2));

    $this->get(route('success-cases.show', $published))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('success-cases/show')
            ->where('successCase.title', 'Caso publicado')
            ->has('relatedSuccessCases', 1)
            ->where('relatedSuccessCases.0.title', 'Caso relacionado'));

    $this->get(route('success-cases.show', $draft))->assertNotFound();
});

test('about page loads the published quienes somos page', function () {
    Page::factory()->published()->create([
        'title' => 'Quiénes somos',
        'slug' => 'quienes-somos',
    ]);

    $this->get(route('pages.about'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pages/about')
            ->where('page.title', 'Quiénes somos'));
});

test('contact page loads published services', function () {
    $service = Service::factory()->published()->ordered(10)->create([
        'title' => 'Servicio publicado',
        'slug' => 'servicio-publicado',
    ]);
    Service::factory()->create(['title' => 'Servicio borrador']);

    $this->get(route('contact.index', ['service' => $service->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('contact/index')
            ->has('services', 1)
            ->where('services.0.title', 'Servicio publicado')
            ->where('selectedServiceId', $service->id)
            ->where('turnstileSiteKey', 'test-site-key'));
});

test('contact form validates input and creates a lead', function () {
    fakePublicTurnstileVerification();

    $service = Service::factory()->published()->create();

    $this->post(route('contact.store'), [])
        ->assertSessionHasErrors(['name', 'email', 'message', 'privacy_accepted', 'cf_turnstile_response']);

    $this->post(route('contact.store'), [
        'name' => 'Ivan Martinez',
        'email' => 'ivan@example.com',
        'phone' => '600000000',
        'company' => 'PODARCIS',
        'service_id' => $service->id,
        'message' => 'Necesito ayuda con un proyecto ambiental.',
        'privacy_accepted' => '1',
        'cf_turnstile_response' => 'valid-turnstile-token',
    ])->assertRedirect();

    expect(Lead::query()->count())->toBe(1);
    $this->assertDatabaseHas('leads', [
        'name' => 'Ivan Martinez',
        'email' => 'ivan@example.com',
        'service_id' => $service->id,
        'source' => 'contact_page',
        'status' => 'new',
    ]);
});

test('contact honeypot blocks spam submissions', function () {
    fakePublicTurnstileVerification();

    $this->post(route('contact.store'), [
        'name' => 'Spam Bot',
        'email' => 'spam@example.com',
        'message' => 'Este mensaje tiene longitud suficiente.',
        'privacy_accepted' => '1',
        'cf_turnstile_response' => 'valid-turnstile-token',
        'website' => 'https://spam.example',
    ])->assertSessionHasErrors(['website']);

    expect(Lead::query()->count())->toBe(0);
});

test('contact form rejects invalid turnstile verification', function () {
    fakePublicTurnstileVerification(false);

    $this->post(route('contact.store'), [
        'name' => 'Ivan Martinez',
        'email' => 'ivan@example.com',
        'message' => 'Necesito ayuda con un proyecto ambiental.',
        'privacy_accepted' => '1',
        'cf_turnstile_response' => 'invalid-turnstile-token',
    ])->assertSessionHasErrors(['cf_turnstile_response']);

    expect(Lead::query()->count())->toBe(0);
});
