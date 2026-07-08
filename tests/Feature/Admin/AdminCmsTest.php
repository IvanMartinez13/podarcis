<?php

use App\Models\Category;
use App\Models\Lead;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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
    'admin.users.index',
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

test('service image upload is optimized to webp', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.services.store'), [
            'title' => 'Servicio con imagen',
            'slug' => '',
            'excerpt' => 'Servicio estratégico.',
            'description' => 'Descripción del servicio.',
            'icon' => 'leaf',
            'featured_image_upload' => UploadedFile::fake()->image('servicio.jpg', 1200, 760),
            'seo_title' => '',
            'seo_description' => '',
            'is_featured' => false,
            'sort_order' => 10,
            'status' => 'draft',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.services.index'))
        ->assertSessionHas('success');

    $service = Service::query()->where('slug', 'servicio-con-imagen')->firstOrFail();

    expect($service->featured_image)->toStartWith('cms/services/')
        ->and($service->featured_image)->toEndWith('.webp');

    Storage::disk('public')->assertExists($service->featured_image);
});

test('service image replacement and removal cleans local files', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $service = Service::factory()->create([
        'featured_image' => 'cms/services/old.webp',
    ]);

    Storage::disk('public')->put('cms/services/old.webp', 'old-image');

    $this->actingAs($user)
        ->patch(route('admin.services.update', $service), [
            'title' => $service->title,
            'slug' => $service->slug,
            'excerpt' => 'Extracto.',
            'description' => 'Descripción.',
            'icon' => '',
            'featured_image_upload' => UploadedFile::fake()->image('nueva.png', 1200, 760),
            'seo_title' => '',
            'seo_description' => '',
            'is_featured' => false,
            'sort_order' => 10,
            'status' => 'draft',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.services.index'));

    $service->refresh();
    $newImage = $service->featured_image;

    expect($newImage)->toEndWith('.webp');
    Storage::disk('public')->assertMissing('cms/services/old.webp');
    Storage::disk('public')->assertExists($newImage);

    $this->actingAs($user)
        ->patch(route('admin.services.update', $service), [
            'title' => $service->title,
            'slug' => $service->slug,
            'excerpt' => 'Extracto.',
            'description' => 'Descripción.',
            'icon' => '',
            'remove_featured_image' => true,
            'seo_title' => '',
            'seo_description' => '',
            'is_featured' => false,
            'sort_order' => 10,
            'status' => 'draft',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.services.index'));

    $service->refresh();

    expect($service->featured_image)->toBeNull();
    Storage::disk('public')->assertMissing($newImage);
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

test('admin can create users from cms', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'Gestor CMS',
            'email' => 'gestor@podarcis.app',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'name' => 'Gestor CMS',
        'email' => 'gestor@podarcis.app',
    ]);
});

test('admin can update users without changing password', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create([
        'email' => 'before@podarcis.app',
    ]);

    $originalPassword = $user->password;

    $this->actingAs($admin)
        ->patch(route('admin.users.update', $user), [
            'name' => 'Nombre actualizado',
            'email' => 'after@podarcis.app',
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success');

    $user->refresh();

    expect($user->name)->toBe('Nombre actualizado')
        ->and($user->email)->toBe('after@podarcis.app')
        ->and($user->password)->toBe($originalPassword);
});

test('admin cannot delete own user from cms', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertRedirect()
        ->assertSessionHas('error');

    $this->assertModelExists($admin);
});

test('admin can delete another user from cms', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $user))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success');

    $this->assertModelMissing($user);
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

test('post image upload is optimized to webp', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.posts.store'), [
            'title' => 'Post con imagen',
            'slug' => '',
            'excerpt' => 'Extracto.',
            'content' => 'Contenido completo.',
            'featured_image_upload' => UploadedFile::fake()->image('post.jpg', 1200, 760),
            'category_id' => null,
            'seo_title' => '',
            'seo_description' => '',
            'status' => 'draft',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.posts.index'));

    $post = Post::query()->where('slug', 'post-con-imagen')->firstOrFail();

    expect($post->featured_image)->toEndWith('.webp');
    Storage::disk('public')->assertExists($post->featured_image);
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

test('about page can be updated with configurable team blocks', function () {
    $user = User::factory()->create();
    $page = Page::factory()->published()->create([
        'title' => 'Quiénes somos',
        'slug' => 'quienes-somos',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), [
            'title' => 'Quiénes somos',
            'slug' => 'quienes-somos',
            'excerpt' => 'Equipo técnico.',
            'content' => 'Contenido corporativo.',
            'blocks' => [
                'teamCoverImage' => 'https://placehold.co/1440x760/163247/FFFFFF?text=Equipo',
                'teamMembers' => [
                    [
                        'name' => 'Javi A. Torres',
                        'title' => 'Software Engineer',
                        'handle' => 'javicodes',
                        'status' => 'Online',
                        'contactText' => 'Contactar',
                        'avatarUrl' => 'https://placehold.co/720x1000/163247/FFFFFF?text=Javi',
                    ],
                ],
            ],
            'seo_title' => '',
            'seo_description' => '',
            'og_image' => '',
            'status' => 'published',
            'published_at' => now()->format('Y-m-d H:i:s'),
        ])
        ->assertRedirect(route('admin.pages.index'))
        ->assertSessionHas('success');

    $page->refresh();

    expect($page->blocks['teamCoverImage'])->toBe('https://placehold.co/1440x760/163247/FFFFFF?text=Equipo')
        ->and($page->blocks['teamMembers'][0]['name'])->toBe('Javi A. Torres')
        ->and($page->blocks['teamMembers'][0])->not->toHaveKey('enableTilt')
        ->and($page->blocks['teamMembers'][0])->not->toHaveKey('innerGradient');
});

test('about page ignores legacy team card presentation fields', function () {
    $user = User::factory()->create();
    $page = Page::factory()->published()->create([
        'title' => 'Quiénes somos',
        'slug' => 'quienes-somos',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), [
            'title' => 'Quiénes somos',
            'slug' => 'quienes-somos',
            'excerpt' => 'Equipo técnico.',
            'content' => 'Contenido corporativo.',
            'blocks' => [
                'teamCoverImage' => 'https://placehold.co/1440x760/163247/FFFFFF?text=Equipo',
                'teamMembers' => [
                    [
                        'name' => 'Javi A. Torres',
                        'title' => 'Software Engineer',
                        'handle' => 'javicodes',
                        'status' => 'Online',
                        'contactText' => 'Contactar',
                        'avatarUrl' => 'https://placehold.co/720x1000/163247/FFFFFF?text=Javi',
                        'enableTilt' => true,
                        'innerGradient' => 'linear-gradient(145deg, #244D3A8C 0%, #6FAF4544 100%)',
                    ],
                ],
            ],
            'seo_title' => '',
            'seo_description' => '',
            'og_image' => '',
            'status' => 'published',
            'published_at' => now()->format('Y-m-d H:i:s'),
        ])
        ->assertRedirect(route('admin.pages.index'));

    $page->refresh();

    expect($page->blocks['teamMembers'][0])
        ->not->toHaveKey('enableTilt')
        ->not->toHaveKey('innerGradient');
});

test('about page stores team cover as webp and png avatars in blocks', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $page = Page::factory()->published()->create([
        'title' => 'Quiénes somos',
        'slug' => 'quienes-somos',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), [
            'title' => 'Quiénes somos',
            'slug' => 'quienes-somos',
            'excerpt' => 'Equipo técnico.',
            'content' => 'Contenido corporativo.',
            'blocks' => [
                'teamCoverImage' => '',
                'teamMembers' => [
                    [
                        'name' => 'Javi A. Torres',
                        'title' => 'Software Engineer',
                        'handle' => 'javicodes',
                        'status' => 'Online',
                        'contactText' => 'Contactar',
                        'avatarUrl' => '',
                    ],
                ],
            ],
            'team_cover_image_upload' => UploadedFile::fake()->image('equipo.jpg', 1440, 760),
            'team_member_avatar_uploads' => [
                UploadedFile::fake()->image('avatar.png', 400, 400),
            ],
            'seo_title' => '',
            'seo_description' => '',
            'og_image' => '',
            'status' => 'published',
            'published_at' => now()->format('Y-m-d H:i:s'),
        ])
        ->assertRedirect(route('admin.pages.index'));

    $page->refresh();

    expect($page->blocks['teamCoverImage'])->toEndWith('.webp')
        ->and($page->blocks['teamMembers'][0]['avatarUrl'])->toEndWith('.png');

    Storage::disk('public')->assertExists($page->blocks['teamCoverImage']);
    Storage::disk('public')->assertExists($page->blocks['teamMembers'][0]['avatarUrl']);
});

test('page team blocks validate nested member data', function () {
    $user = User::factory()->create();
    $page = Page::factory()->published()->create([
        'title' => 'Quiénes somos',
        'slug' => 'quienes-somos',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.pages.update', $page), [
            'title' => 'Quiénes somos',
            'slug' => 'quienes-somos',
            'excerpt' => 'Equipo técnico.',
            'content' => 'Contenido corporativo.',
            'blocks' => [
                'teamCoverImage' => 'https://placehold.co/1440x760/163247/FFFFFF?text=Equipo',
                'teamMembers' => [
                    [
                        'name' => '',
                        'title' => 'Software Engineer',
                    ],
                ],
            ],
            'seo_title' => '',
            'seo_description' => '',
            'og_image' => '',
            'status' => 'published',
            'published_at' => now()->format('Y-m-d H:i:s'),
        ])
        ->assertSessionHasErrors(['blocks.teamMembers.0.name']);
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

test('success case image upload is optimized to webp', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.success-cases.store'), [
            'title' => 'Caso con imagen',
            'slug' => '',
            'client_name' => 'Cliente',
            'sector' => 'Industria',
            'challenge' => 'Reto.',
            'solution' => 'Solución.',
            'result' => 'Resultado.',
            'featured_image_upload' => UploadedFile::fake()->image('caso.jpg', 1200, 760),
            'service_id' => null,
            'status' => 'draft',
            'published_at' => null,
        ])
        ->assertRedirect(route('admin.success-cases.index'));

    $successCase = SuccessCase::query()->where('slug', 'caso-con-imagen')->firstOrFail();

    expect($successCase->featured_image)->toEndWith('.webp');
    Storage::disk('public')->assertExists($successCase->featured_image);
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

test('testimonial png avatar upload keeps png transparency format', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.testimonials.store'), [
            'name' => 'Cliente con avatar',
            'position' => 'Directora',
            'company' => 'Empresa Demo',
            'quote' => 'Un testimonio con avatar.',
            'avatar_upload' => UploadedFile::fake()->image('avatar.png', 300, 300),
            'is_featured' => true,
            'sort_order' => 5,
            'status' => 'published',
        ])
        ->assertRedirect(route('admin.testimonials.index'));

    $testimonial = Testimonial::query()->where('name', 'Cliente con avatar')->firstOrFail();

    expect($testimonial->avatar)->toEndWith('.png');
    Storage::disk('public')->assertExists($testimonial->avatar);
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
