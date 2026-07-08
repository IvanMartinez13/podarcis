import { Head, Link } from '@inertiajs/react';

import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
import { Badge } from '@/components/ui/badge';
import * as contact from '@/routes/contact';
import * as successCases from '@/routes/success-cases';
import type { CmsSuccessCase } from '@/types';

type SuccessCaseShowProps = {
    successCase: CmsSuccessCase;
};

export default function SuccessCaseShow({ successCase }: SuccessCaseShowProps) {
    return (
        <>
            <Head title={successCase.title} />

            <PublicHero as="header" className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                    <div>
                        <Link
                            className="text-sm font-semibold text-podarcis-green"
                            href={successCases.index()}
                        >
                            Casos de éxito
                        </Link>
                        <h1 className="mt-6 text-4xl font-semibold text-balance sm:text-5xl">
                            {successCase.title}
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-white/75">
                            {successCase.result}
                        </p>
                    </div>
                    <img
                        alt=""
                        className="aspect-[4/3] rounded-lg object-cover shadow-2xl shadow-black/20"
                        src={
                            successCase.featuredImage ??
                            'https://placehold.co/900x680/0E2535/25E331?text=Caso+PODARCIS'
                        }
                    />
                </Container>
            </PublicHero>

            <Container className="py-12 sm:py-16">
                <div className="grid gap-5 lg:grid-cols-3">
                    {[
                        ['Reto', successCase.challenge],
                        ['Solución', successCase.solution],
                        ['Resultado', successCase.result],
                    ].map(([title, text]) => (
                        <div
                            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                            key={title}
                        >
                            <Badge className="bg-podarcis-surface text-podarcis-navy">
                                {title}
                            </Badge>
                            <p className="mt-5 leading-7 text-podarcis-muted">
                                {text}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>

            <CTASection
                title="¿Quieres un resultado parecido en tu organización?"
                description="Revisamos tu contexto y planteamos un camino técnico viable."
                primaryHref={contact.index().url}
                primaryLabel="Contactar"
            />
        </>
    );
}
