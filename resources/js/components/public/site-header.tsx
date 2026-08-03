import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

import logoWhite from '@/assets/logo-blanco.png';
import { Container } from '@/components/public/container';
import { MobileNavigation } from '@/components/public/mobile-navigation';
import { PublicLink } from '@/components/public/public-link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import type { CmsLink } from '@/types';

type SiteHeaderProps = {
    cta: CmsLink | null;
    navigation: CmsLink[];
};

export function SiteHeader({ cta, navigation }: SiteHeaderProps) {
    const currentPath = normalizePath(usePage().url);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const update = () => setIsScrolled(window.scrollY > 24);

        update();
        window.addEventListener('scroll', update, { passive: true });

        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none',
                isScrolled
                    ? 'border-white/10 bg-podarcis-ink/96 shadow-xl shadow-black/10 backdrop-blur-xl'
                    : 'border-transparent bg-transparent',
            )}
        >
            <Container className="flex h-20 items-center justify-between gap-5">
                <Link
                    href={home()}
                    prefetch
                    className="rounded-md focus-visible:ring-3 focus-visible:ring-podarcis-green/50 focus-visible:outline-none"
                    aria-label="PODARCIS, inicio"
                >
                    <img
                        src={logoWhite}
                        alt="PODARCIS Consultores Auditores"
                        className="h-auto w-40 sm:w-44"
                        width="634"
                        height="192"
                    />
                </Link>

                <nav
                    className="hidden items-center gap-1 lg:flex"
                    aria-label="Navegación principal"
                >
                    {navigation.map((item) => {
                        const active = isActive(
                            currentPath,
                            normalizePath(item.href),
                        );

                        return (
                            <PublicLink
                                key={item.id ?? item.href}
                                href={item.href}
                                prefetch
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'rounded-lg px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/8 hover:text-white focus-visible:ring-3 focus-visible:ring-podarcis-green/50 focus-visible:outline-none',
                                    active && 'bg-white/10 text-white',
                                )}
                            >
                                {item.label}
                            </PublicLink>
                        );
                    })}
                </nav>

                <div className="hidden lg:block">
                    {cta && (
                        <Button
                            asChild
                            className="bg-podarcis-green text-podarcis-ink shadow-lg shadow-podarcis-green/20 hover:-translate-y-0.5 hover:bg-podarcis-green/90 motion-reduce:hover:translate-y-0"
                        >
                            <PublicLink href={cta.href}>{cta.label}</PublicLink>
                        </Button>
                    )}
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="border-white/20 bg-white/8 text-white hover:bg-white/15 hover:text-white lg:hidden"
                            aria-label="Abrir menú de navegación"
                        >
                            <Menu className="size-5" aria-hidden="true" />
                        </Button>
                    </SheetTrigger>
                    <MobileNavigation
                        cta={cta}
                        currentPath={currentPath}
                        navigation={navigation}
                    />
                </Sheet>
            </Container>
        </header>
    );
}

export function normalizePath(url: string): string {
    const [path] = url.split(/[?#]/);

    return path.replace(/\/$/, '') || '/';
}

function isActive(currentPath: string, itemPath: string): boolean {
    if (itemPath === '/') {
        return currentPath === '/';
    }

    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}
