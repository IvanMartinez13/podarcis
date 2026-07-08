import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { CategoryForm } from '@/components/admin/category-form';
import type { AdminCategoryFormData } from '@/components/admin/category-form';

type EditCategoryProps = {
    category: AdminCategoryFormData;
};

export default function EditCategory({ category }: EditCategoryProps) {
    return (
        <>
            <Head title={`Editar ${category.name}`} />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Editar categoría"
                    description="Actualiza el nombre, slug y tipo de categoría."
                />
                <CategoryForm category={category} mode="edit" />
            </div>
        </>
    );
}
