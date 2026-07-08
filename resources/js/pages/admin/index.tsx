import { Head, Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    FileText,
    Inbox,
    Newspaper,
    Plus,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import * as categories from '@/routes/admin/categories';
import * as services from '@/routes/admin/services';

type DashboardProps = {
    stats: {
        services: number;
        posts: number;
        newLeads: number;
        publishedPages: number;
    };
};

const statCards = [
    {
        key: 'services',
        label: 'Servicios',
        icon: BriefcaseBusiness,
    },
    {
        key: 'posts',
        label: 'Posts',
        icon: Newspaper,
    },
    {
        key: 'newLeads',
        label: 'Leads nuevos',
        icon: Inbox,
    },
    {
        key: 'publishedPages',
        label: 'Páginas publicadas',
        icon: FileText,
    },
] as const;

export default function AdminIndex({ stats }: DashboardProps) {
    return (
        <>
            <Head title="Admin CMS" />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Panel de administración"
                    description="Primera base operativa del CMS de PODARCIS para gestionar contenidos corporativos."
                />

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <article
                                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-950"
                                key={card.key}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {card.label}
                                        </p>
                                        <p className="mt-2 text-3xl font-semibold text-[#163247] dark:text-white">
                                            {stats[card.key]}
                                        </p>
                                    </div>
                                    <span className="grid size-11 place-items-center rounded-lg bg-[#25E331]/10 text-[#163247] dark:text-[#25E331]">
                                        <Icon className="size-5" />
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-slate-950">
                        <h2 className="text-lg font-semibold text-[#163247] dark:text-white">
                            Gestión activa
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Empieza por los contenidos ya habilitados en esta
                            fase.
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <Button
                                asChild
                                className="justify-start bg-[#163247] text-white hover:bg-[#0f2638]"
                            >
                                <Link href={services.create()}>
                                    <Plus className="size-4" />
                                    Nuevo servicio
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="justify-start"
                                variant="outline"
                            >
                                <Link href={categories.create()}>
                                    <Plus className="size-4" />
                                    Nueva categoría
                                </Link>
                            </Button>
                        </div>
                    </article>

                    <article className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-6 dark:border-white/15 dark:bg-white/5">
                        <h2 className="text-lg font-semibold text-[#163247] dark:text-white">
                            Próxima fase
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Posts, páginas, casos, testimonios y leads ya están
                            visibles en navegación para preparar el flujo, pero
                            sus CRUD quedan bloqueados hasta la siguiente fase.
                        </p>
                    </article>
                </section>
            </div>
        </>
    );
}
