import { Linkedin } from 'lucide-react';

import { PublicLink } from '@/components/public/public-link';
import { cn } from '@/lib/utils';

type ProfileCardProps = {
    avatarUrl?: string | null;
    className?: string;
    linkedinUrl?: string | null;
    name: string;
    title?: string | null;
};

export default function ProfileCard({
    avatarUrl,
    className,
    linkedinUrl,
    name,
    title,
}: ProfileCardProps) {
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <article
            className={cn(
                'group relative isolate flex aspect-[0.78] min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/55 bg-white/35 p-4 shadow-[0_24px_70px_rgba(14,37,53,0.16)] backdrop-blur-2xl transition-all duration-500 ease-out',
                'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-[radial-gradient(circle_at_50%_0%,rgba(37,227,49,0.22),transparent_42%),linear-gradient(145deg,rgba(255,255,255,0.72),rgba(244,247,248,0.2))]',
                'after:pointer-events-none after:absolute after:inset-px after:-z-10 after:rounded-[15px] after:border after:border-white/50',
                'hover:-translate-y-2 hover:border-podarcis-green/55 hover:bg-white/45 hover:shadow-[0_30px_90px_rgba(22,50,71,0.22),0_0_50px_rgba(37,227,49,0.2)]',
                className,
            )}
        >
            <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-podarcis-green/20 blur-3xl transition-opacity duration-500 group-hover:opacity-90" />

            <div className="relative flex min-h-0 flex-1 items-end justify-center rounded-xl bg-linear-to-b from-podarcis-navy/10 via-white/10 to-podarcis-navy/5">
                {avatarUrl?.trim() ? (
                    <img
                        alt={name}
                        className="absolute inset-x-0 bottom-0 mx-auto h-[88%] w-full object-contain object-bottom drop-shadow-[0_26px_34px_rgba(14,37,53,0.22)] transition-transform duration-500 ease-out group-hover:translate-y-[-6px] group-hover:scale-[1.03]"
                        loading="lazy"
                        src={avatarUrl}
                    />
                ) : (
                    <span className="mb-28 grid size-28 place-items-center rounded-full border border-white/60 bg-podarcis-navy text-3xl font-semibold tracking-[0.12em] text-white shadow-xl">
                        {initials}
                    </span>
                )}
            </div>

            <div className="absolute bottom-5 left-1/2 w-[min(calc(100%-2rem),230px)] -translate-x-1/2 rounded-xl border border-white/55 bg-white/70 p-3 text-center shadow-[0_14px_40px_rgba(14,37,53,0.14)] backdrop-blur-xl">
                <div className="flex flex-col items-center gap-1.5">
                    <div className="max-w-full min-w-0">
                        <h3 className="truncate text-base font-semibold text-podarcis-navy">
                            {name}
                        </h3>
                        {title && (
                            <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-podarcis-muted">
                                {title}
                            </p>
                        )}
                    </div>
                    {linkedinUrl?.trim() && (
                        <PublicLink
                            aria-label={`LinkedIn de ${name}`}
                            className="mt-1 inline-flex items-center gap-1.5 rounded-sm text-xs font-semibold text-podarcis-navy underline decoration-podarcis-green decoration-2 underline-offset-4 transition-colors hover:text-podarcis-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-podarcis-green"
                            href={linkedinUrl}
                        >
                            <Linkedin className="size-3.5" aria-hidden="true" />
                            <span>LinkedIn</span>
                        </PublicLink>
                    )}
                </div>
            </div>
        </article>
    );
}
