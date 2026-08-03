import { Link } from '@inertiajs/react';

import { CaseStudyCard } from '@/components/public/case-study-card';
import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';
import { Badge } from '@/components/ui/badge';
import * as contact from '@/routes/contact';
import * as successCasesRoutes from '@/routes/success-cases';
import type { CmsSuccessCase } from '@/types';

type SuccessCaseShowProps = {
    successCase: CmsSuccessCase;
    relatedSuccessCases: CmsSuccessCase[];
};

export default function SuccessCaseShow({
    successCase,
    relatedSuccessCases,
}: SuccessCaseShowProps) {
    const details = [
        ['Reto', successCase.challenge],
        ['Solución', successCase.solution],
        ['Resultado', successCase.result],
    ].filter((entry): entry is [string, string] => Boolean(entry[1]));

    return (
        <>
            <SeoHead
                title={successCase.seoTitle ?? successCase.title}
                description={
                    successCase.seoDescription ??
                    successCase.excerpt ??
                    successCase.result
                }
                image={successCase.featuredImage}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'CreativeWork',
                    name: successCase.title,
                    description:
                        successCase.seoDescription ??
                        successCase.excerpt ??
                        successCase.result,
                    creator: {
                        '@type': 'Organization',
                        name: 'PODARCIS',
                    },
                }}
            />

            <PublicHero as="header">
                <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_.85fr] lg:items-center lg:py-24">
                    <div>
                        <Link
                            className="text-sm font-semibold text-podarcis-green"
                            href={successCasesRoutes.index()}
                        >
                            Casos de éxito
                        </Link>
                        <h1 className="mt-6 text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl">
                            {successCase.title}
                        </h1>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {successCase.clientName && (
                                <Badge className="bg-white/10 text-white">
                                    {successCase.clientName}
                                </Badge>
                            )}
                            {successCase.sector && (
                                <Badge className="bg-podarcis-green text-podarcis-ink">
                                    {successCase.sector}
                                </Badge>
                            )}
                            {successCase.service && (
                                <Badge className="bg-white/10 text-white">
                                    {successCase.service.title}
                                </Badge>
                            )}
                        </div>
                        {successCase.excerpt && (
                            <p className="mt-6 text-lg leading-8 text-white/68">
                                {successCase.excerpt}
                            </p>
                        )}
                    </div>
                    {successCase.featuredImage ? (
                        <img
                            alt={successCase.imageAlt ?? ''}
                            className="aspect-[4/3] rounded-3xl object-cover shadow-2xl shadow-black/20"
                            src={successCase.featuredImage}
                            width="900"
                            height="675"
                            fetchPriority="high"
                        />
                    ) : (
                        <div className="aspect-[4/3] rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_72%_22%,rgba(37,227,49,.2),transparent_28%),linear-gradient(145deg,#163247,#071923)]" />
                    )}
                </Container>
            </PublicHero>

            {details.length > 0 && (
                <Section
                    eyebrow="El proyecto"
                    title="Del contexto inicial al resultado"
                >
                    <div className="grid gap-5 lg:grid-cols-3">
                        {details.map(([title, text], index) => (
                            <article
                                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                                key={title}
                            >
                                <span className="text-sm font-semibold text-emerald-700">
                                    0{index + 1} · {title}
                                </span>
                                <p className="mt-5 leading-7 text-podarcis-muted">
                                    {text}
                                </p>
                            </article>
                        ))}
                    </div>
                </Section>
            )}

            {relatedSuccessCases.length > 0 && (
                <Section
                    surface="navy"
                    eyebrow="Casos relacionados"
                    title="Más proyectos en un contexto técnico similar"
                >
                    <div className="grid gap-5 lg:grid-cols-3">
                        {relatedSuccessCases.map((relatedCase) => (
                            <CaseStudyCard
                                key={relatedCase.slug}
                                successCase={relatedCase}
                            />
                        ))}
                    </div>
                </Section>
            )}

            <CTASection
                title="¿Quieres analizar un reto similar?"
                description="Revisamos tu contexto y planteamos un camino técnico viable."
                primaryHref={contact.index().url}
                primaryLabel="Hablemos"
            />
        </>
    );
}
