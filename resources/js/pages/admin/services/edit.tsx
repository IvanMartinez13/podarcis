import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ServiceForm } from '@/components/admin/service-form';
import type { AdminServiceFormData } from '@/components/admin/service-form';

type EditServiceProps = {
    service: AdminServiceFormData;
};

export default function EditService({ service }: EditServiceProps) {
    return (
        <>
            <Head title={`Editar ${service.title}`} />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Editar servicio"
                    description="Actualiza el contenido, la publicación y los metadatos del servicio."
                />
                <ServiceForm mode="edit" service={service} />
            </div>
        </>
    );
}
