import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    FileSearch,
    ShieldCheck,
} from 'lucide-react';

import casesBackgroundImage from '@/assets/casos-exito.webp';
import ctaEnvironmentImage from '@/assets/cta-environment.webp';
import digitalEcosystemImage from '@/assets/digital-ecosystem.webp';
import heroBackground960 from '@/assets/hero-background-v1-960.webp';
import heroBackground from '@/assets/hero-background-v1.webp';
import { CaseStudiesCollection } from '@/components/public/case-studies-collection';
import { Container } from '@/components/public/container';
import { DigitalSolutionCard } from '@/components/public/digital-solution-card';
import { PostCard } from '@/components/public/post-card';
import { PublicHero } from '@/components/public/public-hero';
import { PublicLink } from '@/components/public/public-link';
import { Reveal } from '@/components/public/reveal';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';
import { ServiceCard } from '@/components/public/service-card';
import { TestimonialsCarousel } from '@/components/public/testimonials-carousel';
import { Button } from '@/components/ui/button';
import { getServiceIcon } from '@/lib/cms-icons';
import { home } from '@/routes';
import * as contact from '@/routes/contact';
import * as digitalSolutionsRoutes from '@/routes/digital-solutions';
import * as servicesRoutes from '@/routes/services';
import type {
    CmsPage,
    CmsPost,
    CmsService,
    CmsSuccessCase,
    CmsTestimonial,
    HomePageBlocks,
} from '@/types';

type WelcomeProps = {
    digitalServices: CmsService[];
    home?: CmsPage | null;
    services: CmsService[];
    posts: CmsPost[];
    successCases: CmsSuccessCase[];
    testimonials: CmsTestimonial[];
};

const defaultBlocks: HomePageBlocks = {
    hero: {
        eyebrow: 'Consultoría técnica y soluciones digitales',
        title: 'Consultoría ambiental y tecnología para decisiones que generan impacto real',
        highlightText: 'avanzar con seguridad',
        primaryCta: {
            label: 'Solicitar asesoramiento',
            href: contact.index().url,
        },
        secondaryCta: {
            label: 'Explorar servicios',
            href: servicesRoutes.index().url,
        },
    },
    metrics: [
        { id: 'vision', value: '360º', label: 'visión técnica y operativa' },
        { id: 'services', value: '10+', label: 'líneas de servicio' },
        { id: 'solutions', value: '4', label: 'soluciones digitales propias' },
    ],
    services: {
        eyebrow: 'Servicios destacados',
        title: 'Soluciones clave para cumplir, medir y avanzar con criterio',
        description:
            'Consultoría especializada para ordenar obligaciones, evidencias y decisiones técnicas.',
        limit: 8,
    },
    methodology: {
        eyebrow: 'Método PODARCIS',
        title: 'Rigor técnico en cada etapa del proyecto',
        description:
            'Una secuencia clara para convertir obligaciones complejas en un sistema de trabajo útil.',
        steps: [
            {
                id: 'analyse',
                title: 'Analizamos',
                description:
                    'Entendemos el contexto, la normativa y las prioridades reales.',
            },
            {
                id: 'design',
                title: 'Diseñamos',
                description:
                    'Definimos una solución proporcionada, trazable y orientada a resultados.',
            },
            {
                id: 'implement',
                title: 'Implementamos',
                description:
                    'Acompañamos al equipo con criterio técnico y herramientas prácticas.',
            },
            {
                id: 'measure',
                title: 'Medimos y mejoramos',
                description:
                    'Seguimos evidencias e indicadores para sostener la mejora.',
            },
        ],
    },
    digital: {
        eyebrow: 'Soluciones digitales',
        title: 'Tecnología que transforma datos en decisiones',
        description:
            'Herramientas propias que aportan trazabilidad, control documental y seguimiento operativo.',
        features: [
            {
                id: 'evidence',
                title: 'Datos fiables',
                description: 'Información ordenada y disponible para decidir.',
                icon: 'chart',
            },
            {
                id: 'reports',
                title: 'Control documental',
                description: 'Obligaciones y evidencias siempre localizables.',
                icon: 'file',
            },
            {
                id: 'compliance',
                title: 'Cumplimiento claro',
                description: 'Seguimiento continuo sin procesos opacos.',
                icon: 'shield',
            },
        ],
        primaryCta: {
            label: 'Conocer nuestras soluciones',
            href: digitalSolutionsRoutes.index().url,
        },
        secondaryCta: {
            label: 'Solicitar demo',
            href: contact.index({
                query: { source: 'digital_solution_demo' },
            }).url,
        },
    },
    successCases: {
        eyebrow: 'Casos de éxito',
        title: 'Resultados que hablan por nuestro trabajo',
        description:
            'Proyectos donde el criterio técnico se convierte en decisiones y mejoras concretas.',
    },
    testimonials: {
        eyebrow: 'Confianza',
        title: 'Lo que nuestros clientes dicen',
        description:
            'Claridad, seguimiento y criterio técnico durante todo el proyecto.',
        autoplay: false,
    },
    posts: {
        eyebrow: 'Recursos',
        title: 'Lo último en sostenibilidad y gestión ambiental',
        description:
            'Criterio técnico para anticipar obligaciones y convertir información en decisiones.',
    },
    finalCta: {
        eyebrow: '¿Listo para avanzar?',
        title: 'Construyamos una solución que genere valor',
        description:
            'Cuéntanos el contexto y prepararemos contigo el siguiente paso.',
        primaryCta: {
            label: 'Hablemos de tu proyecto',
            href: contact.index().url,
        },
        secondaryCta: {
            label: 'Explorar servicios',
            href: servicesRoutes.index().url,
        },
    },
};

