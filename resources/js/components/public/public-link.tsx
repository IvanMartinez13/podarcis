import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { forwardRef } from 'react';

type PublicLinkProps = Omit<
    ComponentProps<typeof Link>,
    'href' | 'prefetch'
> & {
    href: string;
    prefetch?: boolean;
};

export const PublicLink = forwardRef<HTMLAnchorElement, PublicLinkProps>(
    function PublicLink(
        { children, href, prefetch, rel, target, ...props },
        ref,
    ) {
        if (href.startsWith('/') && !href.startsWith('//')) {
            return (
                <Link href={href} prefetch={prefetch} ref={ref} {...props}>
                    {children}
                </Link>
            );
        }

        const isExternalWebUrl = /^https?:\/\//i.test(href);
        const anchorProps = props as ComponentProps<'a'>;

        return (
            <a
                href={href}
                ref={ref}
                rel={isExternalWebUrl ? 'noreferrer' : rel}
                target={isExternalWebUrl ? '_blank' : target}
                {...anchorProps}
            >
                {children}
            </a>
        );
    },
);
