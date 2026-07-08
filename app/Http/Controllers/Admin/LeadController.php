<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateLeadStatusRequest;
use App\Models\Lead;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString(),
            'service_id' => $request->string('service_id')->toString(),
        ];

        $leads = Lead::query()
            ->with('service')
            ->when($filters['search'] !== '', function (Builder $query) use ($filters): void {
                $query->where(function (Builder $query) use ($filters): void {
                    $query
                        ->where('name', 'like', "%{$filters['search']}%")
                        ->orWhere('email', 'like', "%{$filters['search']}%")
                        ->orWhere('company', 'like', "%{$filters['search']}%")
                        ->orWhere('message', 'like', "%{$filters['search']}%");
                });
            })
            ->when(in_array($filters['status'], ['new', 'contacted', 'closed', 'discarded'], true), function (Builder $query) use ($filters): void {
                $query->where('status', $filters['status']);
            })
            ->when($filters['service_id'] !== '', function (Builder $query) use ($filters): void {
                $query->where('service_id', $filters['service_id']);
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Lead $lead): array => $this->leadIndexData($lead));

        return Inertia::render('admin/leads/index', [
            'filters' => $filters,
            'services' => $this->serviceOptions(),
            'leads' => [
                'data' => $leads->items(),
                'links' => $leads->linkCollection(),
                'meta' => [
                    'currentPage' => $leads->currentPage(),
                    'from' => $leads->firstItem(),
                    'lastPage' => $leads->lastPage(),
                    'perPage' => $leads->perPage(),
                    'to' => $leads->lastItem(),
                    'total' => $leads->total(),
                ],
            ],
        ]);
    }

    public function show(Lead $lead): Response
    {
        $lead->load('service');

        return Inertia::render('admin/leads/show', [
            'lead' => $this->leadDetailData($lead),
        ]);
    }

    public function updateStatus(UpdateLeadStatusRequest $request, Lead $lead): RedirectResponse
    {
        $lead->update($request->validated());

        return back()->with('success', 'Estado del lead actualizado correctamente.');
    }

    public function destroy(Lead $lead): RedirectResponse
    {
        $lead->delete();

        return to_route('admin.leads.index')->with('success', 'Lead eliminado correctamente.');
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
    private function leadIndexData(Lead $lead): array
    {
        return [
            'id' => $lead->id,
            'name' => $lead->name,
            'email' => $lead->email,
            'phone' => $lead->phone,
            'company' => $lead->company,
            'status' => $lead->status,
            'createdAt' => $lead->created_at?->format('d/m/Y H:i'),
            'service' => $lead->service ? [
                'title' => $lead->service->title,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function leadDetailData(Lead $lead): array
    {
        return [
            ...$this->leadIndexData($lead),
            'message' => $lead->message,
            'source' => $lead->source,
            'updatedAt' => $lead->updated_at?->format('d/m/Y H:i'),
        ];
    }
}
