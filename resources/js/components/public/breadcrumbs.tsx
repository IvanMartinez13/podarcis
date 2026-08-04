import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { Container } from '@/components/public/container';

export type BreadcrumbItem = {
    label: string;
    href: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav
            aria-label="Migas de pan"
            className="border-b border-slate-200 bg-white"
        >
            <Container className="py-3">
                <ol className="flex flex-wrap items-center gap-1.5 text-sm text-podarcis-muted">
                    {items.map((item, index) => (
                        <li
                            className="flex items-center gap-1.5"
                            key={item.href}
                        >
                            {index > 0 && (
                                <ChevronRight
                                    aria-hidden="true"
                                    className="size-3.5"
                                />
                            )}
                            {index === items.length - 1 ? (
                                <span
                                    aria-current="page"
                                    className="font-medium text-podarcis-navy"
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    className="hover:text-podarcis-navy hover:underline"
                                    href={item.href}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </Container>
        </nav>
    );
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href,
        })),
    };
}
