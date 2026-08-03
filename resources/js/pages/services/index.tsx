import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
import { Reveal } from '@/components/public/reveal';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';
import { ServiceCard } from '@/components/public/service-card';
import { getServiceIcon } from '@/lib/cms-icons';
import * as contact from '@/routes/contact';
import type { CmsPage, CmsService } from '@/types';

type ServicesIndexProps = {
    page?: CmsPage | null;
    services: CmsService[];
};

export default function ServicesIndex({ page, services }: ServicesIndexProps) {
    const title =
        page?.title ??
        'Consultoría, auditoría y software para gestionar obligaciones con rigor';
    const excerpt =
        page?.excerpt ??
        'Servicios ambientales, de calidad y sostenibilidad adaptados al contexto de cada organización.';

    return (
        <>
            <SeoHead
                title={page?.seoTitle ?? 'Servicios'}
                description={page?.seoDescription ?? excerpt}
                image={page?.ogImage}
            />

            <PublicHero as="header">
                <Container className="py-16 sm:py-20 lg:py-24">
                    <p className="text-xs font-semibold tracking-[0.16em] text-podarcis-green uppercase">
                        Servicios
                    </p>
                    <h1 className="mt-5 max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                        {excerpt}
                    </p>
                </Container>
            </PublicHero>

            {services.length > 0 && (
                <Section>
                    <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {services.map((service) => (
                            <div id={service.slug} key={service.slug}>
                                <ServiceCard
                                    description={service.excerpt ?? ''}
                                    href={service.href}
                                    icon={getServiceIcon(service.icon)}
                                    label={
                                        service.kind === 'digital'
                                            ? 'Solución digital'
                                            : undefined
                                    }
                                    title={service.title}
                                />
                            </div>
                        ))}
                    </Reveal>
                </Section>
            )}

            <CTASection
                title="¿Necesitas combinar varias líneas de trabajo?"
                description="Cuéntanos el contexto y te ayudaremos a priorizar el siguiente paso."
                primaryHref={contact.index().url}
                primaryLabel="Hablemos de tu proyecto"
            />
        </>
    );
}
