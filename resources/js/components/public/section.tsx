import * as React from 'react';

import { Container } from '@/components/public/container';
import { cn } from '@/lib/utils';

type SectionProps = React.ComponentProps<'section'> & {
    eyebrow?: string;
    title?: string;
    description?: string;
    surface?: 'white' | 'muted' | 'navy';
};

function Section({
    children,
    className,
    description,
    eyebrow,
    surface = 'white',
    title,
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                'py-16 sm:py-20',
                surface === 'muted' && 'bg-podarcis-surface',
                surface === 'navy' && 'bg-podarcis-navy text-white',
                className,
            )}
            {...props}
        >
            <Container>
                {(eyebrow || title || description) && (
                    <div className="mx-auto mb-10 max-w-3xl text-center">
                        {eyebrow && (
                            <p
                                className={cn(
                                    'text-sm font-semibold text-podarcis-green',
                                    surface === 'white' && 'text-podarcis-navy',
                                )}
                            >
                                {eyebrow}
                            </p>
                        )}
                        {title && (
                            <h2
                                className={cn(
                                    'mt-3 text-3xl font-semibold text-podarcis-navy sm:text-4xl',
                                    surface === 'navy' && 'text-white',
                                )}
                            >
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p
                                className={cn(
                                    'mt-4 text-base leading-7 text-podarcis-muted sm:text-lg',
                                    surface === 'navy' && 'text-white/75',
                                )}
                            >
                                {description}
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
