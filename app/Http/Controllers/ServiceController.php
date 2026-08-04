<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Support\PublicContentData;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(private PublicContentData $data) {}

    public function index(): Response
    {
        return Inertia::render('services/index', [
            'page' => ($page = Page::query()->published()->where('slug', 'servicios')->first())
                ? $this->data->page($page)
                : null,
            'services' => Service::query()
                ->published()
                ->where('kind', 'consulting')
                ->ordered()
                ->get()
                ->map(fn (Service $service): array => $this->data->service($service)),
        ]);
    }

    public function show(Service $service): Response
    {
        abort_unless($service->kind === 'consulting' && $this->isPublished($service), 404);

        $service->load(['successCases' => fn ($query) => $query->published()->with('service')->latest('published_at')->limit(3)]);

        return Inertia::render('services/show', [
            'service' => [
                ...$this->data->service($service),
                'description' => $service->description,
                'blocks' => $service->blocks,
                'seoTitle' => $service->seo_title,
                'seoDescription' => $service->seo_description,
            ],
            'successCases' => $service->successCases->map(fn (SuccessCase $successCase): array => $this->data->successCase($successCase)),
        ]);
    }

    private function isPublished(Service $service): bool
    {
        return $service->status === 'published' && ($service->published_at === null || $service->published_at->isPast());
    }
}
