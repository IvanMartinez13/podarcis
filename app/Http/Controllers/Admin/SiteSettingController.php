<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSiteSettingRequest;
use App\Models\Page;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/site-settings/edit', [
            'siteSettings' => $this->formData($this->settings()),
            'homeHero' => $this->homeHeroData(),
        ]);
    }

    public function update(UpdateSiteSettingRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $hero = is_array($validated['hero'] ?? null)
            ? $this->normalizeHero($validated['hero'])
            : null;

        unset($validated['hero']);

        $this->settings()->update($validated);

        if ($hero !== null) {
            $this->updateHomeHero($hero);
        }

        return to_route('admin.site-settings.edit')->with('success', 'Ajustes del sitio actualizados correctamente.');
    }

    private function settings(): SiteSetting
    {
        return SiteSetting::query()->firstOrCreate(['singleton_key' => 'site']);
    }

    private function homePage(): Page
    {
        return Page::query()->firstOrCreate(
            ['slug' => 'inicio'],
            [
                'title' => 'Inicio',
                'status' => 'draft',
            ],
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function formData(SiteSetting $settings): array
    {
        return [
            'brandDescription' => $settings->brand_description,
            'navigation' => $settings->navigation ?? [],
            'headerCta' => $settings->header_cta,
            'contact' => $settings->contact,
            'socialLinks' => $settings->social_links ?? [],
            'footerGroups' => $settings->footer_groups ?? [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function homeHeroData(): array
    {
        $hero = $this->homePage()->blocks['hero'] ?? [];

        return [
            'eyebrow' => is_string($hero['eyebrow'] ?? null) ? $hero['eyebrow'] : '',
            'title' => is_string($hero['title'] ?? null) ? $hero['title'] : '',
            'highlightText' => is_string($hero['highlightText'] ?? null) ? $hero['highlightText'] : '',
            'primaryCta' => [
                'label' => is_string($hero['primaryCta']['label'] ?? null) ? $hero['primaryCta']['label'] : '',
                'href' => is_string($hero['primaryCta']['href'] ?? null) ? $hero['primaryCta']['href'] : '',
            ],
            'secondaryCta' => [
                'label' => is_string($hero['secondaryCta']['label'] ?? null) ? $hero['secondaryCta']['label'] : '',
                'href' => is_string($hero['secondaryCta']['href'] ?? null) ? $hero['secondaryCta']['href'] : '',
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $hero
     * @return array<string, mixed>
     */
    private function normalizeHero(array $hero): array
    {
        $normalizeText = static fn (mixed $value): ?string => is_string($value) && trim($value) !== ''
            ? trim($value)
            : null;

        $normalizeCta = static function (mixed $value) use ($normalizeText): ?array {
            if (! is_array($value)) {
                return null;
            }

            $label = $normalizeText($value['label'] ?? null);
            $href = $normalizeText($value['href'] ?? null);

            if ($label === null || $href === null) {
                return null;
            }

            return [
                'label' => $label,
                'href' => $href,
            ];
        };

        return [
            'eyebrow' => $normalizeText($hero['eyebrow'] ?? null),
            'title' => $normalizeText($hero['title'] ?? null),
            'highlightText' => $normalizeText($hero['highlightText'] ?? null),
            'primaryCta' => $normalizeCta($hero['primaryCta'] ?? null),
            'secondaryCta' => $normalizeCta($hero['secondaryCta'] ?? null),
        ];
    }

    /**
     * @param  array<string, mixed>  $hero
     */
    private function updateHomeHero(array $hero): void
    {
        $homePage = $this->homePage();
        $blocks = is_array($homePage->blocks) ? $homePage->blocks : [];
        $blocks['hero'] = $hero;

        $homePage->update([
            'blocks' => $blocks,
        ]);
    }
}
