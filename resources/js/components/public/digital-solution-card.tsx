import { Link } from '@inertiajs/react';
import { ArrowRight, MonitorCog } from 'lucide-react';
import { createElement } from 'react';

import { Button } from '@/components/ui/button';
import { getServiceIcon } from '@/lib/cms-icons';
import * as contact from '@/routes/contact';
import type { CmsService } from '@/types';

type DigitalSolutionCardProps = {
    compact?: boolean;
    solution: CmsService;
};

export function DigitalSolutionCard({
    compact = false,
    solution,
}: DigitalSolutionCardProps) {
    const demoHref = contact.index({
        query: {
            service: solution.slug,
            source: 'digital_solution_demo',
        },
    }).url;

    return (
        <article
            className={
                compact
                    ? 'group flex h-full flex-col overflow-hidden rounded-2xl border border-white/14 bg-podarcis-ink/62 text-white shadow-[0_24px_60px_-36px_rgba(7,25,35,.72)] backdrop-blur-md transition motion-safe:hover:-translate-y-1 motion-safe:hover:bg-podarcis-ink/68'
                    : 'group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-32px_rgba(7,25,35,.35)] transition motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_24px_60px_-30px_rgba(7,25,35,.42)]'
            }
        >
            {!compact && solution.featuredImage && (
                <Link
                    className="block aspect-[16/8] overflow-hidden bg-podarcis-surface"
                    href={solution.href}
                >
                    <img
                        alt={solution.imageAlt ?? ''}
                        className="size-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
                        height="480"
                        loading="lazy"
                        src={solution.featuredImage}
                        width="960"
                    />
                </Link>
            )}
            <div className={compact ? 'flex flex-1 flex-col p-5' : 'flex flex-1 flex-col p-6'}>
                <div className="flex min-h-12 items-center">
                    {solution.logoImage ? (
                        <span
                            className={
                                compact
                                    ? 'inline-flex rounded-xl border border-podarcis-green/45 bg-podarcis-green/12 px-3 py-2'
                                    : 'inline-flex'
                            }
                        >
                            <img
                                alt={solution.logoImageAlt ?? ''}
                                className="max-h-12 max-w-40 object-contain object-left"
                                height="48"
                                loading="lazy"
                                src={solution.logoImage}
                                width="160"
                            />
                        </span>
                    ) : (
                        <span
                            className={
                                compact
                                    ? 'flex size-11 items-center justify-center rounded-xl bg-podarcis-green/14 text-podarcis-green'
                                    : 'flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700'
                            }
                        >
                            {createElement(getServiceIcon(solution.icon), {
                                className: 'size-5',
                                'aria-hidden': true,
                            })}
                        </span>
                    )}
                </div>
                <h2 className={compact ? 'mt-4 text-lg font-semibold text-white' : 'mt-5 text-2xl font-semibold text-podarcis-navy'}>
                    <Link
                        className={
                            compact
                                ? 'hover:text-podarcis-green'
                                : 'hover:text-emerald-700'
                        }
                        href={solution.href}
                    >
                        {solution.title}
                    </Link>
                </h2>
                {solution.excerpt && (
                    <p
                        className={
                            compact
                                ? 'mt-3 line-clamp-2 flex-1 text-sm leading-6 text-white/76'
                                : 'mt-3 flex-1 text-sm leading-7 text-podarcis-muted'
                        }
                        dangerouslySetInnerHTML={{ __html: solution.excerpt }}
                    >  
                    </p>
                )}
                {compact ? (
                    <div className="mt-5">
                        <Button
                            asChild
                            size="sm"
                            className="bg-podarcis-green text-podarcis-ink hover:bg-podarcis-green/90"
                        >
                            <Link href={solution.href}>
                                Ver solución
                                <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                        <Button asChild variant="outline">
                            <Link href={solution.href}>
                                Ver solución
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className="bg-podarcis-green text-podarcis-ink hover:bg-podarcis-green/90"
                        >
                            <Link href={demoHref}>
                                <MonitorCog className="size-4" />
                                Solicitar demo
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </article>
    );
}
