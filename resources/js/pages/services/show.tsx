import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { createElement } from 'react';

import { Breadcrumbs, breadcrumbSchema } from '@/components/public/breadcrumbs';
import { CaseStudyCard } from '@/components/public/case-study-card';
import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
import { RichText } from '@/components/public/rich-text';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getServiceIcon } from '@/lib/cms-icons';
import * as contact from '@/routes/contact';
import * as digitalSolutions from '@/routes/digital-solutions';
import * as servicesRoutes from '@/routes/services';
import type { CmsService, CmsSuccessCase, SharedPageProps } from '@/types';

type ServiceShowProps = {
    service: CmsService;
    successCases: CmsSuccessCase[];
};

export default function ServiceShow({
    service,
    successCases,
}: ServiceShowProps) {
    const benefits = service.blocks?.benefits ?? [];
    const { seo } = usePage<SharedPageProps>().props;
    const faqs =
        service.blocks?.faqs?.filter((faq) => faq.question && faq.answer) ?? [];
    const indexRoute =
        service.kind === 'digital'
            ? digitalSolutions.index()
            : servicesRoutes.index();
    const breadcrumbs = [
        { label: 'Inicio', href: '/' },
        {
            label:
                service.kind === 'digital'
                    ? 'Soluciones digitales'
                    : 'Servicios',
            href: indexRoute.url,
        },
        { label: service.title, href: service.href },
    ];

    return (
        <>
            <SeoHead
                title={service.seoTitle ?? service.title}
                description={service.seoDescription ?? service.excerpt}
                image={service.featuredImage}
                jsonLd={[
                    {
                        '@type': 'Service',
                        name: service.title,
                        description: service.seoDescription ?? service.excerpt,
                        provider: { '@id': `${seo.baseUrl}/#organization` },
                        areaServed: ['Mallorca', 'Illes Balears'],
                    },
                    breadcrumbSchema(breadcrumbs),
                    ...(faqs.length > 0
                        ? [
                              {
                                  '@type': 'FAQPage',
                                  mainEntity: faqs.map((faq) => ({
                                      '@type': 'Question',
                                      name: faq.question,
                                      acceptedAnswer: {
                                          '@type': 'Answer',
                                          text: faq.answer,
                                      },
                                  })),
                              },
                          ]
                        : []),
                ]}
            />

            <PublicHero as="header" backgroundImage={service.featuredImage}>
                <Container className="py-16 sm:py-20 lg:py-24">
                    <div className="max-w-4xl">
                        <Badge className="bg-podarcis-green text-podarcis-ink">
                            {service.kind === 'digital'
                                ? 'Solución digital'
                                : 'Servicio'}
                        </Badge>
                        <div className="mt-6 flex items-start gap-4">
                            {service.logoImage && (
                                <img
                                    alt={service.logoImageAlt ?? ''}
                                    className="max-h-14 max-w-40 shrink-0 rounded-lg border border-white/12 bg-white/6 object-contain object-left p-2"
                                    height="56"
                                    loading="lazy"
                                    src={service.logoImage}
                                    width="160"
                                />
                            )}
                            <div className="flex items-center gap-3">
                                {createElement(getServiceIcon(service.icon), {
                                    'aria-hidden': true,
                                    className:
                                        'size-8 shrink-0 text-podarcis-green sm:size-9',
                                })}
                                <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl">
                                    {service.title}
                                </h1>
                            </div>
                        </div>
                        {service.excerpt && (
                            <RichText
                                className="mt-6 max-w-2xl text-lg leading-8 text-white/68 [&_a]:text-white [&_a]:decoration-white/50"
                                html={service.excerpt}
                            />
                        )}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                asChild
                                className="bg-podarcis-green text-podarcis-ink hover:bg-podarcis-green/90"
                            >
                                <Link
                                    href={contact.index({
                                        query: { service: service.slug },
                                    })}
                                >
                                    Solicitar asesoramiento
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                                <Link href={indexRoute}>
                                    {service.kind === 'digital'
                                        ? 'Ver todas las soluciones'
                                        : 'Ver todos los servicios'}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </Container>
            </PublicHero>
            <Breadcrumbs items={breadcrumbs} />

            <Section
                eyebrow="En detalle"
                title="Del diagnóstico a una solución aplicable"
                description={service.blocks?.detail ?? undefined}
            >
                <div
                    className={
                        benefits.length > 0
                            ? 'grid gap-10 lg:grid-cols-[.65fr_1fr]'
                            : 'mx-auto max-w-4xl'
                    }
                >
                    {benefits.length > 0 && (
                        <div className="rounded-2xl bg-podarcis-surface p-6">
                            {benefits.map((item) => (
                                <div
                                    className="flex gap-3 border-b border-slate-200 py-4 last:border-0"
                                    key={item.id}
                                >
                                    <CheckCircle2
                                        className="mt-0.5 size-5 text-emerald-600"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        <span className="font-medium text-podarcis-navy">
                                            {item.title}
                                        </span>
                                        {item.description && (
                                            <span className="mt-1 block text-sm leading-6 text-podarcis-muted">
                                                {item.description}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    <RichText
                        className="text-lg leading-8 text-podarcis-muted"
                        html={service.description ?? service.excerpt}
                    />
                </div>
            </Section>

            {service.blocks?.localContext && (
                <Section
                    surface="muted"
                    eyebrow="Mallorca y Baleares"
                    title="Experiencia aplicada al contexto local"
                >
                    <RichText
                        className="mx-auto max-w-4xl text-lg leading-8 text-podarcis-muted"
                        html={service.blocks.localContext}
                    />
                </Section>
            )}

            {faqs.length > 0 && (
                <Section
                    eyebrow="Preguntas frecuentes"
                    title="Dudas habituales sobre el servicio"
                >
                    <div className="mx-auto max-w-4xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
                        {faqs.map((faq) => (
                            <details className="group py-5" key={faq.id}>
                                <summary className="cursor-pointer list-none pr-8 font-semibold text-podarcis-navy">
                                    {faq.question}
                                </summary>
                                <p className="mt-3 leading-7 text-podarcis-muted">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </Section>
            )}

            {successCases.length > 0 && (
                <Section
                    surface="navy"
                    eyebrow="Casos relacionados"
                    title="Aplicaciones reales de este servicio"
                >
                    <div className="grid gap-5 lg:grid-cols-3">
                        {successCases.map((successCase) => (
                            <CaseStudyCard
                                key={successCase.slug}
                                successCase={successCase}
                            />
                        ))}
                    </div>
                </Section>
            )}

            <CTASection
                title="Hablemos de este servicio"
                description="Revisamos tu punto de partida y proponemos un camino técnico viable."
                primaryHref={
                    service.blocks?.cta?.href ??
                    contact.index({ query: { service: service.slug } }).url
                }
                primaryLabel={service.blocks?.cta?.label ?? 'Contactar'}
            />
        </>
    );
}
