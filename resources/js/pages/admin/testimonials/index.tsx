import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Plus, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTable } from '@/components/admin/admin-table';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as testimonials from '@/routes/admin/testimonials';

type AdminTestimonial = {
    id: number;
    name: string;
    position: string | null;
    company: string | null;
    quote: string;
    avatar: string | null;
    isFeatured: boolean;
    sortOrder: number;
    status: string;
};

type TestimonialsIndexProps = {
    testimonials: AdminTestimonial[];
    filters: {
        search: string;
        status: string;
        featured: string;
    };
};

export default function TestimonialsIndex({
    testimonials: items,
    filters,
}: TestimonialsIndexProps) {
    function updateFilter(
        key: keyof TestimonialsIndexProps['filters'],
        value: string,
    ) {
        router.get(
            testimonials.index().url,
            { ...filters, [key]: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function destroyTestimonial(testimonial: AdminTestimonial) {
        router.delete(
            testimonials.destroy({ testimonial: testimonial.id }).url,
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <>
            <Head title="Testimonios" />

            <div className="grid gap-8">
                <AdminPageHeader
                    actions={
                        <Button
                            asChild
                            className="bg-[#163247] text-white hover:bg-[#0f2638]"
                        >
                            <Link href={testimonials.create()}>
                                <Plus className="size-4" />
                                Nuevo testimonio
                            </Link>
                        </Button>
                    }
                    title="Testimonios"
                    description="Gestiona citas destacadas y prueba social visible en la landing."
                />

                <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 md:grid-cols-[1fr_180px_180px] dark:border-white/10 dark:bg-slate-950">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="pl-9"
                            placeholder="Buscar por nombre, empresa o texto"
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
                        value={filters.featured}
                        onChange={(event) =>
                            updateFilter('featured', event.target.value)
                        }
                    >
                        <option value="">Todos</option>
                        <option value="yes">Destacados</option>
                        <option value="no">No destacados</option>
                    </select>
                </section>

                <AdminTable
                    columns={[
                        'Persona',
                        'Empresa',
                        'Destacado',
                        'Orden',
                        'Estado',
                        'Acciones',
                    ]}
                    empty="Todavía no hay testimonios con estos filtros."
                    isEmpty={items.length === 0}
                >
                    {items.map((testimonial) => (
                        <tr
                            className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                            key={testimonial.id}
                        >
                            <td className="px-5 py-4">
                                <p className="font-medium text-[#163247] dark:text-white">
                                    {testimonial.name}
                                </p>
                                <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                    {testimonial.position ?? 'Sin cargo'}
                                </p>
                            </td>
                            <td className="px-5 py-4">
                                {testimonial.company ?? 'Sin empresa'}
                            </td>
                            <td className="px-5 py-4">
                                {testimonial.isFeatured ? 'Sí' : 'No'}
                            </td>
                            <td className="px-5 py-4">
                                {testimonial.sortOrder}
                            </td>
                            <td className="px-5 py-4">
                                <StatusBadge status={testimonial.status} />
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex flex-wrap gap-2">
                                    <Button asChild size="sm" variant="outline">
                                        <Link
                                            href={testimonials.edit({
                                                testimonial: testimonial.id,
                                            })}
                                        >
                                            <Edit3 className="size-4" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <ConfirmDeleteDialog
                                        title="Eliminar testimonio"
                                        description={`¿Seguro que quieres eliminar el testimonio de "${testimonial.name}"? Esta acción no se puede deshacer.`}
                                        onConfirm={() =>
                                            destroyTestimonial(testimonial)
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
