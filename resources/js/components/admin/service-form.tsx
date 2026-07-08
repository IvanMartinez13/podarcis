import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { AdminFormSection } from '@/components/admin/admin-form-section';
import { FormField } from '@/components/admin/form-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import * as services from '@/routes/admin/services';

export type AdminServiceFormData = {
    id: number | null;
    title: string;
    slug: string;
    excerpt: string;
    description: string;
    icon: string;
    featuredImage: string;
    seoTitle: string;
    seoDescription: string;
    isFeatured: boolean;
    sortOrder: number;
    status: 'draft' | 'published';
    publishedAt: string;
};

type ServiceFormProps = {
    service: AdminServiceFormData;
    mode: 'create' | 'edit';
};

export function ServiceForm({ service, mode }: ServiceFormProps) {
    const form = useForm({
        title: service.title,
        slug: service.slug,
        excerpt: service.excerpt ?? '',
        description: service.description ?? '',
        icon: service.icon ?? '',
        featured_image: service.featuredImage ?? '',
        seo_title: service.seoTitle ?? '',
        seo_description: service.seoDescription ?? '',
        is_featured: service.isFeatured,
        sort_order: service.sortOrder,
        status: service.status,
        published_at: service.publishedAt ?? '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post(services.store().url);

            return;
        }

        form.patch(services.update({ service: service.slug }).url);
    }

    return (
        <form className="grid gap-6" onSubmit={submit}>
            <AdminFormSection
                title="Contenido principal"
                description="Define cómo se presenta el servicio en la web pública."
            >
                <div className="grid gap-5 lg:grid-cols-2">
                    <FormField
                        error={form.errors.title}
                        htmlFor="title"
                        label="Título"
                    >
                        <Input
                            id="title"
                            value={form.data.title}
                            onChange={(event) =>
                                form.setData('title', event.target.value)
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
                    error={form.errors.excerpt}
                    htmlFor="excerpt"
                    label="Extracto"
                >
                    <textarea
                        id="excerpt"
                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.excerpt}
                        onChange={(event) =>
                            form.setData('excerpt', event.target.value)
                        }
                    />
                </FormField>

                <FormField
                    error={form.errors.description}
                    htmlFor="description"
                    label="Descripción"
                >
                    <textarea
                        id="description"
                        className="min-h-44 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.description}
                        onChange={(event) =>
                            form.setData('description', event.target.value)
                        }
                    />
                </FormField>
            </AdminFormSection>

            <AdminFormSection
                title="Publicación"
                description="Controla visibilidad, orden y destacados."
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
                    <FormField
                        error={form.errors.published_at}
                        htmlFor="published_at"
                        label="Fecha de publicación"
                    >
                        <Input
                            id="published_at"
                            type="datetime-local"
                            value={form.data.published_at}
                            onChange={(event) =>
                                form.setData('published_at', event.target.value)
                            }
                        />
                    </FormField>
                </div>

                <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                    <Checkbox
                        checked={form.data.is_featured}
                        onCheckedChange={(checked) =>
                            form.setData('is_featured', checked === true)
                        }
                    />
                    Servicio destacado
                </label>
            </AdminFormSection>

            <AdminFormSection
                title="Detalles visuales y SEO"
                description="Usaremos placeholders mientras el CMS no gestione archivos."
            >
                <div className="grid gap-5 lg:grid-cols-2">
                    <FormField
                        error={form.errors.icon}
                        htmlFor="icon"
                        label="Icono"
                    >
                        <Input
                            id="icon"
                            value={form.data.icon}
                            onChange={(event) =>
                                form.setData('icon', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        error={form.errors.featured_image}
                        htmlFor="featured_image"
                        label="Imagen destacada"
                    >
                        <Input
                            id="featured_image"
                            placeholder="https://placehold.co/1200x700"
                            value={form.data.featured_image}
                            onChange={(event) =>
                                form.setData(
                                    'featured_image',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                    <FormField
                        error={form.errors.seo_title}
                        htmlFor="seo_title"
                        label="SEO title"
                    >
                        <Input
                            id="seo_title"
                            value={form.data.seo_title}
                            onChange={(event) =>
                                form.setData('seo_title', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        error={form.errors.seo_description}
                        htmlFor="seo_description"
                        label="SEO description"
                    >
                        <Input
                            id="seo_description"
                            value={form.data.seo_description}
                            onChange={(event) =>
                                form.setData(
                                    'seo_description',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                </div>
            </AdminFormSection>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={services.index()}>Cancelar</Link>
                </Button>
                <Button
                    className="bg-[#163247] text-white hover:bg-[#0f2638]"
                    disabled={form.processing}
                    type="submit"
                >
                    {form.processing ? 'Guardando...' : 'Guardar servicio'}
                </Button>
            </div>
        </form>
    );
}
