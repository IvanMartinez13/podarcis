<?php

use Inertia\Testing\AssertableInertia as Assert;

test('home renders the public PODARCIS page', function () {
    $response = $this->get(route('home'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('welcome'));
});
