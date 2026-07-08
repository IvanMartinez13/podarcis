import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { PageForm } from '@/components/admin/page-form';
import type { AdminPageFormData } from '@/components/admin/page-form';

type EditPageProps = {
    page: AdminPageFormData;
};

export default function EditPage({ page }: EditPageProps) {
    return (
        <>
            <Head title={`Editar ${page.title}`} />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Editar página"
                    description="Actualiza contenido, publicación y metadatos SEO."
                />
                <PageForm mode="edit" page={page} />
            </div>
        </>
    );
}
