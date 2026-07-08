<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Models\Lead;
use App\Models\Page;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $page = Page::query()->published()->where('slug', 'contacto')->first();
        $services = Service::query()->published()->ordered()->get(['id', 'title', 'slug']);
        $selectedService = $services->firstWhere('slug', $request->string('service')->toString());

        return Inertia::render('contact/index', [
            'page' => $page ? [
                'title' => $page->title,
                'excerpt' => $page->excerpt,
                'content' => $page->content,
            ] : null,
            'services' => $services,
            'selectedServiceId' => $selectedService?->id,
            'turnstileSiteKey' => config('services.turnstile.site_key'),
        ]);
    }

    public function store(StoreLeadRequest $request): RedirectResponse
    {
        $data = $request->safe()->only([
            'name',
            'email',
            'phone',
            'company',
            'service_id',
            'message',
            'source',
        ]);

        Lead::query()->create([
            ...$data,
            'source' => $data['source'] ?? 'contact_page',
            'status' => 'new',
        ]);

        return back()->with('success', 'Hemos recibido tu mensaje correctamente. Nos pondremos en contacto contigo lo antes posible.');
    }
}
