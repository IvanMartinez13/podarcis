import type { ComponentProps, PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type PublicHeroProps = PropsWithChildren<
    ComponentProps<'section'> & {
        as?: 'section' | 'header';
        backgroundImage?: string | null;
        contentClassName?: string;
        fadeTo?: 'white' | 'transparent';
    }
>;

export function PublicHero({
    as = 'section',
    backgroundImage,
    children,
    className,
    contentClassName,
    fadeTo = 'transparent',
    ...props
}: PublicHeroProps) {
    const Component = as;

    return (
        <Component
            className={cn(
                'relative isolate overflow-hidden bg-podarcis-ink pt-20 text-white',
                className,
            )}
            {...props}
        >
            {backgroundImage ? (
                <>
                    <img
                        alt=""
                        className="pointer-events-none absolute inset-0 -z-20 size-full object-cover object-center"
                        fetchPriority="high"
                        src={backgroundImage}
                    />
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,24,34,0.28)_0%,rgba(6,24,34,0.62)_100%)]" />
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,24,34,0.97)_0%,rgba(6,24,34,0.9)_42%,rgba(6,24,34,0.62)_72%,rgba(6,24,34,0.42)_100%)]" />
                </>
            ) : (
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_18%,rgba(37,227,49,0.12),transparent_25%),radial-gradient(circle_at_16%_5%,rgba(30,120,140,0.18),transparent_28%),linear-gradient(135deg,#061822_0%,#0a2839_55%,#061822_100%)]" />
            )}
            <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_82%)] [background-size:56px_56px] opacity-30" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-linear-to-r from-transparent via-podarcis-green/45 to-transparent" />
            {fadeTo === 'white' && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-white/8 to-transparent" />
            )}
            <div className={cn('relative', contentClassName)}>{children}</div>
        </Component>
    );
}
