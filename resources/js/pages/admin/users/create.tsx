import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { UserForm } from '@/components/admin/user-form';
import type { AdminUserFormData } from '@/components/admin/user-form';

type CreateUserProps = {
    user: AdminUserFormData;
};

export default function CreateUser({ user }: CreateUserProps) {
    return (
        <>
            <Head title="Nuevo usuario" />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Nuevo usuario"
                    description="Crea un nuevo acceso interno para el CMS."
                />
                <UserForm mode="create" user={user} />
            </div>
        </>
    );
}
