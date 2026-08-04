<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use App\Support\SeoData;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function __construct(private SeoData $seo) {}

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = $this->settings();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'site' => fn (): array => $this->siteData($settings),
            'seo' => fn (): array => $this->seo->shared($settings),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    private function settings(): ?SiteSetting
    {
        return SiteSetting::query()
            ->where('singleton_key', 'site')
            ->first([
                'brand_description',
                'navigation',
                'header_cta',
                'contact',
                'social_links',
                'footer_groups',
            ]);
    }

    /** @return array<string, mixed> */
    private function siteData(?SiteSetting $settings): array
    {
        return [
            'navigation' => $settings instanceof SiteSetting && is_array($settings->navigation) ? $settings->navigation : [],
            'headerCta' => $settings?->header_cta,
            'brandDescription' => $settings?->brand_description,
            'contact' => $settings?->contact,
            'socialLinks' => $settings instanceof SiteSetting && is_array($settings->social_links) ? $settings->social_links : [],
            'footerGroups' => $settings instanceof SiteSetting && is_array($settings->footer_groups) ? $settings->footer_groups : [],
        ];
    }
}
