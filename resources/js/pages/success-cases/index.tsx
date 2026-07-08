import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

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
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="bg-podarcis-green text-podarcis-navy">
                                            {successCase.sector ?? 'Proyecto'}
                                        </Badge>
                                        {successCase.service && (
                                            <Badge className="bg-podarcis-surface text-podarcis-navy">
                                                {successCase.service.title}
                                            </Badge>
                                        )}
                                    </div>
                                    <h2 className="mt-4 text-2xl font-semibold text-podarcis-navy">
                                        {successCase.title}
                                    </h2>
                                    {successCase.clientName && (
                                        <p className="mt-2 text-sm font-semibold text-podarcis-muted">
                                            {successCase.clientName}
                                        </p>
                                    )}
                                    <p className="mt-3 leading-7 text-podarcis-muted">
                                        {successCase.excerpt ??
                                            successCase.result}
                                    </p>
                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-podarcis-navy transition-colors group-hover:text-podarcis-green">
                                        Ver caso
                                        <ArrowRight
                                            className="size-4 transition-transform group-hover:translate-x-1"
                                            aria-hidden="true"
                                        />
                                    </span>
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
