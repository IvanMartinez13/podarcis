import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { CmsSuccessCase } from '@/types';

export function CaseStudyCard({
    successCase,
}: {
    successCase: CmsSuccessCase;
}) {
    return (
        <Link
            href={successCase.href}
            className="group relative flex min-h-[26rem] overflow-hidden rounded-2xl border border-white/10 bg-podarcis-navy text-white shadow-2xl shadow-black/10 focus-visible:ring-3 focus-visible:ring-podarcis-green/50 focus-visible:outline-none"
        >
            {successCase.featuredImage ? (
                <img
                    src={successCase.featuredImage}
                    alt={successCase.imageAlt ?? ''}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(37,227,49,.2),transparent_30%),linear-gradient(145deg,#163247,#071923)]" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-podarcis-ink via-podarcis-ink/60 to-transparent" />
            <div className="relative mt-auto w-full p-6 sm:p-7">
                <div className="flex flex-wrap gap-2">
                    {successCase.sector && (
                        <Badge className="bg-podarcis-green text-podarcis-ink">
                            {successCase.sector}
                        </Badge>
                    )}
                    {successCase.service && (
                        <Badge className="border-white/15 bg-white/10 text-white">
                            {successCase.service.title}
                        </Badge>
                    )}
                </div>
                <h3 className="mt-4 max-w-xl text-2xl leading-tight font-semibold text-balance">
                    {successCase.title}
                </h3>
                {successCase.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/68">
                        {successCase.excerpt}
                    </p>
                )}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-podarcis-green">
                    Ver caso completo
                    <ArrowUpRight
                        className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                    />
                </span>
            </div>
        </Link>
    );
}
