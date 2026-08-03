<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Service;
use App\Support\PublicContentData;
use Inertia\Inertia;
use Inertia\Response;

class DigitalSolutionController extends Controller
{
    public function __construct(private PublicContentData $data) {}

    public function index(): Response
    {
        return Inertia::render('digital-solutions/index', [
            'page' => ($page = Page::query()->published()->where('slug', 'soluciones-digitales')->first())
                ? $this->data->page($page)
                : null,
            'digitalSolutions' => Service::query()
                ->select([
                    'id',
                    'title',
                    'slug',
                    'kind',
                    'excerpt',
                    'icon',
                    'featured_image',
                    'featured_image_alt',
                    'logo_image',
                    'logo_image_alt',
                    'status',
                    'published_at',
                    'sort_order',
                ])
                ->published()
                ->where('kind', 'digital')
                ->ordered()
                ->get()
                ->map(fn (Service $service): array => $this->data->service($service)),
        ]);
    }
}
