<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Support\PublicContentData;
use Inertia\Inertia;
use Inertia\Response;

class SeoLandingPageController extends Controller
{
    public function __construct(private PublicContentData $data) {}

    public function show(string $path): Response
    {
        $page = Page::query()->published()->where('slug', $path)->firstOrFail();

        return Inertia::render('pages/show', [
            'page' => $this->data->page($page),
            'breadcrumbs' => $this->breadcrumbs($page),
        ]);
    }

    /** @return array<int, array{label: string, href: string}> */
    private function breadcrumbs(Page $page): array
    {
        $segments = explode('/', $page->slug);
        $breadcrumbs = [['label' => 'Inicio', 'href' => route('home')]];

        foreach ($segments as $index => $segment) {
            $path = implode('/', array_slice($segments, 0, $index + 1));
            $matchingPage = Page::query()->published()->where('slug', $path)->first();
            $breadcrumbs[] = [
                'label' => $matchingPage->title ?? str($segment)->replace('-', ' ')->title()->toString(),
                'href' => $index === count($segments) - 1
                    ? route('seo-landings.show', ['path' => $page->slug])
                    : url($path),
            ];
        }

        return $breadcrumbs;
    }
}
