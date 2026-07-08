import type { ReactNode } from 'react';

type AdminFormSectionProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

export function AdminFormSection({
    title,
    description,
    children,
}: AdminFormSectionProps) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-slate-950">
            <div className="mb-5">
                <h2 className="text-base font-semibold text-[#163247] dark:text-white">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>
            <div className="grid gap-5">{children}</div>
        </section>
    );
}
