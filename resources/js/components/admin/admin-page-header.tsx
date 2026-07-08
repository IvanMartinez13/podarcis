import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
};

export function AdminPageHeader({
    title,
    description,
    actions,
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
            <div className="max-w-2xl">
                <p className="text-xs font-semibold tracking-[0.18em] text-[#25E331] uppercase">
                    PODARCIS CMS
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-[#163247] sm:text-3xl dark:text-white">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
        </div>
    );
}
