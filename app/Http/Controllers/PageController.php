<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function about(): Response
    {
        $page = Page::query()->published()->where('slug', 'quienes-somos')->firstOrFail();

        return Inertia::render('pages/about', [
            'page' => [
                'title' => $page->title,
                'slug' => $page->slug,
                'excerpt' => $page->excerpt,
                'content' => $page->content,
                'seoTitle' => $page->seo_title,
                'seoDescription' => $page->seo_description,
            ],
        ]);
    }
}
