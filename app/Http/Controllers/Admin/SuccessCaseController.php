<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSuccessCaseRequest;
use App\Http\Requests\UpdateSuccessCaseRequest;
use App\Models\Service;
use App\Models\SuccessCase;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SuccessCaseController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString(),
            'service_id' => $request->string('service_id')->toString(),
        ];

        return Inertia::render('admin/success-cases/index', [
            'filters' => $filters,
            'services' => $this->serviceOptions(),
            'successCases' => SuccessCase::query()
                ->with('service')
                ->when($filters['search'] !== '', function (Builder $query) use ($filters): void {
                    $query->where(function (Builder $query) use ($filters): void {
                        $query
                            ->where('title', 'like', "%{$filters['search']}%")
                            ->orWhere('client_name', 'like', "%{$filters['search']}%")
                            ->orWhere('sector', 'like', "%{$filters['search']}%");
                    });
                })
                ->when(in_array($filters['status'], ['draft', 'published'], true), function (Builder $query) use ($filters): void {
                    $query->where('status', $filters['status']);
                })
                ->when($filters['service_id'] !== '', function (Builder $query) use ($filters): void {
                    $query->where('service_id', $filters['service_id']);
                })
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (SuccessCase $successCase): array => $this->successCaseIndexData($successCase)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/success-cases/create', [
            'successCase' => $this->successCaseFormDefaults(),
            'services' => $this->serviceOptions(),
        ]);
    }

    public function store(StoreSuccessCaseRequest $request): RedirectResponse
    {
        SuccessCase::query()->create($request->validated());

        return to_route('admin.success-cases.index')->with('success', 'Caso de éxito creado correctamente.');
    }

    public function edit(SuccessCase $successCase): Response
    {
        return Inertia::render('admin/success-cases/edit', [
            'successCase' => $this->successCaseFormData($successCase),
            'services' => $this->serviceOptions(),
        ]);
    }

    public function update(UpdateSuccessCaseRequest $request, SuccessCase $successCase): RedirectResponse
    {
        $successCase->update($request->validated());

        return to_route('admin.success-cases.index')->with('success', 'Caso de éxito actualizado correctamente.');
    }

    public function destroy(SuccessCase $successCase): RedirectResponse
    {
        $successCase->delete();

        return to_route('admin.success-cases.index')->with('success', 'Caso de éxito eliminado correctamente.');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function serviceOptions(): array
    {
        return Service::query()
            ->published()
            ->ordered()
            ->get(['id', 'title'])
            ->map(fn (Service $service): array => [
                'id' => $service->id,
                'title' => $service->title,
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function successCaseIndexData(SuccessCase $successCase): array
    {
        return [
            'id' => $successCase->id,
            'title' => $successCase->title,
            'slug' => $successCase->slug,
            'clientName' => $successCase->client_name,
            'sector' => $successCase->sector,
            'status' => $successCase->status,
            'publishedAt' => $successCase->published_at?->format('d/m/Y H:i'),
            'previewUrl' => $successCase->status === 'published' ? route('success-cases.show', $successCase) : null,
            'service' => $successCase->service ? [
                'title' => $successCase->service->title,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function successCaseFormData(SuccessCase $successCase): array
    {
        return [
            'id' => $successCase->id,
            'title' => $successCase->title,
            'slug' => $successCase->slug,
            'clientName' => $successCase->client_name,
            'sector' => $successCase->sector,
            'challenge' => $successCase->challenge,
            'solution' => $successCase->solution,
            'result' => $successCase->result,
            'featuredImage' => $successCase->featured_image,
            'serviceId' => $successCase->service_id,
            'status' => $successCase->status,
            'publishedAt' => $successCase->published_at?->format('Y-m-d\TH:i'),
            'previewUrl' => $successCase->status === 'published' ? route('success-cases.show', $successCase) : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function successCaseFormDefaults(): array
    {
        return [
            'id' => null,
            'title' => '',
            'slug' => '',
            'clientName' => '',
            'sector' => '',
            'challenge' => '',
            'solution' => '',
            'result' => '',
            'featuredImage' => '',
            'serviceId' => '',
            'status' => 'draft',
            'publishedAt' => '',
            'previewUrl' => null,
        ];
    }
}
