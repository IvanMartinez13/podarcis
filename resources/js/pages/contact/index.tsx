import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Mail, Phone, ShieldCheck } from 'lucide-react';
import type { FormEvent } from 'react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Container } from '@/components/public/container';
import { PublicHero } from '@/components/public/public-hero';
import { Section } from '@/components/public/section';
import { TurnstileWidget } from '@/components/public/turnstile-widget';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    selectedServiceId: number | null;
    turnstileSiteKey: string | null;
};

type ContactForm = {
    name: string;
    email: string;
    phone: string;
    company: string;
    service_id: string;
    message: string;
    source: string;
    privacy_accepted: boolean;
    cf_turnstile_response: string;
    website: string;
};

export default function ContactIndex({
    page,
    services,
    selectedServiceId,
    turnstileSiteKey,
}: ContactProps) {
    const { flash } = usePage().props as {
        flash?: { success?: string | null };
    };
    const form = useForm<ContactForm>({
        name: '',
        email: '',
        phone: '',
        company: '',
        service_id: selectedServiceId ? String(selectedServiceId) : '',
        message: '',
        source: 'contact_page',
        privacy_accepted: false,
        cf_turnstile_response: '',
        website: '',
    });
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);
    const hasErrors = Object.keys(form.errors).length > 0;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(contact.store().url, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
            onFinish: () => {
                form.setData('cf_turnstile_response', '');
                setTurnstileResetKey((current) => current + 1);
            },
        });
    }

    return (
        <>
            <Head title={page?.title ?? 'Contacto'} />

            <PublicHero className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
                    <div>
                        <p className="text-sm font-semibold text-podarcis-green">
                            Contacto
                        </p>
                        <h1 className="mt-4 text-4xl font-semibold text-balance sm:text-5xl">
                            {page?.title ?? 'Hablemos de tu proyecto'}
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-white/75">
                            {page?.excerpt ??
                                'Cuéntanos qué necesitas y el equipo de PODARCIS te ayudará a encontrar la mejor solución técnica, ambiental o de gestión.'}
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
                        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                            <ShieldCheck
                                className="size-6 text-podarcis-green"
                                aria-hidden="true"
                            />
                            <p className="mt-4 text-sm leading-6 text-white/70">
                                Revisamos tu contexto antes de proponer el
                                siguiente paso: sin automatismos opacos, con
                                criterio técnico y respuesta personalizada.
                            </p>
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
                        {hasErrors && (
                            <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                Revisa los campos marcados antes de enviar el
                                formulario.
                            </div>
                        )}

                        <input
                            className="hidden"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={form.data.website}
                            onChange={(event) =>
                                form.setData('website', event.target.value)
                            }
                        />

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

                        <label className="mt-4 flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                            <Checkbox
                                checked={form.data.privacy_accepted}
                                onCheckedChange={(checked) =>
                                    form.setData(
                                        'privacy_accepted',
                                        checked === true,
                                    )
                                }
                            />
                            <span>
                                Acepto que PODARCIS trate mis datos para
                                responder a esta solicitud.
                                {form.errors.privacy_accepted && (
                                    <span className="mt-2 block text-red-600">
                                        {form.errors.privacy_accepted}
                                    </span>
                                )}
                            </span>
                        </label>

                        <div className="mt-4">
                            {turnstileSiteKey ? (
                                <TurnstileWidget
                                    siteKey={turnstileSiteKey}
                                    resetKey={turnstileResetKey}
                                    onVerify={(token) =>
                                        form.setData(
                                            'cf_turnstile_response',
                                            token,
                                        )
                                    }
                                    onExpire={() =>
                                        form.setData(
                                            'cf_turnstile_response',
                                            '',
                                        )
                                    }
                                    onError={() =>
                                        form.setData(
                                            'cf_turnstile_response',
                                            '',
                                        )
                                    }
                                />
                            ) : (
                                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                    La protección anti-spam no está configurada.
                                    Añade las claves de Cloudflare Turnstile.
                                </div>
                            )}
                            {form.errors.cf_turnstile_response && (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.errors.cf_turnstile_response}
                                </p>
                            )}
                        </div>

                        <Button
                            className="mt-6 w-full bg-podarcis-green text-podarcis-navy hover:bg-podarcis-green/90"
                            disabled={
                                form.processing ||
                                !turnstileSiteKey ||
                                !form.data.cf_turnstile_response
                            }
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

            <Section
                eyebrow="Servicios"
                title="Áreas sobre las que podemos ayudarte"
                className="bg-podarcis-surface"
            >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.slice(0, 6).map((service) => (
                        <div
                            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                            key={service.id}
                        >
                            <p className="font-semibold text-podarcis-navy">
                                {service.title}
                            </p>
                        </div>
                    ))}
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
