import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { AdminFormSection } from '@/components/admin/admin-form-section';
import { FormField } from '@/components/admin/form-field';
import { SeoCounter } from '@/components/admin/seo-counter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as pages from '@/routes/admin/pages';

export type AdminPageFormData = {
    id: number | null;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
    ogImage: string;
    status: 'draft' | 'published';
    publishedAt: string;
    previewUrl: string | null;
};

type PageFormProps = {
    page: AdminPageFormData;
    mode: 'create' | 'edit';
};

export function PageForm({ page, mode }: PageFormProps) {
    const form = useForm({
        title: page.title,
        slug: page.slug,
        excerpt: page.excerpt ?? '',
        content: page.content ?? '',
        seo_title: page.seoTitle ?? '',
        seo_description: page.seoDescription ?? '',
        og_image: page.ogImage ?? '',
        status: page.status,
        published_at: page.publishedAt ?? '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post(pages.store().url);

            return;
        }

        if (page.id === null) {
            return;
        }

        form.patch(pages.update({ page: page.id }).url);
    }

    return (
        <form className="grid gap-6" onSubmit={submit}>
            <AdminFormSection
                title="Contenido de página"
                description="Página estática corporativa editable desde el CMS."
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
                    error={form.errors.content}
                    htmlFor="content"
                    label="Contenido"
                >
                    <textarea
                        id="content"
                        className="min-h-80 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.content}
                        onChange={(event) =>
                            form.setData('content', event.target.value)
                        }
                    />
                </FormField>
            </AdminFormSection>

            <AdminFormSection
                title="Publicación"
                description="Controla visibilidad y fecha pública."
            >
                <div className="grid gap-5 lg:grid-cols-2">
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
                        error={form.errors.published_at}
                        htmlFor="published_at"
                        label="Fecha publicación"
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
            </AdminFormSection>

            <AdminFormSection
                title="SEO e imagen social"
                description="Metadatos públicos y Open Graph."
            >
                <FormField
                    error={form.errors.og_image}
                    htmlFor="og_image"
                    label="OG image"
                >
                    <Input
                        id="og_image"
                        placeholder="https://placehold.co/1200x630"
                        value={form.data.og_image}
                        onChange={(event) =>
                            form.setData('og_image', event.target.value)
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
                    <SeoCounter value={form.data.seo_title} max={60} />
                </FormField>
                <FormField
                    error={form.errors.seo_description}
                    htmlFor="seo_description"
                    label="SEO description"
                >
                    <textarea
                        id="seo_description"
                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.seo_description}
                        onChange={(event) =>
                            form.setData('seo_description', event.target.value)
                        }
                    />
                    <SeoCounter value={form.data.seo_description} max={160} />
                </FormField>
            </AdminFormSection>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={pages.index()}>Cancelar</Link>
                </Button>
                {page.previewUrl && (
                    <Button asChild variant="outline">
                        <a href={page.previewUrl} target="_blank">
                            Ver público
                        </a>
                    </Button>
                )}
                <Button
                    className="bg-[#163247] text-white hover:bg-[#0f2638]"
                    disabled={form.processing}
                    type="submit"
                >
                    {form.processing ? 'Guardando...' : 'Guardar página'}
                </Button>
            </div>
        </form>
    );
}
