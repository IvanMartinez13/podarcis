<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class SeoContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->settings();
        $this->home();
        $this->services();
        $this->landingPages();
        $this->retirePlaceholderContent();
    }

    private function settings(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['singleton_key' => 'site'],
            [
                'brand_description' => 'Consultoría ambiental en Mallorca para empresas, promotores y administraciones: evaluación ambiental, vigilancia de obras, sostenibilidad, sistemas de gestión y soluciones digitales.',
                'navigation' => [
                    ['id' => 'services', 'label' => 'Servicios', 'href' => '/servicios'],
                    ['id' => 'digital', 'label' => 'Soluciones digitales', 'href' => '/soluciones-digitales'],
                    ['id' => 'cases', 'label' => 'Casos de éxito', 'href' => '/casos-de-exito'],
                    ['id' => 'resources', 'label' => 'Recursos', 'href' => '/blog'],
                    ['id' => 'about', 'label' => 'Quiénes somos', 'href' => '/quienes-somos'],
                ],
                'header_cta' => ['label' => 'Hablemos de tu proyecto', 'href' => '/contacto'],
                'contact' => [
                    'legal_name' => 'PODARCIS SL',
                    'email' => 'contacto@podarcis.com',
                    'phone' => '+34 871 961 697',
                    'address' => 'C/ Ter, 27, 1.er piso, oficina 13, 07009 Palma de Mallorca',
                    'street_address' => 'C/ Ter, 27, 1.er piso, oficina 13',
                    'postal_code' => '07009',
                    'locality' => 'Palma de Mallorca',
                    'region' => 'Illes Balears',
                    'country' => 'ES',
                ],
                'footer_groups' => [
                    ['id' => 'services', 'title' => 'Servicios', 'links' => [
                        ['id' => 'all-services', 'label' => 'Todos los servicios', 'href' => '/servicios'],
                        ['id' => 'digital-solutions', 'label' => 'Soluciones digitales', 'href' => '/soluciones-digitales'],
                    ]],
                    ['id' => 'company', 'title' => 'PODARCIS', 'links' => [
                        ['id' => 'about', 'label' => 'Quiénes somos', 'href' => '/quienes-somos'],
                        ['id' => 'contact', 'label' => 'Contacto', 'href' => '/contacto'],
                        ['id' => 'blog', 'label' => 'Recursos', 'href' => '/blog'],
                    ]],
                    ['id' => 'legal', 'title' => 'Legal', 'links' => [
                        ['id' => 'notice', 'label' => 'Aviso legal', 'href' => '/aviso-legal'],
                        ['id' => 'privacy', 'label' => 'Privacidad', 'href' => '/politica-de-privacidad'],
                        ['id' => 'cookies', 'label' => 'Cookies', 'href' => '/politica-de-cookies'],
                    ]],
                ],
            ],
        );
    }

    private function home(): void
    {
        $page = Page::query()->firstOrNew(['slug' => 'inicio']);
        $blocks = is_array($page->blocks) ? $page->blocks : [];
        $blocks['hero'] = [
            ...($blocks['hero'] ?? []),
            'eyebrow' => 'Consultoría ambiental en Mallorca y Baleares',
            'title' => 'Consultoría ambiental para convertir obligaciones en decisiones claras',
            'highlightText' => 'decisiones claras',
            'primaryCta' => ['label' => 'Solicitar asesoramiento', 'href' => '/contacto'],
            'secondaryCta' => ['label' => 'Ver servicios', 'href' => '/servicios'],
            'imageAlt' => 'Equipo de consultoría ambiental de PODARCIS en Mallorca',
        ];

        $page->fill([
            'title' => 'Consultoría ambiental en Mallorca',
            'excerpt' => 'PODARCIS acompaña a empresas, promotores y administraciones de Mallorca y Baleares en evaluación ambiental, vigilancia de obras, sostenibilidad y cumplimiento.',
            'blocks' => $blocks,
            'seo_title' => 'Consultoría ambiental en Mallorca | PODARCIS',
            'seo_description' => 'Consultoría ambiental en Mallorca para evaluación ambiental, vigilancia de obras, huella de carbono, sostenibilidad y sistemas de gestión.',
            'status' => 'published',
            'published_at' => $page->published_at ?? now(),
        ])->save();
    }

    private function services(): void
    {
        $renames = [
            'vigilancia-ambiental-de-obra' => 'vigilancia-ambiental-de-obras',
            'huella-de-carbono' => 'calculo-de-huella-de-carbono',
            'circularidad' => 'plan-circularidad-sector-hotelero',
            'gestion-de-incidencias-uuupsapp' => 'uuupsapp',
        ];

        foreach ($renames as $old => $new) {
            if (! Service::query()->where('slug', $new)->exists()) {
                Service::query()->where('slug', $old)->update(['slug' => $new]);
            }
        }

        $services = [
            ['Estudios ambientales', 'estudios-ambientales', 'consulting', 'Evaluación y documentación ambiental para proyectos en Mallorca y Baleares.', 'leaf'],
            ['Vigilancia ambiental de obras', 'vigilancia-ambiental-de-obras', 'consulting', 'Seguimiento de condicionantes, incidencias y evidencias ambientales durante la ejecución de obras.', 'clipboard-check'],
            ['Cálculo de huella de carbono', 'calculo-de-huella-de-carbono', 'consulting', 'Inventario de emisiones, Registro balear y planes de reducción adaptados a cada organización.', 'chart-no-axes-column'],
            ['Sistemas de gestión', 'sistemas-de-gestion', 'consulting', 'Implantación y mejora de sistemas ISO de calidad, medio ambiente, seguridad, energía y seguridad de la información.', 'shield-check'],
            ['Consultoría de sostenibilidad y ESG', 'consultoria-sostenibilidad-esg', 'consulting', 'Estrategia ESG, indicadores y reporting de sostenibilidad con criterios verificables.', 'chart-spline'],
            ['Plan de circularidad para el sector hotelero', 'plan-circularidad-sector-hotelero', 'consulting', 'Diagnóstico, planificación y seguimiento de circularidad para establecimientos turísticos de Baleares.', 'recycle'],
            ['Cumplimiento de legislación ambiental', 'cumplimiento-legislacion-ambiental', 'consulting', 'Identificación y seguimiento de requisitos ambientales estatales, autonómicos y locales.', 'scale'],
            ['Formación ambiental', 'formacion', 'consulting', 'Formación práctica en normativa, gestión ambiental y sostenibilidad para equipos y responsables.', 'graduation-cap'],
            ['Visores cartográficos', 'visores-cartograficos', 'consulting', 'Visores GIS para consultar condicionantes territoriales, activos, incidencias y resultados de campo.', 'map'],
            ['Legislación Online', 'legislacion-online', 'digital', 'Plataforma para identificar, evaluar y mantener trazables los requisitos legales aplicables.', 'book-open'],
            ['UuupsApp', 'uuupsapp', 'digital', 'Gestión digital de incidencias, evidencias y acciones correctivas para equipos de campo.', 'monitor-cog'],
            ['ESG Suite Solutions', 'esg-suite-solutions', 'digital', 'Herramientas para recopilar indicadores ESG, controlar evidencias y preparar el reporting.', 'chart-spline'],
        ];

        foreach ($services as $index => [$title, $slug, $kind, $excerpt, $icon]) {
            $service = Service::query()->firstOrNew(['slug' => $slug]);
            $blocks = is_array($service->blocks) ? $service->blocks : [];
            $blocks['localContext'] = '<p>Aplicamos este servicio al marco normativo y operativo de Mallorca e Illes Balears, coordinando requisitos autonómicos, insulares y municipales cuando el proyecto lo exige.</p>';
            $existingFaqs = data_get($blocks, 'faqs');

            if (! is_array($existingFaqs)) {
                $blocks['faqs'] = [
                    ['id' => 'scope', 'question' => '¿Cómo se define el alcance del servicio?', 'answer' => 'Revisamos la actividad, ubicación, fase del proyecto y obligaciones aplicables antes de proponer trabajos y entregables.'],
                    ['id' => 'balearic', 'question' => '¿Trabajáis con normativa de Baleares?', 'answer' => 'Sí. El análisis incorpora la regulación autonómica y, cuando corresponde, los instrumentos insulares y municipales aplicables.'],
                ];
            }

            $description = $slug === 'visores-cartograficos'
                ? '<h2>Información territorial en una interfaz operativa</h2><p>Diseñamos visores cartográficos que reúnen capas ambientales, urbanísticas y de proyecto para consultar condicionantes sin depender de archivos dispersos.</p><h2>Datos, permisos y mantenimiento</h2><p>Definimos fuentes, estructura de capas, filtros, fichas, perfiles de acceso y proceso de actualización. El alcance puede incluir captura de datos de campo y conexión con inventarios existentes.</p><h2>Aplicaciones</h2><p>Son útiles para seguimiento de obras, inventarios ambientales, gestión de activos, incidencias y comunicación de resultados técnicos.</p>'
                : ($service->description ?: '<p>'.$excerpt.'</p><p>El trabajo se adapta a la fase del proyecto e incluye criterios técnicos, documentación y seguimiento de acciones.</p>');

            $service->fill([
                'title' => $title,
                'kind' => $kind,
                'excerpt' => $excerpt,
                'description' => $description,
                'icon' => $icon,
                'blocks' => $blocks,
                'seo_title' => $title.' en Mallorca | PODARCIS',
                'seo_description' => $excerpt.' Servicio técnico de PODARCIS en Mallorca y Baleares.',
                'sort_order' => ($index + 1) * 10,
                'status' => 'published',
                'published_at' => $service->published_at ?? now(),
            ])->save();
        }

        Service::query()
            ->whereIn('slug', ['double-u-certificate', 'formacion-medioambiental', 'gestion-de-incidencias-uuupsapp'])
            ->update(['status' => 'draft']);
    }

    private function landingPages(): void
    {
        $pages = [
            ['Evaluación de impacto ambiental', 'servicios/estudios-ambientales/evaluacion-impacto-ambiental', 'Tramitación y documentación técnica para valorar los efectos ambientales de proyectos en Mallorca y Baleares.'],
            ['Evaluación ambiental estratégica', 'servicios/estudios-ambientales/evaluacion-ambiental-estrategica', 'Evaluación de planes y programas con integración temprana de criterios ambientales.'],
            ['Evaluación de afecciones a Red Natura 2000', 'servicios/estudios-ambientales/red-natura-2000', 'Análisis de repercusiones sobre espacios, hábitats y especies de la Red Natura 2000.'],
            ['Estudio de impacto paisajístico', 'servicios/estudios-ambientales/impacto-paisajistico', 'Análisis de integración visual y medidas correctoras para proyectos con incidencia paisajística.'],
            ['Consultoría ISO 9001', 'servicios/sistemas-de-gestion/iso-9001', 'Implantación y mejora de sistemas de gestión de la calidad ISO 9001.'],
            ['Consultoría ISO 14001', 'servicios/sistemas-de-gestion/iso-14001', 'Sistemas de gestión ambiental ISO 14001 adaptados a los aspectos y obligaciones de la organización.'],
            ['Consultoría ISO 45001', 'servicios/sistemas-de-gestion/iso-45001', 'Sistemas de seguridad y salud en el trabajo conforme a ISO 45001.'],
            ['Consultoría ISO 27001', 'servicios/sistemas-de-gestion/iso-27001', 'Sistemas de gestión de seguridad de la información conforme a ISO 27001.'],
            ['Consultoría ISO 50001', 'servicios/sistemas-de-gestion/iso-50001', 'Sistemas de gestión de la energía para medir consumos y mejorar el desempeño energético.'],
        ];

        foreach ($pages as [$title, $slug, $excerpt]) {
            Page::query()->updateOrCreate(['slug' => $slug], [
                'title' => $title,
                'excerpt' => $excerpt,
                'content' => '<h2>Un alcance técnico ajustado al proyecto</h2><p>'.$excerpt.'</p><h2>Cómo trabajamos</h2><p>Partimos de la actividad, la ubicación y la fase de tramitación. Revisamos requisitos, documentación disponible y organismos implicados para definir entregables y próximos pasos.</p><h2>Aplicación en Mallorca y Baleares</h2><p>El trabajo considera el marco estatal, autonómico, insular y municipal que resulte aplicable, sin trasladar soluciones genéricas entre proyectos con condicionantes distintos.</p>',
                'seo_title' => $title.' en Mallorca | PODARCIS',
                'seo_description' => $excerpt.' Consulta a PODARCIS.',
                'status' => 'published',
                'published_at' => now(),
            ]);
        }
    }

    private function retirePlaceholderContent(): void
    {
        Post::query()->whereIn('slug', [
            'como-preparar-una-auditoria-ambiental',
            'datos-para-calcular-huella-carbono',
            'claves-gestionar-obligaciones-legales-ambientales',
        ])->update(['status' => 'draft']);

        SuccessCase::query()->whereIn('slug', [
            'control-ambiental-integral-actividad-industrial',
            'vigilancia-ambiental-ejecucion-obra',
        ])->update(['status' => 'draft']);

        Testimonial::query()->whereIn('name', [
            'Laura Martínez',
            'Javier Serrano',
            'Marta Soler',
        ])->update(['status' => 'draft']);

        $about = Page::query()->where('slug', 'quienes-somos')->first();
        $blocks = is_array($about?->blocks) ? $about->blocks : null;

        if ($about === null || $blocks === null || ! is_array($blocks['teamMembers'] ?? null)) {
            return;
        }

        $blocks['teamMembers'] = collect($blocks['teamMembers'])
            ->reject(fn (mixed $member): bool => is_array($member) && in_array($member['handle'] ?? null, ['javicodes', 'lauraambiental'], true))
            ->values()
            ->all();

        $about->update(['blocks' => $blocks]);
    }
}
