<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\SuccessCase;
use App\Support\PublicContentData;
use Inertia\Inertia;
use Inertia\Response;

class SuccessCaseController extends Controller
{
    public function __construct(private PublicContentData $data) {}

    public function index(): Response
    {
        return Inertia::render('success-cases/index', [
            'page' => ($page = Page::query()->published()->where('slug', 'casos-de-exito')->first())
                ? $this->data->page($page)
                : null,
            'successCases' => SuccessCase::query()
                ->published()
                ->with('service')
                ->latest('published_at')
                ->get()
                ->map(fn (SuccessCase $successCase): array => $this->data->successCase($successCase)),
        ]);
    }

    public function show(SuccessCase $successCase): Response
    {
        abort_unless($this->isPublished($successCase), 404);

        $successCase->load('service');

        return Inertia::render('success-cases/show', [
            'successCase' => [
                ...$this->data->successCase($successCase),
                'challenge' => $successCase->challenge,
                'solution' => $successCase->solution,
                'result' => $successCase->result,
                'seoTitle' => $successCase->seo_title,
                'seoDescription' => $successCase->seo_description,
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
                    ->map(fn (SuccessCase $relatedCase): array => $this->data->successCase($relatedCase))
                : [],
        ]);
    }

    private function isPublished(SuccessCase $successCase): bool
    {
        return $successCase->status === 'published' && ($successCase->published_at === null || $successCase->published_at->isPast());
    }
}
