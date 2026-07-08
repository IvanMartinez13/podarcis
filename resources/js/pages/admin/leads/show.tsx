import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import * as leads from '@/routes/admin/leads';

type LeadStatus = 'new' | 'contacted' | 'closed' | 'discarded';

type AdminLeadDetail = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    message: string;
    source: string | null;
    status: LeadStatus;
    createdAt: string | null;
    updatedAt: string | null;
    service: { title: string } | null;
};

type LeadShowProps = {
    lead: AdminLeadDetail;
};

const statusActions: Array<{ status: LeadStatus; label: string }> = [
    { status: 'new', label: 'Volver a nuevo' },
    { status: 'contacted', label: 'Marcar contactado' },
    { status: 'closed', label: 'Marcar cerrado' },
    { status: 'discarded', label: 'Marcar descartado' },
];

export default function LeadShow({ lead }: LeadShowProps) {
    function updateStatus(status: LeadStatus) {
        router.patch(
            leads.status({ lead: lead.id }).url,
            { status },
            { preserveScroll: true },
        );
    }

    function destroyLead() {
        router.delete(leads.destroy({ lead: lead.id }).url);
    }

    return (
        <>
            <Head title={`Lead de ${lead.name}`} />

            <div className="grid gap-8">
                <AdminPageHeader
                    actions={
                        <Button asChild variant="outline">
                            <Link href={leads.index()}>
                                <ArrowLeft className="size-4" />
                                Volver
                            </Link>
                        </Button>
                    }
                    title={lead.name}
                    description="Detalle completo del contacto recibido desde la web."
                />

                <section className="grid gap-5 lg:grid-cols-[1fr_0.42fr]">
                    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-slate-950">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    Estado actual
                                </p>
                                <div className="mt-2">
                                    <StatusBadge status={lead.status} />
                                </div>
                            </div>
                            <ConfirmDeleteDialog
                                title="Eliminar lead"
                                description={`¿Seguro que quieres eliminar el lead de "${lead.name}"? Esta acción no se puede deshacer.`}
                                triggerLabel="Eliminar lead"
                                onConfirm={destroyLead}
                            />
                        </div>

                        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                            <Detail label="Email" value={lead.email} />
                            <Detail
                                label="Teléfono"
                                value={lead.phone ?? 'Sin teléfono'}
                            />
                            <Detail
                                label="Empresa"
                                value={lead.company ?? 'Sin empresa'}
                            />
                            <Detail
                                label="Servicio"
                                value={lead.service?.title ?? 'Sin servicio'}
                            />
                            <Detail
                                label="Origen"
                                value={lead.source ?? 'Sin origen'}
                            />
                            <Detail
                                label="Creado"
                                value={lead.createdAt ?? 'Sin fecha'}
                            />
                            <Detail
                                label="Actualizado"
                                value={lead.updatedAt ?? 'Sin fecha'}
                            />
                        </dl>

                        <div className="mt-8 rounded-lg bg-slate-50 p-5 dark:bg-white/5">
                            <p className="text-sm font-semibold text-[#163247] dark:text-white">
                                Mensaje
                            </p>
                            <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                                {lead.message}
                            </p>
                        </div>
                    </article>

                    <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-slate-950">
                        <h2 className="text-lg font-semibold text-[#163247] dark:text-white">
                            Acciones rápidas
                        </h2>
                        <div className="mt-5 grid gap-3">
                            {statusActions.map((action) => (
                                <Button
                                    className="justify-start"
                                    disabled={lead.status === action.status}
                                    key={action.status}
                                    onClick={() => updateStatus(action.status)}
                                    type="button"
                                    variant="outline"
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    </aside>
                </section>
            </div>
        </>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-semibold tracking-[0.08em] text-slate-500 uppercase dark:text-slate-400">
                {label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                {value}
            </dd>
        </div>
    );
}
