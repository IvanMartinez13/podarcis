import { Container } from '@/components/public/container';
import { PublicHero } from '@/components/public/public-hero';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';

export default function LegalNotice() {
    return (
        <>
            <SeoHead
                title="Aviso legal"
                description="Información legal y condiciones de uso de la web de PODARCIS SL."
            />
            <PublicHero>
                <Container className="py-16 sm:py-20">
                    <p className="text-sm font-semibold tracking-wide text-podarcis-green uppercase">
                        Legal
                    </p>
                    <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                        Aviso legal
                    </h1>
                </Container>
            </PublicHero>
            <Section
                className="bg-podarcis-surface"
                title="Titularidad y uso del sitio"
            >
                <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-slate-200 bg-white p-6 leading-7 text-podarcis-muted shadow-sm sm:p-8">
                    <section>
                        <h2 className="text-xl font-semibold text-podarcis-navy">
                            Titular
                        </h2>
                        <p className="mt-3">
                            PODARCIS SL, con domicilio en C/ Ter, 27, 1.er piso,
                            oficina 13, 07009 Palma de Mallorca (Illes Balears).
                            Teléfono: +34 871 961 697.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-podarcis-navy">
                            Condiciones de uso
                        </h2>
                        <p className="mt-3">
                            El acceso a este sitio implica la aceptación de sus
                            condiciones de uso. Sus contenidos tienen carácter
                            informativo y no sustituyen el asesoramiento técnico
                            adaptado a cada proyecto.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-podarcis-navy">
                            Propiedad intelectual
                        </h2>
                        <p className="mt-3">
                            Los textos, diseños, marcas y demás elementos del
                            sitio pertenecen a sus titulares y no pueden
                            reutilizarse sin autorización, salvo en los
                            supuestos permitidos por la legislación aplicable.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-podarcis-navy">
                            Responsabilidad
                        </h2>
                        <p className="mt-3">
                            PODARCIS procura mantener la información
                            actualizada, pero no garantiza la ausencia total de
                            errores ni la disponibilidad permanente del sitio o
                            de los enlaces externos.
                        </p>
                    </section>
                </div>
            </Section>
        </>
    );
}
