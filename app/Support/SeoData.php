<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Arr;

class SeoData
{
    /** @return array<string, mixed> */
    public function shared(?SiteSetting $settings): array
    {
        $baseUrl = rtrim((string) config('seo.canonical_url'), '/');
        $contact = $settings instanceof SiteSetting && is_array($settings->contact)
            ? $settings->contact
            : [];
        $organizationId = $baseUrl.'/#organization';

        $organization = array_filter([
            '@type' => ['Organization', 'ProfessionalService'],
            '@id' => $organizationId,
            'name' => Arr::get($contact, 'legal_name', 'PODARCIS SL'),
            'alternateName' => 'PODARCIS',
            'url' => $baseUrl,
            'email' => Arr::get($contact, 'email'),
            'telephone' => Arr::get($contact, 'phone'),
            'description' => $settings?->brand_description,
            'areaServed' => [
                ['@type' => 'AdministrativeArea', 'name' => 'Mallorca'],
                ['@type' => 'AdministrativeArea', 'name' => 'Illes Balears'],
            ],
            'address' => $this->address($contact),
            'geo' => $this->geo($contact),
            'sameAs' => collect($settings instanceof SiteSetting && is_array($settings->social_links) ? $settings->social_links : [])
                ->pluck('href')
                ->filter(fn (mixed $href): bool => is_string($href) && $href !== '')
                ->values()
                ->all(),
        ], fn (mixed $value): bool => $value !== null && $value !== '' && $value !== []);

        return [
            'baseUrl' => $baseUrl,
            'siteName' => 'PODARCIS',
            'organization' => $organization,
            'website' => [
                '@type' => 'WebSite',
                '@id' => $baseUrl.'/#website',
                'url' => $baseUrl,
                'name' => 'PODARCIS',
                'publisher' => ['@id' => $organizationId],
                'inLanguage' => 'es-ES',
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $contact
     * @return array<string, string>|null
     */
    private function address(array $contact): ?array
    {
        $streetAddress = Arr::get($contact, 'street_address') ?? Arr::get($contact, 'address');

        if (! is_string($streetAddress) || $streetAddress === '') {
            return null;
        }

        return array_filter([
            '@type' => 'PostalAddress',
            'streetAddress' => $streetAddress,
            'postalCode' => Arr::get($contact, 'postal_code'),
            'addressLocality' => Arr::get($contact, 'locality'),
            'addressRegion' => Arr::get($contact, 'region'),
            'addressCountry' => Arr::get($contact, 'country', 'ES'),
        ], fn (mixed $value): bool => is_string($value) && $value !== '');
    }

    /**
     * @param  array<string, mixed>  $contact
     * @return array<string, string>|null
     */
    private function geo(array $contact): ?array
    {
        $latitude = Arr::get($contact, 'latitude');
        $longitude = Arr::get($contact, 'longitude');

        if (! is_string($latitude) || $latitude === '' || ! is_string($longitude) || $longitude === '') {
            return null;
        }

        return [
            '@type' => 'GeoCoordinates',
            'latitude' => $latitude,
            'longitude' => $longitude,
        ];
    }
}
