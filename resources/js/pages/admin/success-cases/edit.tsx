import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SuccessCaseForm } from '@/components/admin/success-case-form';
import type {
    AdminSuccessCaseFormData,
    AdminSuccessCaseService,
} from '@/components/admin/success-case-form';

type EditSuccessCaseProps = {
    successCase: AdminSuccessCaseFormData;
    services: AdminSuccessCaseService[];
};

export default function EditSuccessCase({
    successCase,
    services,
}: EditSuccessCaseProps) {
    return (
        <>
            <Head title={`Editar ${successCase.title}`} />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Editar caso de éxito"
                    description="Actualiza el relato, servicio relacionado y estado de publicación."
                />
                <SuccessCaseForm
                    mode="edit"
                    services={services}
                    successCase={successCase}
                />
            </div>
        </>
    );
}
