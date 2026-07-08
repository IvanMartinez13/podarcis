<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\SuccessCase;
use App\Support\CmsImageStorage;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(private CmsImageStorage $images) {}

    public function index(): Response
    {
        return Inertia::render('services/index', [
            'services' => Service::query()->published()->ordered()->get()->map(fn (Service $service): array => $this->summary($service)),
        ]);
    }

    public function show(Service $service): Response
    {
        abort_unless($this->isPublished($service), 404);

        $service->load(['successCases' => fn ($query) => $query->published()->latest('published_at')->limit(3)]);

        return Inertia::render('services/show', [
            'service' => [
                ...$this->summary($service),
                'description' => $service->description,
                'seoTitle' => $service->seo_title,
                'seoDescription' => $service->seo_description,
            ],
            'successCases' => $service->successCases->map(fn (SuccessCase $successCase): array => [
                'title' => $successCase->title,
                'slug' => $successCase->slug,
                'clientName' => $successCase->client_name,
                'sector' => $successCase->sector,
                'excerpt' => $successCase->challenge ?: $successCase->solution,
                'result' => $successCase->result,
                'featuredImage' => $this->images->url($successCase->featured_image),
                'href' => route('success-cases.show', $successCase),
            ]),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Service $service): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'excerpt' => $service->excerpt,
            'icon' => $service->icon,
            'featuredImage' => $this->images->url($service->featured_image),
            'href' => route('services.show', $service),
        ];
    }

    private function isPublished(Service $service): bool
    {
        return $service->status === 'published' && ($service->published_at === null || $service->published_at->isPast());
    }
}
