import { Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            aria-label="Paginación"
            className="mt-10 flex flex-wrap justify-center gap-2"
        >
            {links.map((link, index) => (
                <Button
                    asChild={link.url !== null}
                    disabled={link.url === null}
                    key={`${link.label}-${index}`}
                    variant={link.active ? 'default' : 'outline'}
                >
                    {link.url ? (
                        <Link
                            href={link.url}
                            preserveScroll
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </Button>
            ))}
        </nav>
    );
}
