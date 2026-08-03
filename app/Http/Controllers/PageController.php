<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Support\PublicContentData;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(private PublicContentData $data) {}

    public function about(): Response
    {
        $page = Page::query()->published()->where('slug', 'quienes-somos')->firstOrFail();

        return Inertia::render('pages/about', [
            'page' => $this->data->page($page),
        ]);
    }
}
