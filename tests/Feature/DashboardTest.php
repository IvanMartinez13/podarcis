<?php

use App\Models\User;

test('dashboard route no longer exists', function () {
    $response = $this->get('/dashboard');
    $response->assertNotFound();
});

test('guests are redirected to the login page from admin', function () {
    $response = $this->get(route('admin.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the admin dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.index'));
    $response->assertOk();
});
