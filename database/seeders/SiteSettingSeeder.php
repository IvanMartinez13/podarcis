<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SiteSetting::query()->firstOrCreate(
            ['singleton_key' => 'site'],
            [
                'brand_description' => 'Consultoría ambiental y soluciones digitales para gestionar obligaciones, evidencias y decisiones con rigor.',
                'navigation' => [
                    ['id' => 'services', 'label' => 'Servicios', 'href' => '/servicios'],
                    ['id' => 'digital', 'label' => 'Soluciones digitales', 'href' => '/soluciones-digitales'],
                    ['id' => 'cases', 'label' => 'Casos de éxito', 'href' => '/casos-de-exito'],
                    ['id' => 'resources', 'label' => 'Recursos', 'href' => '/blog'],
                    ['id' => 'about', 'label' => 'Nosotros', 'href' => '/quienes-somos'],
                ],
                'header_cta' => ['label' => 'Hablemos de su proyecto', 'href' => '/contacto'],
                'contact' => ['email' => 'contacto@podarcis.com', 'phone' => null, 'address' => null],
                'social_links' => [],
                'footer_groups' => [
                    [
                        'id' => 'services',
                        'title' => 'Servicios',
                        'links' => [
                            ['id' => 'all-services', 'label' => 'Todos los servicios', 'href' => '/servicios'],
                            ['id' => 'success-cases', 'label' => 'Casos de éxito', 'href' => '/casos-de-exito'],
                        ],
                    ],
                    [
                        'id' => 'resources',
                        'title' => 'Recursos',
                        'links' => [
                            ['id' => 'blog', 'label' => 'Blog', 'href' => '/blog'],
                            ['id' => 'contact', 'label' => 'Contacto', 'href' => '/contacto'],
                        ],
                    ],
                    [
                        'id' => 'legal',
                        'title' => 'Legal',
                        'links' => [
                            ['id' => 'privacy', 'label' => 'Privacidad', 'href' => '/politica-de-privacidad'],
                            ['id' => 'cookies', 'label' => 'Cookies', 'href' => '/politica-de-cookies'],
                        ],
                    ],
                ],
            ],
        );
    }
}
