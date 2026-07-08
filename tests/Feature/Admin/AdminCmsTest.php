<?php

use App\Models\Category;
use App\Models\Lead;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin routes require authentication', function (string $routeName) {
    $this->get(route($routeName))->assertRedirect(route('login'));
})->with([
    'admin.index',
    'admin.services.index',
    'admin.categories.index',
    'admin.posts.index',
    'admin.pages.index',
    'admin.success-cases.index',
    'admin.testimonials.index',
    'admin.leads.index',
]);

test('authenticated user can load admin dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/index')
            ->has('stats'));
});

test('service can be created with generated slug', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.services.store'), [
            'title' => 'Consultoría Ambiental Premium',
            'slug' => '',
            'excerpt' => 'Servicio estratégico.',
            'description' => 'Descripción del servicio.',
            'icon' => 'leaf',
            'featured_image' => '',
            'seo_title' => '',
            'seo_description' => '',
            'is_featured' => true,
            'sort_order' => 10,
            'status' => 'published',
            'published_at' => now()->format('Y-m-d H:i:s'),
        ])
        ->assertRedirect(route('admin.services.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('services', [
        'title' => 'Consultoría Ambiental Premium',
        'slug' => 'consultoria-ambiental-premium',
        'status' => 'published',
        'is_featured' => true,
    ]);
});

test('service can be updated while ignoring its own slug uniqueness', function () {
    $user = User::factory()->create();
    $service = Service::factory()->create([
        'title' => 'Servicio inicial',
        'slug' => 'servicio-inicial',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.services.update', $service), [
            'title' => 'Servicio actualizado',
            'slug' => 'servicio-inicial',
            'excerpt' => 'Nuevo extracto.',
            'description' => 'Nueva descripción.',
            'icon' => '',
            'featured_image' => '',
            'seo_title' => '',
            'seo_description' => '',
            'is_featured' => false,
            'sort_order' => 20,
            'status' => 'draft',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.services.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('services', [
        'id' => $service->id,
        'title' => 'Servicio actualizado',
        'slug' => 'servicio-inicial',
        'sort_order' => 20,
    ]);
});

test('category can be created with generated slug', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.categories.store'), [
            'name' => 'Actualidad Ambiental',
            'slug' => '',
            'description' => 'Categoría de contenidos.',
            'type' => 'post',
        ])
        ->assertRedirect(route('admin.categories.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('categories', [
        'name' => 'Actualidad Ambiental',
        'slug' => 'actualidad-ambiental',
        'type' => 'post',
    ]);
});

test('category with posts cannot be deleted', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    Post::factory()->for($category)->create();

    $this->actingAs($user)
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect()
        ->assertSessionHas('error');

    $this->assertModelExists($category);
});

test('post can be created with generated slug, authenticated author and automatic publication date', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'post']);

    $this->actingAs($user)
        ->post(route('admin.posts.store'), [
            'title' => 'Nueva noticia ambiental',
            'slug' => '',
            'excerpt' => 'Extracto de la noticia.',
            'content' => 'Contenido completo de la noticia.',
            'featured_image' => '',
            'category_id' => $category->id,
            'seo_title' => '',
            'seo_description' => '',
            'status' => 'published',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.posts.index'))
        ->assertSessionHas('success');

    $post = Post::query()->where('slug', 'nueva-noticia-ambiental')->firstOrFail();

    expect($post->author_id)->toBe($user->id)
        ->and($post->published_at)->not->toBeNull();
});

test('post can be updated while ignoring its own slug uniqueness', function () {
    $user = User::factory()->create();
    $post = Post::factory()->for($user, 'author')->create([
        'title' => 'Título anterior',
        'slug' => 'titulo-anterior',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.posts.update', $post), [
            'title' => 'Título actualizado',
            'slug' => 'titulo-anterior',
            'excerpt' => 'Extracto actualizado.',
            'content' => 'Contenido actualizado.',
            'featured_image' => '',
            'category_id' => null,
            'seo_title' => '',
            'seo_description' => '',
            'status' => 'draft',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.posts.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'title' => 'Título actualizado',
        'slug' => 'titulo-anterior',
        'author_id' => $user->id,
    ]);
});

test('posts index can filter by status category and search', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['name' => 'Normativa', 'type' => 'post']);
    $otherCategory = Category::factory()->create(['type' => 'post']);

    Post::factory()->published()->for($category)->create([
        'title' => 'Normativa ambiental europea',
        'slug' => 'normativa-ambiental-europea',
    ]);

    Post::factory()->for($category)->create([
        'title' => 'Borrador ambiental',
        'slug' => 'borrador-ambiental',
        'status' => 'draft',
    ]);

    Post::factory()->published()->for($otherCategory)->create([
        'title' => 'Otro contenido',
        'slug' => 'otro-contenido',
    ]);

    $this->actingAs($user)
        ->get(route('admin.posts.index', [
            'search' => 'normativa',
            'status' => 'published',
            'category_id' => $category->id,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/posts/index')
            ->has('posts', 1)
            ->where('posts.0.title', 'Normativa ambiental europea'));
});

