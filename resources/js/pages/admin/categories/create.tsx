import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { CategoryForm } from '@/components/admin/category-form';
import type { AdminCategoryFormData } from '@/components/admin/category-form';

type CreateCategoryProps = {
    category: AdminCategoryFormData;
};

export default function CreateCategory({ category }: CreateCategoryProps) {
    return (
        <>
            <Head title="Nueva categoría" />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Nueva categoría"
                    description="Crea una categoría para organizar contenidos del CMS."
                />
                <CategoryForm category={category} mode="create" />
            </div>
        </>
    );
}
