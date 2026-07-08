import { Head } from '@inertiajs/react';

import { CTASection } from '@/components/public/cta-section';
import { EmptyState } from '@/components/public/empty-state';
import { Section } from '@/components/public/section';
import { ServiceCard } from '@/components/public/service-card';
import { getServiceIcon } from '@/lib/cms-icons';
import * as contact from '@/routes/contact';
import type { CmsService } from '@/types';

type ServicesIndexProps = {
    services: CmsService[];
};

export default function ServicesIndex({ services }: ServicesIndexProps) {
    return (
        <>
            <Head title="Servicios" />

            <Section
                eyebrow="Servicios"
                title="Consultoría, auditoría y software para gestionar obligaciones con rigor"
                description="Todas las líneas de servicio publicadas desde el CMS aparecen aquí ordenadas para facilitar la exploración."
                className="bg-podarcis-surface"
            >
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((service) => (
                            <ServiceCard
                                description={service.excerpt ?? ''}
                                href={service.href}
                                icon={getServiceIcon(service.icon)}
                                key={service.slug}
                                title={service.title}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No hay servicios publicados"
                        description="Cuando se publiquen servicios desde el CMS aparecerán en esta página."
                    />
                )}
            </Section>

            <CTASection
                title="¿Necesitas encajar varios servicios en un mismo proyecto?"
                description="Cuéntanos el contexto y te ayudamos a priorizar el siguiente paso."
                primaryHref={contact.index().url}
                primaryLabel="Contactar"
            />
        </>
    );
}
