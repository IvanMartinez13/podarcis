import { Container } from '@/components/public/container';
import { PublicHero } from '@/components/public/public-hero';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';

const privacySections = [
    [
        'Responsable',
        'PODARCIS SL será responsable del tratamiento de los datos facilitados a través de los formularios y canales de contacto de esta web.',
    ],
    [
        'Finalidad',
        'Usaremos la información para atender solicitudes, preparar respuestas comerciales o técnicas y mantener la relación derivada de la consulta.',
    ],
    [
        'Legitimación',
        'La base del tratamiento será el consentimiento del usuario y, cuando proceda, la aplicación de medidas precontractuales solicitadas por la persona interesada.',
    ],
    [
        'Derechos',
        'Puedes solicitar el acceso, rectificación, supresión, oposición, limitación o portabilidad de tus datos mediante los canales oficiales de contacto de PODARCIS.',
    ],
];

export default function PrivacyPolicy() {
    return (
        <>
            <SeoHead
                description="Información básica sobre el tratamiento de datos personales en la web de PODARCIS SL."
                title="Política de privacidad"
            />

            <PublicHero>
                <Container className="py-16 sm:py-20">
                    <p className="text-sm font-semibold tracking-wide text-podarcis-green uppercase">
                        Legal
                    </p>
                    <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                        Política de privacidad
                    </h1>
                </Container>
            </PublicHero>

            <Section
                eyebrow="Legal"
                title="Política de privacidad"
                description="Información básica sobre el tratamiento de datos personales en la web de PODARCIS SL."
                className="bg-podarcis-surface"
            >
                <div className="mx-auto grid max-w-4xl gap-5">
                    {privacySections.map(([title, text]) => (
                        <article
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            key={title}
                        >
                            <h2 className="text-lg font-semibold text-podarcis-navy">
                                {title}
                            </h2>
                            <p className="mt-3 leading-7 text-podarcis-muted">
                                {text}
                            </p>
                        </article>
                    ))}
                </div>
            </Section>
        </>
    );
}
