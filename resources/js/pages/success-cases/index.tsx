import { CaseStudyCard } from '@/components/public/case-study-card';
import { Container } from '@/components/public/container';
import { PublicHero } from '@/components/public/public-hero';
import { Reveal } from '@/components/public/reveal';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';
import type { CmsPage, CmsSuccessCase } from '@/types';

type SuccessCasesIndexProps = {
    page?: CmsPage | null;
    successCases: CmsSuccessCase[];
};

export default function SuccessCasesIndex({
    page,
    successCases,
}: SuccessCasesIndexProps) {
    const title =
        page?.title ??
        'Proyectos donde el criterio técnico se convierte en resultados';
    const excerpt =
        page?.excerpt ??
        'Una selección de trabajos ambientales, de calidad y sostenibilidad desarrollados por PODARCIS.';

    return (
        <>
            <SeoHead
                title={page?.seoTitle ?? 'Casos de éxito'}
                description={page?.seoDescription ?? excerpt}
                image={page?.ogImage}
            />
            <PublicHero as="header">
                <Container className="py-16 sm:py-20 lg:py-24">
                    <p className="text-xs font-semibold tracking-[0.16em] text-podarcis-green uppercase">
                        Casos de éxito
                    </p>
                    <h1 className="mt-5 max-w-4xl text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                        {excerpt}
                    </p>
                </Container>
            </PublicHero>

            {successCases.length > 0 && (
                <Section surface="navy">
                    <Reveal className="grid gap-5 lg:grid-cols-2">
                        {successCases.map((successCase) => (
                            <CaseStudyCard
                                key={successCase.slug}
                                successCase={successCase}
                            />
                        ))}
                    </Reveal>
                </Section>
            )}
        </>
    );
}
