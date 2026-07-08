<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Models\Page;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString(),
        ];

        return Inertia::render('admin/pages/index', [
            'filters' => $filters,
            'pages' => Page::query()
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
                ->orderBy('title')
                ->get()
                ->map(fn (Page $page): array => $this->pageIndexData($page)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/pages/create', [
            'page' => $this->pageFormDefaults(),
        ]);
    }

    public function store(StorePageRequest $request): RedirectResponse
    {
        Page::query()->create($request->validated());

        return to_route('admin.pages.index')->with('success', 'Página creada correctamente.');
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('admin/pages/edit', [
            'page' => $this->pageFormData($page),
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $page->update($request->validated());

        return to_route('admin.pages.index')->with('success', 'Página actualizada correctamente.');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();

        return to_route('admin.pages.index')->with('success', 'Página eliminada correctamente.');
    }

    /**
     * @return array<string, mixed>
     */
    private function pageIndexData(Page $page): array
    {
        return [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'status' => $page->status,
            'publishedAt' => $page->published_at?->format('d/m/Y H:i'),
            'previewUrl' => $page->status === 'published' ? $this->previewUrl($page) : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function pageFormData(Page $page): array
    {
        return [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'excerpt' => $page->excerpt,
            'content' => $page->content,
            'seoTitle' => $page->seo_title,
            'seoDescription' => $page->seo_description,
            'ogImage' => $page->og_image,
            'status' => $page->status,
            'publishedAt' => $page->published_at?->format('Y-m-d\TH:i'),
            'previewUrl' => $page->status === 'published' ? $this->previewUrl($page) : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function pageFormDefaults(): array
    {
        return [
            'id' => null,
            'title' => '',
            'slug' => '',
            'excerpt' => '',
            'content' => '',
            'seoTitle' => '',
            'seoDescription' => '',
            'ogImage' => '',
            'status' => 'draft',
            'publishedAt' => '',
            'previewUrl' => null,
        ];
    }

    private function previewUrl(Page $page): ?string
    {
        return match ($page->slug) {
            'quienes-somos' => route('pages.about'),
            'contacto' => route('contact.index'),
            default => null,
        };
    }
}
