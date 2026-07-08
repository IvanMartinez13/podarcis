import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTable } from '@/components/admin/admin-table';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as categories from '@/routes/admin/categories';

type AdminCategory = {
    id: number;
    name: string;
    slug: string;
    type: 'post' | 'service';
    postsCount: number;
};

type CategoriesIndexProps = {
    categories: AdminCategory[];
};

export default function CategoriesIndex({
    categories: items,
}: CategoriesIndexProps) {
    function destroyCategory(category: AdminCategory) {
        router.delete(categories.destroy({ category: category.id }).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Categorías" />

            <div className="grid gap-8">
                <AdminPageHeader
                    actions={
                        <Button
                            asChild
                            className="bg-[#163247] text-white hover:bg-[#0f2638]"
                        >
                            <Link href={categories.create()}>
                                <Plus className="size-4" />
                                Nueva categoría
                            </Link>
                        </Button>
                    }
                    title="Categorías"
                    description="Organiza taxonomías del blog y de futuros contenidos de servicios."
                />

                <AdminTable
                    columns={['Categoría', 'Tipo', 'Posts', 'Acciones']}
                    empty="Todavía no hay categorías creadas."
                    isEmpty={items.length === 0}
                >
                    {items.map((category) => (
                        <tr
                            className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                            key={category.id}
                        >
                            <td className="px-5 py-4">
                                <div>
                                    <p className="font-medium text-[#163247] dark:text-white">
                                        {category.name}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        /{category.slug}
                                    </p>
                                </div>
                            </td>
                            <td className="px-5 py-4">
                                <Badge variant="outline">
                                    {category.type === 'post'
                                        ? 'Post'
                                        : 'Servicio'}
                                </Badge>
                            </td>
                            <td className="px-5 py-4">{category.postsCount}</td>
                            <td className="px-5 py-4">
                                <div className="flex gap-2">
                                    <Button asChild size="sm" variant="outline">
                                        <Link
                                            href={categories.edit({
                                                category: category.id,
                                            })}
                                        >
                                            <Edit3 className="size-4" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <ConfirmDeleteDialog
                                        title="Eliminar categoría"
                                        description={`¿Seguro que quieres eliminar "${category.name}"? Esta acción no se puede deshacer.`}
                                        onConfirm={() =>
                                            destroyCategory(category)
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
