<?php

use App\Models\Post;

it('redirects known WordPress routes in one permanent hop', function (string $legacy, string $destination) {
    $this->get($legacy)
        ->assertMovedPermanently()
        ->assertRedirect(url($destination));
})->with([
    ['/noticias/', '/blog'],
    ['/estudios-ambientales/', '/servicios/estudios-ambientales'],
    ['/legislacion-online/', '/soluciones-digitales/legislacion-online'],
    ['/politica-privacidad/', '/politica-de-privacidad'],
]);

it('redirects imported flat article slugs to the blog', function () {
    $post = Post::factory()->published()->create(['slug' => 'articulo-historico']);

    $this->get('/articulo-historico/')
        ->assertMovedPermanently()
        ->assertRedirect(route('blog.show', $post));
});

it('preserves old blog pagination', function () {
    $this->get('/noticias/page/3/')
        ->assertMovedPermanently()
        ->assertRedirect(route('blog.index', ['page' => 3]));
});

it('returns a useful 404 and retires excluded content with 410', function () {
    $this->get('/una-url-inexistente')->assertNotFound()->assertSee('Esta página no existe');
    $this->get('/hola-mundo')->assertGone();
});
