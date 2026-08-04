import { Breadcrumbs, breadcrumbSchema } from '@/components/public/breadcrumbs';
import type { BreadcrumbItem } from '@/components/public/breadcrumbs';
import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
import { RichText } from '@/components/public/rich-text';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';
import * as contact from '@/routes/contact';
import type { CmsPage } from '@/types';

export default function SeoLanding({
    page,
    breadcrumbs,
}: {
    page: CmsPage;
    breadcrumbs: BreadcrumbItem[];
}) {
    return (
        <>
            <SeoHead
                title={page.seoTitle ?? page.title}
                description={page.seoDescription ?? page.excerpt}
                image={page.ogImage}
                jsonLd={breadcrumbSchema(breadcrumbs)}
            />
            <PublicHero as="header">
                <Container className="py-16 sm:py-20 lg:py-24">
                    <p className="text-xs font-semibold tracking-[0.16em] text-podarcis-green uppercase">
                        Servicio especializado
                    </p>
                    <h1 className="mt-5 max-w-4xl text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl">
                        {page.title}
                    </h1>
                    {page.excerpt && (
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
                            {page.excerpt}
                        </p>
                    )}
                </Container>
            </PublicHero>
            <Breadcrumbs items={breadcrumbs} />
            <Section>
                <RichText
                    className="mx-auto max-w-4xl text-lg leading-8 text-podarcis-muted"
                    html={page.content}
                />
            </Section>
            <CTASection
                title="¿Necesitas evaluar este aspecto de tu proyecto?"
                description="Cuéntanos el punto de partida y te indicaremos el alcance técnico adecuado."
                primaryHref={contact.index().url}
                primaryLabel="Consultar con el equipo"
            />
        </>
    );
}