const benefitIcons = {
    chart: BarChart3,
    file: FileSearch,
    shield: ShieldCheck,
};

export default function Welcome({
    digitalServices,
    home: homePage,
    services,
    posts,
    successCases,
    testimonials,
}: WelcomeProps) {
    const blocks = {
        ...defaultBlocks,
        ...(homePage?.blocks as HomePageBlocks | undefined),
    };
    const hero = { ...defaultBlocks.hero, ...blocks.hero };
    const consultingServices = services.filter(
        (service) => service.kind !== 'digital',
    );
    const featuredDigitalServices = digitalServices
        .filter((service) => service.isFeatured !== false)
        .slice(0, 4);
    const title =
        hero.title ??
        homePage?.title ??
        'Consultoría ambiental y tecnología para decisiones que generan impacto real';
    const excerpt =
        homePage?.excerpt ??
        'Ayudamos a empresas, administraciones y organizaciones a gestionar sus obligaciones ambientales y de calidad combinando consultoría técnica, auditoría especializada y herramientas digitales propias.';

    return (
        <>
            <SeoHead
                title={
                    homePage?.seoTitle ??
                    'Consultoría ambiental, calidad y sostenibilidad'
                }
                description={homePage?.seoDescription ?? excerpt}
                image={homePage?.ogImage}
                canonical={home().url}
                jsonLd={{
                    '@type': 'WebPage',
                    '@id': '/#webpage',
                    url: '/',
                    name: homePage?.seoTitle ?? title,
                    isPartOf: { '@id': '/#website' },
                    about: { '@id': '/#organization' },
                    inLanguage: 'es-ES',
                }}
            />

            <PublicHero fadeTo="white">
                <picture className="absolute inset-0 z-0 overflow-hidden">
                    <source
                        media="(max-width: 767px)"
                        srcSet={hero.image ?? heroBackground960}
                    />
                    <img
                        alt={hero.imageAlt ?? ''}
                        className="size-full object-cover object-center md:object-[64%_center]"
                        decoding="async"
                        fetchPriority="high"
                        sizes="100vw"
                        src={hero.image ?? heroBackground}
                        srcSet={`${hero.image ?? heroBackground960} 960w, ${
                            hero.image ?? heroBackground
                        } 1600w`}
                    />
                </picture>
                <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(5,22,31,.98)_0%,rgba(5,22,31,.88)_38%,rgba(5,22,31,.42)_68%,rgba(5,22,31,.2)_100%)]" />
                <div className="absolute inset-0 z-0 bg-podarcis-ink/18" />
                <Container
                    size="wide"
                    className="relative z-10 flex min-h-[min(880px,100svh)] items-center py-16 sm:py-20 lg:py-24"
                >
                    <Reveal className="w-full max-w-[780px]">
                        {hero.eyebrow && (
                            <p className="text-xs font-semibold tracking-[0.16em] text-podarcis-green uppercase">
                                {hero.eyebrow}
                            </p>
                        )}
                        <h1 className="mt-5 text-[clamp(2.55rem,5vw,4.65rem)] leading-[1.03] font-semibold tracking-[-0.035em] text-balance">
                            <HighlightedTitle
                                title={title}
                                highlight={hero.highlightText}
                            />
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                            {excerpt}
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            {hero.primaryCta?.href && hero.primaryCta.label && (
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-podarcis-green text-podarcis-ink shadow-xl shadow-podarcis-green/20 hover:-translate-y-0.5 hover:bg-podarcis-green/90 motion-reduce:hover:translate-y-0"
                                >
                                    <PublicLink href={hero.primaryCta.href}>
                                        {hero.primaryCta.label}
                                        <ArrowRight
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </PublicLink>
                                </Button>
                            )}
                            {hero.secondaryCta?.href &&
                                hero.secondaryCta.label && (
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="border-white/25 bg-white/5 text-white hover:bg-white/12 hover:text-white"
                                    >
                                        <PublicLink
                                            href={hero.secondaryCta.href}
                                        >
                                            {hero.secondaryCta.label}
                                        </PublicLink>
                                    </Button>
                                )}
                        </div>
                        {blocks.metrics && blocks.metrics.length > 0 && (
                            <div className="mt-10 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
                                {blocks.metrics.slice(0, 4).map((metric) => (
                                    <div
                                        key={metric.id}
                                        className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                                    >
                                        <strong className="block text-2xl text-podarcis-green">
                                            {metric.value}
                                        </strong>
                                        <span className="mt-1 block text-xs leading-5 text-white/58">
                                            {metric.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Reveal>
                </Container>
            </PublicHero>

            {consultingServices.length > 0 && blocks.services?.title && (
                <Section
                    id="servicios"
                    eyebrow={blocks.services.eyebrow ?? undefined}
                    title={blocks.services.title}
                    description={blocks.services.description ?? undefined}
                >
                    <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {consultingServices
                            .slice(0, blocks.services.limit ?? 8)
                            .map((service) => (
                                <ServiceCard
                                    key={service.slug}
                                    title={service.title}
                                    description={service.excerpt ?? ''}
                                    href={service.href}
                                    icon={getServiceIcon(service.icon)}
                                />
                            ))}
                    </Reveal>
                    <div className="mt-8">
                        <Button asChild variant="outline">
                            <Link href={servicesRoutes.index()}>
                                Ver todos los servicios
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </Section>
            )}

            {blocks.methodology?.title &&
                blocks.methodology.steps &&
                blocks.methodology.steps.length > 0 && (
                    <Section
                        surface="muted"
                        eyebrow={blocks.methodology.eyebrow ?? undefined}
                        title={blocks.methodology.title}
                        description={
                            blocks.methodology.description ?? undefined
                        }
                    >
                        <Reveal className="relative grid gap-4 lg:grid-cols-4">
                            <div className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-linear-to-r from-transparent via-podarcis-green/55 to-transparent lg:block" />
                            {blocks.methodology.steps.map((step, index) => (
                                <article
                                    key={step.id}
                                    className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-podarcis-navy text-sm font-semibold text-podarcis-green">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="mt-6 text-xl font-semibold text-podarcis-navy">
                                        {step.title}
                                    </h3>
                                    {step.description && (
                                        <p className="mt-3 text-sm leading-6 text-podarcis-muted">
                                            {step.description}
                                        </p>
                                    )}
                                </article>
                            ))}
                        </Reveal>
                    </Section>
                )}

            {successCases.length > 0 && blocks.successCases?.title && (
                <Section
                    className="relative isolate overflow-hidden"
                    id="casos"
                    surface="navy"
                    background={
                        <>
                            <img
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 z-0 size-full object-cover"
                                height="821"
                                loading="lazy"
                                src={
                                    blocks.successCases.backgroundImage ??
                                    casesBackgroundImage
                                }
                                width="1916"
                            />
                            <div className="absolute inset-0 z-0 bg-podarcis-navy/86" />
                        </>
                    }
                    eyebrow={blocks.successCases.eyebrow ?? undefined}
                    title={blocks.successCases.title}
                    description={blocks.successCases.description ?? undefined}
                >
                    <Reveal>
                        <CaseStudiesCollection successCases={successCases} />
                    </Reveal>
                </Section>
            )}

            {blocks.digital?.title && (
                <Section
                    eyebrow={blocks.digital.eyebrow ?? undefined}
                    title={blocks.digital.title}
                    description={blocks.digital.description ?? undefined}
                >
                    <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
                        <Reveal className="grid gap-4">
                            {(
                                blocks.digital.features ??
                                blocks.digital.benefits ??
                                []
                            ).map((benefit) => {
                                const Icon =
                                    benefitIcons[
                                        benefit.icon as keyof typeof benefitIcons
                                    ] ?? CheckCircle2;

                                return (
                                    <article
                                        key={benefit.id}
                                        className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >
                                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                            <Icon
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-podarcis-navy">
                                                {benefit.title}
                                            </h3>
                                            {benefit.description && (
                                                <p className="mt-1 text-sm leading-6 text-podarcis-muted">
                                                    {benefit.description}
                                                </p>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                            <div className="mt-2 flex flex-wrap gap-3">
                                {(
                                    blocks.digital.primaryCta ??
                                    blocks.digital.cta
                                )?.href && (
                                    <Button
                                        asChild
                                        className="bg-podarcis-green text-podarcis-ink hover:bg-podarcis-green/90"
                                    >
                                        <PublicLink
                                            href={
                                                (blocks.digital.primaryCta ??
                                                    blocks.digital.cta)!.href
                                            }
                                        >
                                            {
                                                (blocks.digital.primaryCta ??
                                                    blocks.digital.cta)!.label
                                            }
                                            <ArrowRight className="size-4" />
                                        </PublicLink>
                                    </Button>
                                )}
                                {blocks.digital.secondaryCta?.href && (
                                    <Button asChild variant="outline">
                                        <PublicLink
                                            href={
                                                blocks.digital.secondaryCta.href
                                            }
                                        >
                                            {blocks.digital.secondaryCta.label}
                                        </PublicLink>
                                    </Button>
                                )}
                            </div>
                        </Reveal>

                        <Reveal className="relative min-h-[430px] overflow-hidden rounded-3xl bg-podarcis-ink p-6 text-white shadow-[0_35px_90px_-35px_rgba(7,25,35,.5)] sm:p-8">
                            <img
                                alt={blocks.digital.imageAlt ?? ''}
                                className="absolute inset-0 size-full object-cover"
                                height="960"
                                loading="lazy"
                                src={
                                    blocks.digital.image ??
                                    digitalEcosystemImage
                                }
                                width="1440"
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-podarcis-ink/96 via-podarcis-ink/72 to-podarcis-ink/30" />
                            <div className="relative z-10 min-h-[360px]">
                                {featuredDigitalServices.length > 0 && (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {featuredDigitalServices.map(
                                            (solution) => (
                                                <DigitalSolutionCard
                                                    compact
                                                    key={solution.slug}
                                                    solution={solution}
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </Section>
            )}

            {testimonials.length > 0 && blocks.testimonials?.title && (
                <Section
                    className="relative isolate overflow-hidden"
                    surface="navy"
                    background={
                        <>
                            <img
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 z-0 size-full scale-105 object-cover blur-[3px]"
                                height="711"
                                loading="lazy"
                                src={
                                    blocks.testimonials.backgroundImage ??
                                    ctaEnvironmentImage
                                }
                                width="1600"
                            />
                            <div className="absolute inset-0 z-0 bg-podarcis-ink/82" />
                        </>
                    }
                    eyebrow={blocks.testimonials.eyebrow ?? undefined}
                    title={blocks.testimonials.title}
                    description={blocks.testimonials.description ?? undefined}
                >
                    <TestimonialsCarousel
                        testimonials={testimonials}
                        autoplay={blocks.testimonials.autoplay}
                    />
                </Section>
            )}

            {posts.length > 0 && blocks.posts?.title && (
                <Section
                    eyebrow={blocks.posts.eyebrow ?? undefined}
                    title={blocks.posts.title}
                    description={blocks.posts.description ?? undefined}
                >
                    <Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </Reveal>
                </Section>
            )}

            {blocks.finalCta?.title && (
                <section className="relative overflow-hidden bg-podarcis-ink py-16 text-white sm:py-20">
                    <img
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 size-full object-cover"
                        height="711"
                        loading="lazy"
                        src={ctaEnvironmentImage}
                        width="1600"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-podarcis-ink via-podarcis-ink/86 to-podarcis-ink/35" />
                    <Container className="relative">
                        <Reveal className="grid gap-8 rounded-3xl border border-white/12 bg-white/6 p-7 backdrop-blur-sm sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div className="max-w-3xl">
                                {blocks.finalCta.eyebrow && (
                                    <p className="text-xs font-semibold tracking-[0.16em] text-podarcis-green uppercase">
                                        {blocks.finalCta.eyebrow}
                                    </p>
                                )}
                                <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance sm:text-4xl">
                                    {blocks.finalCta.title}
                                </h2>
                                {blocks.finalCta.description && (
                                    <p className="mt-4 max-w-2xl leading-7 text-white/65">
                                        {blocks.finalCta.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                {blocks.finalCta.primaryCta?.href && (
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-podarcis-green text-podarcis-ink hover:bg-podarcis-green/90"
                                    >
                                        <PublicLink
                                            href={
                                                blocks.finalCta.primaryCta.href
                                            }
                                        >
                                            {blocks.finalCta.primaryCta.label}
                                        </PublicLink>
                                    </Button>
                                )}
                                {blocks.finalCta.secondaryCta?.href && (
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                    >
                                        <PublicLink
                                            href={
                                                blocks.finalCta.secondaryCta
                                                    .href
                                            }
                                        >
                                            {blocks.finalCta.secondaryCta.label}
                                        </PublicLink>
                                    </Button>
                                )}
                            </div>
                        </Reveal>
                    </Container>
                </section>
            )}
        </>
    );
}

function HighlightedTitle({
    highlight,
    title,
}: {
    highlight?: string | null;
    title: string;
}) {
    if (!highlight || !title.includes(highlight)) {
        return title;
    }

    const [before, after] = title.split(highlight, 2);

    return (
        <>
            {before}
            <span className="text-podarcis-green">{highlight}</span>
            {after}
        </>
    );
}
