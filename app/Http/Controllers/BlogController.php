<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Support\CmsImageStorage;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(private CmsImageStorage $images) {}

    public function index(): Response
    {
        return Inertia::render('blog/index', [
            'posts' => Post::query()->published()->with('category')->latest('published_at')->get()->map(fn (Post $post): array => $this->summary($post)),
        ]);
    }

    public function show(Post $post): Response
    {
        abort_unless($this->isPublished($post), 404);

        $post->load(['category', 'author']);

        return Inertia::render('blog/show', [
            'post' => [
                ...$this->summary($post),
                'content' => $post->content,
                'seoTitle' => $post->seo_title,
                'seoDescription' => $post->seo_description,
                'author' => $post->author ? [
                    'name' => $post->author->name,
                ] : null,
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Post $post): array
    {
        return [
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'featuredImage' => $this->images->url($post->featured_image),
            'publishedAt' => $post->published_at?->toDateString(),
            'href' => route('blog.show', $post),
            'category' => $post->category ? [
                'name' => $post->category->name,
                'slug' => $post->category->slug,
            ] : null,
        ];
    }

    private function isPublished(Post $post): bool
    {
        return $post->status === 'published' && ($post->published_at === null || $post->published_at->isPast());
    }
}
