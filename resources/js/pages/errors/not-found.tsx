import { Link } from '@inertiajs/react';

import { Container } from '@/components/public/container';
import { SeoHead } from '@/components/public/seo-head';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import * as contact from '@/routes/contact';

export default function NotFound() {
    return (
        <>
            <SeoHead
                title="Página no encontrada"
                description="La página solicitada no está disponible."
                noindex
            />
            <Container className="flex min-h-[65vh] flex-col items-center justify-center py-24 text-center">
                <p className="text-sm font-semibold tracking-widest text-emerald-700 uppercase">
                    Error 404
                </p>
                <h1 className="mt-4 text-4xl font-semibold text-podarcis-navy sm:text-5xl">
                    Esta página no existe
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-8 text-podarcis-muted">
                    Puede que la dirección haya cambiado durante la renovación
                    de la web. Puedes volver al inicio o contactar con PODARCIS.
                </p>
                <div className="mt-8 flex gap-3">
                    <Button asChild>
                        <Link href={home()}>Volver al inicio</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={contact.index()}>Contacto</Link>
                    </Button>
                </div>
            </Container>
        </>
    );
}
