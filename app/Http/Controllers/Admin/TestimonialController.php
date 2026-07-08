<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Models\Testimonial;
use App\Support\CmsImageStorage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function __construct(private CmsImageStorage $images) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString(),
            'featured' => $request->string('featured')->toString(),
        ];

        return Inertia::render('admin/testimonials/index', [
            'filters' => $filters,
            'testimonials' => Testimonial::query()
                ->when($filters['search'] !== '', function (Builder $query) use ($filters): void {
                    $query->where(function (Builder $query) use ($filters): void {
                        $query
                            ->where('name', 'like', "%{$filters['search']}%")
                            ->orWhere('position', 'like', "%{$filters['search']}%")
                            ->orWhere('company', 'like', "%{$filters['search']}%")
                            ->orWhere('quote', 'like', "%{$filters['search']}%");
                    });
                })
                ->when(in_array($filters['status'], ['draft', 'published'], true), function (Builder $query) use ($filters): void {
                    $query->where('status', $filters['status']);
                })
                ->when(in_array($filters['featured'], ['yes', 'no'], true), function (Builder $query) use ($filters): void {
                    $query->where('is_featured', $filters['featured'] === 'yes');
                })
                ->orderBy('sort_order')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (Testimonial $testimonial): array => $this->testimonialIndexData($testimonial)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/testimonials/create', [
            'testimonial' => $this->testimonialFormDefaults(),
        ]);
    }

    public function store(StoreTestimonialRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['avatar_upload', 'remove_avatar']);

        if ($request->hasFile('avatar_upload')) {
            $data['avatar'] = $this->images->store($request->file('avatar_upload'), 'cms/testimonials/avatars', preservePng: true);
        } elseif (blank($data['avatar'] ?? null)) {
            $data['avatar'] = null;
        }

        Testimonial::query()->create($data);

        return to_route('admin.testimonials.index')->with('success', 'Testimonio creado correctamente.');
    }

    public function edit(Testimonial $testimonial): Response
    {
        return Inertia::render('admin/testimonials/edit', [
            'testimonial' => $this->testimonialFormData($testimonial),
        ]);
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $data = $request->safe()->except(['avatar_upload', 'remove_avatar']);

        if ($request->hasFile('avatar_upload')) {
            $data['avatar'] = $this->images->store($request->file('avatar_upload'), 'cms/testimonials/avatars', $testimonial->avatar, preservePng: true);
        } elseif ($request->boolean('remove_avatar')) {
            $this->images->delete($testimonial->avatar);
            $data['avatar'] = null;
        } else {
            unset($data['avatar']);
        }

        $testimonial->update($data);

        return to_route('admin.testimonials.index')->with('success', 'Testimonio actualizado correctamente.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $this->images->delete($testimonial->avatar);

        $testimonial->delete();

        return to_route('admin.testimonials.index')->with('success', 'Testimonio eliminado correctamente.');
    }

    /**
     * @return array<string, mixed>
     */
    private function testimonialIndexData(Testimonial $testimonial): array
    {
        return [
            'id' => $testimonial->id,
            'name' => $testimonial->name,
            'position' => $testimonial->position,
            'company' => $testimonial->company,
            'quote' => $testimonial->quote,
            'avatar' => $this->images->url($testimonial->avatar),
            'isFeatured' => $testimonial->is_featured,
            'sortOrder' => $testimonial->sort_order,
            'status' => $testimonial->status,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function testimonialFormData(Testimonial $testimonial): array
    {
        return [
            'id' => $testimonial->id,
            'name' => $testimonial->name,
            'position' => $testimonial->position,
            'company' => $testimonial->company,
            'quote' => $testimonial->quote,
            'avatar' => $this->images->url($testimonial->avatar),
            'isFeatured' => $testimonial->is_featured,
            'sortOrder' => $testimonial->sort_order,
            'status' => $testimonial->status,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function testimonialFormDefaults(): array
    {
        return [
            'id' => null,
            'name' => '',
            'position' => '',
            'company' => '',
            'quote' => '',
            'avatar' => '',
            'isFeatured' => false,
            'sortOrder' => 0,
            'status' => 'draft',
        ];
    }
}
