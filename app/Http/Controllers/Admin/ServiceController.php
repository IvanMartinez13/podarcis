<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/services/index', [
            'services' => Service::query()
                ->ordered()
                ->get()
                ->map(fn (Service $service): array => $this->serviceIndexData($service)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/services/create', [
            'service' => $this->serviceFormDefaults(),
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        Service::query()->create($request->validated());

        return to_route('admin.services.index')->with('success', 'Servicio creado correctamente.');
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('admin/services/edit', [
            'service' => $this->serviceFormData($service),
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        return to_route('admin.services.index')->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return to_route('admin.services.index')->with('success', 'Servicio eliminado correctamente.');
    }

    /**
     * @return array<string, mixed>
     */
    private function serviceIndexData(Service $service): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'status' => $service->status,
            'isFeatured' => $service->is_featured,
            'sortOrder' => $service->sort_order,
            'publishedAt' => $service->published_at?->format('d/m/Y H:i'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serviceFormData(Service $service): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'excerpt' => $service->excerpt,
            'description' => $service->description,
            'icon' => $service->icon,
            'featuredImage' => $service->featured_image,
            'seoTitle' => $service->seo_title,
            'seoDescription' => $service->seo_description,
            'isFeatured' => $service->is_featured,
            'sortOrder' => $service->sort_order,
            'status' => $service->status,
            'publishedAt' => $service->published_at?->format('Y-m-d\TH:i'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serviceFormDefaults(): array
    {
        return [
            'id' => null,
            'title' => '',
            'slug' => '',
            'excerpt' => '',
            'description' => '',
            'icon' => '',
            'featuredImage' => '',
            'seoTitle' => '',
            'seoDescription' => '',
            'isFeatured' => false,
            'sortOrder' => 0,
            'status' => 'draft',
            'publishedAt' => '',
        ];
    }
}
