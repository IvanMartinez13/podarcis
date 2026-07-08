import { Head, Link } from '@inertiajs/react';

import { EmptyState } from '@/components/public/empty-state';
import { Section } from '@/components/public/section';
import { Badge } from '@/components/ui/badge';
import type { CmsSuccessCase } from '@/types';

type SuccessCasesIndexProps = {
    successCases: CmsSuccessCase[];
};

export default function SuccessCasesIndex({
    successCases,
}: SuccessCasesIndexProps) {
    return (
        <>
            <Head title="Casos de éxito" />

            <Section
                eyebrow="Casos de éxito"
                title="Proyectos donde el criterio técnico se convierte en resultados"
                description="Casos publicados desde el CMS con sector, servicio asociado y resultado principal."
                className="bg-podarcis-surface"
            >
                {successCases.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {successCases.map((successCase) => (
                            <Link
                                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                href={successCase.href}
                                key={successCase.slug}
                            >
                                <img
                                    alt=""
                                    className="aspect-[16/8] w-full object-cover transition duration-500 group-hover:scale-105"
                                    src={
                                        successCase.featuredImage ??
                                        'https://placehold.co/1000x520/0E2535/25E331?text=Caso+PODARCIS'
                                    }
                                />
                                <div className="p-6">
                                    <Badge className="bg-podarcis-green text-podarcis-navy">
                                        {successCase.sector ?? 'Proyecto'}
                                    </Badge>
                                    <h2 className="mt-4 text-2xl font-semibold text-podarcis-navy">
                                        {successCase.title}
                                    </h2>
                                    <p className="mt-3 leading-7 text-podarcis-muted">
                                        {successCase.result}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No hay casos publicados"
                        description="Cuando el CMS tenga casos publicados aparecerán en esta página."
                    />
                )}
            </Section>
        </>
    );
}
