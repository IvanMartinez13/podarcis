<?php

namespace App\Http\Controllers;

use App\Models\SuccessCase;
use Inertia\Inertia;
use Inertia\Response;

class SuccessCaseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('success-cases/index', [
            'successCases' => SuccessCase::query()
                ->published()
                ->with('service')
                ->latest('published_at')
                ->get()
                ->map(fn (SuccessCase $successCase): array => $this->summary($successCase)),
        ]);
    }

    public function show(SuccessCase $successCase): Response
    {
        abort_unless($this->isPublished($successCase), 404);

        $successCase->load('service');

        return Inertia::render('success-cases/show', [
            'successCase' => [
                ...$this->summary($successCase),
                'challenge' => $successCase->challenge,
                'solution' => $successCase->solution,
                'result' => $successCase->result,
            ],
            'relatedSuccessCases' => $successCase->service_id
                ? SuccessCase::query()
                    ->published()
                    ->with('service')
                    ->where('service_id', $successCase->service_id)
                    ->whereKeyNot($successCase->id)
                    ->latest('published_at')
                    ->limit(3)
                    ->get()
                    ->map(fn (SuccessCase $relatedCase): array => $this->summary($relatedCase))
                : [],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(SuccessCase $successCase): array
    {
        return [
            'title' => $successCase->title,
            'slug' => $successCase->slug,
            'clientName' => $successCase->client_name,
            'sector' => $successCase->sector,
            'excerpt' => $successCase->challenge ?: $successCase->solution,
            'result' => $successCase->result,
            'featuredImage' => $successCase->featured_image,
            'href' => route('success-cases.show', $successCase),
            'service' => $successCase->service ? [
                'title' => $successCase->service->title,
                'slug' => $successCase->service->slug,
            ] : null,
        ];
    }

    private function isPublished(SuccessCase $successCase): bool
    {
        return $successCase->status === 'published' && ($successCase->published_at === null || $successCase->published_at->isPast());
    }
}
