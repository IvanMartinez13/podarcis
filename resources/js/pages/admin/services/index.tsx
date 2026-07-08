import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTable } from '@/components/admin/admin-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import * as services from '@/routes/admin/services';

type AdminService = {
    id: number;
    title: string;
    slug: string;
    status: string;
    isFeatured: boolean;
    sortOrder: number;
    publishedAt: string | null;
};

type ServicesIndexProps = {
    services: AdminService[];
};

export default function ServicesIndex({ services: items }: ServicesIndexProps) {
    function destroyService(service: AdminService) {
        if (!window.confirm(`¿Eliminar el servicio "${service.title}"?`)) {
            return;
        }

        router.delete(services.destroy({ service: service.slug }).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Servicios" />

            <div className="grid gap-8">
                <AdminPageHeader
                    actions={
                        <Button
                            asChild
                            className="bg-[#163247] text-white hover:bg-[#0f2638]"
                        >
                            <Link href={services.create()}>
                                <Plus className="size-4" />
                                Nuevo servicio
                            </Link>
                        </Button>
                    }
                    title="Servicios"
                    description="Gestiona los servicios publicados y borradores de la web corporativa."
                />

                <AdminTable
                    columns={[
                        'Servicio',
                        'Estado',
                        'Destacado',
                        'Orden',
                        'Publicado',
                        'Acciones',
                    ]}
                    empty="Todavía no hay servicios creados."
                    isEmpty={items.length === 0}
                >
                    {items.map((service) => (
                        <tr
                            className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                            key={service.id}
                        >
                            <td className="px-5 py-4">
                                <div>
                                    <p className="font-medium text-[#163247] dark:text-white">
                                        {service.title}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        /{service.slug}
                                    </p>
                                </div>
                            </td>
                            <td className="px-5 py-4">
                                <StatusBadge status={service.status} />
                            </td>
                            <td className="px-5 py-4">
                                {service.isFeatured ? 'Sí' : 'No'}
                            </td>
                            <td className="px-5 py-4">{service.sortOrder}</td>
                            <td className="px-5 py-4">
                                {service.publishedAt ?? 'Sin fecha'}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex gap-2">
                                    <Button asChild size="sm" variant="outline">
                                        <Link
                                            href={services.edit({
                                                service: service.slug,
                                            })}
                                        >
                                            <Edit3 className="size-4" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <Button
                                        onClick={() => destroyService(service)}
                                        size="sm"
                                        type="button"
                                        variant="destructive"
                                    >
                                        <Trash2 className="size-4" />
                                        Eliminar
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </AdminTable>
            </div>
        </>
    );
}
