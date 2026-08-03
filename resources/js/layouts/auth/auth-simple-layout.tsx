import { Link } from '@inertiajs/react';
import logoBlack from '@/assets/logo-negro.png';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-podarcis-surface px-6 py-10 md:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,227,49,0.22),transparent_36%),radial-gradient(circle_at_85%_10%,rgba(22,50,71,0.2),transparent_40%),linear-gradient(160deg,rgba(255,255,255,0.95),rgba(231,240,244,0.9))]" />
            <div className="pointer-events-none absolute -bottom-20 -left-24 h-72 w-72 rounded-full border border-podarcis-navy/10 bg-white/45 blur-2xl" />

            <div className="relative w-full max-w-md rounded-2xl border border-podarcis-navy/10 bg-white/90 p-7 shadow-[0_28px_90px_rgba(22,50,71,0.18)] backdrop-blur-sm sm:p-8">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-5 text-center">
                        <Link
                            href={home()}
                            className="group inline-flex"
                            aria-label="PODARCIS inicio"
                        >
                            <img
                                alt="PODARCIS Consultores Auditores"
                                className="h-11 w-auto transition duration-300 group-hover:-translate-y-0.5"
                                src={logoBlack}
                            />
                        </Link>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold text-podarcis-navy sm:text-[1.65rem]">
                                {title}
                            </h1>
                            <p className="text-sm leading-6 text-podarcis-muted">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-950/5 sm:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
