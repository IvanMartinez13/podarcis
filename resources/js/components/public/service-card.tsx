import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ServiceCardProps = {
    description: string;
    href: string;
    icon: LucideIcon;
    label?: string;
    title: string;
};

function ServiceCard({
    description,
    href,
    icon: Icon,
    label,
    title,
}: ServiceCardProps) {
    return (
        <a
            className="group relative flex h-full min-h-64 overflow-hidden rounded-lg border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-950/5 transition duration-500 hover:-translate-y-2 hover:border-podarcis-green/70 hover:shadow-2xl hover:shadow-podarcis-navy/10 focus-visible:ring-3 focus-visible:ring-podarcis-green/40 focus-visible:outline-none"
            href={href}
        >
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-podarcis-green transition-transform duration-500 group-hover:scale-x-100" />
            <span className="absolute -right-10 -bottom-10 size-28 rounded-full bg-podarcis-green/0 blur-2xl transition duration-500 group-hover:bg-podarcis-green/15" />
            <div className="relative flex h-full w-full flex-col">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-podarcis-navy text-white shadow-lg shadow-podarcis-navy/20 transition duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-podarcis-green group-hover:text-podarcis-navy">
                        <Icon
                            className="size-5 transition duration-500"
                            aria-hidden="true"
                        />
                    </div>
                    {label && (
                        <Badge className="border-podarcis-green/30 bg-podarcis-green/10 text-podarcis-navy">
                            {label}
                        </Badge>
                    )}
                </div>
                <div className="flex flex-1 flex-col">
                    <h3 className="mt-5 text-lg font-semibold text-podarcis-navy">
                        {title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-podarcis-muted">
                        {description}
                    </p>
                    <span
                        className={cn(
                            'mt-6 inline-flex items-center gap-2 text-sm font-semibold text-podarcis-navy transition duration-300',
                            'group-hover:text-podarcis-green',
                        )}
                    >
                        Ver servicio
                        <ArrowRight
                            className="size-4 transition duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </span>
                </div>
            </div>
        </a>
    );
}

export { ServiceCard };
