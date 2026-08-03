<?php

namespace Database\Factories;

use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SiteSetting>
 */
class SiteSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'singleton_key' => 'site',
            'brand_description' => fake()->sentence(),
            'navigation' => [
                ['id' => 'services', 'label' => 'Servicios', 'href' => '/servicios'],
            ],
            'header_cta' => ['label' => 'Contacto', 'href' => '/contacto'],
            'contact' => ['email' => 'contacto@podarcis.com'],
            'social_links' => [],
            'footer_groups' => [],
        ];
    }
}
