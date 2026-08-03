import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { AdminFormSection } from '@/components/admin/admin-form-section';
import { FormField } from '@/components/admin/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as users from '@/routes/admin/users';

export type AdminUserFormData = {
    id: number | null;
    name: string;
    email: string;
};

type UserFormProps = {
    user: AdminUserFormData;
    mode: 'create' | 'edit';
};

type UserFormPayload = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export function UserForm({ user, mode }: UserFormProps) {
    const form = useForm<UserFormPayload>({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post(users.store().url);

            return;
        }

        if (user.id === null) {
            return;
        }

        form.patch(users.update({ user: user.id }).url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset('password', 'password_confirmation');
            },
        });
    }

    return (
        <form className="grid gap-6" onSubmit={submit}>
            <AdminFormSection
                title="Datos de acceso"
                description="Gestiona usuarios internos que acceden al CMS corporativo."
            >
                <div className="grid gap-5 lg:grid-cols-2">
                    <FormField
                        error={form.errors.name}
                        htmlFor="name"
                        label="Nombre"
                    >
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        error={form.errors.email}
                        htmlFor="email"
                        label="Email"
                    >
                        <Input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                        />
                    </FormField>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                    <FormField
                        error={form.errors.password}
                        hint={
                            mode === 'edit'
                                ? 'Déjalo vacío para mantener la contraseña actual.'
                                : undefined
                        }
                        htmlFor="password"
                        label="Contraseña"
                    >
                        <Input
                            id="password"
                            type="password"
                            value={form.data.password}
                            onChange={(event) =>
                                form.setData('password', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        error={form.errors.password_confirmation}
                        htmlFor="password_confirmation"
                        label="Confirmar contraseña"
                    >
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={form.data.password_confirmation}
                            onChange={(event) =>
                                form.setData(
                                    'password_confirmation',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                </div>
            </AdminFormSection>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={users.index()}>Cancelar</Link>
                </Button>
                <Button
                    className="bg-[#163247] text-white hover:bg-[#0f2638]"
                    disabled={form.processing}
                    type="submit"
                >
                    {form.processing ? 'Guardando...' : 'Guardar usuario'}
                </Button>
            </div>
        </form>
    );
}
