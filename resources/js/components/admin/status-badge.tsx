import { Badge } from '@/components/ui/badge';

type StatusBadgeProps = {
    status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const isPublished = status === 'published';

    return (
        <Badge
            className={
                isPublished
                    ? 'border-[#25E331]/30 bg-[#25E331]/10 text-[#163247] dark:text-[#25E331]'
                    : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-300'
            }
            variant="outline"
        >
            {isPublished ? 'Publicado' : 'Borrador'}
        </Badge>
    );
}
