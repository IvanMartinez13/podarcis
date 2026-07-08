<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
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
        Testimonial::query()->create($request->validated());

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
        $testimonial->update($request->validated());

        return to_route('admin.testimonials.index')->with('success', 'Testimonio actualizado correctamente.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
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
            'avatar' => $testimonial->avatar,
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
            'avatar' => $testimonial->avatar,
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
