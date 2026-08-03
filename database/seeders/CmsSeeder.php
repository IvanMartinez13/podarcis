<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    /**
     * Seed the CMS starter content.
     */
    public function run(): void
    {
        $publishedAt = now()->subDay();

        $services = collect([
            ['Estudios ambientales', 'estudios-ambientales', 'Evaluaciones, informes y documentación técnica para proyectos con exigencias ambientales.', 'leaf', true],
            ['Vigilancia ambiental de obra', 'vigilancia-ambiental-de-obra', 'Seguimiento técnico, control de condicionantes y evidencias para obras y contratos.', 'clipboard-check', true],
            ['Huella de carbono', 'huella-de-carbono', 'Cálculo, registro y planes de reducción para convertir datos de actividad en decisiones.', 'bar-chart-3', true],
            ['Sistemas de gestión', 'sistemas-de-gestion', 'Implantación y mejora de sistemas de calidad, medio ambiente, seguridad y salud.', 'shield-check', true],
            ['Circularidad', 'circularidad', 'Diagnóstico y acciones para reducir residuos, optimizar recursos y avanzar en economía circular.', 'recycle', false],
            ['Legislación online', 'legislacion-online', 'Herramientas digitales para mantener obligaciones legales localizadas, trazadas y al día.', 'book-open', false],
            ['Gestión de incidencias UuupsApp', 'gestion-de-incidencias-uuupsapp', 'Registro y seguimiento de incidencias para equipos que necesitan actuar sin perder contexto.', 'monitor-cog', false],
            ['Double U Certificate', 'double-u-certificate', 'Soluciones de certificación y soporte documental para procesos de mejora y cumplimiento.', 'check-circle-2', false],
            ['Formación medioambiental', 'formacion-medioambiental', 'Programas formativos claros y aplicables para equipos técnicos, operaciones y dirección.', 'graduation-cap', false],
            ['Visores cartográficos', 'visores-cartograficos', 'Visualización territorial y mapas operativos para entender proyectos, riesgos y activos.', 'map', false],
        ])->mapWithKeys(function (array $service, int $index) use ($publishedAt): array {
            [$title, $slug, $excerpt, $icon, $featured] = $service;

            $model = Service::query()->firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => $title,
                    'kind' => in_array($slug, ['legislacion-online', 'gestion-de-incidencias-uuupsapp', 'double-u-certificate', 'visores-cartograficos'], true)
                        ? 'digital'
                        : 'consulting',
                    'excerpt' => $excerpt,
                    'description' => $excerpt.' PODARCIS acompaña el proceso completo: diagnóstico, documentación, seguimiento técnico y mejora continua con criterios claros para dirección y equipos operativos.',
                    'icon' => $icon,
                    'featured_image' => null,
                    'featured_image_alt' => null,
                    'logo_image' => null,
                    'logo_image_alt' => null,
                    'seo_title' => $title.' | PODARCIS',
                    'seo_description' => $excerpt,
                    'is_featured' => $featured,
                    'sort_order' => ($index + 1) * 10,
                    'status' => 'published',
                    'published_at' => $publishedAt,
                ],
            );

            return [$slug => $model];
        });

        collect([
            ['Auditoría', 'auditoria'],
            ['Sostenibilidad', 'sostenibilidad'],
            ['Legislación', 'legislacion'],
            ['Calidad', 'calidad'],
            ['Economía circular', 'economia-circular'],
            ['Tecnología ambiental', 'tecnologia-ambiental'],
        ])->each(fn (array $category): Category => Category::query()->firstOrCreate(
            ['slug' => $category[1]],
            [
                'name' => $category[0],
                'description' => 'Contenido especializado de PODARCIS sobre '.$category[0].'.',
                'type' => 'post',
            ],
        ));

        $author = User::query()->first();

        collect([
            ['Cómo preparar una auditoría ambiental sin convertirla en una urgencia', 'como-preparar-una-auditoria-ambiental', 'Auditoría', 'auditoria'],
            ['Qué datos necesitas para calcular la huella de carbono', 'datos-para-calcular-huella-carbono', 'Sostenibilidad', 'sostenibilidad'],
            ['Claves para gestionar obligaciones legales ambientales', 'claves-gestionar-obligaciones-legales-ambientales', 'Legislación', 'legislacion'],
        ])->each(function (array $post, int $index) use ($author, $publishedAt): void {
            [$title, $slug, $label, $categorySlug] = $post;

            Post::query()->firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => $title,
                    'excerpt' => "Una guía práctica de {$label} para anticipar riesgos, ordenar evidencias y tomar mejores decisiones.",
                    'content' => "En PODARCIS abordamos {$label} con una metodología orientada a datos, cumplimiento y trazabilidad.\n\nEste contenido resume criterios prácticos para equipos que necesitan avanzar sin convertir cada obligación en una urgencia.\n\nLa clave está en combinar planificación, evidencias actualizadas y herramientas que reduzcan trabajo manual.",
                    'featured_image' => null,
                    'featured_image_alt' => null,
                    'category_id' => Category::query()->where('slug', $categorySlug)->value('id'),
                    'author_id' => $author?->id,
                    'seo_title' => $title.' | PODARCIS',
                    'seo_description' => "Artículo de PODARCIS sobre {$label}.",
                    'status' => 'published',
                    'published_at' => $publishedAt->copy()->subDays($index),
                ],
            );
        });

        collect([
            ['Laura Martínez', 'Directora de operaciones', 'Empresa industrial', 'PODARCIS nos ayudó a convertir obligaciones dispersas en un sistema claro, medible y mucho más fácil de mantener.'],
            ['Javier Serrano', 'Responsable de calidad', 'Servicios técnicos', 'El acompañamiento fue muy práctico: documentación ordenada, criterios claros y seguimiento cercano.'],
            ['Marta Soler', 'Gerente', 'Organización multisede', 'Su combinación de consultoría y herramientas digitales redujo mucho el trabajo manual del equipo.'],
        ])->each(fn (array $testimonial, int $index): Testimonial => Testimonial::query()->firstOrCreate(
            ['name' => $testimonial[0], 'company' => $testimonial[2]],
            [
                'position' => $testimonial[1],
                'quote' => $testimonial[3],
                'is_featured' => true,
                'sort_order' => ($index + 1) * 10,
                'status' => 'draft',
            ],
        ));

        collect([
            ['Control ambiental integral para actividad industrial', 'control-ambiental-integral-actividad-industrial', 'Industria', 'Plan de cumplimiento, seguimiento documental y reducción de riesgos operativos.', 'estudios-ambientales'],
            ['Vigilancia ambiental en ejecución de obra', 'vigilancia-ambiental-ejecucion-obra', 'Obra civil', 'Trazabilidad de condicionantes, incidencias y reportes para dirección facultativa.', 'vigilancia-ambiental-de-obra'],
        ])->each(function (array $successCase, int $index) use ($publishedAt, $services): void {
            [$title, $slug, $sector, $result, $serviceSlug] = $successCase;

            SuccessCase::query()->firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => $title,
                    'client_name' => null,
                    'sector' => $sector,
                    'challenge' => 'El cliente necesitaba ordenar obligaciones, evidencias y seguimiento técnico sin frenar la operación diaria.',
                    'solution' => 'PODARCIS definió una hoja de ruta técnica, indicadores de control y documentación preparada para auditoría.',
                    'result' => $result,
                    'featured_image' => null,
                    'featured_image_alt' => null,
                    'service_id' => $services[$serviceSlug]->id,
                    'seo_title' => $title.' | PODARCIS',
                    'seo_description' => $result,
                    'status' => 'draft',
                    'published_at' => $publishedAt->copy()->subDays($index),
                ],
            );
        });

        Page::query()->firstOrCreate(
            ['slug' => 'quienes-somos'],
            [
                'title' => 'Quiénes somos',
                'excerpt' => 'PODARCIS es una consultoría técnica especializada en medio ambiente, calidad, sostenibilidad y herramientas digitales.',
                'content' => "Trabajamos con empresas, administraciones y organizaciones que necesitan cumplir, medir y avanzar con rigor.\n\nNuestro enfoque combina experiencia técnica, cercanía y soluciones digitales propias para transformar obligaciones complejas en procesos claros.",
                'blocks' => [
                    'teamCoverImage' => null,
                    'teamMembers' => [
                        [
                            'name' => 'Javi A. Torres',
                            'title' => 'Software Engineer',
                            'handle' => 'javicodes',
                            'status' => 'Disponible',
                            'linkedinUrl' => null,
                            'avatarUrl' => null,
                        ],
                        [
                            'name' => 'Laura Martínez',
                            'title' => 'Consultora ambiental',
                            'handle' => 'lauraambiental',
                            'status' => 'Online',
                            'linkedinUrl' => null,
                            'avatarUrl' => null,
                        ],
                    ],
                ],
                'seo_title' => 'Quiénes somos | PODARCIS',
                'seo_description' => 'Conoce el enfoque técnico y digital de PODARCIS.',
                'status' => 'published',
                'published_at' => $publishedAt,
            ],
        );

        Page::query()->firstOrCreate(
            ['slug' => 'contacto'],
            [
                'title' => 'Contacto',
                'excerpt' => 'Cuéntanos qué obligación, auditoría o proyecto necesitas resolver.',
                'content' => 'El equipo de PODARCIS revisará tu solicitud y preparará el siguiente paso.',
                'seo_title' => 'Contacto | PODARCIS',
                'seo_description' => 'Contacta con PODARCIS para servicios ambientales, calidad y sostenibilidad.',
                'status' => 'published',
                'published_at' => $publishedAt,
            ],
        );

        Page::query()->firstOrCreate(
            ['slug' => 'inicio'],
            [
                'title' => 'Consultoría ambiental, calidad y sostenibilidad',
                'excerpt' => 'PODARCIS combina consultoría técnica, auditoría especializada y herramientas digitales para ayudar a empresas a cumplir, medir y avanzar.',
                'blocks' => [
                    'hero' => [
                        'eyebrow' => 'Consultoría ambiental y soluciones digitales',
                        'title' => 'Consultoría ambiental y tecnología para decisiones que generan impacto real',
                        'highlightText' => 'avanzar con seguridad',
                        'imageAlt' => 'Consultoría ambiental y sostenibilidad PODARCIS',
                        'primaryCta' => ['label' => 'Solicitar asesoramiento', 'href' => '/contacto'],
                        'secondaryCta' => ['label' => 'Ver servicios', 'href' => '/servicios'],
                    ],
                    'metrics' => [
                        ['id' => 'vision', 'value' => '360º', 'label' => 'visión técnica y operativa'],
                        ['id' => 'services', 'value' => '10+', 'label' => 'líneas de servicio iniciales'],
                        ['id' => 'digital', 'value' => '4', 'label' => 'soluciones digitales propias'],
                    ],
                    'services' => [
                        'eyebrow' => 'Servicios destacados',
                        'title' => 'Servicios clave para cumplir, medir y avanzar con criterio',
                        'description' => 'Seleccionamos las líneas de trabajo más relevantes para ayudarte a ordenar obligaciones, evidencias y decisiones técnicas desde el primer paso.',
                        'limit' => 8,
                    ],
                    'methodology' => [
                        'eyebrow' => 'Método PODARCIS',
                        'title' => 'Rigor técnico con una experiencia clara para equipos ocupados',
                        'steps' => [
                            ['id' => 'expertise', 'title' => 'Especialización', 'description' => 'Equipo técnico especializado en normativa ambiental, calidad y sostenibilidad.'],
                            ['id' => 'evidence', 'title' => 'Evidencias', 'description' => 'Metodología orientada a evidencias, auditoría y decisiones accionables.'],
                            ['id' => 'tools', 'title' => 'Herramientas', 'description' => 'Herramientas digitales propias para reducir trabajo manual y mejorar seguimiento.'],
                            ['id' => 'support', 'title' => 'Acompañamiento', 'description' => 'Acompañamiento cercano para empresas, administraciones y organizaciones.'],
                        ],
                    ],
                    'digital' => [
                        'eyebrow' => 'Ecosistema digital',
                        'title' => 'Software propio para que el cumplimiento no viva en hojas sueltas',
                        'description' => 'Legislación online, UuupsApp, Double U Certificate y visores cartográficos se integran con la consultoría para dar seguimiento real.',
                        'features' => [
                            ['id' => 'automation', 'title' => 'Automatización', 'description' => 'Menos trabajo manual y más trazabilidad de evidencias.'],
                            ['id' => 'documents', 'title' => 'Control documental', 'description' => 'Obligaciones, indicadores e incidencias ordenadas por proyecto.'],
                            ['id' => 'improvement', 'title' => 'Mejora continua', 'description' => 'Datos convertidos en decisiones ambientales y de calidad.'],
                        ],
                        'primaryCta' => ['label' => 'Conocer nuestras soluciones', 'href' => '/soluciones-digitales'],
                        'secondaryCta' => ['label' => 'Solicitar una demo', 'href' => '/contacto?source=digital_solution_demo'],
                    ],
                    'successCases' => ['eyebrow' => 'Casos de éxito', 'title' => 'Resultados que hablan por nosotros'],
                    'testimonials' => ['eyebrow' => 'Confianza', 'title' => 'Lo que nuestros clientes dicen', 'autoplay' => false, 'backgroundImage' => null],
                    'posts' => ['eyebrow' => 'Últimos artículos', 'title' => 'Criterio técnico para anticipar obligaciones'],
                    'finalCta' => [
                        'eyebrow' => '¿Listo para avanzar?',
                        'title' => 'Cuéntanos qué obligación, auditoría o proyecto necesitas resolver',
                        'description' => 'Preparamos el siguiente paso con una visión técnica, clara y orientada a resultados.',
                        'primaryCta' => ['label' => 'Ir a contacto', 'href' => '/contacto'],
                        'secondaryCta' => ['label' => 'Explorar servicios', 'href' => '/servicios'],
                    ],
                ],
                'seo_title' => 'Consultoría ambiental, calidad y sostenibilidad | PODARCIS',
                'seo_description' => 'PODARCIS combina consultoría técnica, auditoría especializada y herramientas digitales para ayudar a empresas a cumplir, medir y avanzar.',
                'status' => 'published',
                'published_at' => $publishedAt,
            ],
        );

        collect([
            ['Servicios', 'servicios', 'Consultoría técnica y soluciones digitales para gestionar obligaciones ambientales, calidad y sostenibilidad.'],
            ['Soluciones digitales', 'soluciones-digitales', 'Herramientas digitales para ordenar obligaciones, evidencias, incidencias y seguimiento ambiental.'],
            ['Blog', 'blog', 'Criterio técnico y recursos para anticipar obligaciones ambientales y de calidad.'],
            ['Casos de éxito', 'casos-de-exito', 'Proyectos publicados por PODARCIS para ordenar obligaciones, evidencias y seguimiento técnico.'],
        ])->each(fn (array $page): Page => Page::query()->firstOrCreate(
            ['slug' => $page[1]],
            [
                'title' => $page[0],
                'excerpt' => $page[2],
                'seo_title' => $page[0].' | PODARCIS',
                'seo_description' => $page[2],
                'status' => 'published',
                'published_at' => $publishedAt,
            ],
        ));
    }
}
