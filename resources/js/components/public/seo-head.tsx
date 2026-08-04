import { Head, usePage } from '@inertiajs/react';

import type { SharedPageProps } from '@/types';

type SeoHeadProps = {
    canonical?: string;
    description?: string | null;
    image?: string | null;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
    noindex?: boolean;
    next?: string | null;
    previous?: string | null;
    type?: 'article' | 'website';
    title: string;
};

export function SeoHead({
    canonical,
    description,
    image,
    jsonLd,
    noindex = false,
    next,
    previous,
    type = 'website',
    title,
}: SeoHeadProps) {
    const { seo } = usePage<SharedPageProps>().props;
    const currentPath = usePage().url.split(/[?#]/)[0] || '/';
    const resolvedCanonical = resolveUrl(canonical ?? currentPath, seo.baseUrl);
    const resolvedImage = image ? resolveUrl(image, seo.baseUrl) : null;
    const graph = [seo.organization, seo.website, ...normalizeJsonLd(jsonLd)];

    return (
        <Head title={title}>
            {description && (
                <meta
                    name="description"
                    content={description}
                    head-key="description"
                />
            )}
            {description && (
                <meta
                    property="og:description"
                    content={description}
                    head-key="og:description"
                />
            )}
            <meta property="og:title" content={title} head-key="og:title" />
            <meta property="og:type" content={type} head-key="og:type" />
            <meta property="og:locale" content="es_ES" head-key="og:locale" />
            <meta
                property="og:site_name"
                content={seo.siteName}
                head-key="og:site_name"
            />
            <meta
                name="twitter:card"
                content="summary_large_image"
                head-key="twitter:card"
            />
            <meta
                name="twitter:title"
                content={title}
                head-key="twitter:title"
            />
            {description && (
                <meta
                    name="twitter:description"
                    content={description}
                    head-key="twitter:description"
                />
            )}
            <meta
                name="robots"
                content={
                    noindex
                        ? 'noindex,follow'
                        : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
                }
                head-key="robots"
            />
            <link
                rel="canonical"
                href={resolvedCanonical}
                head-key="canonical"
            />
            {previous && (
                <link
                    rel="prev"
                    href={resolveUrl(previous, seo.baseUrl)}
                    head-key="prev"
                />
            )}
            {next && (
                <link
                    rel="next"
                    href={resolveUrl(next, seo.baseUrl)}
                    head-key="next"
                />
            )}
            <meta
                property="og:url"
                content={resolvedCanonical}
                head-key="og:url"
            />
            {resolvedImage && (
                <meta
                    property="og:image"
                    content={resolvedImage}
                    head-key="og:image"
                />
            )}
            {resolvedImage && (
                <meta
                    name="twitter:image"
                    content={resolvedImage}
                    head-key="twitter:image"
                />
            )}
            <script type="application/ld+json" head-key="structured-data">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@graph': graph,
                })}
            </script>
        </Head>
    );
}

function resolveUrl(url: string, baseUrl: string): string {
    return new URL(url, `${baseUrl}/`).toString();
}

function normalizeJsonLd(
    value?: Record<string, unknown> | Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
    if (!value) {
        return [];
    }

    const entries = Array.isArray(value) ? value : [value];

    return entries.flatMap((entry) => {
        if (Array.isArray(entry['@graph'])) {
            return entry['@graph'] as Array<Record<string, unknown>>;
        }

        const schema = { ...entry };
        delete schema['@context'];

        return [schema];
    });
}
