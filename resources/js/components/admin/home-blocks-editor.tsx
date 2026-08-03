import { Plus, Trash2 } from 'lucide-react';
import { useId } from 'react';

import { FormField } from '@/components/admin/form-field';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { SummernoteField } from '@/components/admin/summernote-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type {
    CmsLink,
    CmsSectionCopy,
    HomeFeature,
    HomePageBlocks,
    HomeStep,
} from '@/types';

type HomeBlocksEditorProps = {
    blocks: HomePageBlocks;
    errors: Record<string, string | undefined>;
    progress: number | null;
    removals: {
        hero: boolean;
        digital: boolean;
        successCases: boolean;
        testimonials: boolean;
    };
    onChange: (blocks: HomePageBlocks) => void;
    onUploadChange: (
        field: 'hero' | 'digital' | 'successCases' | 'testimonials',
        file: File | null,
    ) => void;
    onRemovalChange: (
        field: 'hero' | 'digital' | 'successCases' | 'testimonials',
        remove: boolean,
    ) => void;
};

const iconOptions = [
    ['chart', 'Gráfico'],
    ['file', 'Documento'],
    ['shield', 'Cumplimiento'],
] as const;

function stableId(prefix: string): string {
    return `${prefix}-${crypto.randomUUID()}`;
}

