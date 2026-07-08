import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { AdminFormSection } from '@/components/admin/admin-form-section';
import { FormField } from '@/components/admin/form-field';
import { SeoCounter } from '@/components/admin/seo-counter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as posts from '@/routes/admin/posts';

export type AdminPostCategory = {
    id: number;
    name: string;
};

export type AdminPostFormData = {
    id: number | null;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    categoryId: number | string | null;
    seoTitle: string;
    seoDescription: string;
    status: 'draft' | 'published';
    publishedAt: string;
    previewUrl: string | null;
};

type PostFormProps = {
    post: AdminPostFormData;
    categories: AdminPostCategory[];
    mode: 'create' | 'edit';
};

export function PostForm({ post, categories, mode }: PostFormProps) {
    const form = useForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        content: post.content ?? '',
        featured_image: post.featuredImage ?? '',
        category_id: post.categoryId ? String(post.categoryId) : '',
        seo_title: post.seoTitle ?? '',
        seo_description: post.seoDescription ?? '',
        status: post.status,
        published_at: post.publishedAt ?? '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post(posts.store().url);

            return;
        }

        form.patch(posts.update({ post: post.slug }).url);
    }

    return (
        <form className="grid gap-6" onSubmit={submit}>
            <AdminFormSection
                title="Contenido del post"
                description="Texto base del artículo. El editor avanzado llegará en una fase posterior."
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
                description="Controla visibilidad, categoría y fecha pública."
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
                        error={form.errors.category_id}
                        htmlFor="category_id"
                        label="Categoría"
                    >
                        <select
                            id="category_id"
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={form.data.category_id}
                            onChange={(event) =>
                                form.setData('category_id', event.target.value)
                            }
                        >
                            <option value="">Sin categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
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
                title="SEO e imagen"
                description="Metadatos públicos y placeholder de imagen hasta incorporar media library."
            >
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
                            form.setData('featured_image', event.target.value)
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
                    <Link href={posts.index()}>Cancelar</Link>
                </Button>
                {post.previewUrl && (
                    <Button asChild variant="outline">
                        <a href={post.previewUrl} target="_blank">
                            Ver público
                        </a>
                    </Button>
                )}
                <Button
                    className="bg-[#163247] text-white hover:bg-[#0f2638]"
                    disabled={form.processing}
                    type="submit"
                >
                    {form.processing ? 'Guardando...' : 'Guardar post'}
                </Button>
            </div>
        </form>
    );
}
