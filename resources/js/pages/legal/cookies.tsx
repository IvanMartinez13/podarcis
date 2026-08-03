import { Container } from '@/components/public/container';
import { PublicHero } from '@/components/public/public-hero';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';

const cookieSections = [
    [
        'Qué son las cookies',
        'Las cookies son pequeños archivos que un sitio web puede guardar en el navegador para recordar información técnica o preferencias de navegación.',
    ],
    [
        'Uso en esta web',
        'La web de PODARCIS podrá utilizar cookies técnicas necesarias para su funcionamiento y, si se configuran en el futuro, cookies analíticas o de medición.',
    ],
    [
        'Gestión',
        'Puedes bloquear o eliminar cookies desde la configuración de tu navegador. Algunas funciones técnicas podrían verse afectadas si desactivas cookies necesarias.',
    ],
    [
        'Actualizaciones',
        'Esta política podrá actualizarse cuando se incorporen nuevas herramientas, servicios de medición o cambios normativos aplicables.',
    ],
];

export default function CookiesPolicy() {
    return (
        <>
            <SeoHead
                description="Información sobre el uso de cookies y tecnologías similares en la web de PODARCIS SL."
                title="Política de cookies"
            />

            <PublicHero>
                <Container className="py-16 sm:py-20">
                    <p className="text-sm font-semibold tracking-wide text-podarcis-green uppercase">
                        Legal
                    </p>
                    <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                        Política de cookies
                    </h1>
                </Container>
            </PublicHero>

            <Section
                eyebrow="Legal"
                title="Política de cookies"
                description="Información sobre el uso de cookies y tecnologías similares en la web de PODARCIS SL."
                className="bg-podarcis-surface"
            >
                <div className="mx-auto grid max-w-4xl gap-5">
                    {cookieSections.map(([title, text]) => (
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
