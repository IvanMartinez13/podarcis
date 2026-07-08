import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTable } from '@/components/admin/admin-table';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as leads from '@/routes/admin/leads';

type AdminLead = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    status: string;
    createdAt: string | null;
    service: { title: string } | null;
};

type LeadService = {
    id: number;
    title: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type LeadsIndexProps = {
    leads: {
        data: AdminLead[];
        links: PaginationLink[];
        meta: {
            from: number | null;
            to: number | null;
            total: number;
        };
    };
    services: LeadService[];
    filters: {
        search: string;
        status: string;
        service_id: string;
    };
};

export default function LeadsIndex({
    leads: paginatedLeads,
    services,
    filters,
}: LeadsIndexProps) {
    function updateFilter(
        key: keyof LeadsIndexProps['filters'],
        value: string,
    ) {
        router.get(
            leads.index().url,
            { ...filters, [key]: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function destroyLead(lead: AdminLead) {
        router.delete(leads.destroy({ lead: lead.id }).url, {
            preserveScroll: true,
        });
    }

    function paginationLabel(label: string) {
        return label
            .replace('&laquo; Previous', 'Anterior')
            .replace('Next &raquo;', 'Siguiente');
    }

    return (
        <>
            <Head title="Leads" />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Leads"
                    description="Gestiona los contactos recibidos desde el formulario público."
                />

                <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 md:grid-cols-[1fr_180px_220px] dark:border-white/10 dark:bg-slate-950">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="pl-9"
                            placeholder="Buscar por nombre, email, empresa o mensaje"
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
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="closed">Cerrado</option>
                        <option value="discarded">Descartado</option>
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
                        'Contacto',
                        'Teléfono',
                        'Empresa',
                        'Servicio',
                        'Estado',
                        'Fecha',
                        'Acciones',
                    ]}
                    empty="Todavía no hay leads con estos filtros."
                    isEmpty={paginatedLeads.data.length === 0}
                >
                    {paginatedLeads.data.map((lead) => (
                        <tr
                            className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                            key={lead.id}
                        >
                            <td className="px-5 py-4">
                                <p className="font-medium text-[#163247] dark:text-white">
                                    {lead.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {lead.email}
                                </p>
                            </td>
                            <td className="px-5 py-4">
                                {lead.phone ?? 'Sin teléfono'}
                            </td>
                            <td className="px-5 py-4">
                                {lead.company ?? 'Sin empresa'}
                            </td>
                            <td className="px-5 py-4">
                                {lead.service?.title ?? 'Sin servicio'}
                            </td>
                            <td className="px-5 py-4">
                                <StatusBadge status={lead.status} />
                            </td>
                            <td className="px-5 py-4">
                                {lead.createdAt ?? 'Sin fecha'}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex flex-wrap gap-2">
                                    <Button asChild size="sm" variant="outline">
                                        <Link
                                            href={leads.show({ lead: lead.id })}
                                        >
                                            <Eye className="size-4" />
                                            Ver
                                        </Link>
                                    </Button>
                                    <ConfirmDeleteDialog
                                        title="Eliminar lead"
                                        description={`¿Seguro que quieres eliminar el lead de "${lead.name}"? Esta acción no se puede deshacer.`}
                                        onConfirm={() => destroyLead(lead)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </AdminTable>

                {paginatedLeads.meta.total > 0 && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Mostrando {paginatedLeads.meta.from}-
                            {paginatedLeads.meta.to} de{' '}
                            {paginatedLeads.meta.total}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {paginatedLeads.links
                                .filter((link) => link.url !== null)
                                .map((link) => (
                                    <Button
                                        asChild
                                        key={`${link.label}-${link.url}`}
                                        size="sm"
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                    >
                                        <Link
                                            href={link.url ?? ''}
                                            preserveScroll
                                            preserveState
                                        >
                                            {paginationLabel(link.label)}
                                        </Link>
                                    </Button>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
