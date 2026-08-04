import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import { AdminFormSection } from '@/components/admin/admin-form-section';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { FormField } from '@/components/admin/form-field';
import { SummernoteField } from '@/components/admin/summernote-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as siteSettingsRoutes from '@/routes/admin/site-settings';
import type { SiteSettings } from '@/types';

type EditableLink = {
    id: string;
    label: string;
    href: string;
};

type EditableCta = {
    label: string;
    href: string;
};

type FooterGroup = {
    id: string;
    title: string;
    links: EditableLink[];
};

type EditableHero = {
    eyebrow: string;
    title: string;
    highlightText: string;
    primaryCta: EditableCta;
    secondaryCta: EditableCta;
};

type SiteSettingsPayload = {
    brand_description: string;
    hero: EditableHero;
    navigation: EditableLink[];
    header_cta: EditableCta | null;
    contact: {
        email: string;
        phone: string;
        address: string;
        legal_name: string;
        street_address: string;
        postal_code: string;
        locality: string;
        region: string;
        country: string;
        latitude: string;
        longitude: string;
    };
    social_links: EditableLink[];
    footer_groups: FooterGroup[];
};

export default function EditSiteSettings({
    homeHero,
    siteSettings,
}: {
    homeHero: EditableHero;
    siteSettings: SiteSettings;
}) {
    const form = useForm<SiteSettingsPayload>({
        brand_description: siteSettings.brandDescription ?? '',
        hero: {
            eyebrow: homeHero.eyebrow ?? '',
            title: homeHero.title ?? '',
            highlightText: homeHero.highlightText ?? '',
            primaryCta: {
                label: homeHero.primaryCta?.label ?? '',
                href: homeHero.primaryCta?.href ?? '',
            },
            secondaryCta: {
                label: homeHero.secondaryCta?.label ?? '',
                href: homeHero.secondaryCta?.href ?? '',
            },
        },
        navigation: siteSettings.navigation.map(normalizeLink),
        header_cta: siteSettings.headerCta
            ? normalizeCta(siteSettings.headerCta)
            : null,
        contact: {
            email: siteSettings.contact?.email ?? '',
            phone: siteSettings.contact?.phone ?? '',
            address: siteSettings.contact?.address ?? '',
            legal_name: siteSettings.contact?.legal_name ?? '',
            street_address: siteSettings.contact?.street_address ?? '',
            postal_code: siteSettings.contact?.postal_code ?? '',
            locality: siteSettings.contact?.locality ?? '',
            region: siteSettings.contact?.region ?? '',
            country: siteSettings.contact?.country ?? 'ES',
            latitude: siteSettings.contact?.latitude ?? '',
            longitude: siteSettings.contact?.longitude ?? '',
        },
        social_links: siteSettings.socialLinks.map(normalizeLink),
        footer_groups: siteSettings.footerGroups.map((group, index) => ({
            id: group.id ?? `footer-${index + 1}`,
            title: group.title,
            links: group.links.map(normalizeLink),
        })),
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.patch(siteSettingsRoutes.update().url, {
            preserveScroll: true,
        });
    }

    function error(path: string) {
        return (form.errors as Record<string, string | undefined>)[path];
    }

    return (
        <>
            <Head title="Ajustes del sitio" />

            <form className="grid gap-8" onSubmit={submit}>
                <AdminPageHeader
                    title="Ajustes del sitio"
                    description="Navegación, contacto y pie global de la web pública."
                />

                <AdminFormSection
                    title="Marca y contacto"
                    description="Solo se mostrará la información que tenga contenido."
                >
                    <SummernoteField
                        id="brand_description"
                        label="Descripción corporativa"
                        error={form.errors.brand_description}
                        value={form.data.brand_description}
                        onChange={(value) =>
                            form.setData('brand_description', value)
                        }
                    />
                    <div className="grid gap-5 lg:grid-cols-2">
                        <FormField error={error('contact.email')} label="Email">
                            <Input
                                type="email"
                                value={form.data.contact.email}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        email: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                        <FormField
                            error={error('contact.phone')}
                            label="Teléfono"
                        >
                            <Input
                                value={form.data.contact.phone}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        phone: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                    </div>
                    <FormField
                        error={error('contact.address')}
                        label="Dirección"
                    >
                        <Input
                            value={form.data.contact.address}
                            onChange={(event) =>
                                form.setData('contact', {
                                    ...form.data.contact,
                                    address: event.target.value,
                                })
                            }
                        />
                    </FormField>
                    <div className="grid gap-5 border-t border-slate-200 pt-5 lg:grid-cols-2">
                        <FormField
                            error={error('contact.legal_name')}
                            label="Razón social"
                        >
                            <Input
                                value={form.data.contact.legal_name}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        legal_name: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                        <FormField
                            error={error('contact.street_address')}
                            label="Calle y número"
                        >
                            <Input
                                value={form.data.contact.street_address}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        street_address: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                        <FormField
                            error={error('contact.postal_code')}
                            label="Código postal"
                        >
                            <Input
                                value={form.data.contact.postal_code}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        postal_code: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                        <FormField
                            error={error('contact.locality')}
                            label="Localidad"
                        >
                            <Input
                                value={form.data.contact.locality}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        locality: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                        <FormField
                            error={error('contact.region')}
                            label="Comunidad / región"
                        >
                            <Input
                                value={form.data.contact.region}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        region: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                        <FormField
                            error={error('contact.country')}
                            hint="Código ISO de dos letras, por ejemplo ES."
                            label="País"
                        >
                            <Input
                                maxLength={2}
                                value={form.data.contact.country}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        country:
                                            event.target.value.toUpperCase(),
                                    })
                                }
                            />
                        </FormField>
                        <FormField
                            error={error('contact.latitude')}
                            label="Latitud"
                        >
                            <Input
                                inputMode="decimal"
                                value={form.data.contact.latitude}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        latitude: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                        <FormField
                            error={error('contact.longitude')}
                            label="Longitud"
                        >
                            <Input
                                inputMode="decimal"
                                value={form.data.contact.longitude}
                                onChange={(event) =>
                                    form.setData('contact', {
                                        ...form.data.contact,
                                        longitude: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                    </div>
                </AdminFormSection>

                <AdminFormSection
                    title="Hero de portada"
                    description="Contenido principal que se muestra en la cabecera de la home."
                >
                    <div className="grid gap-5 lg:grid-cols-2">
                        <FormField
                            error={error('hero.eyebrow')}
                            label="Antetítulo"
                        >
                            <Input
                                value={form.data.hero.eyebrow}
                                onChange={(event) =>
                                    form.setData('hero', {
                                        ...form.data.hero,
                                        eyebrow: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                        <FormField
                            error={error('hero.highlightText')}
                            label="Texto destacado"
                        >
                            <Input
                                value={form.data.hero.highlightText}
                                onChange={(event) =>
                                    form.setData('hero', {
                                        ...form.data.hero,
                                        highlightText: event.target.value,
                                    })
                                }
                            />
                        </FormField>
                    </div>

                    <SummernoteField
                        id="hero_title"
                        label="Título principal"
                        error={error('hero.title')}
                        value={form.data.hero.title}
                        onChange={(value) =>
                            form.setData('hero', {
                                ...form.data.hero,
                                title: value,
                            })
                        }
                    />

                    <div className="grid gap-4 rounded-xl border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-800">
                            Botón principal
                        </p>
                        <div className="grid gap-4 lg:grid-cols-2">
                            <FormField
                                error={error('hero.primaryCta.label')}
                                label="Texto"
                            >
                                <Input
                                    value={form.data.hero.primaryCta.label}
                                    onChange={(event) =>
                                        form.setData('hero', {
                                            ...form.data.hero,
                                            primaryCta: {
                                                ...form.data.hero.primaryCta,
                                                label: event.target.value,
                                            },
                                        })
                                    }
                                />
                            </FormField>
                            <FormField
                                error={error('hero.primaryCta.href')}
                                label="URL"
                            >
                                <Input
                                    value={form.data.hero.primaryCta.href}
                                    onChange={(event) =>
                                        form.setData('hero', {
                                            ...form.data.hero,
                                            primaryCta: {
                                                ...form.data.hero.primaryCta,
                                                href: event.target.value,
                                            },
                                        })
                                    }
                                />
                            </FormField>
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-xl border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-800">
                            Botón secundario
                        </p>
                        <div className="grid gap-4 lg:grid-cols-2">
                            <FormField
                                error={error('hero.secondaryCta.label')}
                                label="Texto"
                            >
                                <Input
                                    value={form.data.hero.secondaryCta.label}
                                    onChange={(event) =>
                                        form.setData('hero', {
                                            ...form.data.hero,
                                            secondaryCta: {
                                                ...form.data.hero.secondaryCta,
                                                label: event.target.value,
                                            },
                                        })
                                    }
                                />
                            </FormField>
                            <FormField
                                error={error('hero.secondaryCta.href')}
                                label="URL"
                            >
                                <Input
                                    value={form.data.hero.secondaryCta.href}
                                    onChange={(event) =>
                                        form.setData('hero', {
                                            ...form.data.hero,
                                            secondaryCta: {
                                                ...form.data.hero.secondaryCta,
                                                href: event.target.value,
                                            },
                                        })
                                    }
                                />
                            </FormField>
                        </div>
                    </div>
                </AdminFormSection>

                <LinkCollection
                    error={error}
                    links={form.data.navigation}
                    onChange={(navigation) =>
                        form.setData('navigation', navigation)
                    }
                    path="navigation"
                    title="Navegación principal"
                />

                <AdminFormSection
                    title="CTA del header"
                    description="Déjalo desactivado para ocultar el botón."
                >
                    {form.data.header_cta ? (
                        <LinkRow
                            errors={error}
                            index={0}
                            link={form.data.header_cta}
                            path="header_cta"
                            onChange={(headerCta) =>
                                form.setData('header_cta', headerCta)
                            }
                            onRemove={() => form.setData('header_cta', null)}
                        />
                    ) : (
                        <Button
                            className="w-fit"
                            onClick={() =>
                                form.setData('header_cta', blankCta())
                            }
                            type="button"
                            variant="outline"
                        >
                            <Plus className="size-4" />
                            Activar CTA
                        </Button>
                    )}
                </AdminFormSection>

                <LinkCollection
                    error={error}
                    links={form.data.social_links}
                    onChange={(socialLinks) =>
                        form.setData('social_links', socialLinks)
                    }
                    path="social_links"
                    title="Redes sociales"
                />

                <AdminFormSection
                    title="Grupos del footer"
                    description="Cada grupo contiene un título y sus enlaces."
                >
                    {form.data.footer_groups.map((group, groupIndex) => (
                        <div
                            className="rounded-xl border border-slate-200 p-4"
                            key={group.id}
                        >
                            <div className="flex gap-3">
                                <Input
                                    aria-label="Título del grupo"
                                    value={group.title}
                                    onChange={(event) => {
                                        const groups = [
                                            ...form.data.footer_groups,
                                        ];
                                        groups[groupIndex] = {
                                            ...group,
                                            title: event.target.value,
                                        };
                                        form.setData('footer_groups', groups);
                                    }}
                                />
                                <Button
                                    aria-label="Eliminar grupo"
                                    onClick={() =>
                                        form.setData(
                                            'footer_groups',
                                            form.data.footer_groups.filter(
                                                (_, index) =>
                                                    index !== groupIndex,
                                            ),
                                        )
                                    }
                                    size="icon"
                                    type="button"
                                    variant="outline"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                            <div className="mt-4 grid gap-3">
                                {group.links.map((link, linkIndex) => (
                                    <LinkRow
                                        errors={error}
                                        index={linkIndex}
                                        key={link.id}
                                        link={link}
                                        path={`footer_groups.${groupIndex}.links`}
                                        onChange={(nextLink) => {
                                            const links = [...group.links];
                                            links[linkIndex] = nextLink;
                                            const groups = [
                                                ...form.data.footer_groups,
                                            ];
                                            groups[groupIndex] = {
                                                ...group,
                                                links,
                                            };
                                            form.setData(
                                                'footer_groups',
                                                groups,
                                            );
                                        }}
                                        onRemove={() => {
                                            const groups = [
                                                ...form.data.footer_groups,
                                            ];
                                            groups[groupIndex] = {
                                                ...group,
                                                links: group.links.filter(
                                                    (_, index) =>
                                                        index !== linkIndex,
                                                ),
                                            };
                                            form.setData(
                                                'footer_groups',
                                                groups,
                                            );
                                        }}
                                    />
                                ))}
                                <Button
                                    className="w-fit"
                                    onClick={() => {
                                        const groups = [
                                            ...form.data.footer_groups,
                                        ];
                                        groups[groupIndex] = {
                                            ...group,
                                            links: [
                                                ...group.links,
                                                blankLink(
                                                    `${group.id}-${group.links.length + 1}`,
                                                ),
                                            ],
                                        };
                                        form.setData('footer_groups', groups);
                                    }}
                                    type="button"
                                    variant="outline"
                                >
                                    <Plus className="size-4" />
                                    Añadir enlace
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button
                        className="w-fit"
                        onClick={() =>
                            form.setData('footer_groups', [
                                ...form.data.footer_groups,
                                {
                                    id: `group-${Date.now()}`,
                                    title: '',
                                    links: [],
                                },
                            ])
                        }
                        type="button"
                        variant="outline"
                    >
                        <Plus className="size-4" />
                        Añadir grupo
                    </Button>
                </AdminFormSection>

                <div className="flex justify-end">
                    <Button disabled={form.processing} type="submit">
                        Guardar ajustes
                    </Button>
                </div>
            </form>
        </>
    );
}

function LinkCollection({
    error,
    links,
    onChange,
    path,
    title,
}: {
    error: (path: string) => string | undefined;
    links: EditableLink[];
    onChange: (links: EditableLink[]) => void;
    path: string;
    title: string;
}) {
    return (
        <AdminFormSection title={title}>
            {links.map((link, index) => (
                <LinkRow
                    errors={error}
                    index={index}
                    key={link.id}
                    link={link}
                    path={path}
                    onChange={(nextLink) => {
                        const nextLinks = [...links];
                        nextLinks[index] = nextLink;
                        onChange(nextLinks);
                    }}
                    onRemove={() =>
                        onChange(
                            links.filter((_, itemIndex) => itemIndex !== index),
                        )
                    }
                />
            ))}
            <Button
                className="w-fit"
                onClick={() =>
                    onChange([
                        ...links,
                        blankLink(`${path}-${links.length + 1}-${Date.now()}`),
                    ])
                }
                type="button"
                variant="outline"
            >
                <Plus className="size-4" />
                Añadir enlace
            </Button>
        </AdminFormSection>
    );
}

function LinkRow<TLink extends EditableLink | EditableCta>({
    errors,
    index,
    link,
    onChange,
    onRemove,
    path,
}: {
    errors: (path: string) => string | undefined;
    index: number;
    link: TLink;
    onChange: (link: TLink) => void;
    onRemove: () => void;
    path: string;
}) {
    const fieldPath = path === 'header_cta' ? path : `${path}.${index}`;

    return (
        <div className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[.7fr_1.3fr_auto]">
            <FormField error={errors(`${fieldPath}.label`)} label="Etiqueta">
                <Input
                    value={link.label}
                    onChange={(event) =>
                        onChange({
                            ...link,
                            label: event.target.value,
                        } as TLink)
                    }
                />
            </FormField>
            <FormField
                error={errors(`${fieldPath}.href`)}
                hint="Ruta interna o http, https, mailto o tel."
                label="URL"
            >
                <Input
                    value={link.href}
                    onChange={(event) =>
                        onChange({ ...link, href: event.target.value } as TLink)
                    }
                />
            </FormField>
            <Button
                aria-label="Eliminar enlace"
                className="self-end"
                onClick={onRemove}
                size="icon"
                type="button"
                variant="outline"
            >
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}

function blankLink(id: string): EditableLink {
    return { id, label: '', href: '' };
}

function blankCta(): EditableCta {
    return { label: '', href: '' };
}

function normalizeLink(link: {
    id?: string;
    label: string;
    href: string;
}): EditableLink {
    return {
        id: link.id ?? `link-${Date.now()}-${link.label}`,
        label: link.label,
        href: link.href,
    };
}

function normalizeCta(link: { label: string; href: string }): EditableCta {
    return {
        label: link.label,
        href: link.href,
    };
}
