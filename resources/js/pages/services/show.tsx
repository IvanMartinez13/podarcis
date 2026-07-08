import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { createElement } from 'react';

import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { EmptyState } from '@/components/public/empty-state';
import { PublicHero } from '@/components/public/public-hero';
import { Section } from '@/components/public/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getServiceIcon } from '@/lib/cms-icons';
import * as contact from '@/routes/contact';
import * as servicesRoutes from '@/routes/services';
import type { CmsService, CmsSuccessCase } from '@/types';

type ServiceShowProps = {
    service: CmsService;
    successCases: CmsSuccessCase[];
};

export default function ServiceShow({
    service,
    successCases,
}: ServiceShowProps) {
    return (
        <>
            <Head title={service.seoTitle ?? service.title}>
                {service.seoDescription && (
                    <meta
                        content={service.seoDescription}
                        head-key="description"
                        name="description"
                    />
                )}
            </Head>

            <PublicHero className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                    <div>
                        <Badge className="bg-podarcis-green text-podarcis-navy">
                            Servicio PODARCIS
                        </Badge>
                        <h1 className="mt-6 max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
                            {service.title}
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                            {service.excerpt}
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                asChild
                                className="bg-podarcis-green text-podarcis-navy"
                            >
                                <Link
                                    href={contact.index({
                                        query: { service: service.slug },
                                    })}
                                >
                                    Solicitar asesoramiento
                                    <ArrowRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                                <Link href={servicesRoutes.index()}>
                                    Ver todos los servicios
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/15 backdrop-blur-[2px]">
                        {createElement(getServiceIcon(service.icon), {
                            'aria-hidden': true,
                            className: 'size-12 text-podarcis-green',
                        })}
                        <img
                            alt=""
                            className="mt-8 aspect-[4/3] w-full rounded-md object-cover"
                            src={
                                service.featuredImage ??
                                'https://placehold.co/900x680/163247/FFFFFF?text=Servicio+PODARCIS'
                            }
                        />
                    </div>
                </Container>
            </PublicHero>

            <Section
                eyebrow="Detalle"
                title="Un servicio pensado para pasar del diagnóstico a la acción"
            >
                <div className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
                    <div className="rounded-lg bg-podarcis-surface p-6">
                        {[
                            'Diagnóstico técnico',
                            'Documentación trazable',
                            'Seguimiento operativo',
                        ].map((item) => (
                            <div
                                className="flex gap-3 border-b border-slate-200 py-4 last:border-0"
                                key={item}
                            >
                                <CheckCircle2
                                    className="mt-0.5 size-5 text-podarcis-green"
                                    aria-hidden="true"
                                />
                                <span className="font-medium text-podarcis-navy">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="prose prose-slate max-w-none">
                        {(service.description ?? service.excerpt ?? '')
                            .split('\n')
                            .map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                    </div>
                </div>
            </Section>

            <Section
                eyebrow="Casos relacionados"
                title="Aplicaciones reales de este servicio"
                className="bg-podarcis-surface"
            >
                {successCases.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-3">
                        {successCases.map((successCase) => (
                            <Link
                                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                href={successCase.href}
                                key={successCase.slug}
                            >
                                <Badge className="bg-podarcis-surface text-podarcis-navy">
                                    {successCase.sector ?? 'Caso'}
                                </Badge>
                                <h3 className="mt-4 text-xl font-semibold text-podarcis-navy">
                                    {successCase.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-podarcis-muted">
                                    {successCase.excerpt ?? successCase.result}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Sin casos relacionados publicados"
                        description="Los casos asociados a este servicio aparecerán aquí cuando se publiquen."
                    />
                )}
            </Section>

            <CTASection
                title="Hablemos de este servicio"
                description="Revisamos tu punto de partida y te proponemos un camino práctico."
                primaryHref={
                    contact.index({ query: { service: service.slug } }).url
                }
                primaryLabel="Contactar"
            />
        </>
    );
}
