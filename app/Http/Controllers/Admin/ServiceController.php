<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use App\Support\CmsImageStorage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(private CmsImageStorage $images) {}

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
        $data = $request->safe()->except([
            'featured_image_upload',
            'remove_featured_image',
            'logo_image_upload',
            'remove_logo_image',
        ]);

        if ($request->hasFile('featured_image_upload')) {
            $data['featured_image'] = $this->images->store($request->file('featured_image_upload'), 'cms/services');
        } elseif (blank($data['featured_image'] ?? null)) {
            $data['featured_image'] = null;
        }

        if ($request->hasFile('logo_image_upload')) {
            $data['logo_image'] = $this->images->store($request->file('logo_image_upload'), 'cms/services/logos', preservePng: true);
        } elseif (blank($data['logo_image'] ?? null)) {
            $data['logo_image'] = null;
        }

        Service::query()->create($data);

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
        $data = $request->safe()->except([
            'featured_image_upload',
            'remove_featured_image',
            'logo_image_upload',
            'remove_logo_image',
        ]);

        if ($request->hasFile('featured_image_upload')) {
            $data['featured_image'] = $this->images->store($request->file('featured_image_upload'), 'cms/services', $service->featured_image);
        } elseif ($request->boolean('remove_featured_image')) {
            $this->images->delete($service->featured_image);
            $data['featured_image'] = null;
        } else {
            unset($data['featured_image']);
        }

        if ($request->hasFile('logo_image_upload')) {
            $data['logo_image'] = $this->images->store(
                $request->file('logo_image_upload'),
                'cms/services/logos',
                $service->logo_image,
                preservePng: true,
            );
        } elseif ($request->boolean('remove_logo_image')) {
            $this->images->delete($service->logo_image);
            $data['logo_image'] = null;
        } else {
            unset($data['logo_image']);
        }

        $service->update($data);

        return to_route('admin.services.index')->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $this->images->delete($service->featured_image);
        $this->images->delete($service->logo_image);

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
            'kind' => $service->kind,
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
            'kind' => $service->kind,
            'excerpt' => $service->excerpt,
            'description' => $service->description,
            'icon' => $service->icon,
            'featuredImage' => $this->images->url($service->featured_image),
            'featuredImageAlt' => $service->featured_image_alt,
            'logoImage' => $this->images->url($service->logo_image),
            'logoImageAlt' => $service->logo_image_alt,
            'blocks' => $service->blocks,
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
            'kind' => 'consulting',
            'excerpt' => '',
            'description' => '',
            'icon' => '',
            'featuredImage' => '',
            'featuredImageAlt' => '',
            'logoImage' => '',
            'logoImageAlt' => '',
            'blocks' => null,
            'seoTitle' => '',
            'seoDescription' => '',
            'isFeatured' => false,
            'sortOrder' => 0,
            'status' => 'draft',
            'publishedAt' => '',
        ];
    }
}