test('page can be created with generated slug and automatic publication date', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.pages.store'), [
            'title' => 'Política ambiental',
            'slug' => '',
            'excerpt' => 'Extracto de página.',
            'content' => 'Contenido de página.',
            'seo_title' => '',
            'seo_description' => '',
            'og_image' => '',
            'status' => 'published',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.pages.index'))
        ->assertSessionHas('success');

    $page = Page::query()->where('slug', 'politica-ambiental')->firstOrFail();

    expect($page->published_at)->not->toBeNull();
});

test('page can be updated while ignoring its own slug uniqueness', function () {
    $user = User::factory()->create();
    $page = Page::factory()->create([
        'title' => 'Página anterior',
        'slug' => 'pagina-anterior',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), [
            'title' => 'Página actualizada',
            'slug' => 'pagina-anterior',
            'excerpt' => 'Extracto actualizado.',
            'content' => 'Contenido actualizado.',
            'seo_title' => '',
            'seo_description' => '',
            'og_image' => '',
            'status' => 'draft',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.pages.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('pages', [
        'id' => $page->id,
        'title' => 'Página actualizada',
        'slug' => 'pagina-anterior',
    ]);
});

test('pages index can filter by status and search', function () {
    $user = User::factory()->create();

    Page::factory()->published()->create([
        'title' => 'Política de sostenibilidad',
        'slug' => 'politica-de-sostenibilidad',
    ]);

    Page::factory()->create([
        'title' => 'Borrador corporativo',
        'slug' => 'borrador-corporativo',
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->get(route('admin.pages.index', [
            'search' => 'sostenibilidad',
            'status' => 'published',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/pages/index')
            ->has('pages', 1)
            ->where('pages.0.title', 'Política de sostenibilidad'));
});

test('success case can be created with generated slug and automatic publication date', function () {
    $user = User::factory()->create();
    $service = Service::factory()->published()->create();

    $this->actingAs($user)
        ->post(route('admin.success-cases.store'), [
            'title' => 'Optimización ambiental industrial',
            'slug' => '',
            'client_name' => 'Cliente industrial',
            'sector' => 'Industria',
            'challenge' => 'Reducir trabajo manual.',
            'solution' => 'Implantación técnica.',
            'result' => 'Mejora de trazabilidad.',
            'featured_image' => '',
            'service_id' => $service->id,
            'status' => 'published',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.success-cases.index'))
        ->assertSessionHas('success');

    $successCase = SuccessCase::query()->where('slug', 'optimizacion-ambiental-industrial')->firstOrFail();

    expect($successCase->published_at)->not->toBeNull()
        ->and($successCase->service_id)->toBe($service->id);
});

test('success case can be updated while ignoring its own slug uniqueness', function () {
    $user = User::factory()->create();
    $successCase = SuccessCase::factory()->create([
        'title' => 'Caso anterior',
        'slug' => 'caso-anterior',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.success-cases.update', $successCase), [
            'title' => 'Caso actualizado',
            'slug' => 'caso-anterior',
            'client_name' => 'Cliente actualizado',
            'sector' => 'Servicios',
            'challenge' => 'Reto actualizado.',
            'solution' => 'Solución actualizada.',
            'result' => 'Resultado actualizado.',
            'featured_image' => '',
            'service_id' => null,
            'status' => 'draft',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.success-cases.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('success_cases', [
        'id' => $successCase->id,
        'title' => 'Caso actualizado',
        'slug' => 'caso-anterior',
    ]);
});

test('success cases index can filter by status service and search', function () {
    $user = User::factory()->create();
    $service = Service::factory()->published()->create(['title' => 'Auditoría']);
    $otherService = Service::factory()->published()->create();

    SuccessCase::factory()->published()->for($service)->create([
        'title' => 'Auditoría ambiental industrial',
        'client_name' => 'Cliente objetivo',
        'sector' => 'Industria',
    ]);

    SuccessCase::factory()->for($service)->create([
        'title' => 'Caso borrador',
        'status' => 'draft',
    ]);

    SuccessCase::factory()->published()->for($otherService)->create([
        'title' => 'Otro caso publicado',
    ]);

    $this->actingAs($user)
        ->get(route('admin.success-cases.index', [
            'search' => 'industrial',
            'status' => 'published',
            'service_id' => $service->id,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/success-cases/index')
            ->has('successCases', 1)
            ->where('successCases.0.title', 'Auditoría ambiental industrial'));
});

test('testimonial can be created with featured order and status', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.testimonials.store'), [
            'name' => 'Cliente satisfecho',
            'position' => 'Directora de calidad',
            'company' => 'Empresa Demo',
            'quote' => 'PODARCIS nos ayudó a trabajar con más claridad.',
            'avatar' => '',
            'is_featured' => true,
            'sort_order' => 5,
            'status' => 'published',
        ])
        ->assertRedirect(route('admin.testimonials.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('testimonials', [
        'name' => 'Cliente satisfecho',
        'company' => 'Empresa Demo',
        'is_featured' => true,
        'sort_order' => 5,
        'status' => 'published',
    ]);
});

test('testimonial can be updated', function () {
    $user = User::factory()->create();
    $testimonial = Testimonial::factory()->create([
        'name' => 'Nombre anterior',
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.testimonials.update', $testimonial), [
            'name' => 'Nombre actualizado',
            'position' => 'Responsable ambiental',
            'company' => 'Empresa actualizada',
            'quote' => 'Nuevo testimonio actualizado.',
            'avatar' => '',
            'is_featured' => true,
            'sort_order' => 15,
            'status' => 'published',
        ])
        ->assertRedirect(route('admin.testimonials.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('testimonials', [
        'id' => $testimonial->id,
        'name' => 'Nombre actualizado',
        'is_featured' => true,
        'sort_order' => 15,
        'status' => 'published',
    ]);
});

test('testimonials index can filter by status featured and search', function () {
    $user = User::factory()->create();

    Testimonial::factory()->published()->featured()->ordered(10)->create([
        'name' => 'Cliente destacado',
        'company' => 'Empresa Ambiental',
        'quote' => 'Una experiencia ambiental clara.',
    ]);

    Testimonial::factory()->published()->create([
        'name' => 'Cliente no destacado',
        'is_featured' => false,
    ]);

    Testimonial::factory()->featured()->create([
        'name' => 'Borrador destacado',
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->get(route('admin.testimonials.index', [
            'search' => 'ambiental',
            'status' => 'published',
            'featured' => 'yes',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/testimonials/index')
            ->has('testimonials', 1)
            ->where('testimonials.0.name', 'Cliente destacado'));
});

test('authenticated user can load leads index', function () {
    $user = User::factory()->create();

    Lead::factory()->create(['name' => 'Lead visible']);

    $this->actingAs($user)
        ->get(route('admin.leads.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/leads/index')
            ->has('leads.data', 1)
            ->where('leads.data.0.name', 'Lead visible'));
});

test('leads index can filter by status service and search', function () {
    $user = User::factory()->create();
    $service = Service::factory()->published()->create();
    $otherService = Service::factory()->published()->create();

    Lead::factory()->for($service)->create([
        'name' => 'Ivan Martinez',
        'email' => 'ivan@example.com',
        'company' => 'PODARCIS',
        'message' => 'Consulta ambiental específica.',
        'status' => 'new',
    ]);

    Lead::factory()->for($service)->create([
        'name' => 'Lead contactado',
        'status' => 'contacted',
    ]);

    Lead::factory()->for($otherService)->create([
        'name' => 'Otro lead',
        'message' => 'Otra consulta diferente.',
        'status' => 'new',
    ]);

    $this->actingAs($user)
        ->get(route('admin.leads.index', [
            'search' => 'ambiental',
            'status' => 'new',
            'service_id' => $service->id,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/leads/index')
            ->has('leads.data', 1)
            ->where('leads.data.0.name', 'Ivan Martinez'));
});

test('lead show displays full detail', function () {
    $user = User::factory()->create();
    $service = Service::factory()->published()->create(['title' => 'Consultoría']);
    $lead = Lead::factory()->for($service)->create([
        'name' => 'Lead detalle',
        'message' => 'Mensaje completo del lead.',
    ]);

    $this->actingAs($user)
        ->get(route('admin.leads.show', $lead))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/leads/show')
            ->where('lead.name', 'Lead detalle')
            ->where('lead.message', 'Mensaje completo del lead.')
            ->where('lead.service.title', 'Consultoría'));
});

test('lead status can be changed', function (string $status) {
    $user = User::factory()->create();
    $lead = Lead::factory()->create(['status' => 'new']);

    $this->actingAs($user)
        ->patch(route('admin.leads.status', $lead), [
            'status' => $status,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('leads', [
        'id' => $lead->id,
        'status' => $status,
    ]);
})->with(['contacted', 'closed', 'discarded', 'new']);

test('lead can be deleted', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.leads.destroy', $lead))
        ->assertRedirect(route('admin.leads.index'))
        ->assertSessionHas('success');

    $this->assertModelMissing($lead);
});
