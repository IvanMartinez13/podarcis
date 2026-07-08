import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { AdminFormSection } from '@/components/admin/admin-form-section';
import { FormField } from '@/components/admin/form-field';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import * as testimonials from '@/routes/admin/testimonials';

export type AdminTestimonialFormData = {
    id: number | null;
    name: string;
    position: string;
    company: string;
    quote: string;
    avatar: string;
    isFeatured: boolean;
    sortOrder: number;
    status: 'draft' | 'published';
};

type TestimonialFormProps = {
    testimonial: AdminTestimonialFormData;
    mode: 'create' | 'edit';
};

type TestimonialFormPayload = {
    name: string;
    position: string;
    company: string;
    quote: string;
    avatar: string;
    avatar_upload: File | null;
    remove_avatar: boolean;
    is_featured: boolean;
    sort_order: number;
    status: 'draft' | 'published';
};

export function TestimonialForm({ testimonial, mode }: TestimonialFormProps) {
    const form = useForm<TestimonialFormPayload>({
        name: testimonial.name,
        position: testimonial.position ?? '',
        company: testimonial.company ?? '',
        quote: testimonial.quote ?? '',
        avatar: testimonial.avatar ?? '',
        avatar_upload: null,
        remove_avatar: false,
        is_featured: testimonial.isFeatured,
        sort_order: testimonial.sortOrder,
        status: testimonial.status,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post(testimonials.store().url, { forceFormData: true });

            return;
        }

        if (testimonial.id !== null) {
            form.transform((data) => ({ ...data, _method: 'patch' }));
            form.post(
                testimonials.update({ testimonial: testimonial.id }).url,
                {
                    forceFormData: true,
                },
            );
        }
    }

    return (
        <form className="grid gap-6" onSubmit={submit}>
            <AdminFormSection
                title="Contenido del testimonio"
                description="Texto y datos visibles en la sección de confianza de la web pública."
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
                        error={form.errors.company}
                        htmlFor="company"
                        label="Empresa"
                    >
                        <Input
                            id="company"
                            value={form.data.company}
                            onChange={(event) =>
                                form.setData('company', event.target.value)
                            }
                        />
                    </FormField>
                </div>

                <FormField
                    error={form.errors.position}
                    htmlFor="position"
                    label="Cargo"
                >
                    <Input
                        id="position"
                        value={form.data.position}
                        onChange={(event) =>
                            form.setData('position', event.target.value)
                        }
                    />
                </FormField>

                <FormField
                    error={form.errors.quote}
                    htmlFor="quote"
                    label="Testimonio"
                >
                    <textarea
                        id="quote"
                        className="min-h-44 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.quote}
                        onChange={(event) =>
                            form.setData('quote', event.target.value)
                        }
                    />
                </FormField>
            </AdminFormSection>

            <AdminFormSection
                title="Publicación"
                description="Controla visibilidad, destacado y orden de aparición."
            >
                <div className="grid gap-5 lg:grid-cols-3">
                    <FormField
                        error={form.errors.status}
                        htmlFor="status"
                        label="Estado"
                    >
                        <select
                            id="status"
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={form.data.status}
                            onChange={(event) =>
                                form.setData(
                                    'status',
                                    event.target.value as 'draft' | 'published',
                                )
                            }
                        >
                            <option value="draft">Borrador</option>
                            <option value="published">Publicado</option>
                        </select>
                    </FormField>
                    <FormField
                        error={form.errors.sort_order}
                        htmlFor="sort_order"
                        label="Orden"
                    >
                        <Input
                            id="sort_order"
                            min="0"
                            type="number"
                            value={form.data.sort_order}
                            onChange={(event) =>
                                form.setData(
                                    'sort_order',
                                    Number(event.target.value),
                                )
                            }
                        />
                    </FormField>
                    <ImageUploadField
                        id="avatar_upload"
                        label="Avatar"
                        currentImageUrl={testimonial.avatar}
                        error={form.errors.avatar_upload ?? form.errors.avatar}
                        help="JPG, PNG o WebP. Los PNG se conservarán para mantener transparencias."
                        progress={form.progress?.percentage ?? null}
                        remove={form.data.remove_avatar}
                        onFileChange={(file) =>
                            form.setData('avatar_upload', file)
                        }
                        onRemoveChange={(remove) =>
                            form.setData('remove_avatar', remove)
                        }
                    />
                </div>

                <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                    <Checkbox
                        checked={form.data.is_featured}
                        onCheckedChange={(checked) =>
                            form.setData('is_featured', checked === true)
                        }
                    />
                    Testimonio destacado
                </label>
            </AdminFormSection>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={testimonials.index()}>Cancelar</Link>
                </Button>
                <Button
                    className="bg-[#163247] text-white hover:bg-[#0f2638]"
                    disabled={form.processing}
                    type="submit"
                >
                    {form.processing ? 'Guardando...' : 'Guardar testimonio'}
                </Button>
            </div>
        </form>
    );
}
