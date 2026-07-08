import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Eye, Plus, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTable } from '@/components/admin/admin-table';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as successCases from '@/routes/admin/success-cases';

type AdminSuccessCase = {
    id: number;
    title: string;
    slug: string;
    clientName: string | null;
    sector: string | null;
    status: string;
    publishedAt: string | null;
    previewUrl: string | null;
    service: { title: string } | null;
};

type SuccessCaseService = {
    id: number;
    title: string;
};

type SuccessCasesIndexProps = {
    successCases: AdminSuccessCase[];
    services: SuccessCaseService[];
    filters: {
        search: string;
        status: string;
        service_id: string;
    };
};

export default function SuccessCasesIndex({
    successCases: items,
    services,
    filters,
}: SuccessCasesIndexProps) {
    function updateFilter(
        key: keyof SuccessCasesIndexProps['filters'],
        value: string,
    ) {
        router.get(
            successCases.index().url,
            { ...filters, [key]: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function destroySuccessCase(successCase: AdminSuccessCase) {
        router.delete(
            successCases.destroy({ success_case: successCase.slug }).url,
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <>
            <Head title="Casos de éxito" />

            <div className="grid gap-8">
                <AdminPageHeader
                    actions={
                        <Button
                            asChild
                            className="bg-[#163247] text-white hover:bg-[#0f2638]"
                        >
                            <Link href={successCases.create()}>
                                <Plus className="size-4" />
                                Nuevo caso
                            </Link>
                        </Button>
                    }
                    title="Casos de éxito"
                    description="Gestiona proyectos publicados, resultados y casos relacionados con servicios."
                />

                <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 md:grid-cols-[1fr_180px_220px] dark:border-white/10 dark:bg-slate-950">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="pl-9"
                            placeholder="Buscar por título, cliente o sector"
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
                        <option value="">Todos</option>
                        <option value="published">Publicado</option>
                        <option value="draft">Borrador</option>
                    </select>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={filters.service_id}
                        onChange={(event) =>
                            updateFilter('service_id', event.target.value)
                        }
                    >
                        <option value="">Todos los servicios</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.title}
                            </option>
                        ))}
                    </select>
                </section>

                <AdminTable
                    columns={[
                        'Caso',
                        'Cliente',
                        'Sector',
                        'Servicio',
                        'Estado',
                        'Publicado',
                        'Acciones',
                    ]}
                    empty="Todavía no hay casos con estos filtros."
                    isEmpty={items.length === 0}
                >
                    {items.map((successCase) => (
                        <tr
                            className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                            key={successCase.id}
                        >
                            <td className="px-5 py-4">
                                <p className="font-medium text-[#163247] dark:text-white">
                                    {successCase.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    /{successCase.slug}
                                </p>
                            </td>
                            <td className="px-5 py-4">
                                {successCase.clientName ?? 'Sin cliente'}
                            </td>
                            <td className="px-5 py-4">
                                {successCase.sector ?? 'Sin sector'}
                            </td>
                            <td className="px-5 py-4">
                                {successCase.service?.title ?? 'Sin servicio'}
                            </td>
                            <td className="px-5 py-4">
                                <StatusBadge status={successCase.status} />
                            </td>
                            <td className="px-5 py-4">
                                {successCase.publishedAt ?? 'Sin fecha'}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {successCase.previewUrl && (
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <a
                                                href={successCase.previewUrl}
                                                rel="noreferrer"
                                                target="_blank"
                                            >
                                                <Eye className="size-4" />
                                                Ver
                                            </a>
                                        </Button>
                                    )}
                                    <Button asChild size="sm" variant="outline">
                                        <Link
                                            href={successCases.edit({
                                                success_case: successCase.slug,
                                            })}
                                        >
                                            <Edit3 className="size-4" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <ConfirmDeleteDialog
                                        title="Eliminar caso de éxito"
                                        description={`¿Seguro que quieres eliminar "${successCase.title}"? Esta acción no se puede deshacer.`}
                                        onConfirm={() =>
                                            destroySuccessCase(successCase)
                                        }
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
