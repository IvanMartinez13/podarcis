import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Cpu,
    Factory,
    FileSearch,
    Quote,
    Sparkles,
    Sprout,
    Target,
    TrendingUp,
} from 'lucide-react';

import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { EmptyState } from '@/components/public/empty-state';
import { PublicHero } from '@/components/public/public-hero';
import { Section } from '@/components/public/section';
import { ServiceCard } from '@/components/public/service-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getServiceIcon } from '@/lib/cms-icons';
import * as contact from '@/routes/contact';
import * as servicesRoutes from '@/routes/services';
import type {
    CmsPost,
    CmsService,
    CmsSuccessCase,
    CmsTestimonial,
} from '@/types';

type WelcomeProps = {
    services: CmsService[];
    posts: CmsPost[];
    successCases: CmsSuccessCase[];
    testimonials: CmsTestimonial[];
};

const differentiators = [
    'Equipo técnico especializado en normativa ambiental, calidad y sostenibilidad.',
    'Metodología orientada a evidencias, auditoría y decisiones accionables.',
    'Herramientas digitales propias para reducir trabajo manual y mejorar seguimiento.',
    'Acompañamiento cercano para empresas, administraciones y organizaciones.',
];

const heroStats = [
    ['360º', 'visión técnica y operativa'],
    ['10+', 'líneas de servicio iniciales'],
    ['3', 'soluciones digitales propias'],
];

