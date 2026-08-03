import { CheckCircle2 } from 'lucide-react';

import ProfileCard from '@/components/ProfileCard';
import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
import { RichText } from '@/components/public/rich-text';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';
import { Badge } from '@/components/ui/badge';
import * as contact from '@/routes/contact';
import type { AboutPageBlocks, CmsPage } from '@/types';

type AboutProps = {
    page: CmsPage;
};

export default function About({ page }: AboutProps) {
    const blocks = (page.blocks ?? {}) as AboutPageBlocks;
    const teamCoverImage = blocks.teamCoverImage?.trim() || null;
    const teamMembers = blocks.teamMembers ?? [];
    const hasTeamSection = teamMembers.length > 0 || Boolean(teamCoverImage);
    const values = blocks.values ?? [
        'Rigor ambiental y normativo',
        'Orientación a evidencias',
        'Herramientas digitales propias',
        'Acompañamiento práctico',
    ];

    return (
        <>
            <SeoHead
                description={page.seoDescription ?? page.excerpt}
                image={page.ogImage}
                title={page.seoTitle ?? page.title}
            />

            <PublicHero>
                <Container className="max-w-4xl py-20 sm:py-24">
                    <Badge className="bg-podarcis-green text-podarcis-navy">
                        PODARCIS SL
                    </Badge>
                    <h1 className="mt-6 text-4xl font-semibold text-balance sm:text-5xl">
                        {page.title}
                    </h1>
                    <RichText
                        className="mt-6 text-lg leading-8 text-white/75 [&_a]:text-white [&_a]:decoration-white/50"
                        html={page.excerpt}
                    />
                </Container>
            </PublicHero>

            <Section
                eyebrow="Nuestra forma de trabajar"
                title="Consultoría técnica con criterio, cercanía y apoyo digital"
            >
                <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
                    <RichText
                        className="text-lg leading-8 text-podarcis-muted"
                        html={page.content}
                    />
                    <div className="rounded-lg bg-podarcis-surface p-6">
                        {values.map((item) => (
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
                    {teamCoverImage && (
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <img
                                src={teamCoverImage}
                                alt="Equipo PODARCIS"
                                className="aspect-[16/7] w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}

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
                                    linkedinUrl={member.linkedinUrl}
                                    avatarUrl={member.avatarUrl}
                                    className="w-full max-w-[340px]"
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
