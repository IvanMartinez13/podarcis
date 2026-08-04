import { Link, usePage } from '@inertiajs/react';

import { Breadcrumbs, breadcrumbSchema } from '@/components/public/breadcrumbs';
import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
import { RichText } from '@/components/public/rich-text';
import { SeoHead } from '@/components/public/seo-head';
import { Badge } from '@/components/ui/badge';
import * as blog from '@/routes/blog';
import * as contact from '@/routes/contact';
import type { CmsPost, SharedPageProps } from '@/types';

type BlogShowProps = {
    post: CmsPost;
};

export default function BlogShow({ post }: BlogShowProps) {
    const { seo } = usePage<SharedPageProps>().props;
    const breadcrumbs = [
        { label: 'Inicio', href: '/' },
        { label: 'Recursos', href: blog.index().url },
        { label: post.title, href: post.href },
    ];

    return (
        <>
            <SeoHead
                title={post.seoTitle ?? post.title}
                description={post.seoDescription ?? post.excerpt}
                image={post.featuredImage}
                type="article"
                jsonLd={[
                    {
                        '@type': 'Article',
                        headline: post.title,
                        description: post.seoDescription ?? post.excerpt,
                        datePublished: post.publishedAt,
                        dateModified: post.updatedAt,
                        mainEntityOfPage: post.href,
                        image: post.featuredImage,
                        publisher: { '@id': `${seo.baseUrl}/#organization` },
                        author: post.author
                            ? { '@type': 'Person', name: post.author.name }
                            : { '@type': 'Organization', name: 'PODARCIS' },
                    },
                    breadcrumbSchema(breadcrumbs),
                ]}
            />

            <article>
                <PublicHero as="header">
                    <Container className="max-w-4xl py-16 sm:py-20 lg:py-24">
                        <Link
                            className="text-sm font-semibold text-podarcis-green"
                            href={blog.index()}
                        >
                            Blog
                        </Link>
                        <Badge className="mt-6 bg-white/5 text-white backdrop-blur-[2px]">
                            {post.category?.name ?? 'Artículo'}
                        </Badge>
                        <h1 className="mt-6 text-4xl font-semibold text-balance sm:text-5xl">
                            {post.title}
                        </h1>
                        <RichText
                            className="mt-6 text-lg leading-8 text-white/75 [&_a]:text-white [&_a]:decoration-white/50"
                            html={post.excerpt}
                        />
                        <p className="mt-5 text-sm text-white/65">
                            {post.author?.name
                                ? `Por ${post.author.name}`
                                : 'Por PODARCIS'}
                            {post.publishedAt &&
                                ` · Publicado el ${new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(post.publishedAt))}`}
                            {post.updatedAt &&
                                post.updatedAt !== post.publishedAt &&
                                ` · Actualizado el ${new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(post.updatedAt))}`}
                        </p>
                    </Container>
                </PublicHero>
                <Breadcrumbs items={breadcrumbs} />

                <Container className="py-12 sm:py-16">
                    {post.featuredImage && (
                        <img
                            alt={post.imageAlt ?? ''}
                            className="aspect-[16/8] w-full rounded-3xl object-cover shadow-xl shadow-slate-950/10"
                            src={post.featuredImage}
                            width="1200"
                            height="600"
                            fetchPriority="high"
                        />
                    )}
                    <RichText
                        className="mx-auto mt-10 max-w-3xl text-lg leading-8 text-podarcis-muted"
                        html={post.content}
                    />
                </Container>
            </article>

            <CTASection
                title="¿Quieres aterrizar este criterio en tu organización?"
                description="PODARCIS puede ayudarte a convertir obligaciones y datos técnicos en un sistema de trabajo claro."
                primaryHref={contact.index().url}
                primaryLabel="Contactar"
            />
        </>
    );
}
