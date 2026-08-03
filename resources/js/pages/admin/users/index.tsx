import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTable } from '@/components/admin/admin-table';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as users from '@/routes/admin/users';

type AdminUser = {
    id: number;
    name: string;
    email: string;
    createdAt: string | null;
    emailVerifiedAt: string | null;
};

type UsersIndexProps = {
    users: AdminUser[];
};

export default function UsersIndex({ users: items }: UsersIndexProps) {
    function destroyUser(user: AdminUser) {
        router.delete(users.destroy({ user: user.id }).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Usuarios" />

            <div className="grid gap-8">
                <AdminPageHeader
                    actions={
                        <Button
                            asChild
                            className="bg-[#163247] text-white hover:bg-[#0f2638]"
                        >
                            <Link href={users.create()}>
                                <Plus className="size-4" />
                                Nuevo usuario
                            </Link>
                        </Button>
                    }
                    title="Usuarios"
                    description="Gestiona los usuarios con acceso al CMS de PODARCIS."
                />

                <AdminTable
                    columns={['Usuario', 'Verificación', 'Alta', 'Acciones']}
                    empty="Todavía no hay usuarios creados."
                    isEmpty={items.length === 0}
                >
                    {items.map((user) => (
                        <tr
                            className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                            key={user.id}
                        >
                            <td className="px-5 py-4">
                                <div>
                                    <p className="font-medium text-[#163247] dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {user.email}
                                    </p>
                                </div>
                            </td>
                            <td className="px-5 py-4">
                                {user.emailVerifiedAt ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">
                                        Verificado
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Pendiente</Badge>
                                )}
                            </td>
                            <td className="px-5 py-4">
                                {user.createdAt ?? 'Sin fecha'}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex gap-2">
                                    <Button asChild size="sm" variant="outline">
                                        <Link
                                            href={users.edit({ user: user.id })}
                                        >
                                            <Edit3 className="size-4" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <ConfirmDeleteDialog
                                        title="Eliminar usuario"
                                        description={`¿Seguro que quieres eliminar a "${user.name}"? Esta acción no se puede deshacer.`}
                                        onConfirm={() => destroyUser(user)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </AdminTable>
            </div>
        </>
    );
}
