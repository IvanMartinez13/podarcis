import { Badge } from '@/components/ui/badge';

type StatusBadgeProps = {
    status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const labels: Record<string, string> = {
        published: 'Publicado',
        draft: 'Borrador',
        new: 'Nuevo',
        contacted: 'Contactado',
        closed: 'Cerrado',
        discarded: 'Descartado',
    };

    const classNames: Record<string, string> = {
        published:
            'border-[#25E331]/30 bg-[#25E331]/10 text-[#163247] dark:text-[#25E331]',
        new: 'border-[#25E331]/30 bg-[#25E331]/10 text-[#163247] dark:text-[#25E331]',
        contacted:
            'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
        closed: 'border-slate-300 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-300',
        discarded:
            'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
    };

    return (
        <Badge
            className={
                classNames[status] ??
                'border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-300'
            }
            variant="outline"
        >
            {labels[status] ?? status}
        </Badge>
    );
}
