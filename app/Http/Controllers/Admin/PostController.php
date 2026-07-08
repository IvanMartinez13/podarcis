<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Support\CmsImageStorage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(private CmsImageStorage $images) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString(),
            'category_id' => $request->string('category_id')->toString(),
        ];

        return Inertia::render('admin/posts/index', [
            'filters' => $filters,
            'categories' => $this->postCategories(),
            'posts' => Post::query()
                ->with(['category', 'author'])
                ->when($filters['search'] !== '', function (Builder $query) use ($filters): void {
                    $query->where(function (Builder $query) use ($filters): void {
                        $query
                            ->where('title', 'like', "%{$filters['search']}%")
                            ->orWhere('slug', 'like', "%{$filters['search']}%");
                    });
                })
                ->when(in_array($filters['status'], ['draft', 'published'], true), function (Builder $query) use ($filters): void {
                    $query->where('status', $filters['status']);
                })
                ->when($filters['category_id'] !== '', function (Builder $query) use ($filters): void {
                    $query->where('category_id', $filters['category_id']);
                })
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (Post $post): array => $this->postIndexData($post)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posts/create', [
            'post' => $this->postFormDefaults(),
            'categories' => $this->postCategories(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['featured_image_upload', 'remove_featured_image']);
        $data['author_id'] = $request->user()?->id;

        if ($request->hasFile('featured_image_upload')) {
            $data['featured_image'] = $this->images->store($request->file('featured_image_upload'), 'cms/posts');
        } elseif (blank($data['featured_image'] ?? null)) {
            $data['featured_image'] = null;
        }

        Post::query()->create($data);

        return to_route('admin.posts.index')->with('success', 'Post creado correctamente.');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $this->postFormData($post),
            'categories' => $this->postCategories(),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $data = $request->safe()->except(['featured_image_upload', 'remove_featured_image']);
        $data['author_id'] = $post->author_id ?: $request->user()?->id;

        if ($request->hasFile('featured_image_upload')) {
            $data['featured_image'] = $this->images->store($request->file('featured_image_upload'), 'cms/posts', $post->featured_image);
        } elseif ($request->boolean('remove_featured_image')) {
            $this->images->delete($post->featured_image);
            $data['featured_image'] = null;
        } else {
            unset($data['featured_image']);
        }

        $post->update($data);

        return to_route('admin.posts.index')->with('success', 'Post actualizado correctamente.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $this->images->delete($post->featured_image);

        $post->delete();

        return to_route('admin.posts.index')->with('success', 'Post eliminado correctamente.');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function postCategories(): array
    {
        return Category::query()
            ->where('type', 'post')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function postIndexData(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'status' => $post->status,
            'publishedAt' => $post->published_at?->format('d/m/Y H:i'),
            'previewUrl' => $post->status === 'published' ? route('blog.show', $post) : null,
            'category' => $post->category ? [
                'name' => $post->category->name,
            ] : null,
            'author' => $post->author ? [
                'name' => $post->author->name,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function postFormData(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'featuredImage' => $this->images->url($post->featured_image),
            'categoryId' => $post->category_id,
            'seoTitle' => $post->seo_title,
            'seoDescription' => $post->seo_description,
            'status' => $post->status,
            'publishedAt' => $post->published_at?->format('Y-m-d\TH:i'),
            'previewUrl' => $post->status === 'published' ? route('blog.show', $post) : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function postFormDefaults(): array
    {
        return [
            'id' => null,
            'title' => '',
            'slug' => '',
            'excerpt' => '',
            'content' => '',
            'featuredImage' => '',
            'categoryId' => '',
            'seoTitle' => '',
            'seoDescription' => '',
            'status' => 'draft',
            'publishedAt' => '',
            'previewUrl' => null,
        ];
    }
}
