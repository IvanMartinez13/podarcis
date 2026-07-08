import { Sparkles } from 'lucide-react';

type EmptyStateProps = {
    description: string;
    title: string;
};

function EmptyState({ description, title }: EmptyStateProps) {
    return (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-podarcis-green/10 text-podarcis-navy">
                <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-podarcis-navy">
                {title}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-podarcis-muted">
                {description}
            </p>
        </div>
    );
}

export { EmptyState };