export function HomeBlocksEditor({
    blocks,
    errors,
    progress,
    removals,
    onChange,
    onUploadChange,
    onRemovalChange,
}: HomeBlocksEditorProps) {
    const hero = blocks.hero ?? {};
    const digital = blocks.digital ?? {};
    const digitalFeatures = digital.features ?? digital.benefits ?? [];

    function updateSection<Key extends keyof HomePageBlocks>(
        key: Key,
        value: HomePageBlocks[Key],
    ) {
        onChange({ ...blocks, [key]: value });
    }

    return (
        <div className="grid gap-8">
            <BlockPanel title="Hero">
                <div className="grid gap-4 lg:grid-cols-2">
                    <TextField
                        error={errors['blocks.hero.eyebrow']}
                        label="Antetítulo"
                        value={hero.eyebrow}
                        onChange={(value) =>
                            updateSection('hero', {
                                ...hero,
                                eyebrow: value,
                            })
                        }
                    />
                    <TextField
                        error={errors['blocks.hero.highlightText']}
                        hint="Debe coincidir exactamente con una parte del título."
                        label="Texto acentuado en verde"
                        value={hero.highlightText}
                        onChange={(value) =>
                            updateSection('hero', {
                                ...hero,
                                highlightText: value,
                            })
                        }
                    />
                </div>
                <TextAreaField
                    error={errors['blocks.hero.title']}
                    label="Título visual"
                    value={hero.title}
                    onChange={(value) =>
                        updateSection('hero', { ...hero, title: value })
                    }
                />
                <div className="grid gap-5 lg:grid-cols-2">
                    <LinkFields
                        label="Botón principal"
                        link={hero.primaryCta}
                        errorFor={(field) =>
                            errors[`blocks.hero.primaryCta.${field}`]
                        }
                        onChange={(primaryCta) =>
                            updateSection('hero', { ...hero, primaryCta })
                        }
                    />
                    <LinkFields
                        label="Botón secundario"
                        link={hero.secondaryCta}
                        errorFor={(field) =>
                            errors[`blocks.hero.secondaryCta.${field}`]
                        }
                        onChange={(secondaryCta) =>
                            updateSection('hero', { ...hero, secondaryCta })
                        }
                    />
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                    <ImageUploadField
                        id="hero_image_upload"
                        label="Imagen de fondo del hero"
                        currentImageUrl={hero.image}
                        error={
                            errors.hero_image_upload ?? errors.remove_hero_image
                        }
                        progress={progress}
                        remove={removals.hero}
                        onFileChange={(file) => onUploadChange('hero', file)}
                        onRemoveChange={(remove) =>
                            onRemovalChange('hero', remove)
                        }
                    />
                    <TextField
                        error={errors['blocks.hero.imageAlt']}
                        label="Texto alternativo"
                        value={hero.imageAlt}
                        onChange={(value) =>
                            updateSection('hero', {
                                ...hero,
                                imageAlt: value,
                            })
                        }
                    />
                </div>
            </BlockPanel>

            <BlockPanel
                title="Métricas"
                action={
                    <AddButton
                        label="Añadir métrica"
                        disabled={(blocks.metrics?.length ?? 0) >= 6}
                        onClick={() =>
                            updateSection('metrics', [
                                ...(blocks.metrics ?? []),
                                {
                                    id: stableId('metric'),
                                    value: '',
                                    label: '',
                                },
                            ])
                        }
                    />
                }
            >
                <CollectionGrid
                    empty="No hay métricas configuradas."
                    items={blocks.metrics ?? []}
                    render={(metric, index) => (
                        <CollectionCard
                            key={metric.id}
                            title={`Métrica ${index + 1}`}
                            onRemove={() =>
                                updateSection(
                                    'metrics',
                                    blocks.metrics?.filter(
                                        (_, itemIndex) => itemIndex !== index,
                                    ),
                                )
                            }
                        >
                            <TextField
                                error={errors[`blocks.metrics.${index}.value`]}
                                label="Valor"
                                value={metric.value}
                                onChange={(value) =>
                                    updateSection(
                                        'metrics',
                                        updateItem(
                                            blocks.metrics ?? [],
                                            index,
                                            { ...metric, value },
                                        ),
                                    )
                                }
                            />
                            <TextField
                                error={errors[`blocks.metrics.${index}.label`]}
                                label="Descripción"
                                value={metric.label}
                                onChange={(label) =>
                                    updateSection(
                                        'metrics',
                                        updateItem(
                                            blocks.metrics ?? [],
                                            index,
                                            { ...metric, label },
                                        ),
                                    )
                                }
                            />
                        </CollectionCard>
                    )}
                />
            </BlockPanel>

            <CopyPanel
                title="Servicios destacados"
                copy={blocks.services}
                errors={errors}
                path="services"
                onChange={(services) => updateSection('services', services)}
            >
                <FormField
                    error={errors['blocks.services.limit']}
                    label="Número máximo"
                >
                    <Input
                        min={1}
                        max={12}
                        type="number"
                        value={blocks.services?.limit ?? 8}
                        onChange={(event) =>
                            updateSection('services', {
                                ...blocks.services,
                                limit: Number(event.target.value),
                            })
                        }
                    />
                </FormField>
            </CopyPanel>

            <CopyPanel
                title="Metodología"
                copy={blocks.methodology}
                errors={errors}
                path="methodology"
                onChange={(methodology) =>
                    updateSection('methodology', {
                        ...blocks.methodology,
                        ...methodology,
                    })
                }
            >
                <div className="mb-4 flex justify-end">
                    <AddButton
                        label="Añadir paso"
                        disabled={(blocks.methodology?.steps?.length ?? 0) >= 6}
                        onClick={() =>
                            updateSection('methodology', {
                                ...blocks.methodology,
                                steps: [
                                    ...(blocks.methodology?.steps ?? []),
                                    {
                                        id: stableId('step'),
                                        title: '',
                                        description: '',
                                    },
                                ],
                            })
                        }
                    />
                </div>
                <CollectionGrid
                    empty="No hay pasos configurados."
                    items={blocks.methodology?.steps ?? []}
                    render={(step, index) => (
                        <CollectionCard
                            key={step.id}
                            title={`Paso ${index + 1}`}
                            onRemove={() =>
                                updateSection('methodology', {
                                    ...blocks.methodology,
                                    steps: blocks.methodology?.steps?.filter(
                                        (_, itemIndex) => itemIndex !== index,
                                    ),
                                })
                            }
                        >
                            <TextField
                                error={
                                    errors[
                                        `blocks.methodology.steps.${index}.title`
                                    ]
                                }
                                label="Título"
                                value={step.title}
                                onChange={(title) =>
                                    updateMethodologyStep(index, {
                                        ...step,
                                        title,
                                    })
                                }
                            />
                            <TextAreaField
                                error={
                                    errors[
                                        `blocks.methodology.steps.${index}.description`
                                    ]
                                }
                                label="Descripción"
                                value={step.description}
                                onChange={(description) =>
                                    updateMethodologyStep(index, {
                                        ...step,
                                        description,
                                    })
                                }
                            />
                        </CollectionCard>
                    )}
                />
            </CopyPanel>

            <CopyPanel
                title="Soluciones digitales"
                copy={digital}
                errors={errors}
                path="digital"
                onChange={(copy) =>
                    updateSection('digital', { ...digital, ...copy })
                }
            >
                <div className="grid gap-5 lg:grid-cols-2">
                    <ImageUploadField
                        id="digital_image_upload"
                        label="Imagen de la sección"
                        currentImageUrl={digital.image}
                        error={
                            errors.digital_image_upload ??
                            errors.remove_digital_image
                        }
                        progress={progress}
                        remove={removals.digital}
                        onFileChange={(file) => onUploadChange('digital', file)}
                        onRemoveChange={(remove) =>
                            onRemovalChange('digital', remove)
                        }
                    />
                    <TextField
                        error={errors['blocks.digital.imageAlt']}
                        label="Texto alternativo"
                        value={digital.imageAlt}
                        onChange={(imageAlt) =>
                            updateSection('digital', {
                                ...digital,
                                imageAlt,
                            })
                        }
                    />
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                    <LinkFields
                        label="Botón principal"
                        link={digital.primaryCta ?? digital.cta}
                        errorFor={(field) =>
                            errors[`blocks.digital.primaryCta.${field}`]
                        }
                        onChange={(primaryCta) =>
                            updateSection('digital', {
                                ...digital,
                                features: digitalFeatures,
                                primaryCta,
                                benefits: undefined,
                                cta: undefined,
                            })
                        }
                    />
                    <LinkFields
                        label="Botón secundario"
                        link={digital.secondaryCta}
                        errorFor={(field) =>
                            errors[`blocks.digital.secondaryCta.${field}`]
                        }
                        onChange={(secondaryCta) =>
                            updateSection('digital', {
                                ...digital,
                                features: digitalFeatures,
                                secondaryCta,
                                benefits: undefined,
                                cta: undefined,
                            })
                        }
                    />
                </div>
                <div className="flex justify-end">
                    <AddButton
                        label="Añadir característica"
                        disabled={digitalFeatures.length >= 8}
                        onClick={() =>
                            writeDigitalFeatures([
                                ...digitalFeatures,
                                {
                                    id: stableId('feature'),
                                    icon: 'shield',
                                    title: '',
                                    description: '',
                                },
                            ])
                        }
                    />
                </div>
                <CollectionGrid
                    empty="No hay características configuradas."
                    items={digitalFeatures}
                    render={(feature, index) => (
                        <CollectionCard
                            key={feature.id}
                            title={`Característica ${index + 1}`}
                            onRemove={() =>
                                writeDigitalFeatures(
                                    digitalFeatures.filter(
                                        (_, itemIndex) => itemIndex !== index,
                                    ),
                                )
                            }
                        >
                            <FormField
                                error={
                                    errors[
                                        `blocks.digital.features.${index}.icon`
                                    ]
                                }
                                label="Icono"
                            >
                                <select
                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                    value={feature.icon ?? ''}
                                    onChange={(event) =>
                                        updateDigitalFeature(index, {
                                            ...feature,
                                            icon: event.target.value,
                                        })
                                    }
                                >
                                    {iconOptions.map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                            <TextField
                                error={
                                    errors[
                                        `blocks.digital.features.${index}.title`
                                    ]
                                }
                                label="Subtítulo"
                                value={feature.title}
                                onChange={(title) =>
                                    updateDigitalFeature(index, {
                                        ...feature,
                                        title,
                                    })
                                }
                            />
                            <TextAreaField
                                error={
                                    errors[
                                        `blocks.digital.features.${index}.description`
                                    ]
                                }
                                label="Descripción"
                                value={feature.description}
                                onChange={(description) =>
                                    updateDigitalFeature(index, {
                                        ...feature,
                                        description,
                                    })
                                }
                            />
                        </CollectionCard>
                    )}
                />
            </CopyPanel>

            <CopyPanel
                title="Casos de éxito"
                copy={blocks.successCases}
                errors={errors}
                path="successCases"
                onChange={(successCases) =>
                    updateSection('successCases', successCases)
                }
            >
                <ImageUploadField
                    id="success_cases_background_image_upload"
                    label="Imagen de fondo"
                    currentImageUrl={blocks.successCases?.backgroundImage}
                    error={
                        errors.success_cases_background_image_upload ??
                        errors.remove_success_cases_background_image
                    }
                    progress={progress}
                    remove={removals.successCases}
                    onFileChange={(file) => onUploadChange('successCases', file)}
                    onRemoveChange={(remove) =>
                        onRemovalChange('successCases', remove)
                    }
                />
            </CopyPanel>

            <CopyPanel
                title="Lo que nuestros clientes dicen"
                copy={blocks.testimonials}
                errors={errors}
                path="testimonials"
                onChange={(testimonials) =>
                    updateSection('testimonials', {
                        ...blocks.testimonials,
                        ...testimonials,
                    })
                }
            >
                <ImageUploadField
                    id="testimonials_background_image_upload"
                    label="Imagen de fondo"
                    currentImageUrl={blocks.testimonials?.backgroundImage}
                    error={
                        errors.testimonials_background_image_upload ??
                        errors.remove_testimonials_background_image
                    }
                    progress={progress}
                    remove={removals.testimonials}
                    onFileChange={(file) =>
                        onUploadChange('testimonials', file)
                    }
                    onRemoveChange={(remove) =>
                        onRemovalChange('testimonials', remove)
                    }
                />
                <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                    <Checkbox
                        checked={blocks.testimonials?.autoplay ?? false}
                        onCheckedChange={(checked) =>
                            updateSection('testimonials', {
                                ...blocks.testimonials,
                                autoplay: checked === true,
                            })
                        }
                    />
                    Activar reproducción automática accesible
                </label>
            </CopyPanel>

            <CopyPanel
                title="Noticias"
                copy={blocks.posts}
                errors={errors}
                path="posts"
                onChange={(posts) => updateSection('posts', posts)}
            />

            <CopyPanel
                title="CTA final"
                copy={blocks.finalCta}
                errors={errors}
                path="finalCta"
                onChange={(finalCta) =>
                    updateSection('finalCta', {
                        ...blocks.finalCta,
                        ...finalCta,
                    })
                }
            >
                <div className="grid gap-5 lg:grid-cols-2">
                    <LinkFields
                        label="Botón principal"
                        link={blocks.finalCta?.primaryCta}
                        errorFor={(field) =>
                            errors[`blocks.finalCta.primaryCta.${field}`]
                        }
                        onChange={(primaryCta) =>
                            updateSection('finalCta', {
                                ...blocks.finalCta,
                                primaryCta,
                            })
                        }
                    />
                    <LinkFields
                        label="Botón secundario"
                        link={blocks.finalCta?.secondaryCta}
                        errorFor={(field) =>
                            errors[`blocks.finalCta.secondaryCta.${field}`]
                        }
                        onChange={(secondaryCta) =>
                            updateSection('finalCta', {
                                ...blocks.finalCta,
                                secondaryCta,
                            })
                        }
                    />
                </div>
            </CopyPanel>
        </div>
    );

    function updateMethodologyStep(index: number, step: HomeStep) {
        updateSection('methodology', {
            ...blocks.methodology,
            steps: updateItem(blocks.methodology?.steps ?? [], index, step),
        });
    }

    function writeDigitalFeatures(features: HomeFeature[]) {
        updateSection('digital', {
            ...digital,
            features,
            benefits: undefined,
            cta: undefined,
        });
    }

    function updateDigitalFeature(index: number, feature: HomeFeature) {
        writeDigitalFeatures(updateItem(digitalFeatures, index, feature));
    }
}

function CopyPanel({
    children,
    copy,
    errors,
    onChange,
    path,
    title,
}: {
    children?: React.ReactNode;
    copy?: CmsSectionCopy;
    errors: Record<string, string | undefined>;
    onChange: (copy: CmsSectionCopy) => void;
    path: string;
    title: string;
}) {
    return (
        <BlockPanel title={title}>
            <div className="grid gap-4 lg:grid-cols-2">
                <TextField
                    error={errors[`blocks.${path}.eyebrow`]}
                    label="Antetítulo"
                    value={copy?.eyebrow}
                    onChange={(eyebrow) => onChange({ ...copy, eyebrow })}
                />
                <TextField
                    error={errors[`blocks.${path}.title`]}
                    label="Título"
                    value={copy?.title}
                    onChange={(value) => onChange({ ...copy, title: value })}
                />
            </div>
            <TextAreaField
                error={errors[`blocks.${path}.description`]}
                label="Párrafo"
                value={copy?.description}
                onChange={(description) => onChange({ ...copy, description })}
            />
            {children}
        </BlockPanel>
    );
}

function BlockPanel({
    action,
    children,
    title,
}: {
    action?: React.ReactNode;
    children: React.ReactNode;
    title: string;
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <h3 className="font-semibold text-slate-950">{title}</h3>
                {action}
            </div>
            <div className="grid gap-5">{children}</div>
        </section>
    );
}

function LinkFields({
    errorFor,
    label,
    link,
    onChange,
}: {
    errorFor: (field: 'label' | 'href') => string | undefined;
    label: string;
    link?: CmsLink | null;
    onChange: (link: CmsLink) => void;
}) {
    return (
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">{label}</p>
            <TextField
                error={errorFor('label')}
                label="Texto"
                value={link?.label}
                onChange={(value) =>
                    onChange({ label: value, href: link?.href ?? '' })
                }
            />
            <TextField
                error={errorFor('href')}
                hint="Ruta interna o URL http, https, mailto o tel."
                label="URL"
                value={link?.href}
                onChange={(href) =>
                    onChange({ label: link?.label ?? '', href })
                }
            />
        </div>
    );
}

function TextField({
    error,
    hint,
    label,
    onChange,
    value,
}: {
    error?: string;
    hint?: string;
    label: string;
    onChange: (value: string) => void;
    value?: string | null;
}) {
    return (
        <FormField error={error} hint={hint} label={label}>
            <Input
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value)}
            />
        </FormField>
    );
}

