import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { AdminFormSection } from '@/components/admin/admin-form-section';
import { FormField } from '@/components/admin/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as successCases from '@/routes/admin/success-cases';

export type AdminSuccessCaseService = {
    id: number;
    title: string;
};

export type AdminSuccessCaseFormData = {
    id: number | null;
    title: string;
    slug: string;
    clientName: string;
    sector: string;
    challenge: string;
    solution: string;
    result: string;
    featuredImage: string;
    serviceId: number | string | null;
    status: 'draft' | 'published';
    publishedAt: string;
    previewUrl: string | null;
};

type SuccessCaseFormProps = {
    successCase: AdminSuccessCaseFormData;
    services: AdminSuccessCaseService[];
    mode: 'create' | 'edit';
};

export function SuccessCaseForm({
    successCase,
    services,
    mode,
}: SuccessCaseFormProps) {
    const form = useForm({
        title: successCase.title,
        slug: successCase.slug,
        client_name: successCase.clientName ?? '',
        sector: successCase.sector ?? '',
        challenge: successCase.challenge ?? '',
        solution: successCase.solution ?? '',
        result: successCase.result ?? '',
        featured_image: successCase.featuredImage ?? '',
        service_id: successCase.serviceId ? String(successCase.serviceId) : '',
        status: successCase.status,
        published_at: successCase.publishedAt ?? '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post(successCases.store().url);

            return;
        }

        form.patch(successCases.update({ success_case: successCase.slug }).url);
    }

    return (
        <form className="grid gap-6" onSubmit={submit}>
            <AdminFormSection
                title="Contenido del caso"
                description="Define el relato público: contexto, reto, solución y resultado."
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

                <div className="grid gap-5 lg:grid-cols-2">
                    <FormField
                        error={form.errors.client_name}
                        htmlFor="client_name"
                        label="Cliente"
                    >
                        <Input
                            id="client_name"
                            value={form.data.client_name}
                            onChange={(event) =>
                                form.setData('client_name', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        error={form.errors.sector}
                        htmlFor="sector"
                        label="Sector"
                    >
                        <Input
                            id="sector"
                            value={form.data.sector}
                            onChange={(event) =>
                                form.setData('sector', event.target.value)
                            }
                        />
                    </FormField>
                </div>

                <FormField
                    error={form.errors.challenge}
                    htmlFor="challenge"
                    label="Reto"
                >
                    <textarea
                        id="challenge"
                        className="min-h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.challenge}
                        onChange={(event) =>
                            form.setData('challenge', event.target.value)
                        }
                    />
                </FormField>

                <FormField
                    error={form.errors.solution}
                    htmlFor="solution"
                    label="Solución"
                >
                    <textarea
                        id="solution"
                        className="min-h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.solution}
                        onChange={(event) =>
                            form.setData('solution', event.target.value)
                        }
                    />
                </FormField>

                <FormField
                    error={form.errors.result}
                    htmlFor="result"
                    label="Resultado"
                >
                    <textarea
                        id="result"
                        className="min-h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.result}
                        onChange={(event) =>
                            form.setData('result', event.target.value)
                        }
                    />
                </FormField>
            </AdminFormSection>

            <AdminFormSection
                title="Relación y publicación"
                description="Asocia el caso a un servicio y controla su visibilidad."
            >
                <div className="grid gap-5 lg:grid-cols-3">
                    <FormField
                        error={form.errors.service_id}
                        htmlFor="service_id"
                        label="Servicio"
                    >
                        <select
                            id="service_id"
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={form.data.service_id}
                            onChange={(event) =>
                                form.setData('service_id', event.target.value)
                            }
                        >
                            <option value="">Sin servicio asociado</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.title}
                                </option>
                            ))}
                        </select>
                    </FormField>
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
                title="Imagen"
                description="Usaremos una URL externa o placeholder hasta incorporar media library."
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
            </AdminFormSection>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={successCases.index()}>Cancelar</Link>
                </Button>
                {successCase.previewUrl && (
                    <Button asChild variant="outline">
                        <a
                            href={successCase.previewUrl}
                            rel="noreferrer"
                            target="_blank"
                        >
                            Ver público
                        </a>
                    </Button>
                )}
                <Button
                    className="bg-[#163247] text-white hover:bg-[#0f2638]"
                    disabled={form.processing}
                    type="submit"
                >
                    {form.processing ? 'Guardando...' : 'Guardar caso'}
                </Button>
            </div>
        </form>
    );
}
