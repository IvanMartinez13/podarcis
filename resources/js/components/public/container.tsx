import * as React from 'react';

import { cn } from '@/lib/utils';

type ContainerProps = React.ComponentProps<'div'> & {
    size?: 'default' | 'wide';
};

function Container({ className, size = 'default', ...props }: ContainerProps) {
    return (
        <div
            className={cn(
                'mx-auto w-full px-4 sm:px-5 lg:px-6',
                size === 'wide' ? 'max-w-[1536px]' : 'max-w-[1440px]',
                className,
            )}
            {...props}
        />
    );
}

export { Container };
