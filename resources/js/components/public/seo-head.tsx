import { Head } from '@inertiajs/react';

type SeoHeadProps = {
    canonical?: string;
    description?: string | null;
    image?: string | null;
    jsonLd?: Record<string, unknown>;
    title: string;
};

export function SeoHead({
    canonical,
    description,
    image,
    jsonLd,
    title,
}: SeoHeadProps) {
    const resolvedCanonical =
        canonical ??
        (typeof window !== 'undefined'
            ? `${window.location.origin}${window.location.pathname}`
            : undefined);
    const resolvedImage =
        image && typeof window !== 'undefined'
            ? new URL(image, window.location.origin).toString()
            : image;

    return (
        <Head title={title}>
            {description && (
                <>
                    <meta
                        name="description"
                        content={description}
                        head-key="description"
                    />
                    <meta
                        property="og:description"
                        content={description}
                        head-key="og:description"
                    />
                </>
            )}
            <meta property="og:title" content={title} head-key="og:title" />
            <meta property="og:type" content="website" head-key="og:type" />
            {resolvedCanonical && (
                <>
                    <link
                        rel="canonical"
                        href={resolvedCanonical}
                        head-key="canonical"
                    />
                    <meta
                        property="og:url"
                        content={resolvedCanonical}
                        head-key="og:url"
                    />
                </>
            )}
            {resolvedImage && (
                <meta
                    property="og:image"
                    content={resolvedImage}
                    head-key="og:image"
                />
            )}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
}
