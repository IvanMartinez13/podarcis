import { Head, router } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

import ProfileCard from '@/components/ProfileCard';
import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
import { Section } from '@/components/public/section';
import { Badge } from '@/components/ui/badge';
import * as contact from '@/routes/contact';
import type { CmsPage } from '@/types';

const TEAM_COVER_PLACEHOLDER =
    'https://placehold.co/1440x760/163247/FFFFFF?text=Equipo+PODARCIS';

const TEAM_AVATAR_PLACEHOLDER =
    'https://placehold.co/720x1000/163247/FFFFFF?text=PODARCIS';

type AboutProps = {
    page: CmsPage;
};

export default function About({ page }: AboutProps) {
    const teamCoverImage =
        page.blocks?.teamCoverImage?.trim() || TEAM_COVER_PLACEHOLDER;
    const teamMembers = page.blocks?.teamMembers ?? [];
    const hasTeamSection =
        teamMembers.length > 0 || Boolean(page.blocks?.teamCoverImage?.trim());

    function contactTeamMember(handle: string | null, name: string) {
        router.visit(
            contact.index({
                query: {
                    source: 'team_card',
                    worker: handle?.trim() || slugify(name),
                },
            }).url,
        );
    }

    return (
        <>
            <Head title={page.seoTitle ?? page.title}>
                {page.seoDescription && (
                    <meta
                        content={page.seoDescription}
                        head-key="description"
                        name="description"
                    />
                )}
            </Head>

            <PublicHero className="py-16 text-white sm:py-20">
                <Container className="max-w-4xl">
                    <Badge className="bg-podarcis-green text-podarcis-navy">
                        PODARCIS SL
                    </Badge>
                    <h1 className="mt-6 text-4xl font-semibold text-balance sm:text-5xl">
                        {page.title}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-white/75">
                        {page.excerpt}
                    </p>
                </Container>
            </PublicHero>

            <Section
                eyebrow="Nuestra forma de trabajar"
                title="Consultoría técnica con criterio, cercanía y apoyo digital"
            >
                <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
                    <div className="text-lg leading-8 text-podarcis-muted">
                        {(page.content ?? '')
                            .split('\n')
                            .filter(Boolean)
                            .map((paragraph) => (
                                <p className="mt-6 first:mt-0" key={paragraph}>
                                    {paragraph}
                                </p>
                            ))}
                    </div>
                    <div className="rounded-lg bg-podarcis-surface p-6">
                        {[
                            'Rigor ambiental y normativo',
                            'Orientación a evidencias',
                            'Herramientas digitales propias',
                            'Acompañamiento práctico',
                        ].map((item) => (
                            <div
                                className="flex gap-3 border-b border-slate-200 py-4 last:border-0"
                                key={item}
                            >
                                <CheckCircle2
                                    className="mt-0.5 size-5 text-podarcis-green"
                                    aria-hidden="true"
                                />
                                <span className="font-medium text-podarcis-navy">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {hasTeamSection && (
                <Section
                    eyebrow="Equipo"
                    title="Personas que convierten la complejidad técnica en decisiones claras"
                    className="bg-podarcis-surface"
                >
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <img
                            src={teamCoverImage}
                            alt="Equipo PODARCIS"
                            className="aspect-[16/7] w-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {teamMembers.length > 0 && (
                        <div
                            className="mt-10 grid justify-items-center gap-8"
                            style={{
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                            }}
                        >
                            {teamMembers.map((member) => (
                                <ProfileCard
                                    key={`${member.handle ?? member.name}-${member.title ?? ''}`}
                                    name={member.name}
                                    title={member.title ?? ''}
                                    handle={
                                        member.handle ?? slugify(member.name)
                                    }
                                    status={member.status ?? 'Disponible'}
                                    contactText={
                                        member.contactText ?? 'Contactar'
                                    }
                                    avatarUrl={
                                        member.avatarUrl ||
                                        TEAM_AVATAR_PLACEHOLDER
                                    }
                                    className="w-full max-w-[340px]"
                                    onContactClick={() =>
                                        contactTeamMember(
                                            member.handle,
                                            member.name,
                                        )
                                    }
                                />
                            ))}
                        </div>
                    )}
                </Section>
            )}

            <CTASection
                title="Hablemos de tu proyecto"
                description="Si necesitas claridad técnica, seguimiento y una hoja de ruta realista, podemos ayudarte."
                primaryHref={contact.index().url}
                primaryLabel="Contactar"
            />
        </>
    );
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
