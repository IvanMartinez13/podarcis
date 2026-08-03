<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Post;
use App\Support\PublicContentData;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(private PublicContentData $data) {}

    public function index(): Response
    {
        return Inertia::render('blog/index', [
            'page' => ($page = Page::query()->published()->where('slug', 'blog')->first())
                ? $this->data->page($page)
                : null,
            'posts' => Post::query()->published()->with('category')->latest('published_at')->get()->map(fn (Post $post): array => $this->data->post($post)),
        ]);
    }

    public function show(Post $post): Response
    {
        abort_unless($this->isPublished($post), 404);

        $post->load(['category', 'author']);

        return Inertia::render('blog/show', [
            'post' => [
                ...$this->data->post($post),
                'content' => $post->content,
                'seoTitle' => $post->seo_title,
                'seoDescription' => $post->seo_description,
                'author' => $post->author ? [
                    'name' => $post->author->name,
                ] : null,
            ],
        ]);
    }

    private function isPublished(Post $post): bool
    {
        return $post->status === 'published' && ($post->published_at === null || $post->published_at->isPast());
    }
}
