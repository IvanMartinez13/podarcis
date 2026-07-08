<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Models\Lead;
use App\Models\Page;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        $page = Page::query()->published()->where('slug', 'contacto')->first();

        return Inertia::render('contact/index', [
            'page' => $page ? [
                'title' => $page->title,
                'excerpt' => $page->excerpt,
                'content' => $page->content,
            ] : null,
            'services' => Service::query()->published()->ordered()->get(['id', 'title', 'slug']),
        ]);
    }

    public function store(StoreLeadRequest $request): RedirectResponse
    {
        Lead::query()->create([
            ...$request->validated(),
            'source' => $request->validated('source') ?: 'contacto',
        ]);

        return back()->with('success', 'Gracias. Hemos recibido tu solicitud y te contactaremos pronto.');
    }
}