function TextAreaField({
    error,
    label,
    onChange,
    value,
}: {
    error?: string;
    label: string;
    onChange: (value: string) => void;
    value?: string | null;
}) {
    const id = useId();

    return (
        <SummernoteField
            id={id}
            label={label}
            error={error}
            value={value ?? ''}
            onChange={onChange}
        />
    );
}

function AddButton({
    disabled,
    label,
    onClick,
}: {
    disabled?: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <Button
            disabled={disabled}
            size="sm"
            type="button"
            variant="outline"
            onClick={onClick}
        >
            <Plus className="size-4" />
            {label}
        </Button>
    );
}

function CollectionCard({
    children,
    onRemove,
    title,
}: {
    children: React.ReactNode;
    onRemove: () => void;
    title: string;
}) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <Button
                    aria-label={`Eliminar ${title}`}
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={onRemove}
                >
                    <Trash2 className="size-4 text-red-600" />
                </Button>
            </div>
            <div className="grid gap-4">{children}</div>
        </div>
    );
}

function CollectionGrid<Item>({
    empty,
    items,
    render,
}: {
    empty: string;
    items: Item[];
    render: (item: Item, index: number) => React.ReactNode;
}) {
    if (items.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                {empty}
            </p>
        );
    }

    return <div className="grid gap-4 lg:grid-cols-2">{items.map(render)}</div>;
}

function updateItem<Item>(items: Item[], index: number, item: Item): Item[] {
    return items.map((current, itemIndex) =>
        itemIndex === index ? item : current,
    );
}
