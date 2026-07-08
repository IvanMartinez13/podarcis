import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import type { PropsWithChildren } from 'react';

import logoWhite from '@/assets/logo-blanco.png';
import logoBlack from '@/assets/logo-negro.png';
import { Container } from '@/components/public/container';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { home, login } from '@/routes';
import * as admin from '@/routes/admin';
import * as blog from '@/routes/blog';
import * as contact from '@/routes/contact';
import * as pages from '@/routes/pages';
import * as services from '@/routes/services';
import * as successCases from '@/routes/success-cases';
import type { SharedPageProps } from '@/types';

const navigation = [
    { label: 'Servicios', href: services.index() },
    { label: 'Quiénes somos', href: pages.about() },
    { label: 'Casos', href: successCases.index() },
    { label: 'Blog', href: blog.index() },
    { label: 'Contacto', href: contact.index() },
];

type BrandMarkProps = {
    inverse?: boolean;
};

function BrandMark({ inverse = false }: BrandMarkProps) {
    const logo = inverse ? logoWhite : logoBlack;

    return (
        <span className="group/brand flex items-center gap-3">
            <span
                className={
                    inverse
                        ? 'flex h-11 w-36 items-center rounded-md'
                        : 'flex h-11 w-44 items-center transition duration-300 group-hover/brand:-translate-y-0.5'
                }
            >
                <img
                    alt="PODARCIS Consultores Auditores"
                    className="h-auto w-full"
                    src={logo}
                />
            </span>
        </span>
    );
}

function PublicLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedPageProps>().props;
    const accountHref = auth.user ? admin.index() : login();
    const accountLabel = auth.user ? 'Panel' : 'Acceso';

    return (
        <div className="min-h-screen bg-white text-slate-950 selection:bg-podarcis-green selection:text-podarcis-navy">
            <header className="sticky top-0 z-40 border-b border-white/60 bg-white/85 shadow-sm shadow-slate-950/5 backdrop-blur-xl">
                <Container className="flex h-18 items-center justify-between gap-4">
                    <Link href={home()} aria-label="PODARCIS inicio">
                        <BrandMark />
                    </Link>

                    <nav className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 p-1 text-sm font-medium text-podarcis-muted shadow-sm lg:flex">
                        {navigation.map((item) => (
                            <Link
                                className="rounded-full px-4 py-2 transition duration-300 hover:bg-podarcis-surface hover:text-podarcis-navy focus-visible:ring-3 focus-visible:ring-podarcis-green/40 focus-visible:outline-none"
                                href={item.href}
                                key={item.label}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                        <Button asChild variant="ghost">
                            <Link href={accountHref}>{accountLabel}</Link>
                        </Button>
                        <Button
                            asChild
                            className="bg-podarcis-green text-podarcis-navy shadow-lg shadow-podarcis-green/25 transition duration-300 hover:-translate-y-0.5 hover:bg-podarcis-green/90 hover:shadow-podarcis-green/40"
                        >
                            <Link href={contact.index()}>
                                Hablar con un experto
                            </Link>
                        </Button>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                aria-label="Abrir menu de navegacion"
                                className="border-slate-200 bg-white/80 shadow-sm lg:hidden"
                                size="icon"
                                variant="outline"
                            >
                                <Menu className="size-5" aria-hidden="true" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            className="w-[min(88vw,24rem)] border-l-0 bg-white/95 backdrop-blur-xl"
                            side="right"
                        >
                            <SheetHeader>
                                <SheetTitle>
                                    <BrandMark />
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-2 px-4">
                                {navigation.map((item) => (
                                    <SheetClose asChild key={item.label}>
                                        <Link
                                            className="rounded-md px-3 py-3 text-sm font-medium text-podarcis-navy transition hover:bg-podarcis-surface"
                                            href={item.href}
                                        >
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </nav>
                            <div className="mt-auto grid gap-3 p-4">
                                <Button
                                    asChild
                                    className="bg-podarcis-green text-podarcis-navy hover:bg-podarcis-green/90"
                                >
                                    <Link href={contact.index()}>
                                        Hablar con un experto
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={accountHref}>
                                        {accountLabel}
                                    </Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </Container>
            </header>

            <main>{children}</main>

            <footer className="relative overflow-hidden bg-podarcis-ink text-white">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-podarcis-green/60 to-transparent" />
                <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-podarcis-green/10 blur-3xl" />
                <Container className="py-12">
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                        <div>
                            <BrandMark inverse />
                            <p className="mt-5 max-w-md text-sm leading-6 text-white/70">
                                Consultoría ambiental, calidad, sostenibilidad,
                                seguridad y salud con apoyo de herramientas
                                digitales propias.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-podarcis-green">
                                Servicios
                            </h2>
                            <ul className="mt-4 grid gap-2 text-sm text-white/70">
                                <li>Estudios ambientales</li>
                                <li>Huella de carbono</li>
                                <li>Sistemas de gestion</li>
                                <li>Formacion medioambiental</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-podarcis-green">
                                Navegacion
                            </h2>
                            <ul className="mt-4 grid gap-2 text-sm">
                                {navigation.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            className="text-white/70 transition hover:text-white"
                                            href={item.href}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-podarcis-green">
                                Contacto
                            </h2>
                            <p className="mt-4 text-sm leading-6 text-white/70">
                                Cuéntanos qué obligación, auditoría o proyecto
                                necesitas resolver y preparamos el siguiente
                                paso.
                            </p>
                        </div>
                    </div>
                    <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/55">
                        © 2026 PODARCIS SL. Todos los derechos reservados.
                    </div>
                </Container>
            </footer>
        </div>
    );
}

export default PublicLayout;