export default function Welcome({
    services,
    posts,
    successCases,
    testimonials,
}: WelcomeProps) {
    return (
        <>
            <Head title="Consultoría ambiental, calidad y sostenibilidad">
                <meta
                    content="PODARCIS combina consultoría técnica, auditoría especializada y herramientas digitales para ayudar a empresas a cumplir, medir y avanzar."
                    head-key="description"
                    name="description"
                />
            </Head>

            <PublicHero fadeTo="white">
                <div className="absolute top-24 right-[10%] hidden size-28 rounded-full border border-podarcis-green/20 motion-safe:animate-[podarcis-float_8s_ease-in-out_infinite] lg:block" />
                <Container className="relative grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
                    <div className="max-w-3xl">
                        <Badge className="border-white/15 bg-white/5 text-white shadow-lg shadow-black/10 backdrop-blur-sm">
                            <Sparkles className="size-3 text-podarcis-green" />
                            Consultoría ambiental, calidad y sostenibilidad
                        </Badge>
                        <h1 className="mt-6 max-w-4xl text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl">
                            Consultoría ambiental, calidad y sostenibilidad para
                            empresas que necesitan cumplir, medir y avanzar sin
                            perder tiempo.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                            Combinamos experiencia técnica, auditoría
                            especializada y herramientas digitales propias para
                            ayudar a empresas, administraciones y organizaciones
                            a gestionar sus obligaciones ambientales y de
                            calidad.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                asChild
                                className="bg-podarcis-green text-podarcis-navy shadow-xl shadow-podarcis-green/25 transition duration-300 hover:-translate-y-0.5 hover:bg-podarcis-green/90 hover:shadow-podarcis-green/40"
                                size="lg"
                            >
                                <Link href={contact.index()}>
                                    Solicitar asesoramiento
                                    <ArrowRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="border-white/25 bg-white/5 text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                                size="lg"
                                variant="outline"
                            >
                                <Link href={servicesRoutes.index()}>
                                    Ver servicios
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                            {heroStats.map(([value, label]) => (
                                <div
                                    className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-podarcis-green/40 hover:bg-white/10"
                                    key={value}
                                >
                                    <span className="block text-2xl font-semibold text-podarcis-green">
                                        {value}
                                    </span>
                                    <span className="mt-1 block text-sm text-white/65">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-6 rounded-lg bg-podarcis-green/15 blur-3xl" />
                        <div className="relative overflow-hidden rounded-lg border border-white/12 bg-podarcis-ink/18 p-4 shadow-2xl shadow-black/20 backdrop-blur-[2px]">
                            <div className="aspect-[4/3] rounded-md border border-white/10 bg-white/5 p-6">
                                <div className="flex h-full flex-col justify-between">
                                    <div>
                                        <span className="inline-flex rounded-md border border-podarcis-green/30 bg-podarcis-green/10 px-3 py-1 text-sm font-semibold text-podarcis-green">
                                            PODARCIS CMS
                                        </span>
                                        <p className="mt-5 max-w-sm text-2xl leading-tight font-semibold text-white">
                                            Datos técnicos, cumplimiento y
                                            seguimiento conectados.
                                        </p>
                                    </div>
                                    <div className="h-px w-full bg-linear-to-r from-podarcis-green/70 via-white/20 to-transparent" />
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {[
                                    [Factory, 'Industria'],
                                    [Building2, 'Administración'],
                                    [Target, 'Auditoría'],
                                    [TrendingUp, 'Indicadores'],
                                ].map(([Icon, label]) => (
                                    <div
                                        className="rounded-md border border-white/10 bg-white/5 p-4 backdrop-blur-[2px] transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                                        key={label as string}
                                    >
                                        <Icon
                                            className="size-5 text-podarcis-green"
                                            aria-hidden="true"
                                        />
                                        <span className="mt-3 block text-sm font-medium">
                                            {label as string}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </PublicHero>

            <Section
                eyebrow="Servicios destacados"
                id="servicios"
                title="Un CMS vivo empieza con servicios que ya se pueden consultar"
                description="Las líneas destacadas salen de base de datos y mantienen el diseño de tarjetas premium de la fase anterior."
            >
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((service) => (
                            <ServiceCard
                                description={service.excerpt ?? ''}
                                href={service.href}
                                icon={getServiceIcon(service.icon)}
                                key={service.slug}
                                label="Servicio"
                                title={service.title}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Todavía no hay servicios destacados"
                        description="Cuando el CMS publique servicios destacados aparecerán aquí automáticamente."
                    />
                )}
            </Section>

            <Section
                eyebrow="Método PODARCIS"
                title="Rigor técnico con una experiencia clara para equipos ocupados"
                className="bg-podarcis-surface"
            >
                <div className="grid gap-4 md:grid-cols-2">
                    {differentiators.map((item, index) => (
                        <div
                            className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-podarcis-green/60 hover:shadow-xl hover:shadow-slate-950/5"
                            key={item}
                        >
                            <span className="flex size-10 items-center justify-center rounded-lg bg-podarcis-navy text-sm font-semibold text-podarcis-green transition group-hover:scale-110">
                                0{index + 1}
                            </span>
                            <p className="mt-5 text-base leading-7 text-podarcis-muted">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                eyebrow="Ecosistema digital"
                id="software"
                title="Software propio para que el cumplimiento no viva en hojas sueltas"
                description="Legislación online, UuupsApp, Double U Certificate y visores cartográficos se integran con la consultoría para dar seguimiento real."
            >
                <div className="grid gap-5 lg:grid-cols-3">
                    {[
                        [
                            Cpu,
                            'Automatización',
                            'Menos trabajo manual y más trazabilidad de evidencias.',
                        ],
                        [
                            FileSearch,
                            'Control documental',
                            'Obligaciones, indicadores e incidencias ordenadas por proyecto.',
                        ],
                        [
                            Sprout,
                            'Mejora continua',
                            'Datos convertidos en decisiones ambientales y de calidad.',
                        ],
                    ].map(([Icon, title, text]) => (
                        <div
                            className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            key={title as string}
                        >
                            <Icon
                                className="size-7 text-podarcis-green"
                                aria-hidden="true"
                            />
                            <h3 className="mt-5 text-xl font-semibold text-podarcis-navy">
                                {title as string}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-podarcis-muted">
                                {text as string}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                eyebrow="Casos de éxito"
                id="casos"
                title="Resultados publicados desde el CMS"
                className="bg-podarcis-navy text-white"
            >
                {successCases.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {successCases.map((successCase) => (
                            <Link
                                className="group rounded-lg border border-white/10 bg-white/10 p-6 transition duration-300 hover:-translate-y-1 hover:border-podarcis-green/50 hover:bg-white/15"
                                href={successCase.href}
                                key={successCase.slug}
                            >
                                <Badge className="bg-podarcis-green text-podarcis-navy">
                                    {successCase.sector ?? 'Proyecto'}
                                </Badge>
                                <h3 className="mt-5 text-2xl font-semibold">
                                    {successCase.title}
                                </h3>
                                <p className="mt-4 leading-7 text-white/70">
                                    {successCase.result}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Todavía no hay casos publicados"
                        description="Los próximos casos de éxito se mostrarán aquí al publicarse desde el CMS."
                    />
                )}
            </Section>

            <Section
                eyebrow="Últimos artículos"
                id="blog"
                title="Criterio técnico para anticipar obligaciones"
            >
                {posts.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-3">
                        {posts.map((post) => (
                            <Link
                                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                href={post.href}
                                key={post.slug}
                            >
                                <img
                                    alt=""
                                    className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                                    src={
                                        post.featuredImage ??
                                        'https://placehold.co/900x620/F4F7F8/163247?text=PODARCIS'
                                    }
                                />
                                <div className="p-6">
                                    <Badge className="bg-podarcis-surface text-podarcis-navy">
                                        {post.category?.name ?? 'Blog'}
                                    </Badge>
                                    <h3 className="mt-4 text-xl font-semibold text-podarcis-navy">
                                        {post.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-podarcis-muted">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Todavía no hay artículos publicados"
                        description="Los contenidos del blog se cargarán aquí cuando estén publicados."
                    />
                )}
            </Section>

            {testimonials.length > 0 && (
                <Section
                    eyebrow="Confianza"
                    title="Clientes que valoran claridad, seguimiento y criterio"
                    className="bg-podarcis-surface"
                >
                    <div className="grid gap-5 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <div
                                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                                key={`${testimonial.name}-${testimonial.company}`}
                            >
                                <Quote
                                    className="size-6 text-podarcis-green"
                                    aria-hidden="true"
                                />
                                <p className="mt-5 leading-7 text-podarcis-muted">
                                    {testimonial.quote}
                                </p>
                                <div className="mt-6">
                                    <p className="font-semibold text-podarcis-navy">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-podarcis-muted">
                                        {[
                                            testimonial.position,
                                            testimonial.company,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            <CTASection
                title="Cuéntanos qué obligación, auditoría o proyecto necesitas resolver"
                description="Preparamos el siguiente paso con una visión técnica, clara y orientada a resultados."
                primaryHref={contact.index().url}
                primaryLabel="Ir a contacto"
                secondaryHref={servicesRoutes.index().url}
                secondaryLabel="Explorar servicios"
            />
        </>
    );
}
