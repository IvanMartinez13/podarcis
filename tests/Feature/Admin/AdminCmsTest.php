<?php

use App\Models\Category;
use App\Models\Post;
use App\Models\Service;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin routes require authentication', function (string $routeName) {
    $this->get(route($routeName))->assertRedirect(route('login'));
})->with([
    'admin.index',
    'admin.services.index',
    'admin.categories.index',
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
