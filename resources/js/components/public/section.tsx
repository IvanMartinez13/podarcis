import * as React from 'react';

import { Container } from '@/components/public/container';
import { cn } from '@/lib/utils';

type SectionProps = React.ComponentProps<'section'> & {
    background?: React.ReactNode;
    eyebrow?: string;
    title?: string;
    titleClassName?: string;
    description?: string;
    surface?: 'white' | 'muted' | 'navy';
};

function Section({
    background,
    children,
    className,
    description,
    eyebrow,
    surface = 'white',
    title,
    titleClassName,
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                'py-16 sm:py-20 lg:py-24',
                surface === 'muted' && 'bg-podarcis-surface',
                surface === 'navy' && 'bg-podarcis-navy text-white',
                className,
            )}
            {...props}
        >
            {background}
            <Container className={cn(background && 'relative z-10')}>
                {(eyebrow || title || description) && (
                    <div className="mb-10 max-w-3xl sm:mb-12">
                        {eyebrow && (
                            <p
                                className={cn(
                                    'text-xs font-semibold tracking-[0.16em] text-podarcis-green uppercase',
                                    surface === 'white' && 'text-emerald-700',
                                )}
                            >
                                {eyebrow}
                            </p>
                        )}
                        {title && (
                            <h2
                                className={cn(
                                    'mt-3 text-3xl leading-tight font-semibold text-balance text-podarcis-navy sm:text-4xl lg:text-[2.75rem]',
                                    surface === 'navy' && 'text-white',
                                    titleClassName,
                                )}
                            >
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p
                                className={cn(
                                    'mt-4 max-w-2xl text-base leading-7 text-podarcis-muted sm:text-lg',
                                    surface === 'navy' && 'text-white/75',
                                )}
                                dangerouslySetInnerHTML={{ __html: description }}
                            >
                                
                            </p>
                        )}
                    </div>
                )}
                {children}
            </Container>
        </section>
    );
}

export { Section };
