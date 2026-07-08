import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ServiceForm } from '@/components/admin/service-form';
import type { AdminServiceFormData } from '@/components/admin/service-form';

type CreateServiceProps = {
    service: AdminServiceFormData;
};

export default function CreateService({ service }: CreateServiceProps) {
    return (
        <>
            <Head title="Nuevo servicio" />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Nuevo servicio"
                    description="Crea un servicio corporativo para publicarlo más adelante en la web."
                />
                <ServiceForm mode="create" service={service} />
            </div>
        </>
    );
}
