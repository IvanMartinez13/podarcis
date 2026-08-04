<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class LegacyRedirectController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $path = trim($request->path(), '/');
        $redirects = config('legacy_redirects', []);

        if (isset($redirects[$path])) {
            return redirect()->to(url($redirects[$path]), 301);
        }

        if (preg_match('#^noticias/page/(\d+)$#', $path, $matches) === 1) {
            return redirect()->route('blog.index', ['page' => (int) $matches[1]], 301);
        }

        if (in_array($path, ['hola-mundo', 'podarcis-adquiere-un-club-de-futbol'], true)) {
            abort(410);
        }

        if (! str_contains($path, '/')) {
            $post = Post::query()->published()->where('slug', $path)->first();

            if ($post !== null) {
                return redirect()->route('blog.show', $post, 301);
            }
        }

        return Inertia::render('errors/not-found')->toResponse($request)->setStatusCode(404);
    }
}
