<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/index', [
            'stats' => [
                'services' => Service::query()->count(),
                'posts' => Post::query()->count(),
                'publishedPosts' => Post::query()->where('status', 'published')->count(),
                'draftPosts' => Post::query()->where('status', 'draft')->count(),
                'leads' => Lead::query()->count(),
                'newLeads' => Lead::query()->where('status', 'new')->count(),
                'contactedLeads' => Lead::query()->where('status', 'contacted')->count(),
                'closedLeads' => Lead::query()->where('status', 'closed')->count(),
                'publishedPages' => Page::query()->published()->count(),
                'draftPages' => Page::query()->where('status', 'draft')->count(),
                'successCases' => SuccessCase::query()->count(),
                'publishedSuccessCases' => SuccessCase::query()->where('status', 'published')->count(),
                'draftSuccessCases' => SuccessCase::query()->where('status', 'draft')->count(),
                'testimonials' => Testimonial::query()->count(),
                'featuredTestimonials' => Testimonial::query()->where('is_featured', true)->count(),
                'publishedTestimonials' => Testimonial::query()->where('status', 'published')->count(),
            ],
            'latestLeads' => Lead::query()
                ->latest()
                ->limit(5)
                ->get(['id', 'name', 'email', 'status', 'created_at'])
                ->map(fn (Lead $lead): array => [
                    'id' => $lead->id,
                    'name' => $lead->name,
                    'email' => $lead->email,
                    'status' => $lead->status,
                    'createdAt' => $lead->created_at?->format('d/m/Y H:i'),
                ]),
        ]);
    }
}
