import logoBlack from '@/assets/logo-negro.png';
import { PublicLink } from '@/components/public/public-link';
import { Button } from '@/components/ui/button';
import {
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { CmsLink } from '@/types';

type MobileNavigationProps = {
    cta: CmsLink | null;
    currentPath: string;
    navigation: CmsLink[];
};

export function MobileNavigation({
    cta,
    currentPath,
    navigation,
}: MobileNavigationProps) {
    return (
        <SheetContent
            side="right"
            className="flex w-[min(90vw,25rem)] flex-col border-l-0 bg-white p-0"
        >
            <SheetHeader className="border-b border-slate-200 px-6 py-5 text-left">
                <SheetTitle>
                    <img
                        src={logoBlack}
                        alt="PODARCIS"
                        className="h-auto w-44"
                        width="634"
                        height="192"
                    />
                </SheetTitle>
                <SheetDescription className="sr-only">
                    Navegación principal de PODARCIS
                </SheetDescription>
            </SheetHeader>

            <nav className="grid gap-1 px-4 py-6" aria-label="Menú móvil">
                {navigation.map((item) => {
                    const [rawPath] = item.href.split(/[?#]/);
                    const path = rawPath.replace(/\/$/, '') || '/';
                    const active =
                        path === '/'
                            ? currentPath === '/'
                            : currentPath === path ||
                              currentPath.startsWith(`${path}/`);

                    return (
                        <SheetClose asChild key={item.id ?? item.href}>
                            <PublicLink
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'rounded-xl px-4 py-3.5 text-base font-medium text-podarcis-navy transition hover:bg-podarcis-surface focus-visible:ring-3 focus-visible:ring-podarcis-green/40 focus-visible:outline-none',
                                    active &&
                                        'bg-podarcis-navy text-white hover:bg-podarcis-navy',
                                )}
                            >
                                {item.label}
                            </PublicLink>
                        </SheetClose>
                    );
                })}
            </nav>

            {cta && (
                <div className="mt-auto border-t border-slate-200 p-5">
                    <SheetClose asChild>
                        <Button
                            asChild
                            size="lg"
                            className="w-full bg-podarcis-green text-podarcis-ink hover:bg-podarcis-green/90"
                        >
                            <PublicLink href={cta.href}>{cta.label}</PublicLink>
                        </Button>
                    </SheetClose>
                </div>
            )}
        </SheetContent>
    );
}
