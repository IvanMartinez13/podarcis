import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SuccessCaseForm } from '@/components/admin/success-case-form';
import type {
    AdminSuccessCaseFormData,
    AdminSuccessCaseService,
} from '@/components/admin/success-case-form';

type CreateSuccessCaseProps = {
    successCase: AdminSuccessCaseFormData;
    services: AdminSuccessCaseService[];
};

export default function CreateSuccessCase({
    successCase,
    services,
}: CreateSuccessCaseProps) {
    return (
        <>
            <Head title="Nuevo caso de éxito" />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Nuevo caso de éxito"
                    description="Crea un proyecto publicado o en borrador para la web corporativa."
                />
                <SuccessCaseForm
                    mode="create"
                    services={services}
                    successCase={successCase}
                />
            </div>
        </>
    );
}
