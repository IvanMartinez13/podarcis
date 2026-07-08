import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { PageForm } from '@/components/admin/page-form';
import type { AdminPageFormData } from '@/components/admin/page-form';

type CreatePageProps = {
    page: AdminPageFormData;
};

export default function CreatePage({ page }: CreatePageProps) {
    return (
        <>
            <Head title="Nueva página" />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Nueva página"
                    description="Crea una página corporativa estática."
                />
                <PageForm mode="create" page={page} />
            </div>
        </>
    );
}
