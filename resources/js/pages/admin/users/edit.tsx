import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { UserForm } from '@/components/admin/user-form';
import type { AdminUserFormData } from '@/components/admin/user-form';

type EditUserProps = {
    user: AdminUserFormData;
};

export default function EditUser({ user }: EditUserProps) {
    return (
        <>
            <Head title={`Editar ${user.name}`} />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Editar usuario"
                    description="Actualiza identidad, correo y credenciales de acceso al CMS."
                />
                <UserForm mode="edit" user={user} />
            </div>
        </>
    );
}
