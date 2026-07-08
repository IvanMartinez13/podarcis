import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Eye, Plus, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTable } from '@/components/admin/admin-table';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as pages from '@/routes/admin/pages';

type AdminPage = {
    id: number;
    title: string;
    slug: string;
    status: string;
    publishedAt: string | null;
    previewUrl: string | null;
};

type PagesIndexProps = {
    pages: AdminPage[];
    filters: {
        search: string;
        status: string;
    };
};

export default function PagesIndex({ pages: items, filters }: PagesIndexProps) {
    function updateFilter(
        key: keyof PagesIndexProps['filters'],
        value: string,
    ) {
        router.get(
            pages.index().url,
            { ...filters, [key]: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function destroyPage(page: AdminPage) {
        router.delete(pages.destroy({ page: page.id }).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Páginas" />

            <div className="grid gap-8">
                <AdminPageHeader
                    actions={
                        <Button
                            asChild
                            className="bg-[#163247] text-white hover:bg-[#0f2638]"
                        >
                            <Link href={pages.create()}>
                                <Plus className="size-4" />
                                Nueva página
                            </Link>
                        </Button>
                    }
                    title="Páginas"
                    description="Gestiona páginas corporativas estáticas."
                />

                <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 md:grid-cols-[1fr_180px] dark:border-white/10 dark:bg-slate-950">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="pl-9"
                            placeholder="Buscar por título o slug"
                            value={filters.search}
                            onChange={(event) =>
                                updateFilter('search', event.target.value)
                            }
                        />
                    </div>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={filters.status}
                        onChange={(event) =>
                            updateFilter('status', event.target.value)
                        }
                    >
                        <option value="">Todas</option>
                        <option value="published">Publicada</option>
                        <option value="draft">Borrador</option>
                    </select>
                </section>

                <AdminTable
                    columns={['Página', 'Estado', 'Publicado', 'Acciones']}
                    empty="Todavía no hay páginas con estos filtros."
                    isEmpty={items.length === 0}
                >
                    {items.map((page) => (
                        <tr
                            className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                            key={page.id}
                        >
                            <td className="px-5 py-4">
                                <p className="font-medium text-[#163247] dark:text-white">
                                    {page.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    /{page.slug}
                                </p>
                            </td>
                            <td className="px-5 py-4">
                                <StatusBadge status={page.status} />
                            </td>
                            <td className="px-5 py-4">
                                {page.publishedAt ?? 'Sin fecha'}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {page.previewUrl && (
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <a
                                                href={page.previewUrl}
                                                target="_blank"
                                            >
                                                <Eye className="size-4" />
                                                Ver
                                            </a>
                                        </Button>
                                    )}
                                    <Button asChild size="sm" variant="outline">
                                        <Link
                                            href={pages.edit({
                                                page: page.id,
                                            })}
                                        >
                                            <Edit3 className="size-4" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <ConfirmDeleteDialog
                                        title="Eliminar página"
                                        description={`¿Seguro que quieres eliminar "${page.title}"? Esta acción no se puede deshacer.`}
                                        onConfirm={() => destroyPage(page)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </AdminTable>
            </div>
        </>
    );
}
