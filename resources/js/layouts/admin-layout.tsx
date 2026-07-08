import { Link, usePage } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    FileText,
    FolderTree,
    Home,
    Inbox,
    LayoutDashboard,
    LogOut,
    Menu,
    Newspaper,
    Quote,
    Trophy,
    Users,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { home, logout } from '@/routes';
import * as admin from '@/routes/admin';
import * as categories from '@/routes/admin/categories';
import * as leads from '@/routes/admin/leads';
import * as pages from '@/routes/admin/pages';
import * as posts from '@/routes/admin/posts';
import * as services from '@/routes/admin/services';
import * as successCases from '@/routes/admin/success-cases';
import * as testimonials from '@/routes/admin/testimonials';
import * as users from '@/routes/admin/users';
import type { SharedPageProps } from '@/types';

type AdminNavItem = {
    title: string;
    href?: ReturnType<typeof admin.index>;
    icon: ComponentType<{ className?: string }>;
    disabled?: boolean;
};

const navItems: AdminNavItem[] = [
    {
        title: 'Dashboard',
        href: admin.index(),
        icon: LayoutDashboard,
    },
    {
        title: 'Servicios',
        href: services.index(),
        icon: BriefcaseBusiness,
    },
    {
        title: 'Categorías',
        href: categories.index(),
        icon: FolderTree,
    },
    {
        title: 'Posts',
        href: posts.index(),
        icon: Newspaper,
    },
    {
        title: 'Páginas',
        href: pages.index(),
        icon: FileText,
    },
    {
        title: 'Casos',
        href: successCases.index(),
        icon: Trophy,
    },
    {
        title: 'Testimonios',
        href: testimonials.index(),
        icon: Quote,
    },
    {
        title: 'Usuarios',
        href: users.index(),
        icon: Users,
    },
    {
        title: 'Leads',
        href: leads.index(),
        icon: Inbox,
    },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F4F7F8] text-slate-950 dark:bg-slate-950 dark:text-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
                <aside className="hidden border-r border-slate-200 bg-white lg:block dark:border-white/10 dark:bg-[#071923]">
                    <AdminSidebar />
                </aside>

                <div className="flex min-w-0 flex-col">
                    <AdminHeader open={open} setOpen={setOpen} />
                    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                        <FlashMessages />
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

function AdminHeader({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const { auth } = usePage<SharedPageProps>().props;

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl lg:static dark:border-white/10 dark:bg-[#071923]/90">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                className="lg:hidden"
                                size="icon"
                                variant="outline"
                                aria-label="Abrir menú"
                            >
                                <Menu className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[300px] p-0" side="left">
                            <AdminSidebar onNavigate={() => setOpen(false)} />
                        </SheetContent>
                    </Sheet>
                    <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-[#25E331] uppercase">
                            Administración
                        </p>
                        <p className="text-sm font-medium text-[#163247] dark:text-white">
                            CMS corporativo
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {auth.user.email}
                        </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={logout()} method="post" as="button">
                            <LogOut className="size-4" />
                            Salir
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}

function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <div className="flex h-full min-h-screen flex-col bg-white dark:bg-[#071923]">
            <div className="border-b border-slate-200 p-5 dark:border-white/10">
                <Link
                    className="group flex items-center gap-3"
                    href={admin.index()}
                    onClick={onNavigate}
                >
                    <span className="grid size-10 place-items-center rounded-lg bg-[#163247] text-sm font-bold text-[#25E331] shadow-lg shadow-[#163247]/20 transition-transform group-hover:scale-105">
                        P
                    </span>
                    <span>
                        <span className="block text-base font-semibold text-[#163247] dark:text-white">
                            PODARCIS
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                            Admin CMS
                        </span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item) => (
                    <AdminNavLink
                        item={item}
                        key={item.title}
                        onNavigate={onNavigate}
                    />
                ))}
            </nav>

            <div className="border-t border-slate-200 p-3 dark:border-white/10">
                <Button
                    asChild
                    className="w-full justify-start"
                    variant="ghost"
                >
                    <Link href={home()} onClick={onNavigate}>
                        <Home className="size-4" />
                        Ver web pública
                    </Link>
                </Button>
            </div>
        </div>
    );
}

function AdminNavLink({
    item,
    onNavigate,
}: {
    item: AdminNavItem;
    onNavigate?: () => void;
}) {
    const { isCurrentOrParentUrl, isCurrentUrl } = useCurrentUrl();
    const Icon = item.icon;
    const isDashboard = item.href?.url === admin.index().url;
    const isActive = item.href
        ? isDashboard
            ? isCurrentUrl(item.href)
            : isCurrentOrParentUrl(item.href)
        : false;

    if (item.disabled || !item.href) {
        return (
            <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-3">
                    <Icon className="size-4" />
                    {item.title}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                    Próx.
                </span>
            </div>
        );
    }

    return (
        <Link
            className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                    ? 'bg-[#163247] text-white shadow-sm shadow-[#163247]/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#163247] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
            )}
            href={item.href}
            onClick={onNavigate}
            prefetch
        >
            <Icon
                className={cn(
                    'size-4',
                    isActive ? 'text-[#25E331]' : 'text-current',
                )}
            />
            {item.title}
        </Link>
    );
}

function FlashMessages() {
    const { flash } = usePage<SharedPageProps>().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div className="mb-6 grid gap-3">
            {flash.success && (
                <div className="rounded-lg border border-[#25E331]/30 bg-[#25E331]/10 px-4 py-3 text-sm font-medium text-[#163247] dark:text-[#25E331]">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
