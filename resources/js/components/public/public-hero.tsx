import type { ComponentProps, PropsWithChildren } from 'react';

import LiquidEther from '@/components/LiquidEther';
import { cn } from '@/lib/utils';

type PublicHeroProps = PropsWithChildren<
    ComponentProps<'section'> & {
        as?: 'section' | 'header';
        contentClassName?: string;
        fadeTo?: 'white' | 'transparent';
    }
>;

const podarcisLiquidColors = ['#071923', '#0e2535', '#163247', '#25e331'];

function PublicHero({
    as = 'section',
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
                'relative overflow-hidden bg-podarcis-ink text-white',
                className,
            )}
            {...props}
        >
            <div className="absolute inset-0">
                <LiquidEther
                    colors={podarcisLiquidColors}
                    mouseForce={24}
                    cursorSize={130}
                    isViscous
                    viscous={22}
                    iterationsViscous={28}
                    iterationsPoisson={28}
                    takeoverDuration={0.25}
                    autoResumeDelay={1800}
                    autoRampDuration={0.6}
                    autoDemo
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    isBounce={false}
                    resolution={0.5}
                />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(135deg,rgba(7,25,35,0.08),rgba(7,25,35,0.42))]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,25,35,0.62),rgba(7,25,35,0.12)_50%,rgba(7,25,35,0.42))]" />
            {fadeTo === 'white' && (
                <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-white/58 via-white/10 to-transparent" />
            )}
            <div className={cn('relative', contentClassName)}>{children}</div>
        </Component>
    );
}

export { PublicHero };
