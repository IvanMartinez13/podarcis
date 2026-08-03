import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { DigitalSolutionCard } from '@/components/public/digital-solution-card';
import { PublicHero } from '@/components/public/public-hero';
import { Reveal } from '@/components/public/reveal';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';
import * as contact from '@/routes/contact';
import type { CmsPage, CmsService } from '@/types';

type DigitalSolutionsIndexProps = {
    page?: CmsPage | null;
    digitalSolutions: CmsService[];
};

export default function DigitalSolutionsIndex({
    page,
    digitalSolutions,
}: DigitalSolutionsIndexProps) {
    const title =
        page?.title ??
        'Soluciones digitales para convertir datos en decisiones';
    const excerpt =
        page?.excerpt ??
        'Tecnología propia para ordenar información, documentar evidencias y dar seguimiento a la gestión ambiental.';

    return (
        <>
            <SeoHead
                title={page?.seoTitle ?? 'Soluciones digitales'}
                description={page?.seoDescription ?? excerpt}
                image={page?.ogImage}
            />

            <PublicHero as="header">
                <Container className="py-16 sm:py-20 lg:py-24">
                    <p className="text-xs font-semibold tracking-[0.16em] text-podarcis-green uppercase">
                        Tecnología PODARCIS
                    </p>
                    <h1 className="mt-5 max-w-5xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">
                        {excerpt}
                    </p>
                </Container>
            </PublicHero>

            {digitalSolutions.length > 0 && (
                <Section>
                    <Reveal className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {digitalSolutions.map((solution) => (
                            <DigitalSolutionCard
                                key={solution.slug}
                                solution={solution}
                            />
                        ))}
                    </Reveal>
                </Section>
            )}

            <CTASection
                title="¿Quieres ver una solución aplicada a tu contexto?"
                description="Selecciona la solución que te interesa y prepararemos una demostración orientada a tus necesidades."
                primaryHref={
                    contact.index({
                        query: { source: 'digital_solution_demo' },
                    }).url
                }
                primaryLabel="Solicitar demo"
            />
        </>
    );
}
