import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Mail, Phone } from 'lucide-react';
import type { FormEvent } from 'react';
import type { ReactNode } from 'react';

import { Container } from '@/components/public/container';
import { PublicHero } from '@/components/public/public-hero';
import { Section } from '@/components/public/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as contact from '@/routes/contact';
import type { CmsPage } from '@/types';

type ContactService = {
    id: number;
    title: string;
    slug: string;
};

type ContactProps = {
    page: Pick<CmsPage, 'title' | 'excerpt' | 'content'> | null;
    services: ContactService[];
};

type ContactForm = {
    name: string;
    email: string;
    phone: string;
    company: string;
    service_id: string;
    message: string;
    source: string;
};

export default function ContactIndex({ page, services }: ContactProps) {
    const { flash } = usePage().props as {
        flash?: { success?: string | null };
    };
    const form = useForm<ContactForm>({
        name: '',
        email: '',
        phone: '',
        company: '',
        service_id: '',
        message: '',
        source: 'contacto',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(contact.store().url, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <>
            <Head title={page?.title ?? 'Contacto'} />

            <PublicHero className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <p className="text-sm font-semibold text-podarcis-green">
                            Contacto
                        </p>
                        <h1 className="mt-4 text-4xl font-semibold text-balance sm:text-5xl">
                            {page?.title ?? 'Contacto'}
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-white/75">
                            {page?.excerpt ??
                                'Cuéntanos qué necesitas resolver y prepararemos el siguiente paso.'}
                        </p>
                        <div className="mt-8 grid gap-3 text-sm text-white/75">
                            <span className="inline-flex items-center gap-3">
                                <Mail
                                    className="size-4 text-podarcis-green"
                                    aria-hidden="true"
                                />
                                contacto@podarcis.com
                            </span>
                            <span className="inline-flex items-center gap-3">
                                <Phone
                                    className="size-4 text-podarcis-green"
                                    aria-hidden="true"
                                />
                                Respuesta comercial personalizada
                            </span>
                        </div>
                    </div>
                    <form
                        className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/20"
                        onSubmit={submit}
                    >
                        {flash?.success && (
                            <div className="mb-5 flex gap-3 rounded-md border border-podarcis-green/30 bg-podarcis-green/10 p-4 text-sm text-podarcis-navy">
                                <CheckCircle2
                                    className="mt-0.5 size-4"
                                    aria-hidden="true"
                                />
                                <span>{flash.success}</span>
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field error={form.errors.name} label="Nombre">
                                <Input
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                    autoComplete="name"
                                />
                            </Field>
                            <Field error={form.errors.email} label="Email">
                                <Input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(event) =>
                                        form.setData(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="email"
                                />
                            </Field>
                            <Field error={form.errors.phone} label="Teléfono">
                                <Input
                                    value={form.data.phone}
                                    onChange={(event) =>
                                        form.setData(
                                            'phone',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="tel"
                                />
                            </Field>
                            <Field error={form.errors.company} label="Empresa">
                                <Input
                                    value={form.data.company}
                                    onChange={(event) =>
                                        form.setData(
                                            'company',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="organization"
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="service_id">
                                Servicio de interés
                            </Label>
                            <select
                                id="service_id"
                                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={form.data.service_id}
                                onChange={(event) =>
                                    form.setData(
                                        'service_id',
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="">Selecciona una opción</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.title}
                                    </option>
                                ))}
                            </select>
                            {form.errors.service_id && (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.errors.service_id}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="message">Mensaje</Label>
                            <textarea
                                id="message"
                                className="mt-2 min-h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={form.data.message}
                                onChange={(event) =>
                                    form.setData('message', event.target.value)
                                }
                            />
                            {form.errors.message && (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.errors.message}
                                </p>
                            )}
                        </div>

                        <Button
                            className="mt-6 w-full bg-podarcis-green text-podarcis-navy hover:bg-podarcis-green/90"
                            disabled={form.processing}
                            type="submit"
                        >
                            {form.processing
                                ? 'Enviando...'
                                : 'Enviar solicitud'}
                        </Button>
                    </form>
                </Container>
            </PublicHero>

            <Section
                eyebrow="Siguiente paso"
                title="Te responderemos con una propuesta clara de avance"
            >
                <div className="grid gap-5 lg:grid-cols-3">
                    {['Contexto técnico', 'Prioridades', 'Hoja de ruta'].map(
                        (item) => (
                            <div
                                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                                key={item}
                            >
                                <CheckCircle2
                                    className="size-6 text-podarcis-green"
                                    aria-hidden="true"
                                />
                                <h2 className="mt-5 text-xl font-semibold text-podarcis-navy">
                                    {item}
                                </h2>
                            </div>
                        ),
                    )}
                </div>
            </Section>
        </>
    );
}

type FieldProps = {
    children: ReactNode;
    error?: string;
    label: string;
};

function Field({ children, error, label }: FieldProps) {
    return (
        <div>
            <Label>{label}</Label>
            <div className="mt-2">{children}</div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}
