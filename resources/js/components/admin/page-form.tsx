import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import type { ReactNode } from 'react';
import { AdminFormSection } from '@/components/admin/admin-form-section';
import { FormField } from '@/components/admin/form-field';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { SeoCounter } from '@/components/admin/seo-counter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as pages from '@/routes/admin/pages';
import type { PageBlocks, TeamMember } from '@/types';

const TEAM_COVER_PLACEHOLDER =
    'https://placehold.co/1440x760/163247/FFFFFF?text=Equipo+PODARCIS';

const TEAM_AVATAR_PLACEHOLDER =
    'https://placehold.co/720x1000/163247/FFFFFF?text=PODARCIS';

const DEFAULT_TEAM_MEMBER: TeamMember = {
    name: '',
    title: '',
    handle: '',
    status: 'Disponible',
    contactText: 'Contactar',
    avatarUrl: TEAM_AVATAR_PLACEHOLDER,
};

export type AdminPageFormData = {
    id: number | null;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
    ogImage: string;
    blocks: PageBlocks | null;
    status: 'draft' | 'published';
    publishedAt: string;
    previewUrl: string | null;
};

type AdminPageFormPayload = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    blocks: PageBlocks | null;
    og_image_upload: File | null;
    remove_og_image: boolean;
    team_cover_image_upload: File | null;
    remove_team_cover_image: boolean;
    team_member_avatar_uploads: (File | null)[];
    remove_team_member_avatars: boolean[];
    seo_title: string;
    seo_description: string;
    og_image: string;
    status: 'draft' | 'published';
    published_at: string;
};

type PageFormProps = {
    page: AdminPageFormData;
    mode: 'create' | 'edit';
};

