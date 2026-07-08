import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { AdminFormSection } from '@/components/admin/admin-form-section';
import { FormField } from '@/components/admin/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as categories from '@/routes/admin/categories';

export type AdminCategoryFormData = {
    id: number | null;
    name: string;
    slug: string;
    description: string;
    type: 'post' | 'service';
};

type CategoryFormProps = {
    category: AdminCategoryFormData;
    mode: 'create' | 'edit';
};

export function CategoryForm({ category, mode }: CategoryFormProps) {
    const form = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        type: category.type,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post(categories.store().url);

            return;
        }

        if (category.id === null) {
            return;
        }

        form.patch(categories.update({ category: category.id }).url);
    }

    return (
        <form className="grid gap-6" onSubmit={submit}>
            <AdminFormSection
                title="Datos de categoría"
                description="Organiza contenidos del blog y futuras taxonomías de servicios."
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
                        error={form.errors.slug}
                        hint="Déjalo vacío al crear para generarlo automáticamente."
                        htmlFor="slug"
                        label="Slug"
                    >
                        <Input
                            id="slug"
                            value={form.data.slug}
                            onChange={(event) =>
                                form.setData('slug', event.target.value)
                            }
                        />
                    </FormField>
                </div>

                <FormField
                    error={form.errors.description}
                    htmlFor="description"
                    label="Descripción"
                >
                    <textarea
                        id="description"
                        className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.description}
                        onChange={(event) =>
                            form.setData('description', event.target.value)
                        }
                    />
                </FormField>

                <FormField error={form.errors.type} htmlFor="type" label="Tipo">
                    <select
                        id="type"
                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.type}
                        onChange={(event) =>
                            form.setData(
                                'type',
                                event.target.value as 'post' | 'service',
                            )
                        }
                    >
                        <option value="post">Post</option>
                        <option value="service">Servicio</option>
                    </select>
                </FormField>
            </AdminFormSection>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={categories.index()}>Cancelar</Link>
                </Button>
                <Button
                    className="bg-[#163247] text-white hover:bg-[#0f2638]"
                    disabled={form.processing}
                    type="submit"
                >
                    {form.processing ? 'Guardando...' : 'Guardar categoría'}
                </Button>
            </div>
        </form>
    );
}
