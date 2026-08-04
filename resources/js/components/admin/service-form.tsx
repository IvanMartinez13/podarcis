import { Link, useForm } from '@inertiajs/react';
import { CircleHelp, Plus, Trash2 } from 'lucide-react';
import { createElement } from 'react';
import type { FormEvent } from 'react';
import { AdminFormSection } from '@/components/admin/admin-form-section';
import { FormField } from '@/components/admin/form-field';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { SummernoteField } from '@/components/admin/summernote-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { getServiceIcon, resolveServiceIconName } from '@/lib/cms-icons';
import * as services from '@/routes/admin/services';
import type { ServiceBlocks } from '@/types';

export type AdminServiceFormData = {
    id: number | null;
    title: string;
    slug: string;
    excerpt: string;
    description: string;
    icon: string;
    featuredImage: string;
    featuredImageAlt?: string;
    logoImage?: string;
    logoImageAlt?: string;
    kind?: 'consulting' | 'digital';
    blocks?: ServiceBlocks | null;
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

type ServiceFormPayload = {
    title: string;
    slug: string;
    excerpt: string;
    description: string;
    icon: string;
    featured_image: string;
    featured_image_alt: string;
    featured_image_upload: File | null;
    remove_featured_image: boolean;
    logo_image: string;
    logo_image_alt: string;
    logo_image_upload: File | null;
    remove_logo_image: boolean;
    kind: 'consulting' | 'digital';
    blocks: ServiceBlocks | null;
    seo_title: string;
    seo_description: string;
    is_featured: boolean;
    sort_order: number;
    status: 'draft' | 'published';
    published_at: string;
};

const invalidIconMessage =
    'Este icono no existe en la versión de Lucide instalada.';

export function ServiceForm({ service, mode }: ServiceFormProps) {
    const form = useForm<ServiceFormPayload>({
        title: service.title,
        slug: service.slug,
        excerpt: service.excerpt ?? '',
        description: service.description ?? '',
        icon: service.icon ?? '',
        featured_image: service.featuredImage ?? '',
        featured_image_alt: service.featuredImageAlt ?? '',
        featured_image_upload: null,
        remove_featured_image: false,
        logo_image: service.logoImage ?? '',
        logo_image_alt: service.logoImageAlt ?? '',
        logo_image_upload: null,
        remove_logo_image: false,
        kind: service.kind ?? 'consulting',
        blocks: service.blocks ?? null,
        seo_title: service.seoTitle ?? '',
        seo_description: service.seoDescription ?? '',
        is_featured: service.isFeatured,
        sort_order: service.sortOrder,
        status: service.status,
        published_at: service.publishedAt ?? '',
    });
    const nestedError = (path: string) =>
        (form.errors as Record<string, string | undefined>)[path];
    const hasIconValue = form.data.icon.trim().length > 0;
    const resolvedIconName = resolveServiceIconName(form.data.icon);
    const hasInvalidIcon = hasIconValue && resolvedIconName === null;
    const iconError =
        form.errors.icon ?? (hasInvalidIcon ? invalidIconMessage : undefined);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (hasInvalidIcon) {
            form.setError('icon', invalidIconMessage);

            return;
        }

        form.transform((data) => ({
            ...data,
            icon: resolvedIconName ?? '',
            ...(mode === 'edit' ? { _method: 'patch' } : {}),
        }));

        if (mode === 'create') {
            form.post(services.store().url, { forceFormData: true });

            return;
        }

        form.post(services.update({ service: service.slug }).url, {
            forceFormData: true,
        });
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
                    error={form.errors.kind}
                    htmlFor="kind"
                    label="Clasificación"
                >
                    <select
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        id="kind"
                        value={form.data.kind}
                        onChange={(event) =>
                            form.setData(
                                'kind',
                                event.target.value as 'consulting' | 'digital',
                            )
                        }
                    >
                        <option value="consulting">Consultoría</option>
                        <option value="digital">Solución digital</option>
                    </select>
                </FormField>

                <SummernoteField
                    error={form.errors.excerpt}
                    id="excerpt"
                    label="Extracto"
                    height={170}
                    value={form.data.excerpt}
                    onChange={(nextValue) => form.setData('excerpt', nextValue)}
                />
                <SummernoteField
                    error={nestedError('blocks.localContext')}
                    id="blocks_local_context"
                    label="Contexto local de Mallorca y Baleares"
                    height={190}
                    value={form.data.blocks?.localContext ?? ''}
                    onChange={(nextValue) =>
                        form.setData('blocks', {
                            ...form.data.blocks,
                            localContext: nextValue,
                        })
                    }
                />

                <SummernoteField
                    error={form.errors.description}
                    id="description"
                    label="Descripción"
                    height={260}
                    value={form.data.description}
                    onChange={(nextValue) =>
                        form.setData('description', nextValue)
                    }
                />
            </AdminFormSection>

            <AdminFormSection
                title="Detalle del servicio"
                description="Contenido propio de la ficha y llamada a la acción opcional."
            >
                <SummernoteField
                    error={nestedError('blocks.detail')}
                    id="blocks_detail"
                    label="Contenido de detalle"
                    height={230}
                    value={form.data.blocks?.detail ?? ''}
                    onChange={(nextValue) =>
                        form.setData('blocks', {
                            ...form.data.blocks,
                            detail: nextValue,
                        })
                    }
                />
                <div className="grid gap-5 lg:grid-cols-2">
                    <FormField
                        error={nestedError('blocks.cta.label')}
                        label="Texto del CTA"
                    >
                        <Input
                            value={form.data.blocks?.cta?.label ?? ''}
                            onChange={(event) =>
                                form.setData('blocks', {
                                    ...form.data.blocks,
                                    cta: {
                                        label: event.target.value,
                                        href: form.data.blocks?.cta?.href ?? '',
                                    },
                                })
                            }
                        />
                    </FormField>
                    <FormField
                        error={nestedError('blocks.cta.href')}
                        label="URL del CTA"
                    >
                        <Input
                            value={form.data.blocks?.cta?.href ?? ''}
                            onChange={(event) =>
                                form.setData('blocks', {
                                    ...form.data.blocks,
                                    cta: {
                                        label:
                                            form.data.blocks?.cta?.label ?? '',
                                        href: event.target.value,
                                    },
                                })
                            }
                        />
                    </FormField>
                </div>

                <div className="grid gap-4 border-t border-slate-200 pt-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                Preguntas frecuentes
                            </h3>
                            <p className="text-sm text-slate-500">
                                Solo se genera FAQPage cuando estas preguntas
                                también son visibles.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                form.setData('blocks', {
                                    ...form.data.blocks,
                                    faqs: [
                                        ...(form.data.blocks?.faqs ?? []),
                                        {
                                            id: crypto.randomUUID(),
                                            question: '',
                                            answer: '',
                                        },
                                    ],
                                })
                            }
                        >
                            <Plus className="size-4" /> Añadir pregunta
                        </Button>
                    </div>
                    {(form.data.blocks?.faqs ?? []).map((faq, index) => (
                        <div
                            className="grid gap-3 rounded-xl border border-slate-200 p-4"
                            key={faq.id}
                        >
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <FormField
                                        error={nestedError(
                                            `blocks.faqs.${index}.question`,
                                        )}
                                        label={`Pregunta ${index + 1}`}
                                    >
                                        <Input
                                            value={faq.question}
                                            onChange={(event) =>
                                                form.setData('blocks', {
                                                    ...form.data.blocks,
                                                    faqs: (
                                                        form.data.blocks
                                                            ?.faqs ?? []
                                                    ).map((item, itemIndex) =>
                                                        itemIndex === index
                                                            ? {
                                                                  ...item,
                                                                  question:
                                                                      event
                                                                          .target
                                                                          .value,
                                                              }
                                                            : item,
                                                    ),
                                                })
                                            }
                                        />
                                    </FormField>
                                </div>
                                <Button
                                    aria-label={`Eliminar pregunta ${index + 1}`}
                                    className="mt-7"
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        form.setData('blocks', {
                                            ...form.data.blocks,
                                            faqs: (
                                                form.data.blocks?.faqs ?? []
                                            ).filter(
                                                (_, itemIndex) =>
                                                    itemIndex !== index,
                                            ),
                                        })
                                    }
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                            <SummernoteField
                                error={nestedError(
                                    `blocks.faqs.${index}.answer`,
                                )}
                                id={`blocks_faq_${index}_answer`}
                                label="Respuesta"
                                height={130}
                                value={faq.answer}
                                onChange={(nextValue) =>
                                    form.setData('blocks', {
                                        ...form.data.blocks,
                                        faqs: (
                                            form.data.blocks?.faqs ?? []
                                        ).map((item, itemIndex) =>
                                            itemIndex === index
                                                ? { ...item, answer: nextValue }
                                                : item,
                                        ),
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
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
                description="Configura el icono, el logo opcional y la imagen de cabecera sin mostrar placeholders públicos."
            >
                <div className="grid gap-5 lg:grid-cols-2">
                    <FormField
                        error={iconError}
                        hint={
                            resolvedIconName
                                ? `Se guardará como “${resolvedIconName}”.`
                                : 'Déjalo vacío para utilizar leaf.'
                        }
                        htmlFor="icon"
                        label="Icono"
                    >
                        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                            <Input
                                id="icon"
                                aria-invalid={Boolean(iconError)}
                                value={form.data.icon}
                                onChange={(event) => {
                                    form.clearErrors('icon');
                                    form.setData('icon', event.target.value);
                                }}
                            />
                            <div
                                aria-label={
                                    hasInvalidIcon
                                        ? 'Icono no reconocido'
                                        : `Vista previa del icono ${resolvedIconName ?? 'leaf'}`
                                }
                                className="flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-slate-700 sm:min-w-28 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                                role="img"
                            >
                                {createElement(
                                    hasInvalidIcon
                                        ? CircleHelp
                                        : getServiceIcon(form.data.icon),
                                    {
                                        'aria-hidden': true,
                                        className: 'size-5',
                                    },
                                )}
                                <span className="text-xs font-medium">
                                    {hasInvalidIcon
                                        ? 'No existe'
                                        : (resolvedIconName ?? 'leaf')}
                                </span>
                            </div>
                        </div>
                    </FormField>
                    <ImageUploadField
                        id="featured_image_upload"
                        label="Imagen de cabecera"
                        currentImageUrl={service.featuredImage}
                        error={
                            form.errors.featured_image_upload ??
                            form.errors.featured_image
                        }
                        progress={form.progress?.percentage ?? null}
                        remove={form.data.remove_featured_image}
                        onFileChange={(file) =>
                            form.setData('featured_image_upload', file)
                        }
                        onRemoveChange={(remove) =>
                            form.setData('remove_featured_image', remove)
                        }
                    />
                    <ImageUploadField
                        id="logo_image_upload"
                        label="Logo de la solución"
                        currentImageUrl={service.logoImage}
                        error={
                            form.errors.logo_image_upload ??
                            form.errors.logo_image
                        }
                        help="Logo opcional en JPG, PNG o WebP. Si falta, se usará el icono configurado."
                        progress={form.progress?.percentage ?? null}
                        remove={form.data.remove_logo_image}
                        onFileChange={(file) =>
                            form.setData('logo_image_upload', file)
                        }
                        onRemoveChange={(remove) =>
                            form.setData('remove_logo_image', remove)
                        }
                    />
                    <FormField
                        error={form.errors.featured_image_alt}
                        htmlFor="featured_image_alt"
                        label="Texto alternativo"
                    >
                        <Input
                            id="featured_image_alt"
                            value={form.data.featured_image_alt}
                            onChange={(event) =>
                                form.setData(
                                    'featured_image_alt',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                    <FormField
                        error={form.errors.logo_image_alt}
                        htmlFor="logo_image_alt"
                        label="Texto alternativo del logo"
                    >
                        <Input
                            id="logo_image_alt"
                            value={form.data.logo_image_alt}
                            onChange={(event) =>
                                form.setData(
                                    'logo_image_alt',
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
