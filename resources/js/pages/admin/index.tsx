import { Head, Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    FileText,
    Inbox,
    Newspaper,
    Plus,
    Quote,
    Trophy,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import * as categories from '@/routes/admin/categories';
import * as leads from '@/routes/admin/leads';
import * as pages from '@/routes/admin/pages';
import * as posts from '@/routes/admin/posts';
import * as services from '@/routes/admin/services';
import * as successCases from '@/routes/admin/success-cases';
import * as testimonials from '@/routes/admin/testimonials';

type DashboardProps = {
    stats: {
        services: number;
        posts: number;
        publishedPosts: number;
        draftPosts: number;
        leads: number;
        newLeads: number;
        contactedLeads: number;
        closedLeads: number;
        publishedPages: number;
        draftPages: number;
        successCases: number;
        publishedSuccessCases: number;
        draftSuccessCases: number;
        testimonials: number;
        featuredTestimonials: number;
        publishedTestimonials: number;
    };
    latestLeads: {
        id: number;
        name: string;
        email: string;
        status: string;
        createdAt: string | null;
    }[];
};

const statCards = [
    {
        key: 'services',
        label: 'Servicios',
        icon: BriefcaseBusiness,
    },
    {
        key: 'posts',
        label: 'Posts totales',
        icon: Newspaper,
    },
    {
        key: 'publishedPosts',
        label: 'Posts publicados',
        icon: Newspaper,
    },
    {
        key: 'draftPosts',
        label: 'Posts borrador',
        icon: Newspaper,
    },
    {
        key: 'leads',
        label: 'Leads totales',
        icon: Inbox,
    },
    {
        key: 'newLeads',
        label: 'Leads nuevos',
        icon: Inbox,
    },
    {
        key: 'contactedLeads',
        label: 'Leads contactados',
        icon: Inbox,
    },
    {
        key: 'closedLeads',
        label: 'Leads cerrados',
        icon: Inbox,
    },
    {
        key: 'publishedPages',
        label: 'Páginas publicadas',
        icon: FileText,
    },
    {
        key: 'draftPages',
        label: 'Páginas borrador',
        icon: FileText,
    },
    {
        key: 'successCases',
        label: 'Casos totales',
        icon: Trophy,
    },
    {
        key: 'publishedSuccessCases',
        label: 'Casos publicados',
        icon: Trophy,
    },
    {
        key: 'draftSuccessCases',
        label: 'Casos borrador',
        icon: Trophy,
    },
    {
        key: 'testimonials',
        label: 'Testimonios',
        icon: Quote,
    },
    {
        key: 'featuredTestimonials',
        label: 'Testimonios destacados',
        icon: Quote,
    },
    {
        key: 'publishedTestimonials',
        label: 'Testimonios publicados',
        icon: Quote,
    },
] as const;

export default function AdminIndex({ stats, latestLeads }: DashboardProps) {
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
                            <Button
                                asChild
                                className="justify-start"
                                variant="outline"
                            >
                                <Link href={leads.index()}>
                                    <Inbox className="size-4" />
                                    Ver leads
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="justify-start"
                                variant="outline"
                            >
                                <Link href={posts.create()}>
                                    <Plus className="size-4" />
                                    Nuevo post
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="justify-start"
                                variant="outline"
                            >
                                <Link href={pages.create()}>
                                    <Plus className="size-4" />
                                    Nueva página
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="justify-start"
                                variant="outline"
                            >
                                <Link href={successCases.create()}>
                                    <Plus className="size-4" />
                                    Nuevo caso
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="justify-start"
                                variant="outline"
                            >
                                <Link href={testimonials.create()}>
                                    <Plus className="size-4" />
                                    Nuevo testimonio
                                </Link>
                            </Button>
                        </div>
                    </article>

                    <article className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-6 dark:border-white/15 dark:bg-white/5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-[#163247] dark:text-white">
                                    Últimos leads
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    Contactos recientes recibidos desde la web.
                                </p>
                            </div>
                            <Button asChild size="sm" variant="outline">
                                <Link href={leads.index()}>Ver todos</Link>
                            </Button>
                        </div>
                        <div className="mt-5 grid gap-3">
                            {latestLeads.length > 0 ? (
                                latestLeads.map((lead) => (
                                    <Link
                                        className="rounded-md border border-slate-200 bg-white p-3 transition hover:border-[#25E331]/60 dark:border-white/10 dark:bg-slate-950"
                                        href={leads.show({ lead: lead.id })}
                                        key={lead.id}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-[#163247] dark:text-white">
                                                    {lead.name}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {lead.email}
                                                </p>
                                            </div>
                                            <StatusBadge status={lead.status} />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Todavía no hay leads registrados.
                                </p>
                            )}
                        </div>
                    </article>
                </section>
            </div>
        </>
    );
}