export function PageForm({ page, mode }: PageFormProps) {
    const form = useForm<AdminPageFormPayload>({
        title: page.title,
        slug: page.slug,
        excerpt: page.excerpt ?? '',
        content: page.content ?? '',
        blocks: page.blocks ?? null,
        og_image_upload: null,
        remove_og_image: false,
        team_cover_image_upload: null,
        remove_team_cover_image: false,
        team_member_avatar_uploads:
            page.blocks?.teamMembers?.map(() => null) ?? [],
        remove_team_member_avatars:
            page.blocks?.teamMembers?.map(() => false) ?? [],
        seo_title: page.seoTitle ?? '',
        seo_description: page.seoDescription ?? '',
        og_image: page.ogImage ?? '',
        status: page.status,
        published_at: page.publishedAt ?? '',
    });
    const isAboutPage = form.data.slug === 'quienes-somos';
    const blocks = form.data.blocks ?? { teamCoverImage: '', teamMembers: [] };
    const teamMembers = blocks.teamMembers ?? [];

    function updateBlocks(nextBlocks: PageBlocks) {
        form.setData('blocks', {
            teamCoverImage: nextBlocks.teamCoverImage ?? '',
            teamMembers: nextBlocks.teamMembers ?? [],
        });
    }

    function updateTeamCoverImage(teamCoverImage: string) {
        updateBlocks({ ...blocks, teamCoverImage });
    }

    function addTeamMember() {
        updateBlocks({
            ...blocks,
            teamMembers: [...teamMembers, { ...DEFAULT_TEAM_MEMBER }],
        });
        form.setData('team_member_avatar_uploads', [
            ...form.data.team_member_avatar_uploads,
            null,
        ]);
        form.setData('remove_team_member_avatars', [
            ...form.data.remove_team_member_avatars,
            false,
        ]);
    }

    function removeTeamMember(index: number) {
        updateBlocks({
            ...blocks,
            teamMembers: teamMembers.filter(
                (_, memberIndex) => memberIndex !== index,
            ),
        });
        form.setData(
            'team_member_avatar_uploads',
            form.data.team_member_avatar_uploads.filter(
                (_, avatarIndex) => avatarIndex !== index,
            ),
        );
        form.setData(
            'remove_team_member_avatars',
            form.data.remove_team_member_avatars.filter(
                (_, avatarIndex) => avatarIndex !== index,
            ),
        );
    }

    function updateTeamMember<K extends keyof TeamMember>(
        index: number,
        key: K,
        value: TeamMember[K],
    ) {
        updateBlocks({
            ...blocks,
            teamMembers: teamMembers.map((member, memberIndex) =>
                memberIndex === index ? { ...member, [key]: value } : member,
            ),
        });
    }

    function teamError(path: string): string | undefined {
        return (form.errors as Record<string, string | undefined>)[path];
    }

    function updateTeamMemberAvatarUpload(index: number, file: File | null) {
        form.setData(
            'team_member_avatar_uploads',
            form.data.team_member_avatar_uploads.map(
                (avatarFile, avatarIndex) =>
                    avatarIndex === index ? file : avatarFile,
            ),
        );
    }

    function updateRemoveTeamMemberAvatar(index: number, remove: boolean) {
        form.setData(
            'remove_team_member_avatars',
            form.data.remove_team_member_avatars.map(
                (removeAvatar, avatarIndex) =>
                    avatarIndex === index ? remove : removeAvatar,
            ),
        );
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post(pages.store().url, { forceFormData: true });

            return;
        }

        if (page.id === null) {
            return;
        }

        form.transform((data) => ({ ...data, _method: 'patch' }));
        form.post(pages.update({ page: page.id }).url, {
            forceFormData: true,
        });
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

            {isAboutPage && (
                <AdminFormSection
                    title="Equipo"
                    description="Configura la portada y las cards públicas de trabajadores para la página Quiénes somos."
                >
                    <ImageUploadField
                        id="team_cover_image_upload"
                        label="Imagen de portada del equipo"
                        currentImageUrl={blocks.teamCoverImage}
                        error={
                            form.errors.team_cover_image_upload ??
                            form.errors.remove_team_cover_image ??
                            teamError('blocks.teamCoverImage')
                        }
                        progress={form.progress?.percentage ?? null}
                        remove={form.data.remove_team_cover_image}
                        onFileChange={(file) => {
                            form.setData('team_cover_image_upload', file);

                            if (file) {
                                updateTeamCoverImage(TEAM_COVER_PLACEHOLDER);
                            }
                        }}
                        onRemoveChange={(remove) =>
                            form.setData('remove_team_cover_image', remove)
                        }
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-950">
                                Trabajadores
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                El orden de estas cards será el orden público.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addTeamMember}
                        >
                            Añadir trabajador
                        </Button>
                    </div>

                    {teamMembers.length === 0 && (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                            Todavía no hay trabajadores configurados.
                        </div>
                    )}

                    <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                        {teamMembers.map((member, index) => (
                            <div
                                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                                key={index}
                            >
                                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h4 className="font-semibold text-slate-950">
                                            {member.name ||
                                                `Trabajador ${index + 1}`}
                                        </h4>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Card corporativa del equipo
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeTeamMember(index)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>

                                <div className="mt-5 grid gap-4">
                                    <TeamField
                                        error={teamError(
                                            `blocks.teamMembers.${index}.name`,
                                        )}
                                        label="Nombre"
                                    >
                                        <Input
                                            value={member.name}
                                            onChange={(event) =>
                                                updateTeamMember(
                                                    index,
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </TeamField>
                                    <TeamField
                                        error={teamError(
                                            `blocks.teamMembers.${index}.title`,
                                        )}
                                        label="Cargo"
                                    >
                                        <Input
                                            value={member.title ?? ''}
                                            onChange={(event) =>
                                                updateTeamMember(
                                                    index,
                                                    'title',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </TeamField>
                                    <TeamField
                                        error={teamError(
                                            `blocks.teamMembers.${index}.handle`,
                                        )}
                                        label="Handle"
                                    >
                                        <Input
                                            value={member.handle ?? ''}
                                            onChange={(event) =>
                                                updateTeamMember(
                                                    index,
                                                    'handle',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </TeamField>
                                    <TeamField
                                        error={teamError(
                                            `blocks.teamMembers.${index}.status`,
                                        )}
                                        label="Estado"
                                    >
                                        <Input
                                            value={member.status ?? ''}
                                            onChange={(event) =>
                                                updateTeamMember(
                                                    index,
                                                    'status',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </TeamField>
                                    <TeamField
                                        error={teamError(
                                            `blocks.teamMembers.${index}.contactText`,
                                        )}
                                        label="Texto botón contacto"
                                    >
                                        <Input
                                            value={member.contactText ?? ''}
                                            onChange={(event) =>
                                                updateTeamMember(
                                                    index,
                                                    'contactText',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </TeamField>
                                    <div>
                                        <ImageUploadField
                                            id={`team_member_${index}_avatar_upload`}
                                            label="Avatar"
                                            currentImageUrl={member.avatarUrl}
                                            error={
                                                teamError(
                                                    `team_member_avatar_uploads.${index}`,
                                                ) ??
                                                teamError(
                                                    `blocks.teamMembers.${index}.avatarUrl`,
                                                )
                                            }
                                            help="JPG, PNG o WebP. Los PNG se conservarán para mantener transparencias."
                                            progress={
                                                form.progress?.percentage ??
                                                null
                                            }
                                            remove={
                                                form.data
                                                    .remove_team_member_avatars[
                                                    index
                                                ] ?? false
                                            }
                                            onFileChange={(file) =>
                                                updateTeamMemberAvatarUpload(
                                                    index,
                                                    file,
                                                )
                                            }
                                            onRemoveChange={(remove) =>
                                                updateRemoveTeamMemberAvatar(
                                                    index,
                                                    remove,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AdminFormSection>
            )}

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
                <ImageUploadField
                    id="og_image_upload"
                    label="OG image"
                    currentImageUrl={page.ogImage}
                    error={form.errors.og_image_upload ?? form.errors.og_image}
                    progress={form.progress?.percentage ?? null}
                    remove={form.data.remove_og_image}
                    onFileChange={(file) =>
                        form.setData('og_image_upload', file)
                    }
                    onRemoveChange={(remove) =>
                        form.setData('remove_og_image', remove)
                    }
                />
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

type TeamFieldProps = {
    children: ReactNode;
    error?: string;
    label: string;
};

function TeamField({ children, error, label }: TeamFieldProps) {
    return (
        <div>
            <p className="text-sm font-medium text-slate-700">{label}</p>
            <div className="mt-2">{children}</div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}
