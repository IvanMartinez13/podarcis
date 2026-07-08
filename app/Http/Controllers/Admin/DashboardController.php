<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
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
                'newLeads' => Lead::query()->where('status', 'new')->count(),
                'publishedPages' => Page::query()->published()->count(),
                'draftPages' => Page::query()->where('status', 'draft')->count(),
            ],
        ]);
    }
}
