<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use App\Support\PublicContentData;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private PublicContentData $data) {}

    public function index(): Response
    {
        return Inertia::render('welcome', [
            'home' => ($page = Page::query()->published()->where('slug', 'inicio')->first())
                ? $this->data->page($page)
                : null,
            'services' => Service::query()
                ->published()
                ->where('kind', 'consulting')
                ->featured()
                ->ordered()
                ->limit(8)
                ->get()
                ->map(fn (Service $service): array => $this->data->service($service)),
            'digitalServices' => Service::query()
                ->published()
                ->where('kind', 'digital')
                ->featured()
                ->ordered()
                ->limit(4)
                ->get()
                ->map(fn (Service $service): array => $this->data->service($service)),
            'posts' => Post::query()->published()->with('category')->latest('published_at')->limit(3)->get()->map(fn (Post $post): array => $this->data->post($post)),
            'testimonials' => Testimonial::query()->published()->featured()->ordered()->limit(10)->get()->map(fn (Testimonial $testimonial): array => $this->data->testimonial($testimonial)),
            'successCases' => SuccessCase::query()->published()->with('service')->latest('published_at')->limit(8)->get()->map(fn (SuccessCase $successCase): array => $this->data->successCase($successCase)),
        ]);
    }
}
