<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'services' => Service::query()->published()->featured()->ordered()->limit(8)->get()->map(fn (Service $service): array => $this->serviceSummary($service)),
            'posts' => Post::query()->published()->with('category')->latest('published_at')->limit(3)->get()->map(fn (Post $post): array => $this->postSummary($post)),
            'testimonials' => Testimonial::query()->published()->featured()->ordered()->limit(3)->get()->map(fn (Testimonial $testimonial): array => $this->testimonialSummary($testimonial)),
            'successCases' => SuccessCase::query()->published()->with('service')->latest('published_at')->limit(3)->get()->map(fn (SuccessCase $successCase): array => $this->successCaseSummary($successCase)),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function serviceSummary(Service $service): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'excerpt' => $service->excerpt,
            'description' => $service->description,
            'icon' => $service->icon,
            'featuredImage' => $service->featured_image,
            'href' => route('services.show', $service),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function postSummary(Post $post): array
    {
        return [
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'featuredImage' => $post->featured_image,
            'publishedAt' => $post->published_at?->toDateString(),
            'href' => route('blog.show', $post),
            'category' => $post->category ? [
                'name' => $post->category->name,
                'slug' => $post->category->slug,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function testimonialSummary(Testimonial $testimonial): array
    {
        return [
            'name' => $testimonial->name,
            'position' => $testimonial->position,
            'company' => $testimonial->company,
            'quote' => $testimonial->quote,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function successCaseSummary(SuccessCase $successCase): array
    {
        return [
            'title' => $successCase->title,
            'slug' => $successCase->slug,
            'clientName' => $successCase->client_name,
            'sector' => $successCase->sector,
            'result' => $successCase->result,
            'featuredImage' => $successCase->featured_image,
            'href' => route('success-cases.show', $successCase),
            'service' => $successCase->service ? [
                'title' => $successCase->service->title,
                'slug' => $successCase->service->slug,
            ] : null,
        ];
    }
}
